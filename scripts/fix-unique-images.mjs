// scripts/fix-unique-images.mjs
// Makes `image` field unique per article so no two cards in a category
// render the same visual. Nothing is deleted — only duplicate `image`
// values are swapped for fresh YouTube thumbnails from a global pool.
// Usage: node scripts/fix-unique-images.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';
const TRAILERS_FILE = './public/data/trailers.json';
const VIDEOS_FILE = './public/data/videos.json';

async function main() {
  console.log('📖 Reading data...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const trailers = JSON.parse(await fs.readFile(TRAILERS_FILE, 'utf-8'));
  const videos = JSON.parse(await fs.readFile(VIDEOS_FILE, 'utf-8'));

  // Build a giant pool of every unique YouTube ID we know about
  const allIds = [
    ...trailers.trailers.map((t) => t.youtubeId),
    ...videos.videos.map((v) => v.youtubeId),
  ].filter(Boolean);
  const uniqueIds = [...new Set(allIds)];
  console.log(`Pool: ${uniqueIds.length} unique YouTube IDs\n`);

  // Group content by category
  const byCat = {};
  content.content.forEach((a) => {
    (byCat[a.category] ||= []).push(a);
  });

  let counter = 0;
  let reassigned = 0;
  const report = [];

  for (const [cat, items] of Object.entries(byCat)) {
    const used = new Set();

    for (const item of items) {
      let img = item.image;

      // Duplicate or missing → pull a fresh unique URL from the pool
      if (!img || used.has(img)) {
        let fresh = null;
        for (let i = 0; i < uniqueIds.length * 3; i++) {
          const id = uniqueIds[counter % uniqueIds.length];
          counter++;
          const url = `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
          if (!used.has(url)) {
            fresh = url;
            break;
          }
        }
        if (fresh) {
          report.push(`  ${cat}/${item.id} → ${fresh.split('/vi/')[1].split('/')[0]}`);
          item.image = fresh;
          img = fresh;
          reassigned++;
        }
      }

      if (img) used.add(img);
    }
  }

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`✨ Done!\n`);
  console.log(`   Reassigned: ${reassigned} duplicate images`);
  console.log(`   banner field: untouched`);
  console.log(`   /images folder: untouched`);

  if (report.length) {
    console.log(`\n📋 First 40 of ${report.length}:`);
    report.slice(0, 40).forEach((r) => console.log(r));
  }
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });