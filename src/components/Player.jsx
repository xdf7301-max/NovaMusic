import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Repeat1,
  Volume2, 
  Volume1, 
  VolumeX, 
  Heart, 
  ListMusic,
  Loader2
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Player({ onToggleQueue }) {
  const {
    currentTrack,
    isPlaying,
    isLoadingAudio,
    togglePlay,
    handleNextTrack,
    handlePrevTrack,
    currentTime,
    duration,
    seekTo,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isShuffle,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
    likedSongIds,
    toggleLike,
    formatTime,
  } = useMusic();

  const [isHoveringProgress, setIsHoveringProgress] = useState(false);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);

  if (!currentTrack) return null;

  const isLiked = likedSongIds.includes(currentTrack.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 md:h-24 bg-[#181818] border-t border-[#282828] px-4 md:px-6 flex items-center justify-between z-40 select-none">
      {/* 1. Información de la Canción Actual (Izquierda) */}
      <div className="flex items-center gap-3.5 w-1/4 min-w-[160px] md:min-w-[220px]">
        <div className="relative group flex-shrink-0 cursor-pointer">
          <img
            src={currentTrack.cover}
            alt={currentTrack.title}
            className="w-12 h-12 md:w-14 md:h-14 rounded-md object-cover shadow-lg"
          />
          {currentTrack.format && (
            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.2 bg-black/80 text-[#1ed760] font-bold text-[9px] rounded font-mono">
              {currentTrack.format}
            </span>
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs md:text-sm font-semibold text-white truncate hover:underline cursor-pointer">
              {currentTrack.title}
            </span>
          </div>
          <span className="text-[11px] md:text-xs text-neutral-400 truncate hover:underline hover:text-white cursor-pointer mt-0.5 flex items-center gap-1">
            {currentTrack.artist}
            {currentTrack.isLocal && (
              <span className="text-[10px] text-[#1ed760] font-medium">• Local</span>
            )}
          </span>
        </div>

        <button
          onClick={() => toggleLike(currentTrack.id)}
          className="ml-1 text-neutral-400 hover:text-white transition-transform active:scale-90"
          title={isLiked ? 'Quitar de tus me gusta' : 'Guardar en tus me gusta'}
        >
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
              isLiked ? 'text-[#1ed760] fill-[#1ed760]' : 'hover:text-white'
            }`}
          />
        </button>
      </div>

      {/* 2. Controles de Reproducción y Barra de Progreso (Centro) */}
      <div className="flex flex-col items-center max-w-[600px] w-2/4 px-2">
        {/* Botones de Control */}
        <div className="flex items-center gap-3 md:gap-6 mb-1 md:mb-1.5">
          {/* Aleatorio */}
          <button
            onClick={toggleShuffle}
            title={isShuffle ? 'Desactivar aleatorio' : 'Activar aleatorio'}
            className={`transition-colors relative p-1 ${
              isShuffle ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Shuffle className="w-4 h-4 md:w-4.5 md:h-4.5" />
            {isShuffle && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full" />
            )}
          </button>

          {/* Anterior */}
          <button
            onClick={handlePrevTrack}
            title="Anterior"
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Reproducir / Pausa (Botón Principal) */}
          <button
            onClick={togglePlay}
            disabled={isLoadingAudio}
            title={isPlaying ? 'Pausa' : 'Reproducir'}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-white/10 disabled:opacity-80"
          >
            {isLoadingAudio ? (
              <Loader2 className="w-4 h-4 md:w-5 md:h-5 text-black animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-4 h-4 md:w-5 md:h-5 fill-black" />
            ) : (
              <Play className="w-4 h-4 md:w-5 md:h-5 fill-black ml-0.5" />
            )}
          </button>

          {/* Siguiente */}
          <button
            onClick={handleNextTrack}
            title="Siguiente"
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repetir */}
          <button
            onClick={toggleRepeat}
            title={`Modo repetición: ${repeatMode}`}
            className={`transition-colors relative p-1 ${
              repeatMode !== 'off' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
            }`}
          >
            {repeatMode === 'one' ? (
              <Repeat1 className="w-4 h-4 md:w-4.5 md:h-4.5" />
            ) : (
              <Repeat className="w-4 h-4 md:w-4.5 md:h-4.5" />
            )}
            {repeatMode !== 'off' && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1ed760] rounded-full" />
            )}
          </button>
        </div>

        {/* Barra de Progreso y Tiempos */}
        <div 
          className="w-full flex items-center gap-2 text-[10px] md:text-xs text-neutral-400"
          onMouseEnter={() => setIsHoveringProgress(true)}
          onMouseLeave={() => setIsHoveringProgress(false)}
        >
          <span className="w-9 text-right font-mono">{formatTime(currentTime)}</span>

          <div className="relative flex-1 flex items-center h-4 cursor-pointer group">
            {/* Fondo de la barra */}
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  isHoveringProgress ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${Math.min(progressPercent, 100)}%` }}
              />
            </div>

            {/* Input range invisible sobrepuesto para interacción suave */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seekTo(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <span className="w-9 font-mono">{formatTime(duration)}</span>
        </div>
      </div>

      {/* 3. Controles Secundarios y Volumen (Derecha) */}
      <div className="flex items-center justify-end gap-2.5 md:gap-3 w-1/4 min-w-[140px] md:min-w-[200px]">

        {/* Botón de Cola de Reproducción */}
        <button
          onClick={onToggleQueue}
          title="Cola de reproducción"
          className="text-neutral-400 hover:text-white p-1.5 transition-colors hidden sm:block"
        >
          <ListMusic className="w-4 h-4 md:w-5 md:h-5" />
        </button>

        {/* Control de Volumen */}
        <div 
          className="flex items-center gap-2"
          onMouseEnter={() => setIsHoveringVolume(true)}
          onMouseLeave={() => setIsHoveringVolume(false)}
        >
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors"
            title={isMuted ? 'Desmutear' : 'Silenciar'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 md:w-5 md:h-5 text-red-400" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4 md:w-5 md:h-5" />
            ) : (
              <Volume2 className="w-4 h-4 md:w-5 md:h-5" />
            )}
          </button>

          <div className="relative w-16 md:w-24 h-4 flex items-center cursor-pointer">
            <div className="w-full h-1 bg-[#4d4d4d] rounded-full overflow-hidden">
              <div
                className={`h-full transition-all rounded-full ${
                  isHoveringVolume ? 'bg-[#1ed760]' : 'bg-white'
                }`}
                style={{ width: `${isMuted ? 0 : volume * 100}%` }}
              />
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                if (isMuted) toggleMute();
                setVolume(Number(e.target.value));
              }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
