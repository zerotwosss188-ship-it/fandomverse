// scripts/download-banners-final.mjs
// Downloads banners using EXACT Wikipedia page titles
// No search ambiguity — 100% accurate
// Usage: node scripts/download-banners-final.mjs

import fs from 'fs/promises';
import path from 'path';

const BANNER_DIR = './public/images/banners';
const DELAY = 600;

// Exact Wikipedia page titles (no search, direct fetch)
const WIKI_TITLES = {
  // ---------- MOVIES ----------
  'Dune': 'Dune (2021 film)',
  'The Matrix': 'The Matrix',
  'Iron Man': 'Iron Man (2008 film)',
  'Alien': 'Alien (film)',
  'Pirates of the Caribbean': 'Pirates of the Caribbean: The Curse of the Black Pearl',
  'Avengers': 'The Avengers (2012 film)',
  'The Batman': 'The Batman (film)',
  'Spider-Man': 'Spider-Man: No Way Home',
  'Superman': 'Superman (2025 film)',
  'Harry Potter': "Harry Potter and the Philosopher's Stone (film)",
  'The Lord of the Rings': 'The Lord of the Rings: The Fellowship of the Ring',
  'Star Wars': 'Star Wars (film)',
  'Jurassic Park': 'Jurassic Park (film)',
  'Interstellar': 'Interstellar (film)',
  'Joker': 'Joker (2019 film)',
  'Avatar': 'Avatar (2009 film)',
  'Fast & Furious': 'The Fast and the Furious',
  'How to Train Your Dragon': 'How to Train Your Dragon (2010 film)',
  'Transformers': 'Transformers (film)',
  'The Hunger Games': 'The Hunger Games (film)',
  'The Conjuring': 'The Conjuring',
  'Mission: Impossible': 'Mission: Impossible (film)',
  'Frozen': 'Frozen (2013 film)',
  'Inception': 'Inception',
'The Dark Knight': 'The Dark Knight',

  // ---------- TV SHOWS ----------
  'Breaking Bad': 'Breaking Bad',
  'Wednesday': 'Wednesday (TV series)',
  'House of the Dragon': 'House of the Dragon',
  'Peaky Blinders': 'Peaky Blinders',
  'Money Heist': 'Money Heist',
  'Squid Game': 'Squid Game',
  'Dark': 'Dark (TV series)',
  'The Umbrella Academy': 'The Umbrella Academy',
  'Cobra Kai': 'Cobra Kai',
  'The Mandalorian': 'The Mandalorian',

  // ---------- COMICS ----------
  'Marvel': 'Marvel Comics',
  'DC': 'DC Comics',
  'X-Men': 'X-Men',
  'Fantastic Four': 'Fantastic Four',
  'Guardians of the Galaxy': 'Guardians of the Galaxy (2008 team)',
  'Captain America': 'Captain America',
  'Thor': 'Thor (Marvel Comics)',
  'Black Panther': 'Black Panther (character)',
  'Justice League': 'Justice League',
  'Batman': 'Batman',
  'Superman': 'Superman',
  'Wonder Woman': 'Wonder Woman',
  'The Flash': 'Flash (DC Comics)',
  'Green Lantern': 'Green Lantern',
  'Teen Titans': 'Teen Titans',
  'Suicide Squad': 'Suicide Squad',
  'The Boys': 'The Boys (comics)',
  'Iron Man C': 'Iron Man',         // disambiguate from movie
  'Spider-Man C': 'Spider-Man',     // disambiguate

  // ---------- K-POP ----------
  'BTS': 'BTS',
  'BLACKPINK': 'Blackpink',
  'TWICE': 'Twice (group)',
  'Stray Kids': 'Stray Kids',
  'SEVENTEEN': 'Seventeen (South Korean band)',
  'NewJeans': 'NewJeans',
  'IVE': 'Ive (group)',
  'aespa': 'Aespa',
  'LE SSERAFIM': 'Le Sserafim',
  'ENHYPEN': 'Enhypen',
  'TXT': 'Tomorrow X Together',
  'NCT': 'NCT (group)',
  'Red Velvet': 'Red Velvet (group)',
  'ITZY': 'Itzy',
  '(G)I-DLE': '(G)I-dle',
  'ATEEZ': 'Ateez',
  'BABYMONSTER': 'Babymonster',
  'ILLIT': 'Illit',
  'RIIZE': 'Riize',
  'EXO': 'Exo',

  // ---------- GAMING (fallback) ----------
  'The Legend of Zelda': 'The Legend of Zelda',
  'Minecraft': 'Minecraft',
  'Call of Duty': 'Call of Duty',
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
    if (buf.length < 15000) return { ok: false, size: buf.length };
    await fs.writeFile(dest, buf);
    return { ok: true, size: buf.length };
  } catch {
    return { ok: false, size: 0 };
  }
}

// Fetch exact Wikipedia page image
async function fetchWikiExact(title) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
    `&prop=pageimages&piprop=original|thumbnail&pithumbsize=2000` +
    `&titles=${encodeURIComponent(title)}&redirects=1`;

  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 FandomVerse/1.0' },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const pages = json?.query?.pages || {};

    for (const page of Object.values(pages)) {
      // Prefer original (full-res)
      if (page.original?.source) {
        return { url: page.original.source, title: page.title, type: 'original' };
      }
      if (page.thumbnail?.source) {
        return { url: page.thumbnail.source, title: page.title, type: 'thumbnail' };
      }
    }
    return null;
  } catch {
    return null;
  }
}

async function main() {
  console.log('📖 Using exact Wikipedia titles...\n');
  await fs.mkdir(BANNER_DIR, { recursive: true });

  let ok = 0, fail = 0, skipped = 0;
  const failedList = [];

  for (const [series, wikiTitle] of Object.entries(WIKI_TITLES)) {
    // Skip the disambiguation hacks
    const cleanSeries = series.replace(/ C$/, '');
    const slug = slugify(cleanSeries);
    const dest = path.join(BANNER_DIR, `${slug}.jpg`);

    if (await exists(dest)) {
      const size = (await fs.stat(dest)).size;
      if (size > 80000) {
        console.log(`  ✓ ${slug}.jpg exists (${Math.round(size / 1024)}KB)`);
        skipped++;
        continue;
      }
    }

    console.log(`  🔍 ${cleanSeries} → Wikipedia: "${wikiTitle}"`);

    const result = await fetchWikiExact(wikiTitle);
    if (!result) {
      console.log(`     ✗ No image on Wikipedia page`);
      fail++;
      failedList.push(cleanSeries);
      await sleep(DELAY);
      continue;
    }

    const r = await downloadImage(result.url, dest);
    if (r.ok) {
      console.log(`     ↓ ${slug}.jpg (${result.type}, ${Math.round(r.size / 1024)}KB) — "${result.title}"`);
      ok++;
    } else {
      console.log(`     ✗ Download failed (size ${Math.round(r.size / 1024)}KB)`);
      fail++;
      failedList.push(cleanSeries);
    }

    await sleep(DELAY);
  }

  console.log(`\n✨ Done!\n`);
  console.log(`   Downloaded: ${ok}`);
  console.log(`   Skipped:    ${skipped}`);
  console.log(`   Failed:     ${fail}`);

  if (failedList.length > 0) {
    console.log(`\n⚠ Failed series (need manual download):`);
    failedList.forEach((s) => console.log(`   - ${s}`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});