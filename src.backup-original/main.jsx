import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

const DATA_FILES = [
  'content',
  'characters',
  'events',
  'merchandise',
  'trailers',
  'videos',
  'audio',
  'galleries',
  'releases',
  'chatbot',
  'gameLinks',
];

// Preload all data files into window.__fvData BEFORE rendering
Promise.all(
  DATA_FILES.map((f) =>
    fetch(`/data/${f}.json?v=${Date.now()}`)
      .then((r) => r.json())
      .then((json) => [f, json])
      .catch(() => [f, null])
  )
).then(async (entries) => {
  window.__fvData = Object.fromEntries(entries);

  // ⭐ Background image preload — start AFTER render, non-blocking
  const preloadImages = async () => {
    try {
      const { getSeriesImage } = await import('./lib/imageService.js');
      const charData = window.__fvData?.characters;
      if (!charData?.characters) return;

      // Collect unique series per category
      const seriesByCat = {};
      charData.characters.forEach((c) => {
        if (!c.series || !c.category) return;
        if (!seriesByCat[c.category]) seriesByCat[c.category] = new Set();
        seriesByCat[c.category].add(c.series);
      });

      // Preload priority: kpop, comics, tv-shows, movies, anime, manga, gaming
      const priority = ['kpop', 'comics', 'tv-shows', 'movies', 'anime', 'manga', 'gaming'];
      const queue = [];
      priority.forEach((cat) => {
        if (seriesByCat[cat]) {
          Array.from(seriesByCat[cat]).forEach((s) => {
            queue.push({ series: s, category: cat });
          });
        }
      });

      // Load 4 at a time, in background
      const CONCURRENCY = 4;
      for (let i = 0; i < queue.length; i += CONCURRENCY) {
        const chunk = queue.slice(i, i + CONCURRENCY);
        await Promise.all(
          chunk.map(({ series, category }) =>
            getSeriesImage(series, category).catch(() => null)
          )
        );
      }
      console.log('✅ Background image preload complete');
    } catch (e) {
      console.warn('Preload error:', e);
    }
  };

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Start preload AFTER render so UI is interactive immediately
  setTimeout(preloadImages, 500);
});