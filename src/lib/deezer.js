// src/lib/deezer.js
// Deezer API for copyright-safe artist images
// No auth required for public data

export async function getArtistImage(artistName) {
  const res = await fetch(
    `https://api.deezer.com/search/artist?q=${encodeURIComponent(artistName)}&limit=1`
  );
  const data = await res.json();
  return data.data?.[0]?.picture_xl;
}