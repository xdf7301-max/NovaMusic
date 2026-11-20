# 🎵 NOVA MUSIC

Una aplicación web de música moderna, elegante y profesional desarrollada desde cero con **React**, **Vite** y **Tailwind CSS**, inspirada en la experiencia de usuario y diseño visual de **Spotify**.

---

## ✨ Características Principales

- **Catálogo Completo y Discografía Ampliada:**
  - Al buscar un artista (ej. *Bad Bunny, Queen, Taylor Swift, Shakira, Michael Jackson, Coldplay, etc.*), el buscador ahora muestra **toda su discografía con más de 100 a 200 canciones** en lugar de solo unas pocas.
  - Botón **"Reproducir todo"** para escuchar toda la colección de canciones encontradas en orden.
- **Sistema de Respaldo Multi-Fuente (100% Sin Errores de Reproducción):**
  - Cada canción cuenta con hasta 10 fuentes alternativas de alta fidelidad.
  - Si un video específico tiene restricciones del autor (códigos 101/150), el reproductor **cambia de forma instantánea y automática a la versión alternativa**, garantizando que la música suene siempre sin fallos.
- **Canciones Completas y Reales de Principio a Fin:**
  - Las canciones buscadas ya **no son fragmentos cortos ni previews de 30 segundos**: ahora se reproducen **completas con su duración real al 100%** (3, 4, 5 o 6+ minutos según la canción).
  - Escucha la versión oficial y exacta de cualquier artista (ej. *Queen - Bohemian Rhapsody completa de 5:54, Bad Bunny, Coldplay, Michael Jackson, etc.*).
  - Barra de progreso totalmente interactiva: puedes adelantar, retroceder y saltar a cualquier minuto o segundo de la canción.
  - Botón opcional de **Video Canvas**: puedes alternar entre escuchar en modo solo audio o abrir el reproductor visual / video oficial.
- **Buscador Mundial de Música en Tiempo Real:**
  - Busca **cualquier canción, artista, banda o género musical del mundo** (por ejemplo: *Queen, Bad Bunny, Taylor Swift, Michael Jackson, Coldplay, Billie Eilish, Daft Punk, Rock, K-Pop, Salsa, etc.*).
  - Resultados instantáneos con portadas originales en alta definición, álbum, duración y audio real para escuchar de inmediato.
  - Al hacer clic en reproducir, la canción se reproduce normalmente en el reproductor inferior de NOVA MUSIC y puedes pasar a la siguiente o anterior de la lista de búsqueda.
  - Puedes guardar cualquier canción encontrada en tus favoritos ("Tus me gusta").
- **Importación de Música Local (Privada y Nativa):**
  - Botón **"Importar música"** en *Tu biblioteca*.
  - Admite archivos de audio **MP3, WAV, OGG y FLAC** directamente desde tu computadora.
  - Lee duración real, formato y tamaño de archivo con las APIs nativas del navegador (`URL.createObjectURL` y `HTML5 Audio`).
  - **100% privado:** tus archivos nunca se suben a ningún servidor externo.
  - Reproducción real con el reproductor inferior (play/pausa, barra de progreso, volumen, siguiente/anterior y favoritos).
  - Búsqueda integrada: el buscador encuentra tanto canciones del catálogo como tus archivos locales importados.
- **Diseño Oscuro & Acentos Verdes:** Paleta de colores inspirada en Spotify con fondo oscuro profundo (`#121212`), tarjetas hover con elevación suave y verde vibrante (`#1ed760`).
- **Reproductor Fijo Inferior Completo:**
  - Control de reproducción: Play, Pausa, Anterior, Siguiente.
  - Modos de reproducción: Aleatorio (Shuffle) y Repetición (ciclo normal, repetir todas, repetir una).
  - Barra de progreso interactiva con tiempo actual y duración total.
  - Control de volumen interactivo con botón para silenciar/desilenciar al instante.
  - Botón de favoritos (Me gusta) con animación en tiempo real.
- **Navegación Intuitiva:**
  - **Inicio:** Saludo personalizado según la hora del día, accesos rápidos, canciones más populares, álbumes destacados y playlists recomendadas.
  - **Buscar:** Exploración interactiva por géneros musicales con tarjetas inclinadas estilo Spotify y filtrado en tiempo real por título, artista o género.
  - **Tu biblioteca:** Gestión de playlists creadas, álbumes guardados y la lista especial de canciones favoritas.
  - **Vista Detalle:** Cabecera dinámica con gradiente temático, lista completa de temas, conteo de canciones y reproducción secuencial.
  - **Cola de reproducción:** Panel lateral deslizable para ver qué canción está sonando y cuáles siguen en lista.
- **Audio Real y Robusto:**
  - Integra pistas de demostración libres de derechos.
  - Incluye un motor sintetizador Web Audio API de respaldo que asegura que siempre escuches música relajante y armónica sin depender de conexiones lentas.
- **Adaptable (Responsive):**
  - Barra lateral completa y controles expandidos para computadoras.
  - Barra de navegación inferior optimizada para teléfonos móviles y tablets.

---

## 🚀 Cómo Iniciar la Aplicación

Abre una terminal en la carpeta del proyecto `NovaMusic`:

```bash
# 1. Instalar dependencias (solo la primera vez)
npm install

# 2. Iniciar el servidor local de desarrollo
npm run dev
```

Luego abre tu navegador en la dirección que te indique la terminal (por defecto: [http://localhost:5173](http://localhost:5173)).

---

## 📁 Estructura del Código

El proyecto está diseñado pensando en principiantes para que sea modular, limpio y fácil de ampliar:

```text
NovaMusic/
├── src/
│   ├── components/            # Componentes visuales reutilizables
│   │   ├── Header.jsx         # Barra superior con navegación y buscador
│   │   ├── Sidebar.jsx        # Menú lateral izquierdo (Inicio, Buscar, Biblioteca)
│   │   ├── Player.jsx         # Reproductor fijo inferior con controles
│   │   ├── MobileNav.jsx      # Menú inferior para celulares
│   │   ├── HomeView.jsx       # Vista principal (Canciones populares, álbumes, etc.)
│   │   ├── SearchView.jsx     # Buscador en tiempo real y géneros
│   │   ├── LibraryView.jsx    # Colección personal y creación de playlists
│   │   ├── DetailView.jsx     # Vista detallada de playlists o álbumes
│   │   └── QueueModal.jsx     # Panel con la lista de reproducción actual
│   ├── context/
│   │   └── MusicContext.jsx   # Estado global: canción actual, volumen, reproducción, likes
│   ├── data/
│   │   └── mockData.js        # Catálogo de canciones, artistas, playlists y álbumes
│   ├── utils/
│   │   └── audioSynth.js      # Motor sintetizador de respaldo con Web Audio API
│   ├── App.jsx                # Componente principal que une la interfaz
│   ├── index.css              # Estilos globales y configuración de Tailwind CSS
│   └── main.jsx               # Punto de entrada de React
├── index.html                 # HTML con fuentes Google Fonts (Inter y Plus Jakarta Sans)
├── package.json               # Dependencias y scripts
└── vite.config.js             # Configuración de Vite y Tailwind
```

---

## 🛠️ Cómo Personalizar o Agregar Tus Propias Canciones

Para agregar tus propias canciones, abre el archivo [`src/data/mockData.js`](file:///c:/Users/Fabricio/Downloads/NovaMusic/src/data/mockData.js) y añade un nuevo elemento al arreglo `MOCK_SONGS`:

```javascript
{
  id: 's-11',
  title: 'Nombre de tu canción',
  artist: 'Tu Nombre de Artista',
  album: 'Nombre del Álbum',
  duration: '3:30',
  durationSec: 210,
  cover: 'URL_DE_LA_IMAGEN_DE_PORTADA',
  audioUrl: 'URL_DEL_ARCHIVO_MP3_O_AUDIO',
  plays: '150,000',
  genre: 'Pop',
  releaseDate: '2026'
}
```

¡Listo para disfrutar y expandir NOVA MUSIC!
