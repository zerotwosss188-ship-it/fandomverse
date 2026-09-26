// src/lib/legalImages.js
// Smart image fetcher — tries multiple sources per category for best quality

const TMDB_KEY = import.meta.env.VITE_TMDB_API_KEY || '2a7eee4b0793b98ba80ec2fac95b4464';
const TMDB_IMG = 'https://image.tmdb.org/t/p';
const TMDB_SIZE = 'w1280';

const cache = new Map();
const inflight = new Map();

function cacheGet(key) { return cache.get(key) || null; }
function cacheSet(key, val) { if (val) cache.set(key, val); }

function withCache(key, fetchFn) {
  if (cacheGet(key)) return Promise.resolve(cacheGet(key));
  if (inflight.has(key)) return inflight.get(key);
  const promise = (async () => {
    const url = await fetchFn();
    cacheSet(key, url);
    inflight.delete(key);
    return url;
  })();
  inflight.set(key, promise);
  return promise;
}

// ============================================================
// TMDb — for movies, TV, AND anime/manga (via TV/animation category)
// ============================================================
async function tmdbSearch(query, type = 'movie') {
  try {
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return data.results?.[0] || null;
  } catch { return null; }
}

// NEW: fetch list of backdrops (used only by getLegalImages)
async function tmdbBackdrops(id, type) {
  try {
    const url = `https://api.themoviedb.org/3/${type}/${id}/images?api_key=${TMDB_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const seen = new Set();
    return (data.backdrops || [])
      .filter((b) => {
        if (!b.file_path || seen.has(b.file_path)) return false;
        seen.add(b.file_path);
        return true;
      })
      .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
      .map((b) => `${TMDB_IMG}/${TMDB_SIZE}${b.file_path}`);
  } catch { return []; }
}

export function getMovieBackdrop(title) {
  if (!title) return Promise.resolve(null);
  return withCache(`tmdb:m:${title}`, async () => {
    const r = await tmdbSearch(title, 'movie');
    return r?.backdrop_path ? `${TMDB_IMG}/${TMDB_SIZE}${r.backdrop_path}` : null;
  });
}

export function getTVBackdrop(title) {
  if (!title) return Promise.resolve(null);
  return withCache(`tmdb:tv:${title}`, async () => {
    const r = await tmdbSearch(title, 'tv');
    return r?.backdrop_path ? `${TMDB_IMG}/${TMDB_SIZE}${r.backdrop_path}` : null;
  });
}

// ============================================================
// Kitsu.io — anime/manga (fallback for TMDb)
// ============================================================
async function kitsuSearch(query, type) {
  try {
    const res = await fetch(
      `https://kitsu.io/api/edge/${type}?filter[text]=${encodeURIComponent(query)}&page[limit]=1`,
      { headers: { Accept: 'application/vnd.api+json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.data?.[0];
    if (!item) return null;
    return (
      item.attributes?.coverImage?.original ||
      item.attributes?.coverImage?.large ||
      item.attributes?.posterImage?.original ||
      null
    );
  } catch { return null; }
}

// NEW: multiple kitsu covers
async function kitsuBackdrops(query, type) {
  try {
    const res = await fetch(
      `https://kitsu.io/api/edge/${type}?filter[text]=${encodeURIComponent(query)}&page[limit]=5`,
      { headers: { Accept: 'application/vnd.api+json' } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || [])
      .map((d) =>
        d.attributes?.coverImage?.original ||
        d.attributes?.coverImage?.large ||
        d.attributes?.posterImage?.original
      )
      .filter(Boolean);
  } catch { return []; }
}

// ============================================================
// Wikipedia — fallback for all
// ============================================================
async function wikipediaImage(query, hint = '') {
  try {
    const q = hint ? `${query} ${hint}` : query;
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1` +
      `&prop=pageimages&piprop=original|thumbnail&pithumbsize=2400&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const first = Object.values(pages)[0];
    return first?.original?.source || first?.thumbnail?.source || null;
  } catch { return null; }
}

// NEW: multiple wikipedia images
async function wikipediaImages(query, hint = '', limit = 8) {
  try {
    const q = hint ? `${query} ${hint}` : query;
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=${limit}` +
      `&prop=pageimages&piprop=original|thumbnail&pithumbsize=1600&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const seen = new Set();
    const out = [];
    Object.values(pages).forEach((p) => {
      const u = p.original?.source || p.thumbnail?.source;
      if (u && !seen.has(u)) { seen.add(u); out.push(u); }
    });
    return out;
  } catch { return []; }
}

// ============================================================
// ANIME
// ============================================================
export function getAnimeImage(title) {
  if (!title) return Promise.resolve(null);
  return withCache(`anime:${title}`, async () => {
    const tmdbTV = await tmdbSearch(title, 'tv');
    if (tmdbTV?.backdrop_path) {
      return `${TMDB_IMG}/original${tmdbTV.backdrop_path}`;
    }
    const kitsu = await kitsuSearch(title, 'anime');
    if (kitsu) return kitsu;
    return await wikipediaImage(title, 'anime');
  });
}

// ============================================================
// MANGA
// ============================================================
export function getMangaImage(title) {
  if (!title) return Promise.resolve(null);
  return withCache(`manga:${title}`, async () => {
    const tmdbTV = await tmdbSearch(title, 'tv');
    if (tmdbTV?.backdrop_path) {
      return `${TMDB_IMG}/original${tmdbTV.backdrop_path}`;
    }
    const tmdbMovie = await tmdbSearch(title, 'movie');
    if (tmdbMovie?.backdrop_path) {
      return `${TMDB_IMG}/original${tmdbMovie.backdrop_path}`;
    }
    const kitsu = await kitsuSearch(title, 'manga');
    if (kitsu) return kitsu;
    return await wikipediaImage(title, 'manga');
  });
}

export function getGameImage(title) {
  if (!title) return Promise.resolve(null);
  return withCache(`game:${title}`, () => wikipediaImage(title, 'video game'));
}

export function getArtistImage(name) {
  if (!name) return Promise.resolve(null);
  const clean = name.split(/[:\-–—|]/)[0].trim().split(/\s+/).slice(0, 3).join(' ');
  return withCache(`kpop:${clean}`, () => wikipediaImage(clean, 'K-pop band'));
}

// ============================================================
// Master Router — UNCHANGED original behavior
// ============================================================
export async function getLegalImage(category, title, series) {
  const query = series || title;
  if (!query) return null;

  switch (category) {
    case 'movies':   return getMovieBackdrop(query);
    case 'tv-shows': return getTVBackdrop(query);
    case 'comics':   return (await getMovieBackdrop(query)) || (await getTVBackdrop(query));
    case 'anime':    return getAnimeImage(query);
    case 'manga':    return getMangaImage(query);
    case 'gaming':   return getGameImage(query);
    case 'kpop':     return getArtistImage(query);
    default:         return null;
  }
}

// ============================================================
// NEW: list-based fetcher — used ONLY when variant index is provided
// ============================================================
export async function getLegalImages(category, title, series, limit = 10) {
  const query = series || title;
  if (!query) return [];

  const cacheKey = `multi:${category}:${query}:${limit}`;
  if (cacheGet(cacheKey)) return cacheGet(cacheKey);
  if (inflight.has(cacheKey)) return inflight.get(cacheKey);

  const promise = (async () => {
    let urls = [];

    try {
      switch (category) {
        case 'movies': {
          const info = await tmdbSearch(query, 'movie');
          if (info) urls = await tmdbBackdrops(info.id, 'movie');
          break;
        }
        case 'tv-shows': {
          const info = await tmdbSearch(query, 'tv');
          if (info) urls = await tmdbBackdrops(info.id, 'tv');
          break;
        }
        case 'comics': {
          const m = await tmdbSearch(query, 'movie');
          if (m) urls = await tmdbBackdrops(m.id, 'movie');
          if (!urls.length) {
            const t = await tmdbSearch(query, 'tv');
            if (t) urls = await tmdbBackdrops(t.id, 'tv');
          }
          break;
        }
        case 'anime':
        case 'manga': {
          const t = await tmdbSearch(query, 'tv');
          if (t) urls = await tmdbBackdrops(t.id, 'tv');
          if (!urls.length) {
            urls = await kitsuBackdrops(query, category === 'anime' ? 'anime' : 'manga');
          }
          break;
        }
        case 'gaming':
          urls = await wikipediaImages(query, 'video game', limit);
          break;
        case 'kpop':
          urls = await wikipediaImages(query, 'band', limit);
          break;
      }

      if (!urls.length) {
        const hints = {
          gaming: 'video game',
          comics: 'comics',
          kpop: 'band',
          movies: 'film',
          'tv-shows': 'TV series',
        };
        urls = await wikipediaImages(query, hints[category] || '', limit);
      }
    } catch { /* swallow */ }

    const out = urls.slice(0, limit);
    cacheSet(cacheKey, out);
    inflight.delete(cacheKey);
    return out;
  })();

  inflight.set(cacheKey, promise);
  return promise;
}