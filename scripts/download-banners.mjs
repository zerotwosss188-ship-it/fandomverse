// scripts/download-banners.mjs
// Fetches clean anime/manga banner images from AniList
// Uses verified IDs first, then falls back to search with title verification
// Usage: node scripts/download-banners.mjs

import fs from 'fs/promises';
import path from 'path';

const BANNER_DIR = './public/images/banners';
const CONTENT_FILE = './public/data/content.json';
const CHARACTERS_FILE = './public/data/characters.json';

const DELAY = 900; // AniList rate limit: ~90/min → safe at 900ms

// ============================================================
// VERIFIED ANILIST IDs — 100% accurate, no wrong matches
// ============================================================
const MANUAL_IDS = {
  'Demon Slayer': 101922,
  'Jujutsu Kaisen': 113415,
  'One Piece': 21,
  'Naruto': 20,
  'Attack on Titan': 16498,
  'Bleach': 269,
  'Death Note': 1535,
  'Hunter x Hunter': 11061,
  'Chainsaw Man': 127230,
  'My Hero Academia': 21459,
  'Black Clover': 97940,
  'Fullmetal Alchemist': 5114,
  'Frieren': 154587,
  'Dan Da Dan': 175977,
  'Tokyo Ghoul': 22319,
  'Vinland Saga': 101991,
  "JoJo's Bizarre Adventure": 14719,
  'Solo Leveling': 151807,
  'Dragon Ball': 223,
  'The Apothecary Diaries': 161645,
};

// ============================================================
// GraphQL queries
// ============================================================
const QUERY_BY_ID = `
  query ($id: Int) {
    Media(id: $id) {
      id
      title { romaji english native }
      coverImage { extraLarge large }
      bannerImage
    }
  }
`;

const QUERY_BY_SEARCH = `
  query ($search: String) {
    Media(search: $search, type: ANIME, sort: [SEARCH_MATCH, POPULARITY_DESC]) {
      id
      title { romaji english native }
      synonyms
      coverImage { extraLarge large }
      bannerImage
    }
  }
`;

// ============================================================
// Helpers
// ============================================================
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function exists(f) {
  try {
    await fs.access(f);
    return true;
  } catch {
    return false;
  }
}

async function fetchGraphQL(query, variables, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (res.status === 429) {
        console.log(`     429 rate-limited, waiting ${5 + i * 3}s...`);
        await sleep((5 + i * 3) * 1000);
        continue;
      }
      if (!res.ok) return null;
      const json = await res.json();
      return json?.data?.Media || null;
    } catch (e) {
      if (i < retries) await sleep(2000);
    }
  }
  return null;
}

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FandomVerse/1.0' },
    });
    if (!res.ok) return false;
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// Verify that AniList result matches our search term
// ============================================================
function verifyMatch(media, searchTerm) {
  if (!media) return false;

  const clean = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const search = clean(searchTerm);

  const titles = [
    media.title?.romaji,
    media.title?.english,
    media.title?.native,
    ...(media.synonyms || []),
  ].filter(Boolean);

  return titles.some((t) => {
    const c = clean(t);
    // Match if either contains the other (min 6 chars to avoid false positives)
    if (c.length < 6 || search.length < 6) return c === search;
    return c.includes(search) || search.includes(c);
  });
}

// ============================================================
// Load series list from characters.json
// ============================================================
async function loadSeriesList() {
  const data = JSON.parse(await fs.readFile(CHARACTERS_FILE, 'utf-8'));
  const series = new Set();
  (data.characters || []).forEach((c) => {
    if (c.category === 'anime' || c.category === 'manga') {
      series.add(c.series);
    }
  });
  return Array.from(series);
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('📖 Reading characters.json...\n');
  const seriesList = await loadSeriesList();

  console.log(`Found ${seriesList.length} anime/manga series.\n`);
  console.log(`Series: ${seriesList.join(', ')}\n`);

  await fs.mkdir(BANNER_DIR, { recursive: true });

  console.log(`📸 Downloading banners...\n`);

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  for (const series of seriesList) {
    const slug = slugify(series);
    const dest = path.join(BANNER_DIR, `${slug}.jpg`);

    if (await exists(dest)) {
      const size = (await fs.stat(dest)).size;
      console.log(`  ✓ ${slug}.jpg exists (${Math.round(size / 1024)}KB)`);
      skipped++;
      continue;
    }

    console.log(`  🔍 ${series}`);

    // 1. Try manual ID first (guaranteed correct)
    let media = null;
    if (MANUAL_IDS[series]) {
      console.log(`     📌 Using manual ID ${MANUAL_IDS[series]}`);
      media = await fetchGraphQL(QUERY_BY_ID, { id: MANUAL_IDS[series] });
    }

    // 2. Fall back to search with verification
    if (!media) {
      console.log(`     🔎 Searching AniList...`);
      const searchResult = await fetchGraphQL(QUERY_BY_SEARCH, { search: series });

      if (searchResult && verifyMatch(searchResult, series)) {
        media = searchResult;
      } else if (searchResult) {
        console.log(`     ⚠ Wrong match: got "${searchResult.title?.romaji}" — SKIPPED`);
        fail++;
        await sleep(DELAY);
        continue;
      }
    }

    if (!media) {
      console.log(`     ✗ Not found`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    // Prefer banner (wide), fallback to cover
    const imgUrl =
      media.bannerImage ||
      media.coverImage?.extraLarge ||
      media.coverImage?.large;

    if (!imgUrl) {
      console.log(`     ✗ No image available`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    const success = await downloadImage(imgUrl, dest);
    if (success) {
      const size = (await fs.stat(dest)).size;
      const type = media.bannerImage ? 'banner' : 'cover';
      console.log(
        `     ↓ ${slug}.jpg (${type}, ${Math.round(size / 1024)}KB) — "${media.title?.romaji}"`
      );
      ok++;
    } else {
      console.log(`     ✗ Download failed`);
      fail++;
    }

    await sleep(DELAY);
  }

  console.log(`\n✨ Done!\n`);
  console.log(`   Downloaded: ${ok}`);
  console.log(`   Skipped:    ${skipped} (already existed)`);
  console.log(`   Failed:     ${fail}`);
  console.log(`\n   Images saved to: public/images/banners/`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});