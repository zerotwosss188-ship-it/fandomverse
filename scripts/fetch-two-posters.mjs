// scripts/fetch-two-posters.mjs
// One-off: fetch Inception + The Dark Knight posters from Wikipedia
// Usage: node scripts/fetch-two-posters.mjs

import fs from 'fs/promises';
import path from 'path';

const OUT_DIR = './public/images/covers';

// Exact Wikipedia page titles
const PAGES = {
  'inception': 'Inception',
  'the-dark-knight': 'The Dark Knight',
};

const UA = 'Mozilla/5.0 FandomVerse/1.0 (educational project)';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPosterUrl(wikiTitle) {
  const url =
    `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*` +
    `&prop=pageimages&piprop=original|thumbnail&pithumbsize=1200` +
    `&titles=${encodeURIComponent(wikiTitle)}&redirects=1`;

  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return null;
  const json = await res.json();
  const pages = json?.query?.pages || {};
  for (const page of Object.values(pages)) {
    if (page.original?.source) return page.original.source;
    if (page.thumbnail?.source) return page.thumbnail.source;
  }
  return null;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) return { ok: false, size: 0 };
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) return { ok: false, size: buf.length };
  await fs.writeFile(dest, buf);
  return { ok: true, size: buf.length };
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  console.log(`📁 Output: ${OUT_DIR}\n`);

  for (const [slug, wikiTitle] of Object.entries(PAGES)) {
    console.log(`🔍 ${wikiTitle}`);
    const imgUrl = await fetchPosterUrl(wikiTitle);
    if (!imgUrl) {
      console.log(`   ✗ No image found on Wikipedia page\n`);
      continue;
    }
    console.log(`   Found: ${imgUrl}`);
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    const r = await downloadImage(imgUrl, dest);
    if (r.ok) {
      console.log(`   ✓ Saved ${slug}.jpg (${Math.round(r.size / 1024)} KB)\n`);
    } else {
      console.log(`   ✗ Download failed (size ${r.size} bytes)\n`);
    }
    await sleep(600);
  }

  console.log('✨ Done!');
  console.log(`\nFiles saved:`);
  console.log(`   ${OUT_DIR}/inception.jpg`);
  console.log(`   ${OUT_DIR}/the-dark-knight.jpg`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});