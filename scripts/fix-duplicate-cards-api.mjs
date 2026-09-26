// scripts/fix-duplicates-final.mjs
// Fixes duplicate card visuals — NO APIs.
// Strategy:
//   1. Detect duplicate (banner || image) within each category
//   2. Keep the FIRST occurrence as-is (nice local banner)
//   3. For duplicates, drop the banner so card falls back to unique `image`
//   4. If `image` is also duplicated, assign a fresh YouTube ID from trailers pool
// Usage: node scripts/fix-duplicates-final.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';
const TRAILERS_FILE = './public/data/trailers.json';

async function main() {
  console.log('📖 Reading files...\n');
  const data = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const trailers = JSON.parse(await fs.readFile(TRAILERS_FILE, 'utf-8'));

  // Global pool of every YouTube ID we know about
  const globalPool = [
    ...new Set(trailers.trailers.map((t) => t.youtubeId).filter(Boolean)),
  ];
  console.log(`Global YouTube pool: ${globalPool.length} IDs\n`);

  // Group content by category
  const byCat = {};
  data.content.forEach((a) => {
    if (!byCat[a.category]) byCat[a.category] = [];
    byCat[a.category].push(a);
  });

  let bannerDropped = 0;
  let imageReassigned = 0;
  const report = [];

  for (const [cat, items] of Object.entries(byCat)) {
    console.log(`📂 ${cat.toUpperCase()} — ${items.length} articles`);

    // Per-category YouTube pool (same-cat first, then global)
    const catIds = trailers.trailers
      .filter((t) => t.category === cat && t.youtubeId)
      .map((t) => t.youtubeId);
    const ids = [...new Set([...catIds, ...globalPool])];
    let idIdx = 0;

    const usedVisuals = new Set(); // banner || image that's actually rendered
    const usedImages = new Set();  // image field

    // ---- PASS 1: drop duplicate banners ----
    for (const a of items) {
      if (!a.banner) continue;

      const visual = a.banner; // banner takes priority in ContentCard
      if (usedVisuals.has(visual)) {
        // Duplicate banner → drop it so card uses a.image instead
        report.push(`  ${cat}/${a.id}: dropped banner "${visual.split('/').pop()}"`);
        delete a.banner;
        bannerDropped++;
      } else {
        usedVisuals.add(visual);
      }
    }

    // ---- PASS 2: ensure every article has a unique image ----
    for (const a of items) {
      let img = a.image;

      // If image is missing or duplicated → pull fresh
      if (!img || usedImages.has(img)) {
        let fresh = null;
        while (idIdx < ids.length) {
          const id = ids[idIdx++];
          const url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
          if (!usedImages.has(url) && !usedVisuals.has(url)) {
            fresh = url;
            break;
          }
        }
        if (fresh) {
          report.push(`  ${cat}/${a.id}: image reassigned`);
          a.image = fresh;
          img = fresh;
          imageReassigned++;
        } else {
          console.log(`  ⚠ ${cat}/${a.id}: pool exhausted`);
        }
      }

      if (img) {
        usedImages.add(img);
        usedVisuals.add(img);
      }
    }

    console.log(`   ✓ done\n`);
  }

  await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log(`\n✨ Done!\n`);
  console.log(`   Banners dropped:   ${bannerDropped}`);
  console.log(`   Images reassigned: ${imageReassigned}`);
  console.log(`   Total fixes:       ${bannerDropped + imageReassigned}`);

  if (report.length) {
    console.log(`\n📋 Report (first 60 of ${report.length}):`);
    report.slice(0, 60).forEach((r) => console.log(r));
    if (report.length > 60) console.log(`   ... +${report.length - 60} more`);
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});