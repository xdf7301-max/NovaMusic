import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  User, 
  Bell, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useMusic } from '../context/MusicContext';

export default function Header() {
  const { currentView, setCurrentView, searchQuery, setSearchQuery } = useMusic();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 transition-all">
      {/* Flechas de Navegación y Buscador */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentView('home')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            title="Volver al inicio"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 flex items-center justify-center text-white/80 hover:text-white transition-colors hidden sm:flex"
            title="Ir a buscar"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de búsqueda interactiva accesible desde cualquier vista */}
        <div className="relative w-48 sm:w-72 md:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onFocus={() => {
              if (currentView !== 'search') setCurrentView('search');
            }}
            onChange={(e) => {
              if (currentView !== 'search') setCurrentView('search');
              setSearchQuery(e.target.value);
            }}
            placeholder="¿Qué quieres escuchar hoy? (ej. Queen, Bad Bunny...)"
            className="w-full pl-10 pr-4 py-2 bg-[#242424] hover:bg-[#2a2a2a] focus:bg-[#2a2a2a] text-sm text-white placeholder-neutral-400 rounded-full border border-transparent focus:border-[#1ed760]/50 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Botones de Usuario y Acciones Rápidas */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('library')}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-white text-black hover:scale-105 transition-all shadow"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Explorar Premium</span>
        </button>

        <button 
          title="Novedades"
          className="w-9 h-9 rounded-full bg-black/60 hover:bg-neutral-800 flex items-center justify-center text-neutral-300 hover:text-white transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* Perfil de Usuario */}
        <div 
          className="flex items-center gap-2 p-1 pr-3 bg-black/70 hover:bg-neutral-800 rounded-full cursor-pointer transition-colors border border-white/5"
          title="Perfil de Usuario"
        >
          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-black font-bold text-xs shadow-inner">
            F
          </div>
          <span className="text-xs font-bold text-white hidden sm:inline">Fabricio</span>
        </div>
      </div>
    </header>
  );
}
