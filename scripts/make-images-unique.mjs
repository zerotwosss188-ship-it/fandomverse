// scripts/make-images-unique.mjs
// Makes `image` field unique per-category. Nothing is deleted — banner stays.
// Only duplicate `image` values are reassigned to fresh YouTube IDs.
// Usage: node scripts/make-images-unique.mjs

import fs from 'fs/promises';

const CONTENT_FILE  = './public/data/content.json';
const TRAILERS_FILE = './public/data/trailers.json';

async function main() {
  const data     = JSON.parse(await fs.readFile(CONTENT_FILE,  'utf-8'));
  const trailers = JSON.parse(await fs.readFile(TRAILERS_FILE, 'utf-8'));

  const globalIds = [
    ...new Set(trailers.trailers.map((t) => t.youtubeId).filter(Boolean)),
  ];

  const byCat = {};
  data.content.forEach((a) => {
    (byCat[a.category] ||= []).push(a);
  });

  let reassigned = 0;
  const report   = [];

  for (const [cat, items] of Object.entries(byCat)) {
    // Prefer same-category IDs first, then global
    const catIds = trailers.trailers
      .filter((t) => t.category === cat && t.youtubeId)
      .map((t) => t.youtubeId);
    const ids = [...new Set([...catIds, ...globalIds])];
    let idIdx = 0;

    const usedImages = new Set();
    for (const a of items) {
      let img = a.image;

      if (!img || usedImages.has(img)) {
        while (idIdx < ids.length) {
          const url = `https://img.youtube.com/vi/${ids[idIdx++]}/maxresdefault.jpg`;
          if (!usedImages.has(url)) { img = url; break; }
        }
        if (img && img !== a.image) {
          a.image = img;
          reassigned++;
          report.push(`  ${cat}/${a.id} → ${ids[idIdx - 1]}`);
        }
      }
      if (img) usedImages.add(img);
    }
  }

  await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`✨ Done! Reassigned ${reassigned} duplicate images.`);
  console.log(`   (banner field untouched, images/ folder untouched)`);
  if (report.length) {
    console.log('\n📋 First 40:');
    report.slice(0, 40).forEach((r) => console.log(r));
  }
}

main().catch((e) => { console.error(e); process.exit(1); });