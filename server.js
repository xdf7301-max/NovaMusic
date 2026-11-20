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
async function getYtdl() {
  if (!ytdlInstance) {
    const { Ytdl } = await import('@distube/ytdl-core');
    ytdlInstance = new Ytdl();
  }
  return ytdlInstance;
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
    const ytdl = await getYtdl();
    let targetUrl = audioUrlCache.get(id);

    if (!targetUrl) {
      const info = await ytdl.getInfo(id);
      const formats = info.formats.filter((f) => f.hasAudio && !f.hasVideo && f.url);
      if (!formats.length) {
        return res.status(404).send('No se encontró formato de audio');
      }
      // Elegir el formato con mejor calidad de audio
      const best = formats.sort((a, b) => (b.audioBitrate || 0) - (a.audioBitrate || 0))[0];
      targetUrl = best.url;
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
      // URL expirada, limpiar caché y reintentar
      audioUrlCache.delete(id);
      return res.status(503).send('URL de audio expirada, intenta de nuevo');
    }

    res.status(audioRes.status);
    res.setHeader('Content-Type', audioRes.headers.get('content-type') || 'audio/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    if (audioRes.headers.get('content-length')) {
      res.setHeader('Content-Length', audioRes.headers.get('content-length'));
    }
    if (audioRes.headers.get('content-range')) {
      res.setHeader('Content-Range', audioRes.headers.get('content-range'));
    }

    // Transmitir el audio al cliente
    Readable.fromWeb(audioRes.body).pipe(res);
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
