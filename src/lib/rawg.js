// src/lib/rawg.js
// RAWG API for copyright-safe gaming images
// Free API — https://rawg.io/apidocs

const RAWG_API_KEY = 'YOUR_RAWG_API_KEY_HERE';
const RAWG_BASE = 'https://api.rawg.io/api';

export async function getGameImages(gameSlug) {
  const res = await fetch(
    `${RAWG_BASE}/games/${gameSlug}?key=${RAWG_API_KEY}`
  );
  return res.json();
}

export async function searchGame(title) {
  const res = await fetch(
    `${RAWG_BASE}/games?key=${RAWG_API_KEY}&search=${encodeURIComponent(title)}&page_size=1`
  );
  const data = await res.json();
  return data.results?.[0];
}