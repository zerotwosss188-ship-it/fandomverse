// scripts/download-banners-hires.mjs
// High-resolution banner download for ALL categories
// Uses multiple sources with fallbacks for best quality
// Usage: node scripts/download-banners-hires.mjs

import fs from 'fs/promises';
import path from 'path';

const BANNER_DIR = './public/images/banners';
const CHARACTERS_FILE = './public/data/characters.json';

const DELAY = 700;

// Steam App IDs for high-quality landscape banners (1920x620)
const STEAM_IDS = {
  'God of War': 1593500,
  'God of War Ragnarok': 2322010,
  'The Legend of Zelda': null,
  'The Witcher': 292030,
  'Halo': 1240440,
  'Red Dead Redemption': 1174180,
  'GTA V': 271590,
  'GTA VI': null,
  'Minecraft': null,
  'Fortnite': null,
  'Call of Duty': 2933620,
  'The Last of Us': 1888930,
  'Assassin\'s Creed': 289650,
  'Assassin\'s Creed Shadows': 3159330,
  'Resident Evil': 2050650,
  'Resident Evil 4': 2050650,
  'Elden Ring': 1245620,
  'Elden Ring Nightreign': 2622380,
  'Dark Souls': 374320,
  'Dark Souls III': 374320,
  'The Witcher 3': 292030,
  'The Witcher 4': null,
  'Sekiro': 814380,
  'Hades': 1145360,
  'Hades II': 1145350,
  'Stardew Valley': 413150,
  'Hollow Knight': 367520,
  'Counter-Strike 2': 730,
  'Dota 2': 570,
  'Rainbow Six Siege': 359550,
  'EA Sports FC': 2669320,
  'Cyberpunk 2077': 1091500,
};

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
      headers: { 'User-Agent': 'Mozilla/5.0 FandomVerse/1.0' },
    });
    if (!res.ok) return { ok: false, size: 0 };
    const buf = Buffer.from(await res.arrayBuffer());
    // Reject tiny images (< 20KB) — likely placeholders
    if (buf.length < 20000) return { ok: false, size: buf.length };
    await fs.writeFile(dest, buf);
    return { ok: true, size: buf.length };
  } catch {
    return { ok: false, size: 0 };
  }
}

// Wikipedia with max thumbnail size + original fallback
async function fetchWikipediaHighRes(query) {
  // Try max thumbnail size first
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=5` +
    `&prop=pageimages&pithumbsize=2400&piprop=thumbnail|original&redirects=1`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 FandomVerse/1.0' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const pages = json?.query?.pages || {};

    for (const page of Object.values(pages)) {
      // Prefer original (full resolution) if available and reasonable size
      if (page.original?.source) {
        return { url: page.original.source, title: page.title };
      }
      if (page.thumbnail?.source) {
        return { url: page.thumbnail.source, title: page.title };
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function loadSeriesByCategory() {
  const data = JSON.parse(await fs.readFile(CHARACTERS_FILE, 'utf-8'));
  const byCategory = {};
  (data.characters || []).forEach((c) => {
    if (!byCategory[c.category]) byCategory[c.category] = new Set();
    byCategory[c.category].add(c.series);
  });
  const result = {};
  for (const [cat, set] of Object.entries(byCategory)) {
    result[cat] = Array.from(set);
  }
  return result;
}

const CATEGORY_HINTS = {
  gaming: 'video game',
  movies: 'film',
  'tv-shows': 'TV series',
  kpop: 'band',
  comics: 'comics',
};

async function main() {
  console.log('📖 Loading series list...\n');
  const seriesByCategory = await loadSeriesByCategory();

  await fs.mkdir(BANNER_DIR, { recursive: true });

  let ok = 0, fail = 0, skipped = 0;

  for (const [category, seriesList] of Object.entries(seriesByCategory)) {
    console.log(`\n📸 ${category.toUpperCase()} (${seriesList.length} series)\n`);

    for (const series of seriesList) {
      const slug = slugify(series);
      const dest = path.join(BANNER_DIR, `${slug}.jpg`);

      if (await exists(dest)) {
        const size = (await fs.stat(dest)).size;
        if (size > 100000) {
          console.log(`  ✓ ${slug}.jpg exists (${Math.round(size / 1024)}KB) — good`);
          skipped++;
          continue;
        } else {
          // Too small, re-download
          console.log(`  ↻ ${slug}.jpg exists but small (${Math.round(size / 1024)}KB) — re-downloading`);
        }
      }

      console.log(`  🔍 ${series}`);

      let downloaded = false;

      // 1. Try Steam CDN (best quality, 1920x620)
      if (category === 'gaming' && STEAM_IDS[series]) {
        const steamUrl = `https://cdn.cloudflare.steamstatic.com/steam/apps/${STEAM_IDS[series]}/library_hero.jpg`;
        const r = await downloadImage(steamUrl, dest);
        if (r.ok) {
          console.log(`     ↓ Steam CDN ${Math.round(r.size / 1024)}KB`);
          ok++;
          downloaded = true;
        }
      }

      // 2. Wikipedia (fallback for everything)
      if (!downloaded) {
        const hint = CATEGORY_HINTS[category] || '';
        const query = hint ? `${series} ${hint}` : series;
        const result = await fetchWikipediaHighRes(query);

        if (result) {
          const r = await downloadImage(result.url, dest);
          if (r.ok) {
            console.log(`     ↓ Wikipedia ${Math.round(r.size / 1024)}KB — "${result.title}"`);
            ok++;
            downloaded = true;
          }
        }
      }

      if (!downloaded) {
        console.log(`     ✗ Failed`);
        fail++;
      }

      await sleep(DELAY);
    }
  }

  console.log(`\n✨ Done!\n`);
  console.log(`   Downloaded: ${ok}`);
  console.log(`   Skipped:    ${skipped} (already existed, good size)`);
  console.log(`   Failed:     ${fail}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});