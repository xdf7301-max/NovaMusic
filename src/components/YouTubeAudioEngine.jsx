import React, { useEffect, useRef, useState } from 'react';
import { useMusic } from '../context/MusicContext';
import { X, Tv } from 'lucide-react';

export default function YouTubeAudioEngine() {
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    volume,
    isMuted,
    setCurrentTime,
    setDuration,
    handleNextTrack,
    ytPlayerRef,
    activeVideoId,
    showVideoCanvas,
    setShowVideoCanvas,
    showToast
  } = useMusic();

  const [isYTReady, setIsYTReady] = useState(false);
  const timeIntervalRef = useRef(null);
  const pendingVideoIdRef = useRef(null);

  // 1. Cargar script de la API de YouTube IFrame solo una vez
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsYTReady(true);
      };
    } else if (window.YT && window.YT.Player) {
      setIsYTReady(true);
    }

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, []);

  // 2. Crear o actualizar el reproductor cuando activeVideoId cambie
  useEffect(() => {
    if (!activeVideoId) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
        try {
          ytPlayerRef.current.stopVideo();
        } catch (e) {}
      }
      return;
    }

    if (!isYTReady) {
      pendingVideoIdRef.current = activeVideoId;
      return;
    }

    if (!ytPlayerRef.current) {
      // Inicializar el reproductor con el videoId específico
      try {
        ytPlayerRef.current = new window.YT.Player('nova-yt-frame', {
          height: '100%',
          width: '100%',
          videoId: activeVideoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            playsinline: 1,
          },
          events: {
            onReady: (event) => {
              try {
                event.target.setVolume(volume * 100);
                if (isMuted) event.target.mute();
                if (isPlaying) event.target.playVideo();
              } catch (e) {}
            },
            onStateChange: (event) => {
              // 1: Reproduciendo, 2: Pausado, 0: Terminado naturalmente
              if (event.data === 1) {
                setIsPlaying(true);
                const realDuration = event.target.getDuration();
                if (realDuration && !isNaN(realDuration) && realDuration > 0) {
                  setDuration(Math.round(realDuration));
                }
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 0) {
                // Canción terminada naturalmente de principio a fin -> Pasar a siguiente
                handleNextTrack();
              }
            },
            onError: (event) => {
              console.warn('Error en video ID (' + event.data + '). Buscando fuente alternativa...');

              // Si tiene fuentes alternativas, probar la siguiente sin saltar la canción
              if (currentTrack?.ytMatches && currentTrack.ytMatches.length > 0) {
                const curIdx = currentTrack.matchIndex || 0;
                const nextIdx = curIdx + 1;

                if (nextIdx < currentTrack.ytMatches.length) {
                  currentTrack.matchIndex = nextIdx;
                  const nextId = currentTrack.ytMatches[nextIdx];
                  console.log(`Cargando fuente alternativa ${nextIdx + 1}:`, nextId);

                  try {
                    event.target.loadVideoById(nextId);
                    event.target.playVideo();
                    return;
                  } catch (e) {}
                }
              }

              // Si todas las alternativas fallaron
              setIsPlaying(false);
              showToast('Esta versión tiene restricciones. Selecciona otra canción.', 'warning');
            },
          },
        });
      } catch (err) {
        console.error('Error instanciando YT Player:', err);
      }
    } else {
      // El reproductor ya existe, cargar el nuevo videoId
      try {
        if (typeof ytPlayerRef.current.loadVideoById === 'function') {
          ytPlayerRef.current.loadVideoById(activeVideoId);
          if (isPlaying) {
            ytPlayerRef.current.playVideo();
          }
        }
      } catch (err) {
        console.error('Error cargando videoId:', err);
      }
    }
  }, [activeVideoId, isYTReady]);

  // Si el script de YT se cargó tarde pero había un video pendiente
  useEffect(() => {
    if (isYTReady && pendingVideoIdRef.current) {
      const vid = pendingVideoIdRef.current;
      pendingVideoIdRef.current = null;
      if (vid === activeVideoId && !ytPlayerRef.current) {
        // Triggered by previous useEffect
      }
    }
  }, [isYTReady, activeVideoId]);

  // 3. Sincronización del tiempo transcurrido
  useEffect(() => {
    if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);

    if (isPlaying && currentTrack?.isOnline) {
      timeIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
          try {
            const cur = ytPlayerRef.current.getCurrentTime();
            if (cur !== undefined && !isNaN(cur)) {
              setCurrentTime(Math.round(cur));
            }
          } catch (e) {}
        }
      }, 500);
    }

    return () => {
      if (timeIntervalRef.current) clearInterval(timeIntervalRef.current);
    };
  }, [isPlaying, currentTrack]);

  return (
    <>
      <div
        className={`transition-all duration-300 z-50 ${
          showVideoCanvas && currentTrack?.isOnline
            ? 'fixed bottom-28 right-6 w-80 sm:w-96 aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10'
            : 'fixed -bottom-[9999px] -right-[9999px] w-2 h-2 pointer-events-none opacity-0'
        }`}
      >
        {showVideoCanvas && currentTrack?.isOnline && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-full px-2 py-1">
            <span className="text-[10px] text-white font-medium pl-1">Video Canvas</span>
            <button
              onClick={() => setShowVideoCanvas(false)}
              className="p-1 text-neutral-400 hover:text-white rounded-full transition-colors"
              title="Cerrar video y mantener solo audio"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div id="nova-yt-frame" className="w-full h-full" />
      </div>
    </>
  );
}
