import React from 'react';
import { Play, Pause, Heart, Clock, MoreHorizontal, Music } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function DetailView() {
  const {
    selectedItem,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedSongIds,
    toggleLike
  } = useMusic();

  if (!selectedItem) return null;

  const songs = selectedItem.songs || [];
  const isPlaylistPlaying =
    isPlaying && songs.some((s) => s.id === currentTrack?.id);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      togglePlay();
    } else {
      playTrack(songs[0], songs);
    }
  };

  return (
    <div className="pb-36 select-none">
      {/* 1. Header con Gradiente Gigante Estilo Spotify */}
      <div
        className={`bg-gradient-to-b ${
          selectedItem.color || 'from-emerald-900'
        } via-[#181818]/80 to-[#121212] p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 pt-8`}
      >
        <img
          src={selectedItem.cover}
          alt={selectedItem.title}
          className="w-48 h-48 sm:w-56 sm:h-56 object-cover rounded-lg shadow-2xl flex-shrink-0"
        />

        <div className="flex flex-col text-center sm:text-left min-w-0">
          <span className="text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
            {selectedItem.type === 'album' ? 'Álbum' : 'Playlist pública'}
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 break-words">
            {selectedItem.title}
          </h1>
          {selectedItem.subtitle && (
            <p className="text-sm text-neutral-300 max-w-2xl mb-3">
              {selectedItem.subtitle}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-neutral-300 font-medium">
            <span className="font-bold text-white">{selectedItem.creator || selectedItem.artist}</span>
            <span>•</span>
            <span>{songs.length} canciones</span>
            {selectedItem.followers && (
              <>
                <span>•</span>
                <span>{selectedItem.followers}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Barra de Acciones */}
      <div className="px-6 sm:px-8 py-5 flex items-center gap-6">
        {/* Gran Botón Verde de Play */}
        <button
          onClick={handlePlayAll}
          disabled={songs.length === 0}
          title={isPlaylistPlaying ? 'Pausar' : 'Reproducir'}
          className="w-14 h-14 rounded-full bg-[#1ed760] hover:bg-[#1db954] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-[#1ed760]/30 disabled:opacity-50"
        >
          {isPlaylistPlaying ? (
            <Pause className="w-7 h-7 fill-black" />
          ) : (
            <Play className="w-7 h-7 fill-black ml-1" />
          )}
        </button>

        <button 
          title="Guardar en tu biblioteca"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <Heart className="w-8 h-8" />
        </button>

        <button 
          title="Más opciones"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <MoreHorizontal className="w-7 h-7" />
        </button>
      </div>

      {/* 3. Tabla de Canciones */}
      <div className="px-4 sm:px-8">
        {/* Cabecera de la lista */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-6 sm:col-span-5">Título</div>
          <div className="hidden sm:block sm:col-span-4">Álbum</div>
          <div className="col-span-5 sm:col-span-2 text-right flex items-center justify-end pr-2">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        {/* Filas de canciones */}
        <div className="divide-y divide-white/5">
          {songs.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-sm">
              Esta lista no tiene canciones aún.
            </div>
          ) : (
            songs.map((song, index) => {
              const isCurrent = currentTrack?.id === song.id;
              const isSongPlaying = isCurrent && isPlaying;
              const isLiked = likedSongIds.includes(song.id);

              return (
                <div
                  key={song.id}
                  onClick={() => playTrack(song, songs)}
                  className={`grid grid-cols-12 gap-4 items-center px-4 py-2.5 rounded-lg cursor-pointer group transition-colors ${
                    isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  {/* Número / Play */}
                  <div className="col-span-1 text-center text-sm font-semibold flex items-center justify-center">
                    <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : 'text-neutral-400'}`}>
                      {index + 1}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) togglePlay();
                        else playTrack(song, songs);
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

                  {/* Título y Artista */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-3 min-w-0">
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold truncate ${
                          isCurrent ? 'text-[#1ed760]' : 'text-white'
                        }`}
                      >
                        {song.title}
                      </p>
                      <p className="text-xs text-neutral-400 truncate hover:underline flex items-center gap-1.5">
                        {song.artist}
                        {song.format && (
                          <span className="text-[10px] px-1 py-0.2 bg-emerald-500/20 text-[#1ed760] font-bold rounded">
                            {song.format}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Álbum */}
                  <div className="hidden sm:block sm:col-span-4 text-xs text-neutral-400 truncate hover:underline">
                    {song.album}
                  </div>

                  {/* Like y Duración */}
                  <div className="col-span-5 sm:col-span-2 flex items-center justify-end gap-3 pr-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(song.id);
                      }}
                      className={`p-1 transition-transform active:scale-90 ${
                        isLiked
                          ? 'text-[#1ed760]'
                          : 'text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
                    </button>
                    <span className="text-xs font-mono text-neutral-400">
                      {song.duration}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
