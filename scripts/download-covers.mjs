// scripts/download-covers.mjs
// Downloads portrait COVER images for article cards
// Stores in public/images/covers/{slug}.jpg
// Uses AniList for anime/manga, TMDB CDN for others
// Usage: node scripts/download-covers.mjs

import fs from 'fs/promises';
import path from 'path';

const COVERS_DIR = './public/images/covers';
const CONTENT_FILE = './public/data/content.json';
const DELAY = 800;

// AniList cover IDs (same as banners)
const ANILIST_IDS = {
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

const QUERY = `
  query ($id: Int) {
    Media(id: $id) {
      coverImage { extraLarge large }
      title { romaji english }
    }
  }
`;

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchAniListCover(id) {
  try {
    const res = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { id } }),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.Media?.coverImage?.extraLarge
      || json?.data?.Media?.coverImage?.large;
  } catch {
    return null;
  }
}

async function downloadImage(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, size: 0 };
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 15000) return { ok: false, size: buf.length };
    await fs.writeFile(dest, buf);
    return { ok: true, size: buf.length };
  } catch {
    return { ok: false, size: 0 };
  }
}

// For non-anime/manga: just reuse the banner image
function matchSeriesToBanner(article) {
  const candidates = [
    article.series,
    article.title?.split(/[\s:]+/).slice(0, 3).join(' '),
    article.title?.split(/[\s:]+/).slice(0, 2).join(' '),
    article.tags?.[0],
  ].filter(Boolean);

  for (const c of candidates) {
    const slug = slugify(c);
    // This will be checked against available banners
    candidates.push(slug);
  }
  return candidates;
}

async function main() {
  await fs.mkdir(COVERS_DIR, { recursive: true });

  // List existing banners
  const bannerFiles = await fs.readdir('./public/images/banners').catch(() => []);
  const availableBanners = new Set(
    bannerFiles.filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', ''))
  );

  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  let ok = 0, fail = 0, reused = 0;

  for (const article of content.content) {
    const series = article.series;
    if (!series) continue;

    const slug = slugify(series);
    const dest = path.join(COVERS_DIR, `${slug}.jpg`);

    // Skip if cover already exists
    try {
      await fs.access(dest);
      continue;
    } catch {}

    // Anime/Manga: AniList cover
    if (article.category === 'anime' || article.category === 'manga') {
      const anilistId = ANILIST_IDS[series];
      if (!anilistId) continue;

      console.log(`  🔍 ${series} (AniList cover)`);
      const imgUrl = await fetchAniListCover(anilistId);
      if (!imgUrl) {
        console.log(`     ✗ Not found`);
        fail++;
        await sleep(DELAY);
        continue;
      }

      const r = await downloadImage(imgUrl, dest);
      if (r.ok) {
        console.log(`     ↓ ${slug}.jpg (${Math.round(r.size / 1024)}KB)`);
        ok++;
      } else {
        console.log(`     ✗ Failed`);
        fail++;
      }
      await sleep(DELAY);
      continue;
    }

    // Non-anime/manga: reuse banner if exists
    if (availableBanners.has(slug)) {
      const bannerPath = `./public/images/banners/${slug}.jpg`;
      await fs.copyFile(bannerPath, dest);
      console.log(`  ↻ ${slug}.jpg (reused from banner)`);
      reused++;
      continue;
    }
  }

  console.log(`\n✨ Done!\n`);
  console.log(`   Downloaded: ${ok}`);
  console.log(`   Reused:     ${reused}`);
  console.log(`   Failed:     ${fail}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});