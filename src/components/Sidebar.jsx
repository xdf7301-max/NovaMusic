import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Library, 
  Plus, 
  Heart, 
  Music2, 
  Disc3, 
  Radio, 
  ChevronRight,
  ListMusic,
  HardDrive
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Sidebar() {
  const { 
    currentView, 
    setCurrentView, 
    userPlaylists, 
    MOCK_ALBUMS, 
    openDetail, 
    openLikedSongs, 
    likedSongsList,
    createNewPlaylist 
  } = useMusic();

  const [libraryTab, setLibraryTab] = useState('all'); // 'all' | 'playlists' | 'albums'

  return (
    <aside className="w-64 md:w-72 flex-shrink-0 flex flex-col gap-2 p-2 select-none hidden md:flex h-full">
      {/* Caja Superior: Logo y Navegación Principal */}
      <div className="bg-[#121212] rounded-xl p-4 flex flex-col gap-3">
        {/* Marca NOVA MUSIC */}
        <div 
          onClick={() => setCurrentView('home')} 
          className="flex items-center gap-2.5 px-2 py-1 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1ed760] flex items-center justify-center text-black shadow-lg shadow-[#1ed760]/20 group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black tracking-wider text-white">NOVA</span>
            <span className="text-xl font-extrabold tracking-wider text-[#1ed760] ml-1">MUSIC</span>
          </div>
        </div>

        {/* Botones Inicio y Buscar */}
        <nav className="flex flex-col gap-1 mt-2">
          <button
            onClick={() => setCurrentView('home')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentView === 'home'
                ? 'bg-neutral-800/80 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Home className={`w-5 h-5 ${currentView === 'home' ? 'text-[#1ed760]' : ''}`} />
            <span>Inicio</span>
          </button>

          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center gap-4 px-3 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              currentView === 'search'
                ? 'bg-neutral-800/80 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900/50'
            }`}
          >
            <Search className={`w-5 h-5 ${currentView === 'search' ? 'text-[#1ed760]' : ''}`} />
            <span>Buscar</span>
          </button>
        </nav>
      </div>

      {/* Caja Inferior: Tu Biblioteca */}
      <div className="bg-[#121212] rounded-xl p-3 flex-1 flex flex-col min-h-0">
        {/* Cabecera Biblioteca */}
        <div className="flex items-center justify-between px-2 py-2 mb-1">
          <button 
            onClick={() => setCurrentView('library')}
            className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors group"
          >
            <Library className="w-6 h-6 group-hover:text-white transition-colors" />
            <span className="font-bold text-sm tracking-wide">Tu biblioteca</span>
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => createNewPlaylist()}
              title="Crear playlist"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filtros de Chips */}
        <div className="flex items-center gap-2 px-1 py-2 overflow-x-auto text-xs font-medium scrollbar-none">
          <button
            onClick={() => setLibraryTab('all')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              libraryTab === 'all'
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
            }`}
          >
            Todo
          </button>
          <button
            onClick={() => setLibraryTab('playlists')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              libraryTab === 'playlists'
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
            }`}
          >
            Playlists
          </button>
          <button
            onClick={() => setLibraryTab('albums')}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${
              libraryTab === 'albums'
                ? 'bg-white text-black font-semibold'
                : 'bg-neutral-800/80 text-white hover:bg-neutral-700'
            }`}
          >
            Álbumes
          </button>
        </div>

        {/* Lista de Playlists y Colecciones */}
        <div className="flex-1 overflow-y-auto mt-2 pr-1 space-y-1">
          {/* Card Especial: Tus Me Gusta */}
          {(libraryTab === 'all' || libraryTab === 'playlists') && (
            <div
              onClick={openLikedSongs}
              className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800/60 transition-colors group"
            >
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 flex items-center justify-center flex-shrink-0 shadow-md">
                <Heart className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate group-hover:text-[#1ed760] transition-colors">
                  Tus me gusta
                </p>
                <p className="text-xs text-neutral-400 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#1ed760]">★</span> Playlist • {likedSongsList.length} canciones
                </p>
              </div>
            </div>
          )}

          {/* Listado de Playlists */}
          {(libraryTab === 'all' || libraryTab === 'playlists') &&
            userPlaylists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => openDetail(playlist, 'playlist')}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800/60 transition-colors group"
              >
                {playlist.id === 'pl-imported' ? (
                  <div className="w-12 h-12 rounded-md bg-gradient-to-br from-emerald-800 to-teal-950 flex items-center justify-center flex-shrink-0 text-[#1ed760] shadow-md">
                    <HardDrive className="w-6 h-6" />
                  </div>
                ) : (
                  <img
                    src={playlist.cover}
                    alt={playlist.title}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#1ed760] transition-colors">
                    {playlist.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    Playlist • {playlist.creator}
                  </p>
                </div>
              </div>
            ))}

          {/* Listado de Álbumes */}
          {(libraryTab === 'all' || libraryTab === 'albums') &&
            MOCK_ALBUMS.map((album) => (
              <div
                key={album.id}
                onClick={() => openDetail(album, 'album')}
                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-800/60 transition-colors group"
              >
                <img
                  src={album.cover}
                  alt={album.title}
                  className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate group-hover:text-[#1ed760] transition-colors">
                    {album.title}
                  </p>
                  <p className="text-xs text-neutral-400 truncate mt-0.5">
                    Álbum • {album.artist}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </aside>
  );
}
