// src/lib/tmdb.js — TMDb API wrapper (separate file)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || '2a7eee4b0793b98ba80ec2fac95b4464';
const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_IMAGE = 'https://image.tmdb.org/t/p';

export async function searchMovie(title) {
  if (!title) return null;
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

export async function searchTV(title) {
  if (!title) return null;
  try {
    const res = await fetch(
      `${TMDB_BASE}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(title)}`
    );
    const data = await res.json();
    return data.results?.[0] || null;
  } catch {
    return null;
  }
}

export function getImageUrl(path, size = 'original') {
  if (!path) return null;
  return `${TMDB_IMAGE}/${size}${path}`;
}