import React from 'react';
import { Play, Pause, Heart, Clock, Disc3 } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function HomeView() {
  const {
    MOCK_SONGS,
    MOCK_ALBUMS,
    MOCK_PLAYLISTS,
    MOCK_ARTISTS,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    openDetail,
    openLikedSongs,
    likedSongIds,
    toggleLike
  } = useMusic();

  // Saludo dinámico según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 20) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const popularSongs = MOCK_SONGS.slice(0, 6);

  return (
    <div className="pb-36 p-6 space-y-8 select-none">
      {/* 1. Saludo y Accesos Rápidos (Estilo Spotify) */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-4">
          {getGreeting()}
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Card Especial: Tus me gusta */}
          <div
            onClick={openLikedSongs}
            className="flex items-center bg-[#282828]/50 hover:bg-[#323232] rounded-md overflow-hidden cursor-pointer group transition-all duration-300 relative shadow"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 flex items-center justify-center flex-shrink-0">
              <Heart className="w-8 h-8 text-white fill-white" />
            </div>
            <div className="px-4 flex-1 font-bold text-sm text-white truncate">
              Tus me gusta
            </div>
            <div className="mr-4 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-xl">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  openLikedSongs();
                }}
                className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 transition-transform"
              >
                <Play className="w-5 h-5 fill-black ml-0.5" />
              </button>
            </div>
          </div>

          {/* Primeros 5 playlists o álbumes en accesos rápidos */}
          {MOCK_PLAYLISTS.slice(0, 5).map((pl) => (
            <div
              key={pl.id}
              onClick={() => openDetail(pl, 'playlist')}
              className="flex items-center bg-[#282828]/50 hover:bg-[#323232] rounded-md overflow-hidden cursor-pointer group transition-all duration-300 relative shadow"
            >
              <img
                src={pl.cover}
                alt={pl.title}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover flex-shrink-0"
              />
              <div className="px-4 flex-1 font-bold text-sm text-white truncate">
                {pl.title}
              </div>
              <div className="mr-4 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all shadow-xl">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDetail(pl, 'playlist');
                  }}
                  className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 transition-transform"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Sección: Canciones Populares */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
              Canciones populares en NOVA
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">Las canciones más reproducidas hoy</p>
          </div>
        </div>

        <div className="bg-[#181818]/60 rounded-xl p-3 border border-white/5 divide-y divide-white/5">
          {popularSongs.map((song, index) => {
            const isCurrent = currentTrack?.id === song.id;
            const isLiked = likedSongIds.includes(song.id);

            return (
              <div
                key={song.id}
                onClick={() => playTrack(song, MOCK_SONGS)}
                className={`group flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg cursor-pointer transition-colors ${
                  isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                }`}
              >
                {/* Posición / Icono de Reproducción */}
                <div className="w-6 text-center text-sm font-semibold flex items-center justify-center">
                  <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : 'text-neutral-400'}`}>
                    {index + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) togglePlay();
                      else playTrack(song, MOCK_SONGS);
                    }}
                    className="hidden group-hover:block text-white hover:scale-110 transition-transform"
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-4 h-4 fill-white" />
                    ) : (
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Carátula */}
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded object-cover flex-shrink-0"
                />

                {/* Título y Artista */}
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isCurrent ? 'text-[#1ed760]' : 'text-white group-hover:text-white'
                    }`}
                  >
                    {song.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate hover:underline">
                    {song.artist}
                  </p>
                </div>

                {/* Álbum (oculto en móviles pequeños) */}
                <div className="hidden md:block w-1/4 text-xs text-neutral-400 truncate">
                  {song.album}
                </div>

                {/* Reproducciones (oculto en móviles) */}
                <div className="hidden lg:block w-28 text-xs text-neutral-400 font-mono text-right">
                  {song.plays}
                </div>

                {/* Botón Favorito */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(song.id);
                  }}
                  className={`p-1 transition-transform active:scale-90 ${
                    isLiked ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
                </button>

                {/* Duración */}
                <div className="w-10 text-right text-xs font-mono text-neutral-400">
                  {song.duration}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Sección: Álbumes Destacados */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
              Álbumes que te encantarán
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">Producciones completas de nuestros artistas Nova</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_ALBUMS.map((album) => (
            <div
              key={album.id}
              onClick={() => openDetail(album, 'album')}
              className="bg-[#181818] hover:bg-[#282828] p-3 sm:p-4 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col relative"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-lg">
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Botón Flotante Verde Spotify */}
                <div className="absolute right-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(album, 'album');
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-white truncate mb-1">
                {album.title}
              </h3>
              <p className="text-xs text-neutral-400 truncate">
                {album.year} • {album.artist}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Sección: Playlists Recomendadas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
              Listas de reproducción seleccionadas
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">Ambientes diseñados para cada momento</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {MOCK_PLAYLISTS.map((playlist) => (
            <div
              key={playlist.id}
              onClick={() => openDetail(playlist, 'playlist')}
              className="bg-[#181818] hover:bg-[#282828] p-3 sm:p-4 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col relative"
            >
              <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-lg">
                <img
                  src={playlist.cover}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute right-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetail(playlist, 'playlist');
                    }}
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </button>
                </div>
              </div>

              <h3 className="font-bold text-sm text-white truncate mb-1">
                {playlist.title}
              </h3>
              <p className="text-xs text-neutral-400 line-clamp-2">
                {playlist.subtitle}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Sección: Artistas en Tendencia */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white hover:underline cursor-pointer">
              Artistas en tendencia
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">Creadores que están marcando el sonido NOVA</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_ARTISTS.map((artist) => (
            <div
              key={artist.id}
              className="bg-[#181818] hover:bg-[#282828] p-4 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col items-center text-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden mb-3 shadow-xl">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="font-bold text-sm text-white truncate w-full mb-0.5">
                {artist.name}
              </h3>
              <p className="text-xs text-neutral-400 truncate w-full">
                {artist.listeners}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
