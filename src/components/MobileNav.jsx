import React from 'react';
import { Home, Search, Library } from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function MobileNav() {
  const { currentView, setCurrentView } = useMusic();

  return (
    <nav className="md:hidden fixed bottom-20 left-0 right-0 h-14 bg-[#121212]/95 backdrop-blur-md border-t border-neutral-800 flex items-center justify-around z-30 px-4">
      <button
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentView === 'home' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Inicio</span>
      </button>

      <button
        onClick={() => setCurrentView('search')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentView === 'search' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Buscar</span>
      </button>

      <button
        onClick={() => setCurrentView('library')}
        className={`flex flex-col items-center gap-1 transition-colors ${
          currentView === 'library' ? 'text-[#1ed760]' : 'text-neutral-400 hover:text-white'
        }`}
      >
        <Library className="w-5 h-5" />
        <span className="text-[10px] font-semibold">Tu biblioteca</span>
      </button>
    </nav>
  );
}
