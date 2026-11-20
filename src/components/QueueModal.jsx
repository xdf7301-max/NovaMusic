import React from 'react';
import { X, Play, Music, ListMusic } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function QueueModal({ isOpen, onClose }) {
  const { currentTrack, queue, playTrack } = useMusic();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#181818] h-full p-6 flex flex-col shadow-2xl border-l border-neutral-800 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <ListMusic className="w-5 h-5 text-[#1ed760]" />
            <h2 className="text-lg font-bold text-white">Cola de reproducción</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto py-4 space-y-6">
          {/* Ahora Suena */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">
              Ahora suena
            </h3>
            {currentTrack && (
              <div className="flex items-center gap-3 p-3 bg-neutral-800/80 rounded-xl border border-[#1ed760]/30 shadow">
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#1ed760] truncate">
                    {currentTrack.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate">
                    {currentTrack.artist}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 font-mono">
                  {currentTrack.duration}
                </span>
              </div>
            )}
          </div>

          {/* Siguiente en la cola */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-3">
              A continuación ({queue.length} temas)
            </h3>
            <div className="space-y-1">
              {queue.map((song, i) => {
                const isCurrent = currentTrack?.id === song.id;
                return (
                  <div
                    key={`${song.id}-${i}`}
                    onClick={() => {
                      playTrack(song, queue);
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer group transition-colors ${
                      isCurrent
                        ? 'bg-neutral-800/50 text-[#1ed760]'
                        : 'hover:bg-neutral-800/60 text-white'
                    }`}
                  >
                    <span className="w-5 text-center text-xs text-neutral-500 font-mono">
                      {i + 1}
                    </span>
                    <img
                      src={song.cover}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-neutral-400 truncate">{song.artist}</p>
                    </div>
                    <span className="text-xs text-neutral-400 font-mono">
                      {song.duration}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
