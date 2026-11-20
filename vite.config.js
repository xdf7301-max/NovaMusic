import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { Ytdl } from '@distube/ytdl-core'
import { Readable } from 'node:stream'

const ytdl = new Ytdl();
// Cache en memoria para URLs de audio directo (expira tras 4 horas)
const audioUrlCache = new Map();

// Plugin de búsqueda y streaming de audio directo sin restricciones de incrustación
function musicStreamPlugin() {
  return {
    name: 'music-stream-plugin',
    configureServer(server) {
      // 1. Endpoint para buscar el ID de la canción
      server.middlewares.use('/api/yt-search', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const q = url.searchParams.get('q');
          if (!q) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Falta parámetro q' }));
            return;
          }

          const query = `${q} audio`;
          const ytRes = await fetch(
            `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
            {
              headers: {
                'User-Agent':
                  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
              },
            }
          );
          const text = await ytRes.text();
          const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
          const matches = [...text.matchAll(regex)].map((m) => m[1]);
          const unique = [...new Set(matches)];
          const videoId = unique.length > 0 ? unique[0] : null;

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ videoId, matches: unique.slice(0, 10) }));
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });

      // 2. Endpoint para transmitir audio directo nativo (sin iframes, sin restricciones de VEVO ni errores 150)
      server.middlewares.use('/api/stream-audio', async (req, res) => {
        try {
          const url = new URL(req.url, 'http://localhost');
          const id = url.searchParams.get('id');
          if (!id) {
            res.statusCode = 400;
            res.end('Falta id');
            return;
          }

          let targetUrl = audioUrlCache.get(id);
          if (!targetUrl) {
            const info = await ytdl.getInfo(id);
            const audioFormats = info.formats.filter(
              (f) => f.hasAudio && !f.hasVideo && f.url
            );
            if (!audioFormats.length) {
              res.statusCode = 404;
              res.end('Formato de audio no encontrado');
              return;
            }
            targetUrl = audioFormats[0].url;
            audioUrlCache.set(id, targetUrl);
          }

          // Soporte nativo para cabecera Range (permite adelantar o atrasar a cualquier segundo al instante)
          const headers = {};
          if (req.headers.range) {
            headers['Range'] = req.headers.range;
          }

          const audioRes = await fetch(targetUrl, { headers });
          res.statusCode = audioRes.status;
          res.setHeader(
            'Content-Type',
            audioRes.headers.get('content-type') || 'audio/mp4'
          );
          if (audioRes.headers.get('content-length')) {
            res.setHeader('Content-Length', audioRes.headers.get('content-length'));
          }
          if (audioRes.headers.get('content-range')) {
            res.setHeader('Content-Range', audioRes.headers.get('content-range'));
          }
          res.setHeader('Accept-Ranges', 'bytes');

          Readable.fromWeb(audioRes.body).pipe(res);
        } catch (err) {
          console.error('Error transmitiendo audio:', err);
          res.statusCode = 500;
          res.end(err.message);
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    musicStreamPlugin(),
  ],
})
