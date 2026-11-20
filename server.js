// NOVA MUSIC — Servidor Backend para Render.com
// Proporciona los endpoints de búsqueda y streaming de audio sin restricciones
// Funciona junto con el frontend desplegado en GitHub Pages

import express from 'express';
import cors from 'cors';
import { Readable } from 'node:stream';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS: permite peticiones desde GitHub Pages y desarrollo local
app.use(cors({
  origin: [
    'https://xdf7301-max.github.io',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    // Render también sirve el preview desde su propio dominio
    /\.onrender\.com$/,
  ],
  methods: ['GET', 'HEAD', 'OPTIONS'],
  allowedHeaders: ['Range', 'Content-Type', 'Accept'],
  exposedHeaders: ['Content-Range', 'Content-Length', 'Accept-Ranges', 'Content-Type'],
  credentials: false,
}));

// Cache en memoria para URLs de audio (reduce peticiones repetidas)
const audioUrlCache = new Map();
let ytdlInstance = null;

// Inicializar ytdl de forma lazy
// Se configuran clientes que NO requieren el reproductor (worker_threads),
// que falla en entornos como Render sin worker_threads.
// visionos y web_embedded devuelven URLs de audio directas (sin signatureCipher),
// que pueden reproducirse sin necesidad de descifrar firmas.
// Nota: tv devuelve URLs que responden 403, por lo que se excluye.
const PREFERRED_CLIENTS = [
  'visionos',
  'web_embedded',
  'mweb',
  'web_creator',
  'web_music',
];

async function getYtdl() {
  if (!ytdlInstance) {
    const { Ytdl } = await import('@distube/ytdl-core');
    ytdlInstance = new Ytdl({ clients: PREFERRED_CLIENTS });
  }
  return ytdlInstance;
}

/**
 * Extrae URLs de formato de audio directamente del HTML de la página de YouTube.
 * Sirve como respaldo cuando ytdl-core no puede resolver el reproductor
 * (p. ej. entornos sin worker_threads como Render).
 * Incluye reintentos con jitter para manejar rate limiting (429).
 */
async function extractAudioUrlsFromPage(videoId) {
  let lastErr = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(
        `https://www.youtube.com/watch?v=${videoId}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
            'Accept': 'text/html,application/xhtml+xml',
          },
        }
      );
      if (res.status === 429) {
        // Rate limited: esperar con jitter antes de reintentar
        const wait = 2000 * Math.pow(2, attempt) + Math.random() * 1000;
        await new Promise((r) => setTimeout(r, wait));
        lastErr = new Error(`YouTube page fetch failed: 429`);
        continue;
      }
      if (!res.ok) throw new Error(`YouTube page fetch failed: ${res.status}`);
      const html = await res.text();

      // Buscar ytInitialPlayerResponse dentro del HTML
      const match = html.match(/var ytInitialPlayerResponse = (\{.*?\});\s*<\/script>/s);
      if (!match) throw new Error('ytInitialPlayerResponse not found in page');

      let data;
      try {
        data = JSON.parse(match[1]);
      } catch (e) {
        // JSON.parse puede fallar si el objeto contiene funciones; intentar extraer streamingData por separado
        const streamingMatch = html.match(/"streamingData":(\{.*?\}),"playabilityStatus"/s);
        if (!streamingMatch) throw new Error('streamingData not found in page');
        data = { streamingData: JSON.parse(streamingMatch[1]) };
      }

      const streamingData = data?.streamingData;
      if (!streamingData) throw new Error('No streamingData in YouTube page');

      const formats = [...(streamingData.formats || []), ...(streamingData.adaptiveFormats || [])];
      const audioFormats = formats.filter(
        (f) => f.mimeType?.startsWith('audio/') && (f.url || f.signatureCipher)
      );
      return audioFormats;
    } catch (err) {
      lastErr = err;
      // Pequeña pausa antes de reintentar
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw lastErr;
}

/**
 * Resuelve una URL de audio reproducible para un video de YouTube.
 * Intenta ytdl-core primero; si falla (sin worker_threads), usa la página de YouTube como respaldo.
 * Devuelve la mejor URL de audio disponible (sin signatureCipher cuando sea posible).
 */
async function resolveAudioUrl(videoId) {
  // 1. Intento principal: ytdl-core
  try {
    const ytdl = await getYtdl();
    const info = await ytdl.getInfo(videoId);
    const formats = info.formats.filter(
      (f) => f.hasAudio && !f.hasVideo && (f.url || f.signatureCipher)
    );
    if (formats.length) {
      // Preferir formatos que NO requieran descifrado de firma (pueden reproducirse directamente)
      const direct = formats.filter((f) => !f.signatureCipher);
      const candidates = direct.length ? direct : formats;
      const best = candidates.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
      if (best.url) return best.url;
    }
  } catch (err) {
    console.warn(`[resolveAudioUrl] ytdl-core falló para ${videoId}:`, err.message);
  }

  // 2. Respaldo: extraer directamente del HTML de YouTube (no requiere worker_threads)
  const formats = await extractAudioUrlsFromPage(videoId);
  if (!formats.length) throw new Error('No se encontró formato de audio en YouTube');

  const direct = formats.filter((f) => f.url && !f.signatureCipher);
  const candidates = direct.length ? direct : formats;
  const best = candidates.sort((a, b) => {
    const bitrateA = parseInt(a.bitrate || a.audioBitrate || 0, 10);
    const bitrateB = parseInt(b.bitrate || b.audioBitrate || 0, 10);
    return bitrateB - bitrateA;
  })[0];

  if (!best.url) throw new Error('URL de audio no disponible');
  return best.url;
}

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    service: 'NOVA MUSIC Backend',
    status: 'online 🎵',
    version: '1.0.0',
    endpoints: ['/api/yt-search?q=', '/api/stream-audio?id='],
  });
});

// ─── Buscar canción en YouTube ────────────────────────────────────────────────
app.get('/api/yt-search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Falta parámetro q' });
  }

  try {
    const ytRes = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
        },
      }
    );
    const text = await ytRes.text();
    const matches = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
    const unique = [...new Set(matches)];
    res.json({ videoId: unique[0] || null, matches: unique.slice(0, 10) });
  } catch (err) {
    console.error('yt-search error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ─── Transmitir audio completo sin restricciones ──────────────────────────────
app.get('/api/stream-audio', async (req, res) => {
  const { id } = req.query;
  if (!id) {
    return res.status(400).send('Falta parámetro id');
  }

  try {
    // Resolver URL de audio (con respaldo si ytdl-core falla)
    let targetUrl = audioUrlCache.get(id);

    if (!targetUrl) {
      targetUrl = await resolveAudioUrl(id);
      // Cachear por 3 horas (las URLs de YouTube expiran)
      audioUrlCache.set(id, targetUrl);
      setTimeout(() => audioUrlCache.delete(id), 3 * 60 * 60 * 1000);
    }

    // Soporte para Range requests (permite seek/avanzar en la canción)
    const headers = {};
    if (req.headers.range) {
      headers['Range'] = req.headers.range;
    }

    const audioRes = await fetch(targetUrl, { headers });

    if (!audioRes.ok && audioRes.status !== 206) {
      // URL expirada o bloqueada, limpiar caché y reintentar una vez
      audioUrlCache.delete(id);
      console.warn(`[stream-audio] URL no válida para ${id} (status ${audioRes.status})`);
      return res.status(503).send('URL de audio expirada o bloqueada, intenta de nuevo');
    }

    res.status(audioRes.status);
    res.setHeader('Content-Type', audioRes.headers.get('content-type') || 'audio/webm');
    res.setHeader('Accept-Ranges', 'bytes');
    const contentLength = audioRes.headers.get('content-length');
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    const contentRange = audioRes.headers.get('content-range');
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
    }

    // Transmitir el audio al cliente con manejo de errores de pipe
    const upstream = Readable.fromWeb(audioRes.body);
    upstream.on('error', (err) => {
      console.error('[stream-audio] Error de transmisión:', err.message);
      if (!res.headersSent) {
        res.status(500).send('Error de transmisión');
      } else if (!res.writableEnded) {
        res.end();
      }
    });
    upstream.pipe(res);
  } catch (err) {
    console.error('stream-audio error:', err.message);
    if (!res.headersSent) {
      res.status(500).send(err.message);
    }
  }
});

app.listen(PORT, () => {
  console.log(`🎵 NOVA MUSIC Backend corriendo en puerto ${PORT}`);
});
