import React, { useState } from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Player from './components/Player';
import MobileNav from './components/MobileNav';
import HomeView from './components/HomeView';
import SearchView from './components/SearchView';
import LibraryView from './components/LibraryView';
import DetailView from './components/DetailView';
import QueueModal from './components/QueueModal';

function MainLayout() {
  const { currentView, toast } = useMusic();
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen bg-black overflow-hidden font-sans relative">
      {/* Notificación Toast flotante */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md border text-sm font-semibold transition-all duration-300 ${
            toast.type === 'error'
              ? 'bg-red-950/90 border-red-500/40 text-red-200'
              : toast.type === 'warning'
              ? 'bg-amber-950/90 border-amber-500/40 text-amber-200'
              : 'bg-[#181818]/95 border-[#1ed760]/40 text-[#1ed760]'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}

      {/* Contenedor Superior (Sidebar + Contenido Principal) */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Barra Lateral fija estilo Spotify */}
        <Sidebar />

        {/* Área Central Principal (Scrollable con bordes redondeados) */}
        <main className="flex-1 flex flex-col bg-[#121212] rounded-xl overflow-hidden relative shadow-2xl">
          {/* Cabecera persistente */}
          <Header />

          {/* Vistas dinámicas */}
          <div className="flex-1 overflow-y-auto">
            {currentView === 'home' && <HomeView />}
            {currentView === 'search' && <SearchView />}
            {currentView === 'library' && <LibraryView />}
            {currentView === 'detail' && <DetailView />}
          </div>
        </main>
      </div>

      {/* Navegación móvil inferior (aparece en pantallas pequeñas) */}
      <MobileNav />

      {/* Reproductor fijo en la parte inferior */}
      <Player onToggleQueue={() => setIsQueueOpen(!isQueueOpen)} />

      {/* Panel lateral de la cola de reproducción */}
      <QueueModal isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <MusicProvider>
      <MainLayout />
    </MusicProvider>
  );
}
