// src/lib/imageService.js
// Copyright-safe image fetcher — NO Jikan
// Uses Kitsu.io for anime/manga, Wikipedia for everything else

const CACHE_KEY = 'fv_image_cache_v7';
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7;

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const now = Date.now();
    const clean = {};
    for (const [k, v] of Object.entries(parsed)) {
      if (v && now - v.t < CACHE_TTL) clean[k] = v;
    }
    return clean;
  } catch { return {}; }
}

function saveCache(c) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)); } catch {}
}

const cache = loadCache();
const inflight = new Map();

function cacheGet(key) { return cache[key]?.url ?? null; }
function cacheSet(key, url) {
  if (!url) return;
  cache[key] = { url, t: Date.now() };
  saveCache(cache);
}

// ---------- Kitsu.io (anime + manga — has CORS!) ----------
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
      item.attributes?.posterImage?.original ||
      item.attributes?.posterImage?.large ||
      item.attributes?.coverImage?.original ||
      null
    );
  } catch { return null; }
}

async function kitsuCharacter(name, series) {
  try {
    const query = series ? `${name} ${series}` : name;
    const res = await fetch(
      `https://kitsu.io/api/edge/characters?filter[name]=${encodeURIComponent(name)}&page[limit]=1`,
      { headers: { Accept: 'application/vnd.api+json' } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const item = data.data?.[0];
    return item?.attributes?.image?.original || null;
  } catch { return null; }
}

// ---------- Wikipedia ----------
async function wikiImage(query, hint = '') {
  try {
    const q = hint ? `${query} ${hint}` : query;
    const url =
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
      `&generator=search&gsrsearch=${encodeURIComponent(q)}&gsrlimit=1` +
      `&prop=pageimages&pithumbsize=1200&piprop=thumbnail&redirects=1`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data?.query?.pages || {};
    const first = Object.values(pages)[0];
    return first?.thumbnail?.source || null;
  } catch { return null; }
}

// ---------- Public API ----------
export async function getCharacterImage(name, series, category) {
  if (!name) return null;
  const key = `char:${name}:${series}`;
  if (cacheGet(key)) return cacheGet(key);
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    let url = null;

    if (category === 'anime' || category === 'manga') {
      url = await kitsuCharacter(name, series);
    }

    if (!url) {
      url = await wikiImage(`${name} ${series || ''}`.trim());
    }

    cacheSet(key, url);
    inflight.delete(key);
    return url;
  })();

  inflight.set(key, promise);
  return promise;
}

export async function getSeriesImage(name, category) {
  if (!name) return null;
  const key = `series:${name}:${category}`;
  if (cacheGet(key)) return cacheGet(key);
  if (inflight.has(key)) return inflight.get(key);

  const promise = (async () => {
    let url = null;

    if (category === 'anime') {
      url = await kitsuSearch(name, 'anime');
    } else if (category === 'manga') {
      url = await kitsuSearch(name, 'manga');
    }

    if (!url) {
      const hints = {
        gaming: 'video game',
        comics: 'comics',
        kpop: 'band',
        movies: 'film',
        'tv-shows': 'TV series',
      };
      const hint = hints[category] || '';
      url = await wikiImage(name, hint);
    }

    cacheSet(key, url);
    inflight.delete(key);
    return url;
  })();

  inflight.set(key, promise);
  return promise;
}

export async function getSeriesInfo() {
  return { description: null, year: null, genres: [], score: null };
}

if (typeof window !== 'undefined') {
  window.clearImageCache = () => {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('fv_image_cache_'))
      .forEach((k) => localStorage.removeItem(k));
    console.log('Cache cleared.');
  };
}