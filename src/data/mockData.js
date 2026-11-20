// Datos de demostración de NOVA MUSIC (Libres de derechos de autor y con licencias abiertas)
// Estos datos simulan un catálogo musical completo con canciones, álbumes, playlists y géneros.

export const MOCK_SONGS = [
  {
    id: 's-1',
    title: 'Midnight Echoes',
    artist: 'Luna Solaris',
    album: 'Neon Horizon',
    duration: '3:42',
    durationSec: 222,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    plays: '1,420,890',
    genre: 'Synthwave',
    releaseDate: '2026'
  },
  {
    id: 's-2',
    title: 'Emerald Drift',
    artist: 'Aetheric',
    album: 'Quantum Pulse',
    duration: '4:15',
    durationSec: 255,
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    plays: '985,210',
    genre: 'Electronic',
    releaseDate: '2025'
  },
  {
    id: 's-3',
    title: 'Acoustic Memories',
    artist: 'Mateo Silva',
    album: 'Raíces y Madera',
    duration: '3:18',
    durationSec: 198,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    plays: '2,150,400',
    genre: 'Acústico',
    releaseDate: '2026'
  },
  {
    id: 's-4',
    title: 'Cyberpunk Odyssey',
    artist: 'Vektor 9',
    album: 'Neon Horizon',
    duration: '3:50',
    durationSec: 230,
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    plays: '3,890,120',
    genre: 'Cyberpunk',
    releaseDate: '2025'
  },
  {
    id: 's-5',
    title: 'Golden Sunset Chill',
    artist: 'Lofi Nomad',
    album: 'Coffee & Dreams',
    duration: '2:45',
    durationSec: 165,
    cover: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    plays: '4,520,300',
    genre: 'Lofi',
    releaseDate: '2026'
  },
  {
    id: 's-6',
    title: 'Starlight Serenade',
    artist: 'Elena R.',
    album: 'Constelaciones',
    duration: '3:34',
    durationSec: 214,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    plays: '1,890,750',
    genre: 'Pop / Indie',
    releaseDate: '2026'
  },
  {
    id: 's-7',
    title: 'Urban Rhythm',
    artist: 'Kairo & The Crew',
    album: 'Calles de Fuego',
    duration: '3:10',
    durationSec: 190,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    plays: '5,310,000',
    genre: 'Urbano',
    releaseDate: '2026'
  },
  {
    id: 's-8',
    title: 'Deep Meditation',
    artist: 'Zenith Bloom',
    album: 'Serenidad Sonora',
    duration: '4:40',
    durationSec: 280,
    cover: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    plays: '740,200',
    genre: 'Ambient',
    releaseDate: '2025'
  },
  {
    id: 's-9',
    title: 'Velvet Groove',
    artist: 'The Funk Collective',
    album: 'Retro Future',
    duration: '3:25',
    durationSec: 205,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    plays: '2,640,000',
    genre: 'Funk / Soul',
    releaseDate: '2026'
  },
  {
    id: 's-10',
    title: 'Aurora Borealis',
    artist: 'Nordic Echoes',
    album: 'Cielos Nórdicos',
    duration: '4:02',
    durationSec: 242,
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    plays: '1,120,400',
    genre: 'Chillstep',
    releaseDate: '2026'
  }
];

export const MOCK_ALBUMS = [
  {
    id: 'alb-1',
    title: 'Neon Horizon',
    artist: 'Luna Solaris',
    year: '2026',
    songCount: 10,
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    description: 'Sonidos retro-futuristas con sintetizadores analógicos y atmósferas envolventes.',
    color: 'from-fuchsia-900',
    songIds: ['s-1', 's-4', 's-2']
  },
  {
    id: 'alb-2',
    title: 'Coffee & Dreams',
    artist: 'Lofi Nomad',
    year: '2026',
    songCount: 8,
    cover: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=500&auto=format&fit=crop&q=80',
    description: 'La banda sonora perfecta para estudiar, concentrarte y relajarte con una taza de café.',
    color: 'from-amber-900',
    songIds: ['s-5', 's-3', 's-8']
  },
  {
    id: 'alb-3',
    title: 'Quantum Pulse',
    artist: 'Aetheric',
    year: '2025',
    songCount: 12,
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80',
    description: 'Música electrónica vanguardista impulsada por frecuencias puras y ritmos hipnóticos.',
    color: 'from-emerald-900',
    songIds: ['s-2', 's-10', 's-4']
  },
  {
    id: 'alb-4',
    title: 'Calles de Fuego',
    artist: 'Kairo & The Crew',
    year: '2026',
    songCount: 9,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80',
    description: 'Ritmos urbanos cargados de energía, bajos profundos y estilo callejero.',
    color: 'from-red-900',
    songIds: ['s-7', 's-9', 's-1']
  },
  {
    id: 'alb-5',
    title: 'Retro Future',
    artist: 'The Funk Collective',
    year: '2026',
    songCount: 11,
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&auto=format&fit=crop&q=80',
    description: 'Líneas de bajo contagiosas y guitarras funk que te harán bailar sin parar.',
    color: 'from-orange-900',
    songIds: ['s-9', 's-7', 's-2']
  }
];

export const MOCK_PLAYLISTS = [
  {
    id: 'pl-1',
    title: 'Éxitos Nova 2026',
    subtitle: 'Lo más escuchado en NOVA MUSIC esta semana.',
    creator: 'Nova Music',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&auto=format&fit=crop&q=80',
    color: 'from-emerald-800',
    followers: '3,842,109',
    songIds: ['s-1', 's-7', 's-4', 's-9', 's-6', 's-2']
  },
  {
    id: 'pl-2',
    title: 'Enfoque & Lofi Chill',
    subtitle: 'Beats tranquilos para trabajar o programar sin distracciones.',
    creator: 'Nova Curators',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
    color: 'from-blue-900',
    followers: '1,920,400',
    songIds: ['s-5', 's-8', 's-3', 's-10']
  },
  {
    id: 'pl-3',
    title: 'Entrenamiento & Potencia',
    subtitle: 'La motivación extra que necesitas para superar tus metas.',
    creator: 'Nova Fitness',
    cover: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&auto=format&fit=crop&q=80',
    color: 'from-purple-900',
    followers: '2,410,300',
    songIds: ['s-4', 's-7', 's-2', 's-9']
  },
  {
    id: 'pl-4',
    title: 'Acústico al Atardecer',
    subtitle: 'Guitarras de madera, voces cálidas y tranquilidad absoluta.',
    creator: 'Mateo Silva',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&auto=format&fit=crop&q=80',
    color: 'from-amber-800',
    followers: '850,220',
    songIds: ['s-3', 's-5', 's-6', 's-8']
  },
  {
    id: 'pl-5',
    title: 'Cyber Club Night',
    subtitle: 'El mejor techno y synthwave de la escena nocturna digital.',
    creator: 'Vektor 9',
    cover: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80',
    color: 'from-indigo-900',
    followers: '1,120,500',
    songIds: ['s-1', 's-2', 's-4', 's-10']
  }
];

export const MOCK_GENRES = [
  { id: 'g-1', name: 'Pop', color: 'bg-pink-600', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-2', name: 'Electrónica', color: 'bg-emerald-600', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-3', name: 'Urbano & Trap', color: 'bg-orange-600', image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-4', name: 'Rock & Indie', color: 'bg-red-700', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-5', name: 'Lofi & Chill', color: 'bg-purple-700', image: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-6', name: 'Synthwave', color: 'bg-cyan-700', image: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-7', name: 'Acústico', color: 'bg-amber-700', image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&auto=format&fit=crop&q=80' },
  { id: 'g-8', name: 'Funk & Soul', color: 'bg-yellow-600', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&auto=format&fit=crop&q=80' }
];

export const MOCK_ARTISTS = [
  {
    id: 'art-1',
    name: 'Luna Solaris',
    listeners: '3,450,210 oyentes mensuales',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    verified: true
  },
  {
    id: 'art-2',
    name: 'Vektor 9',
    listeners: '4,102,890 oyentes mensuales',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    verified: true
  },
  {
    id: 'art-3',
    name: 'Mateo Silva',
    listeners: '2,890,140 oyentes mensuales',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    verified: true
  },
  {
    id: 'art-4',
    name: 'Elena R.',
    listeners: '1,780,500 oyentes mensuales',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80',
    verified: true
  }
];
