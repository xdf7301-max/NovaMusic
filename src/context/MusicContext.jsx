import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { MOCK_SONGS, MOCK_ALBUMS, MOCK_PLAYLISTS, MOCK_GENRES, MOCK_ARTISTS } from '../data/mockData';
import { synthFallback } from '../utils/audioSynth';
import { getFullSongSource } from '../utils/musicApi';

const MusicContext = createContext();

export const MusicProvider = ({ children }) => {
  // Estado de navegación
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'search' | 'library' | 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Canciones importadas por el usuario desde su computadora
  const [importedSongs, setImportedSongs] = useState([]);

  // Canciones buscadas en línea que el usuario reproduce o guarda
  const [savedOnlineSongs, setSavedOnlineSongs] = useState([]);

  // Notificación flotante / Toast para mensajes al usuario
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Catálogo unificado
  const allSongs = [...importedSongs, ...savedOnlineSongs, ...MOCK_SONGS];

  // Estado de reproducción
  const [currentTrack, setCurrentTrack] = useState(MOCK_SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState(allSongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Progreso y volumen
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(222);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'

  // Video Canvas oficial para canciones en línea (estilo Spotify Canvas)
  const [showVideoCanvas, setShowVideoCanvas] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const ytPlayerRef = useRef(null);

  // Biblioteca personal y likes
  const [likedSongIds, setLikedSongIds] = useState(['s-1', 's-3', 's-7']);
  const [userPlaylists, setUserPlaylists] = useState(MOCK_PLAYLISTS);

  // Referencia de audio nativo del navegador (para archivos locales y demos)
  const audioRef = useRef(new Audio());
  const synthActiveRef = useRef(false);
  const virtualTimerRef = useRef(null);
  const loadTokenRef = useRef(0);

  // Guardar canción en el catálogo global si es online
  const saveSongToCatalog = (track) => {
    if (!track || !track.isOnline) return;
    setSavedOnlineSongs((prev) => {
      if (prev.some((s) => s.id === track.id)) return prev;
      return [track, ...prev];
    });
  };

  // 1. Inicializar listeners del elemento Audio nativo (usado para archivos locales y demos)
  useEffect(() => {
    const audio = audioRef.current;
    audio.preload = 'auto';

    const handleTimeUpdate = () => {
      if (!currentTrack?.isOnline && !synthActiveRef.current) {
        setCurrentTime(audio.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (!currentTrack?.isOnline && audio.duration && !isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(Math.round(audio.duration));
      }
    };

    const handleCanPlay = () => {
      if (!currentTrack?.isOnline) {
        setIsLoadingAudio(false);
      }
    };

    const handleEnded = () => {
      if (!currentTrack?.isOnline) {
        handleNextTrack();
      }
    };

    const handleError = (e) => {
      if (currentTrack?.isOnline) return; // Las canciones online son gestionadas por YouTubeAudioEngine

      console.warn('Error en elemento de audio local/demo:', e);
      setIsLoadingAudio(false);

      if (currentTrack?.isLocal) {
        setIsPlaying(false);
        synthFallback.stop();
        showToast(
          `Tu navegador no puede reproducir "${currentTrack.fileName || currentTrack.title}". Formato no admitido.`,
          'error'
        );
        return;
      }

      // Canción demo integrada que falló: sintetizador de respaldo
      audio.pause();
      if (isPlaying) {
        synthActiveRef.current = true;
        synthFallback.setVolume(volume);
        synthFallback.start();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
      synthFallback.stop();
      if (virtualTimerRef.current) clearInterval(virtualTimerRef.current);
    };
  }, [currentTrack, isPlaying, volume]);

  // 2. Sincronizar canción actual (carga la pista según sea local o global en línea)
  useEffect(() => {
    if (!currentTrack) return;

    synthActiveRef.current = false;
    synthFallback.stop();
    setCurrentTime(0);

    if (currentTrack.durationSec) {
      setDuration(currentTrack.durationSec);
    }

    const currentToken = ++loadTokenRef.current;

    const setupTrack = async () => {
      const audio = audioRef.current;
      audio.volume = isMuted ? 0 : volume;

      if (currentTrack.isOnline) {
        // Detener audio nativo
        audio.pause();
        setIsLoadingAudio(true);

        let videoId = currentTrack.youtubeId;
        if (!videoId) {
          const source = await getFullSongSource(currentTrack.artist, currentTrack.title);
          if (currentToken !== loadTokenRef.current) return; // Canción cambiada mientras cargaba

          if (source && source.videoId) {
            videoId = source.videoId;
            currentTrack.youtubeId = videoId;
            currentTrack.ytMatches = source.matches || [videoId];
            currentTrack.matchIndex = 0;
          }
        }

        if (videoId) {
          setActiveVideoId(videoId);
          // Si el reproductor de YouTube ya está montado, cargar el video directamente
          if (ytPlayerRef.current && typeof ytPlayerRef.current.loadVideoById === 'function') {
            try {
              ytPlayerRef.current.loadVideoById(videoId);
              if (isPlaying) {
                ytPlayerRef.current.playVideo();
              }
            } catch (e) {}
          }
        } else {
          setIsLoadingAudio(false);
          setIsPlaying(false);
          showToast(`No se encontró fuente para "${currentTrack.title}".`, 'warning');
        }
      } else {
        // Archivo local del usuario o demo integrada
        if (ytPlayerRef.current && typeof ytPlayerRef.current.stopVideo === 'function') {
          try {
            ytPlayerRef.current.stopVideo();
          } catch (e) {}
        }
        setActiveVideoId(null);
        setIsLoadingAudio(false);

        audio.src = currentTrack.audioUrl;
        if (isPlaying) {
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            playPromise.catch((err) => {
              console.warn('Playback error / autoplay:', err);
              if (!currentTrack?.isLocal && !currentTrack?.isOnline) {
                synthActiveRef.current = true;
                synthFallback.setVolume(volume);
                synthFallback.start();
              }
            });
          }
        }
      }
    };

    setupTrack();
  }, [currentTrack]);

  // 3. Manejar Play / Pause sincronizado entre ambos motores
  useEffect(() => {
    if (currentTrack?.isOnline) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
        try {
          if (isPlaying) {
            ytPlayerRef.current.playVideo();
          } else {
            ytPlayerRef.current.pauseVideo();
          }
        } catch (e) {}
      }
      return;
    }

    // Para canciones locales o demos nativas
    const audio = audioRef.current;
    if (isPlaying) {
      if (synthActiveRef.current && !currentTrack?.isLocal && !currentTrack?.isOnline) {
        synthFallback.start();
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (!currentTrack?.isLocal && !currentTrack?.isOnline) {
              synthActiveRef.current = true;
              synthFallback.setVolume(volume);
              synthFallback.start();
            } else {
              setIsPlaying(false);
            }
          });
        }
      }

      if (virtualTimerRef.current) clearInterval(virtualTimerRef.current);
      if (synthActiveRef.current && !currentTrack?.isLocal && !currentTrack?.isOnline) {
        virtualTimerRef.current = setInterval(() => {
          setCurrentTime((prev) => {
            if (prev >= duration) {
              handleNextTrack();
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      audio.pause();
      synthFallback.stop();
      if (virtualTimerRef.current) clearInterval(virtualTimerRef.current);
    }
  }, [isPlaying]);

  // 4. Manejar Volumen y Mute sincronizado en ambos motores
  useEffect(() => {
    const currentVol = isMuted ? 0 : volume;
    audioRef.current.volume = currentVol;
    synthFallback.setVolume(currentVol);

    if (ytPlayerRef.current && typeof ytPlayerRef.current.setVolume === 'function') {
      try {
        ytPlayerRef.current.setVolume(currentVol * 100);
        if (isMuted) {
          ytPlayerRef.current.mute();
        } else {
          ytPlayerRef.current.unMute();
        }
      } catch (e) {}
    }
  }, [volume, isMuted]);

  // Controladores de reproducción
  const togglePlay = () => {
    if (currentTrack?.isOnline && ytPlayerRef.current && typeof ytPlayerRef.current.getPlayerState === 'function') {
      try {
        const state = ytPlayerRef.current.getPlayerState();
        if (state === 1) { // 1 = playing
          ytPlayerRef.current.pauseVideo();
          setIsPlaying(false);
          return;
        } else {
          ytPlayerRef.current.playVideo();
          setIsPlaying(true);
          return;
        }
      } catch (e) {}
    }
    setIsPlaying(!isPlaying);
  };

  const playTrack = (track, newQueue = null) => {
    if (!track) return;

    if (track.isOnline) {
      saveSongToCatalog(track);
    }

    if (newQueue && newQueue.length > 0) {
      setQueue(newQueue);
      const idx = newQueue.findIndex((s) => s.id === track.id);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
      const idx = queue.findIndex((s) => s.id === track.id);
      if (idx !== -1) {
        setCurrentIndex(idx);
      } else {
        setQueue([track, ...queue]);
        setCurrentIndex(0);
      }
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying(true);
      if (track.isOnline && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
      } else {
        audioRef.current.play().catch(() => {});
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one') {
      seekTo(0);
      if (currentTrack?.isOnline && ytPlayerRef.current && typeof ytPlayerRef.current.playVideo === 'function') {
        try { ytPlayerRef.current.playVideo(); } catch (e) {}
      } else {
        audioRef.current.play().catch(() => {});
      }
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * queue.length);
      setCurrentIndex(randomIndex);
      setCurrentTrack(queue[randomIndex]);
      return;
    }

    if (currentIndex < queue.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setCurrentTrack(queue[nextIdx]);
    } else if (repeatMode === 'all') {
      setCurrentIndex(0);
      setCurrentTrack(queue[0]);
    } else {
      setIsPlaying(false);
    }
  };

  const handlePrevTrack = () => {
    if (currentTime > 4) {
      seekTo(0);
      return;
    }

    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setCurrentTrack(queue[prevIdx]);
    } else {
      seekTo(0);
    }
  };

  const seekTo = (seconds) => {
    setCurrentTime(seconds);
    if (currentTrack?.isOnline && ytPlayerRef.current && typeof ytPlayerRef.current.seekTo === 'function') {
      try {
        ytPlayerRef.current.seekTo(seconds, true);
        return;
      } catch (e) {}
    }
    if (!synthActiveRef.current) {
      try {
        audioRef.current.currentTime = seconds;
      } catch (e) {}
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleShuffle = () => {
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('all');
    else if (repeatMode === 'all') setRepeatMode('one');
    else setRepeatMode('off');
  };

  const toggleLike = (songId) => {
    if (currentTrack?.id === songId && currentTrack?.isOnline) {
      saveSongToCatalog(currentTrack);
    }
    setLikedSongIds((prev) =>
      prev.includes(songId) ? prev.filter((id) => id !== songId) : [...prev, songId]
    );
  };

  // Función para importar archivos locales desde la computadora del usuario
  const importAudioFiles = async (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const supportedExts = ['mp3', 'wav', 'ogg', 'flac'];
    const newTracks = [];
    const unsupportedFiles = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const ext = file.name.split('.').pop().toLowerCase();

      if (!supportedExts.includes(ext)) {
        unsupportedFiles.push(file.name);
        continue;
      }

      const objectUrl = URL.createObjectURL(file);
      const titleWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;

      const durationPromise = new Promise((resolve) => {
        const tempAudio = new Audio();
        tempAudio.preload = 'metadata';
        tempAudio.src = objectUrl;

        const onLoaded = () => {
          const secs = tempAudio.duration && !isNaN(tempAudio.duration) && tempAudio.duration !== Infinity
            ? Math.round(tempAudio.duration)
            : 0;
          tempAudio.removeEventListener('loadedmetadata', onLoaded);
          tempAudio.removeEventListener('error', onError);
          resolve(secs);
        };

        const onError = () => {
          tempAudio.removeEventListener('loadedmetadata', onLoaded);
          tempAudio.removeEventListener('error', onError);
          resolve(0);
        };

        tempAudio.addEventListener('loadedmetadata', onLoaded);
        tempAudio.addEventListener('error', onError);
      });

      const durationSec = await durationPromise;

      const newSong = {
        id: `local-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        title: titleWithoutExt,
        artist: 'Archivo Local',
        album: 'Música Importada',
        duration: formatTime(durationSec) !== '0:00' ? formatTime(durationSec) : '--:--',
        durationSec: durationSec,
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
        audioUrl: objectUrl,
        fileName: file.name,
        format: ext.toUpperCase(),
        fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        isLocal: true,
        file: file,
        plays: 'Local',
        genre: 'Local',
        releaseDate: new Date().getFullYear().toString()
      };

      newTracks.push(newSong);
    }

    if (unsupportedFiles.length > 0) {
      showToast(
        `Se ignoraron ${unsupportedFiles.length} archivo(s) no admitidos: ${unsupportedFiles.slice(0, 2).join(', ')}. NOVA MUSIC admite MP3, WAV, OGG y FLAC.`,
        'warning'
      );
    }

    if (newTracks.length > 0) {
      const updatedImported = [...newTracks, ...importedSongs];
      setImportedSongs(updatedImported);

      setUserPlaylists((prev) => {
        const existingIndex = prev.findIndex((p) => p.id === 'pl-imported');
        const importedPlaylist = {
          id: 'pl-imported',
          title: 'Música Importada',
          subtitle: `${updatedImported.length} canciones desde tu computadora`,
          creator: 'Archivos Locales',
          cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
          color: 'from-emerald-950',
          followers: 'Tu equipo',
          songIds: updatedImported.map((s) => s.id)
        };

        if (existingIndex !== -1) {
          const copy = [...prev];
          copy[existingIndex] = importedPlaylist;
          return copy;
        } else {
          return [importedPlaylist, ...prev];
        }
      });

      showToast(`¡Se importaron con éxito ${newTracks.length} canción(es)!`, 'success');
    }
  };

  const openDetail = (item, type = 'playlist') => {
    const songs = (item.songIds || [])
      .map((id) => allSongs.find((s) => s.id === id))
      .filter(Boolean);

    setSelectedItem({ ...item, type, songs });
    setCurrentView('detail');
  };

  const createNewPlaylist = (title = 'Mi Playlist Nova') => {
    const newPl = {
      id: `pl-${Date.now()}`,
      title: `${title} #${userPlaylists.length + 1}`,
      subtitle: 'Creada por ti',
      creator: 'Tú',
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
      color: 'from-emerald-900',
      followers: '1 seguidor',
      songIds: ['s-1', 's-2', 's-5']
    };
    setUserPlaylists([newPl, ...userPlaylists]);
    openDetail(newPl, 'playlist');
  };

  const likedSongsList = allSongs.filter((s) => likedSongIds.includes(s.id));

  const openLikedSongs = () => {
    setSelectedItem({
      id: 'liked-songs',
      title: 'Tus me gusta',
      subtitle: `${likedSongsList.length} canciones que te encantan`,
      creator: 'Tú',
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
      color: 'from-emerald-950',
      type: 'playlist',
      followers: 'Colección privada',
      songs: likedSongsList
    });
    setCurrentView('detail');
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <MusicContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedItem,
        setSelectedItem,
        searchQuery,
        setSearchQuery,
        importedSongs,
        importAudioFiles,
        saveSongToCatalog,
        toast,
        showToast,
        allSongs,
        currentTrack,
        isPlaying,
        setIsPlaying,
        queue,
        currentIndex,
        currentTime,
        setCurrentTime,
        duration,
        setDuration,
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
        likedSongsList,
        userPlaylists,
        openDetail,
        openLikedSongs,
        createNewPlaylist,
        togglePlay,
        playTrack,
        handleNextTrack,
        handlePrevTrack,
        seekTo,
        formatTime,
        isLoadingAudio,
        setIsLoadingAudio,
        ytPlayerRef,
        activeVideoId,
        setActiveVideoId,
        showVideoCanvas,
        setShowVideoCanvas,
        MOCK_SONGS,
        MOCK_ALBUMS,
        MOCK_PLAYLISTS,
        MOCK_GENRES,
        MOCK_ARTISTS
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => useContext(MusicContext);
