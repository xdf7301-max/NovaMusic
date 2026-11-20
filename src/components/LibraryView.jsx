import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Heart, 
  Play, 
  Pause,
  Music, 
  Upload, 
  Clock, 
  FileAudio,
  HardDrive
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function LibraryView() {
  const {
    userPlaylists,
    MOCK_ALBUMS,
    likedSongsList,
    importedSongs,
    importAudioFiles,
    openDetail,
    openLikedSongs,
    createNewPlaylist,
    currentTrack,
    isPlaying,
    playTrack,
    togglePlay,
    likedSongIds,
    toggleLike
  } = useMusic();

  const [filter, setFilter] = useState('all'); // 'all' | 'playlists' | 'albums' | 'local'
  const fileInputRef = useRef(null);

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      importAudioFiles(e.target.files);
      // Reset input para permitir seleccionar los mismos archivos de nuevo si se desea
      e.target.value = '';
    }
  };

  return (
    <div className="pb-36 p-6 space-y-6 select-none">
      {/* Input de archivo nativo oculto */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept=".mp3,.wav,.ogg,.flac,audio/mpeg,audio/wav,audio/ogg,audio/flac"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Cabecera de Biblioteca */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tu biblioteca</h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Tus listas, álbumes, favoritos y archivos locales
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Botón Requerido: Importar música */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-[#282828] hover:bg-[#333333] text-white font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all border border-white/10 shadow-md group"
            title="Seleccionar archivos MP3, WAV, OGG o FLAC de tu computadora"
          >
            <Upload className="w-4 h-4 text-[#1ed760] group-hover:scale-110 transition-transform" />
            <span>Importar música</span>
          </button>

          {/* Botón: Nueva Playlist */}
          <button
            onClick={() => createNewPlaylist()}
            className="flex items-center gap-2 px-4 py-2 bg-[#1ed760] hover:bg-[#1db954] text-black font-bold text-sm rounded-full hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#1ed760]/20"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Playlist</span>
          </button>
        </div>
      </div>

      {/* Filtros de Pestañas */}
      <div className="flex items-center gap-2 text-sm font-semibold overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
            filter === 'all'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Todo
        </button>
        <button
          onClick={() => setFilter('playlists')}
          className={`px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
            filter === 'playlists'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Playlists
        </button>
        <button
          onClick={() => setFilter('albums')}
          className={`px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
            filter === 'albums'
              ? 'bg-white text-black'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          Álbumes
        </button>
        <button
          onClick={() => setFilter('local')}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
            filter === 'local'
              ? 'bg-[#1ed760] text-black font-bold'
              : 'bg-neutral-800 text-white hover:bg-neutral-700'
          }`}
        >
          <HardDrive className="w-3.5 h-3.5" />
          <span>Música local ({importedSongs.length})</span>
        </button>
      </div>

      {/* Sección Dedicada: Canciones Importadas de la Computadora */}
      {(filter === 'all' || filter === 'local') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-[#1ed760]" />
              <h2 className="text-lg font-bold text-white">
                Archivos locales importados ({importedSongs.length})
              </h2>
            </div>
            {importedSongs.length > 0 && (
              <button
                onClick={() => playTrack(importedSongs[0], importedSongs)}
                className="text-xs font-bold text-[#1ed760] hover:underline flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5 fill-[#1ed760]" />
                Reproducir todo
              </button>
            )}
          </div>

          {importedSongs.length === 0 ? (
            /* Banner vacío cuando no se han importado canciones */
            <div className="bg-[#181818]/60 border border-dashed border-white/10 rounded-2xl p-6 text-center">
              <FileAudio className="w-12 h-12 text-neutral-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">
                Aún no has importado canciones desde tu computadora
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto mb-4">
                Puedes reproducir tus archivos locales de audio <b>MP3, WAV, OGG y FLAC</b> de forma privada en NOVA MUSIC sin subirlos a internet.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 bg-[#1ed760] hover:bg-[#1db954] text-black font-bold text-xs rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg"
              >
                Importar música ahora
              </button>
            </div>
          ) : (
            /* Tabla completa de archivos importados */
            <div className="bg-[#181818]/80 rounded-xl p-3 border border-white/5">
              <div className="grid grid-cols-12 gap-3 px-3 py-2 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5 sm:col-span-4">Nombre del archivo</div>
                <div className="hidden sm:block sm:col-span-3">Formato & Tamaño</div>
                <div className="hidden md:block md:col-span-2">Ubicación</div>
                <div className="col-span-6 sm:col-span-4 md:col-span-2 text-right flex items-center justify-end pr-2">
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              <div className="divide-y divide-white/5">
                {importedSongs.map((song, index) => {
                  const isCurrent = currentTrack?.id === song.id;
                  const isSongPlaying = isCurrent && isPlaying;
                  const isLiked = likedSongIds.includes(song.id);

                  return (
                    <div
                      key={song.id}
                      onClick={() => playTrack(song, importedSongs)}
                      className={`grid grid-cols-12 gap-3 items-center px-3 py-2.5 rounded-lg cursor-pointer group transition-colors ${
                        isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      {/* # o Botón Play */}
                      <div className="col-span-1 text-center text-sm font-semibold flex items-center justify-center">
                        <span className={`group-hover:hidden ${isCurrent ? 'text-[#1ed760]' : 'text-neutral-400'}`}>
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isCurrent) togglePlay();
                            else playTrack(song, importedSongs);
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

                      {/* Nombre del archivo */}
                      <div className="col-span-5 sm:col-span-4 flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded bg-[#282828] flex items-center justify-center flex-shrink-0 text-[#1ed760]">
                          <FileAudio className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p
                            className={`text-sm font-semibold truncate ${
                              isCurrent ? 'text-[#1ed760]' : 'text-white'
                            }`}
                            title={song.fileName}
                          >
                            {song.title}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate">
                            {song.fileName}
                          </p>
                        </div>
                      </div>

                      {/* Formato y Tamaño */}
                      <div className="hidden sm:flex sm:col-span-3 items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-[#1ed760] border border-emerald-500/30">
                          {song.format}
                        </span>
                        <span className="text-xs text-neutral-400 font-mono">
                          {song.fileSize}
                        </span>
                      </div>

                      {/* Ubicación */}
                      <div className="hidden md:block md:col-span-2 text-xs text-neutral-400 truncate">
                        Archivo local
                      </div>

                      {/* Favoritos y Duración */}
                      <div className="col-span-6 sm:col-span-4 md:col-span-2 flex items-center justify-end gap-3 pr-2">
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
                          title={isLiked ? 'Quitar de favoritos' : 'Guardar en favoritos'}
                        >
                          <Heart className={`w-4 h-4 ${isLiked ? 'fill-[#1ed760]' : ''}`} />
                        </button>
                        <span className="text-xs font-mono text-neutral-400">
                          {song.duration}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cuadrícula de Playlists y Álbumes */}
      {(filter === 'all' || filter === 'playlists' || filter === 'albums') && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3">Colecciones y Álbumes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {/* Card Especial de Me Gusta */}
            {(filter === 'all' || filter === 'playlists') && (
              <div
                onClick={openLikedSongs}
                className="col-span-2 bg-gradient-to-br from-emerald-800 via-teal-900 to-indigo-950 p-5 rounded-2xl cursor-pointer group hover:scale-[1.01] transition-all relative flex flex-col justify-end shadow-xl min-h-[190px]"
              >
                <div className="flex-1">
                  <Heart className="w-10 h-10 text-white fill-white mb-2" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">Tus me gusta</h2>
                  <p className="text-sm text-white/80 mt-1">
                    {likedSongsList.length} canciones favoritas
                  </p>
                </div>
                <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2 transition-all">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openLikedSongs();
                    }}
                    className="w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xl"
                  >
                    <Play className="w-6 h-6 fill-black ml-0.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Playlists del Usuario */}
            {(filter === 'all' || filter === 'playlists') &&
              userPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  onClick={() => openDetail(pl, 'playlist')}
                  className="bg-[#181818] hover:bg-[#282828] p-3 sm:p-4 rounded-xl cursor-pointer group transition-all duration-300 flex flex-col relative"
                >
                  <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-3 shadow-lg">
                    <img
                      src={pl.cover}
                      alt={pl.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute right-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(pl, 'playlist');
                        }}
                        className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                      >
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate mb-1">{pl.title}</h3>
                  <p className="text-xs text-neutral-400 truncate">Playlist • {pl.creator}</p>
                </div>
              ))}

            {/* Álbumes */}
            {(filter === 'all' || filter === 'albums') &&
              MOCK_ALBUMS.map((album) => (
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
                    <div className="absolute right-2.5 bottom-2.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-xl">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetail(album, 'album');
                        }}
                        className="w-10 h-10 rounded-full bg-[#1ed760] text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
                      >
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-white truncate mb-1">{album.title}</h3>
                  <p className="text-xs text-neutral-400 truncate">Álbum • {album.artist}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
