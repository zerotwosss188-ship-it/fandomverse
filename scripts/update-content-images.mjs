// scripts/update-content-images.mjs
// Updates content.json image paths to use local banner images
// Usage: node scripts/update-content-images.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';
const CHARACTERS_FILE = './public/data/characters.json';
const BANNER_DIR = './public/images/banners';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

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

function matchSeries(article, seriesList) {
  if (article.series) return article.series;
  const title = article.title.toLowerCase();
  for (const s of seriesList) {
    if (title.includes(s.toLowerCase())) return s;
  }
  if (article.tags?.[0]) {
    const tag = article.tags[0].toLowerCase();
    for (const s of seriesList) {
      if (slugify(s) === tag) return s;
    }
  }
  return null;
}

async function main() {
  console.log('📖 Reading content.json...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const seriesList = await loadSeriesList();

  // Check which banners actually exist
  const files = await fs.readdir(BANNER_DIR).catch(() => []);
  const availableBanners = new Set(
    files.filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', ''))
  );

  console.log(`Found ${availableBanners.size} banner images.\n`);

  let updated = 0;
  let skipped = 0;

  content.content = (content.content || []).map((article) => {
    if (article.category !== 'anime' && article.category !== 'manga') {
      return article;
    }

    const series = matchSeries(article, seriesList);
    if (!series) {
      skipped++;
      return article;
    }

    const slug = slugify(series);
    if (!availableBanners.has(slug)) {
      skipped++;
      return article;
    }

    const newPath = `/images/banners/${slug}.jpg`;

    // Skip if already updated
    if (article.image === newPath) {
      skipped++;
      return article;
    }

    console.log(`  ✓ ${article.id} → ${newPath}  ("${article.title}")`);
    updated++;
    return { ...article, image: newPath };
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`\n✨ Done!\n`);
  console.log(`   Updated: ${updated} article image path(s)`);
  console.log(`   Skipped: ${skipped} article(s) — either non-anime/manga or banner missing`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});