// Servicio de Búsqueda y Transmisión de Música Completa
// Obtiene el catálogo completo de canciones de los artistas y resuelve múltiples fuentes de audio

export async function searchGlobalMusic(query, limit = 150) {
  if (!query || !query.trim()) return [];

  try {
    const cleanQuery = encodeURIComponent(query.trim());
    // 1. Búsqueda amplia por término
    const searchUrl = `https://itunes.apple.com/search?term=${cleanQuery}&media=music&entity=song&limit=${limit}`;

    const res = await fetch(searchUrl);
    if (!res.ok) {
      throw new Error(`Error en el servidor de búsqueda: ${res.status}`);
    }

    const data = await res.json();
    let rawResults = (data.results || []).filter((item) => item.wrapperType === 'track' || item.trackName);

    // 2. Si hay un artista principal coincidente, obtener hasta 200 canciones de su discografía completa
    if (rawResults.length > 0 && rawResults[0].artistId) {
      const topArtistId = rawResults[0].artistId;
      const topArtistName = rawResults[0].artistName?.toLowerCase();

      // Si la búsqueda incluye el nombre del artista, ampliar con su discografía completa
      if (topArtistName && (cleanQuery.includes(encodeURIComponent(topArtistName)) || topArtistName.includes(query.toLowerCase()))) {
        try {
          const lookupUrl = `https://itunes.apple.com/lookup?id=${topArtistId}&entity=song&limit=200`;
          const lookupRes = await fetch(lookupUrl);
          if (lookupRes.ok) {
            const lookupData = await lookupRes.json();
            const artistSongs = (lookupData.results || []).filter((item) => item.wrapperType === 'track' && item.trackName);
            if (artistSongs.length > 0) {
              // Combinar resultados de búsqueda general con la discografía completa
              rawResults = [...artistSongs, ...rawResults];
            }
          }
        } catch (e) {
          console.warn('No se pudo completar la discografía ampliada:', e);
        }
      }
    }

    // 3. Eliminar canciones duplicadas por nombre normalizado
    const seenTitles = new Set();
    const songs = [];

    for (const item of rawResults) {
      if (!item.trackName || !item.artistName) continue;

      const normKey = `${item.artistName.toLowerCase()}-${item.trackName.toLowerCase().replace(/\s*\(.*?\)\s*/g, '').trim()}`;
      if (seenTitles.has(normKey)) continue;
      seenTitles.add(normKey);

      // Duración REAL y COMPLETA de la canción en segundos
      const durationSec = item.trackTimeMillis
        ? Math.round(item.trackTimeMillis / 1000)
        : 210;

      const minutes = Math.floor(durationSec / 60);
      const seconds = durationSec % 60;
      const durationStr = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

      // Portada en alta definición (600x600 px)
      const highResCover = item.artworkUrl100
        ? item.artworkUrl100.replace('100x100bb', '600x600bb')
        : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80';

      songs.push({
        id: `online-${item.trackId || Math.random().toString(36).substr(2, 9)}`,
        trackId: item.trackId,
        title: item.trackName,
        artist: item.artistName || 'Artista desconocido',
        album: item.collectionName || item.trackName,
        duration: durationStr,
        durationSec: durationSec,
        cover: highResCover,
        genre: item.primaryGenreName || 'Música',
        releaseDate: item.releaseDate
          ? new Date(item.releaseDate).getFullYear().toString()
          : '2026',
        isOnline: true,
        plays: 'Global'
      });
    }

    return songs;
  } catch (error) {
    console.error('Error buscando música global:', error);
    return [];
  }
}

// Resuelve múltiples IDs de video de respaldo para garantizar reproducción continua sin errores
export async function getFullSongSource(artist, title) {
  const query = `${artist} ${title}`;

  // 1. Probar endpoint local de Vite
  try {
    const res = await fetch(`/api/yt-search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const data = await res.json();
      if (data.videoId) {
        return {
          videoId: data.videoId,
          matches: data.matches && data.matches.length > 0 ? data.matches : [data.videoId]
        };
      }
    }
  } catch (e) {
    console.warn('Endpoint local no disponible, probando respaldo...', e);
  }

  // 2. Respaldo mediante proxy público CORS
  try {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' audio')}`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
    const res = await fetch(proxyUrl);
    if (res.ok) {
      const data = await res.json();
      const regex = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
      const matches = [...(data.contents || '').matchAll(regex)].map((m) => m[1]);
      const unique = [...new Set(matches)];
      if (unique.length > 0) {
        return {
          videoId: unique[0],
          matches: unique.slice(0, 10)
        };
      }
    }
  } catch (err) {
    console.error('Error en respaldo de búsqueda de canción completa:', err);
  }

  return null;
}
