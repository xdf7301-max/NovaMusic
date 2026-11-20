import express from 'express';
import cors from 'cors';
import { Readable } from 'node:stream';
import { Ytdl } from '@distube/ytdl-core';

const app = express();
const PORT = process.env.PORT || 3001;
const ytdl = new Ytdl();
const audioUrlCache = new Map();

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.json({
    service: 'NOVA MUSIC Backend',
    status: 'online 🎵',
    version: '1.0.0',
    endpoints: ['/api/yt-search?q=', '/api/stream-audio?id=']
  });
});

app.get('/api/yt-search', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ error: 'Falta parámetro q' });

  try {
    const ytRes = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(q + ' audio')}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      }
    );
    const text = await ytRes.text();
    const matches = [...text.matchAll(/"videoId":"([a-zA-Z0-9_-]{11})"/g)].map((m) => m[1]);
    const unique = [...new Set(matches)];
    res.json({ videoId: unique[0] || null, matches: unique.slice(0, 10) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/stream-audio', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).send('Falta id');

  try {
    let targetUrl = audioUrlCache.get(id);
    if (!targetUrl) {
      const info = await ytdl.getInfo(id);
      const formats = info.formats.filter((f) => f.hasAudio && !f.hasVideo && f.url);
      if (!formats.length) return res.status(404).send('Formato de audio no encontrado');
      targetUrl = formats[0].url;
      audioUrlCache.set(id, targetUrl);
      setTimeout(() => audioUrlCache.delete(id), 3 * 3600 * 1000);
    }

    const headers = req.headers.range ? { Range: req.headers.range } : {};
    const audioRes = await fetch(targetUrl, { headers });

    res.status(audioRes.status);
    res.setHeader('Content-Type', audioRes.headers.get('content-type') || 'audio/mp4');
    if (audioRes.headers.get('content-length')) {
      res.setHeader('Content-Length', audioRes.headers.get('content-length'));
    }
    if (audioRes.headers.get('content-range')) {
      res.setHeader('Content-Range', audioRes.headers.get('content-range'));
    }
    res.setHeader('Accept-Ranges', 'bytes');

    Readable.fromWeb(audioRes.body).pipe(res);
  } catch (err) {
    console.error('Error transmitiendo audio:', err.message);
    if (!res.headersSent) res.status(500).send(err.message);
  }
});

app.listen(PORT, () => {
  console.log(`🎵 NOVA MUSIC Backend corriendo en puerto ${PORT}`);
});
