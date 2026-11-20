import React, { useState, useEffect, useRef } from 'react';
import { 
  Search as SearchIcon, 
  Play, 
  Pause, 
  Heart, 
  FileAudio, 
  Loader2, 
  X, 
  Globe, 
  Sparkles,
  Music
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';
import { searchGlobalMusic } from '../utils/musicApi';

export default function SearchView() {
  const {
    searchQuery,
    setSearchQuery,
    allSongs,
    importedSongs,
    MOCK_ALBUMS,
    MOCK_GENRES,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    openDetail,
    likedSongIds,
    toggleLike
  } = useMusic();

  const [onlineResults, setOnlineResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef(null);

  const query = searchQuery.toLowerCase().trim();

  // 1. Filtrado instantáneo local (archivos importados y catálogo integrado)
  const localMatchedSongs = allSongs.filter(
    (s) =>
      s.title?.toLowerCase().includes(query) ||
      s.artist?.toLowerCase().includes(query) ||
      s.genre?.toLowerCase().includes(query) ||
      s.album?.toLowerCase().includes(query) ||
      s.fileName?.toLowerCase().includes(query)
  );

  // 2. Búsqueda mundial en línea con Debounce (350ms)
  useEffect(() => {
    if (!query) {
      setOnlineResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchGlobalMusic(query, 150);
        setOnlineResults(results);
      } catch (err) {
        console.error('Error buscando en API:', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Lista combinada de canciones encontradas (locales prioritarias + resultados globales)
  const allMatchedSongs = [
    ...localMatchedSongs,
    ...onlineResults.filter(
      (online) => !localMatchedSongs.some((local) => local.id === online.id)
    )
  ];

  const topResult = allMatchedSongs[0];

  const popularSuggestions = [
    'Queen',
    'Bad Bunny',
    'Taylor Swift',
    'Michael Jackson',
    'The Weeknd',
    'Coldplay',
    'Daft Punk',
    'Billie Eilish'
  ];

  return (
    <div className="pb-36 p-6 space-y-6 select-none">
      {/* Barra de Búsqueda Interactiva */}
      <div className="relative max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Busca cualquier artista, canción o banda (ej. Queen, Bad Bunny, Rock...)"
          className="w-full pl-12 pr-10 py-3.5 bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-white placeholder-neutral-400 rounded-full border border-neutral-700 focus:border-[#1ed760] focus:outline-none text-sm transition-all shadow-lg"
          autoFocus
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sugerencias Rápidas */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-neutral-400 font-semibold whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#1ed760]" />
          Tendencias:
        </span>
        {popularSuggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => setSearchQuery(suggestion)}
            className="px-3 py-1.5 rounded-full bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 hover:text-white font-medium whitespace-nowrap transition-colors border border-white/5"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {query ? (
        /* Vista de Resultados en Tiempo Real */
        <div className="space-y-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-neutral-400 gap-3">
              <Loader2 className="w-8 h-8 text-[#1ed760] animate-spin" />
              <p className="text-sm font-medium">Buscando cualquier música en el catálogo mundial...</p>
            </div>
          ) : allMatchedSongs.length > 0 ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* 1. Resultado Principal Destacado */}
                {topResult && (
                  <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-3">Resultado principal</h2>
                    <div
                      onClick={() => playTrack(topResult, allMatchedSongs)}
                      className="bg-[#181818] hover:bg-[#282828] p-5 rounded-2xl cursor-pointer group transition-all duration-300 relative flex flex-col justify-between shadow-xl border border-white/5 h-full min-h-[220px]"
                    >
                      <div className="relative w-28 h-28 mb-4">
                        {topResult.isLocal ? (
                          <div className="w-28 h-28 rounded-lg bg-gradient-to-br from-emerald-800 to-teal-950 flex items-center justify-center text-[#1ed760] shadow-lg">
                            <FileAudio className="w-14 h-14" />
                          </div>
                        ) : (
                          <img
                            src={topResult.cover}
                            alt={topResult.title}
                            className="w-28 h-28 rounded-lg object-cover shadow-2xl"
                          />
                        )}
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-white group-hover:text-[#1ed760] transition-colors truncate">
                          {topResult.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {topResult.isOnline && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-[#1ed760] border border-emerald-500/30 flex items-center gap-1">
                              <Globe className="w-3 h-3" />
                              Global
                            </span>
                          )}
                          {topResult.format && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-[#1ed760] border border-emerald-500/30">
                              {topResult.format}
                            </span>
                          )}
                          <p className="text-sm text-neutral-400 truncate">
                            {topResult.artist} • Canción
                          </p>
                        </div>
                      </div>

                      {/* Botón Flotante Play */}
                      <div className="absolute right-5 bottom-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-2xl">
                        <button className="w-14 h-14 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg">
                          <Play className="w-7 h-7 fill-black ml-0.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Lista de Canciones Coincidentes */}
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-xl font-bold text-white">
                      Canciones encontradas ({allMatchedSongs.length})
                    </h2>
                    {allMatchedSongs.length > 0 && (
                      <button
                        onClick={() => playTrack(allMatchedSongs[0], allMatchedSongs)}
                        className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-full transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#1ed760]" />
                        <span>Reproducir todo ({allMatchedSongs.length})</span>
                      </button>
                    )}
                  </div>

                  <div className="bg-[#181818]/60 rounded-xl p-2 divide-y divide-white/5 border border-white/5 max-h-[580px] overflow-y-auto">
                    {allMatchedSongs.map((song, index) => {
                      const isCurrent = currentTrack?.id === song.id;
                      const isSongPlaying = isCurrent && isPlaying;
                      const isLiked = likedSongIds.includes(song.id);

                      return (
                        <div
                          key={song.id}
                          onClick={() => playTrack(song, allMatchedSongs)}
                          className={`group flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors ${
                            isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                          }`}
                        >
                          <div className="w-6 text-center text-xs font-semibold flex items-center justify-center">
                            <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : 'text-neutral-400'}`}>
                              {index + 1}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isCurrent) togglePlay();
                                else playTrack(song, allMatchedSongs);
                              }}
                              className="hidden group-hover:block text-white hover:scale-110 transition-transform"
                            >
                              {isSongPlaying ? (
                                <Pause className="w-4 h-4 fill-white" />
                              ) : (
                                <Play className="w-4 h-4 fill-white ml-0.5" />
                              )}
                            </button>
                          </div>

                          {song.isLocal ? (
                            <div className="w-10 h-10 rounded bg-[#282828] flex items-center justify-center flex-shrink-0 text-[#1ed760]">
                              <FileAudio className="w-5 h-5" />
                            </div>
                          ) : (
                            <img
                              src={song.cover}
                              alt={song.title}
                              className="w-10 h-10 rounded object-cover flex-shrink-0 shadow"
                            />
                          )}

                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-semibold truncate ${
                                isCurrent ? 'text-[#1ed760]' : 'text-white'
                              }`}
                            >
                              {song.title}
                            </p>
                            <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5">
                              {song.artist}
                              {song.album && <span className="text-neutral-500">• {song.album}</span>}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(song.id);
                            }}
                            className={`p-1 ${isLiked ? 'text-[#1ed760]' : 'text-neutral-400 opacity-0 group-hover:opacity-100'}`}
                            title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
                          </button>

                          <span className="text-xs font-mono text-neutral-400 w-10 text-right">
                            {song.duration}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-[#181818]/40 rounded-2xl border border-white/5">
              <Music className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <p className="text-lg text-neutral-300 font-semibold">
                No encontramos canciones para "{searchQuery}"
              </p>
              <p className="text-sm text-neutral-500 mt-1 max-w-md mx-auto">
                Prueba buscando otro artista, canción o género musical (como Pop, Rock, Salsa, K-Pop, etc.).
              </p>
            </div>
          )}
        </div>
      ) : (
        /* Categorías / Explorar Todo (Estilo Spotify) */
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Explorar todo</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {MOCK_GENRES.map((genre) => (
              <div
                key={genre.id}
                onClick={() => setSearchQuery(genre.name)}
                className={`${genre.color} h-36 sm:h-44 rounded-xl p-4 cursor-pointer relative overflow-hidden group hover:scale-[1.02] active:scale-95 transition-all shadow-lg`}
              >
                <h3 className="text-lg sm:text-xl font-extrabold text-white leading-tight">
                  {genre.name}
                </h3>
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md absolute -right-3 -bottom-2 shadow-2xl rotate-[25deg] group-hover:rotate-[20deg] group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
