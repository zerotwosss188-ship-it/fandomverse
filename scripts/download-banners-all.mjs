// scripts/download-banners-all.mjs
// Downloads banners for ALL categories (except anime/manga — already done)
// Uses Wikipedia API (free, no key, no watermarks)
// Usage: node scripts/download-banners-all.mjs

import fs from 'fs/promises';
import path from 'path';

const BANNER_DIR = './public/images/banners';
const CONTENT_FILE = './public/data/content.json';
const CHARACTERS_FILE = './public/data/characters.json';

const DELAY = 500; // Wikipedia is fast, 500ms is safe

// Category-specific search hints (helps Wikipedia find the right page)
const CATEGORY_HINTS = {
  gaming: 'video game',
  movies: 'film',
  'tv-shows': 'TV series',
  kpop: 'band',
  comics: 'comics',
};

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

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'FandomVerse/1.0 (educational project)',
      },
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
// Wikipedia image fetch
// ============================================================
async function fetchWikipediaImage(query, retries = 2) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3` +
    `&prop=pageimages&pithumbsize=1200&piprop=thumbnail&redirects=1`;

  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'FandomVerse/1.0 (educational project)',
        },
      });
      if (!res.ok) return null;
      const json = await res.json();
      const pages = json?.query?.pages || {};
      const results = Object.values(pages);

      // Find the first result with a thumbnail
      for (const page of results) {
        if (page.thumbnail?.source) {
          return {
            url: page.thumbnail.source,
            title: page.title,
          };
        }
      }
      return null;
    } catch (e) {
      if (i < retries) await sleep(1000);
    }
  }
  return null;
}

// ============================================================
// Load series list from characters.json
// ============================================================
async function loadSeriesByCategory() {
  const data = JSON.parse(await fs.readFile(CHARACTERS_FILE, 'utf-8'));
  const byCategory = {};

  (data.characters || []).forEach((c) => {
    // Skip anime + manga (already done via AniList)
    if (c.category === 'anime' || c.category === 'manga') return;

    if (!byCategory[c.category]) byCategory[c.category] = new Set();
    byCategory[c.category].add(c.series);
  });

  // Convert sets to arrays
  const result = {};
  for (const [cat, set] of Object.entries(byCategory)) {
    result[cat] = Array.from(set);
  }
  return result;
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('📖 Reading characters.json...\n');
  const seriesByCategory = await loadSeriesByCategory();

  const total = Object.values(seriesByCategory).reduce((sum, arr) => sum + arr.length, 0);
  console.log(`Found ${total} series across ${Object.keys(seriesByCategory).length} categories.\n`);

  for (const [cat, series] of Object.entries(seriesByCategory)) {
    console.log(`   ${cat}: ${series.length} series`);
  }
  console.log('');

  await fs.mkdir(BANNER_DIR, { recursive: true });

  let ok = 0;
  let fail = 0;
  let skipped = 0;

  for (const [category, seriesList] of Object.entries(seriesByCategory)) {
    console.log(`\n📸 ${category.toUpperCase()} (${seriesList.length} series)\n`);

    const hint = CATEGORY_HINTS[category] || '';

    for (const series of seriesList) {
      const slug = slugify(series);
      const dest = path.join(BANNER_DIR, `${slug}.jpg`);

      if (await exists(dest)) {
        console.log(`  ✓ ${slug}.jpg exists`);
        skipped++;
        continue;
      }

      const query = hint ? `${series} ${hint}` : series;
      console.log(`  🔍 ${series} → "${query}"`);

      const result = await fetchWikipediaImage(query);
      if (!result) {
        console.log(`     ✗ Not found`);
        fail++;
        await sleep(DELAY);
        continue;
      }

      const success = await downloadImage(result.url, dest);
      if (success) {
        const size = (await fs.stat(dest)).size;
        console.log(`     ↓ ${slug}.jpg (${Math.round(size / 1024)}KB) — "${result.title}"`);
        ok++;
      } else {
        console.log(`     ✗ Download failed`);
        fail++;
      }

      await sleep(DELAY);
    }
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