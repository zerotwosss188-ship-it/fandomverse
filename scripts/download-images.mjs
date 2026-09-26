// scripts/download-banners.mjs
// Fetches clean anime/manga banner images from AniList (no watermarks, free API)
// Usage: node scripts/download-banners.mjs

import fs from 'fs/promises';
import path from 'path';

const BANNER_DIR = './public/images/banners';
const CONTENT_FILE = './public/data/content.json';
const CHARACTERS_FILE = './public/data/characters.json';

const DELAY = 800; // AniList rate limit: ~90/min → safe at 800ms

const QUERY = `
  query ($search: String) {
    Media(search: $search, type: ANIME) {
      id
      title { romaji english native }
      coverImage { extraLarge large }
      bannerImage
    }
  }
`;

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

async function fetchAniList(search, retries = 3) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ query: QUERY, variables: { search } }),
      });

      if (res.status === 429) {
        console.log(`   429 rate-limited, waiting ${5 + i * 3}s...`);
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

// Build a set of known anime/manga series from characters.json
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

// Try to find which series an article belongs to
function matchSeries(article, seriesList) {
  // 1. Direct series field
  if (article.series) return article.series;

  // 2. Match against known series names in title
  const title = article.title.toLowerCase();
  for (const s of seriesList) {
    if (title.includes(s.toLowerCase())) return s;
  }

  // 3. Match against first tag
  if (article.tags?.[0]) {
    const tag = article.tags[0].toLowerCase();
    for (const s of seriesList) {
      if (slugify(s) === tag) return s;
    }
  }

  return null;
}

async function main() {
  console.log('📖 Reading content.json + characters.json...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const seriesList = await loadSeriesList();

  console.log(`Found ${seriesList.length} anime/manga series.\n`);
  console.log(`Series: ${seriesList.join(', ')}\n`);

  await fs.mkdir(BANNER_DIR, { recursive: true });

  // Build map: series -> articles
  const seriesToArticles = new Map();

  (content.content || []).forEach((article) => {
    if (article.category !== 'anime' && article.category !== 'manga') return;
    const series = matchSeries(article, seriesList);
    if (!series) {
      console.log(`  ⚠ Could not match series for: "${article.title}"`);
      return;
    }
    if (!seriesToArticles.has(series)) seriesToArticles.set(series, []);
    seriesToArticles.get(series).push(article);
  });

  console.log(`\n📸 Downloading banners for ${seriesToArticles.size} series...\n`);

  let ok = 0;
  let fail = 0;

  for (const [series, articles] of seriesToArticles.entries()) {
    const slug = slugify(series);
    const dest = path.join(BANNER_DIR, `${slug}.jpg`);

    if (await exists(dest)) {
      const size = (await fs.stat(dest)).size;
      console.log(`  ✓ ${slug}.jpg already exists (${Math.round(size / 1024)}KB) — ${articles.length} article(s)`);
      ok++;
      continue;
    }

    console.log(`  🔍 ${series} (${articles.length} article${articles.length > 1 ? 's' : ''})`);

    const media = await fetchAniList(series);
    if (!media) {
      console.log(`     ✗ Not found on AniList`);
      fail++;
      await sleep(DELAY);
      continue;
    }

    // Prefer banner (wide, hero-friendly), fallback to cover
    const imgUrl = media.bannerImage || media.coverImage?.extraLarge || media.coverImage?.large;
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
      console.log(`     ↓ ${slug}.jpg (${type}, ${Math.round(size / 1024)}KB)`);
      ok++;
    } else {
      console.log(`     ✗ Download failed`);
      fail++;
    }

    await sleep(DELAY);
  }

  console.log(`\n✨ Done!\n`);
  console.log(`   Success: ${ok}`);
  console.log(`   Failed:  ${fail}`);
  console.log(`\n   Images saved to: public/images/banners/`);
  console.log(`   Next: update content.json image paths to /images/banners/{slug}.jpg`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});