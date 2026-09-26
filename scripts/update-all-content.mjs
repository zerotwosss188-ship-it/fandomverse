// scripts/update-all-content.mjs
// Updates image paths in content.json for ALL categories
// Matches articles to local banners based on series name
// Usage: node scripts/update-all-content.mjs

import fs from 'fs/promises';
import path from 'path';

const CONTENT_FILE = './public/data/content.json';
const BANNER_DIR = './public/images/banners';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('📖 Reading content.json...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  // Get list of available banner files (without .jpg)
  const files = await fs.readdir(BANNER_DIR).catch(() => []);
  const availableBanners = new Set(
    files.filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', ''))
  );

  console.log(`Found ${availableBanners.size} banner images:\n`);
  console.log(`   ${Array.from(availableBanners).slice(0, 10).join(', ')}...\n`);

  let updated = 0;
  let skippedNoMatch = 0;
  let alreadyLocal = 0;

  content.content = (content.content || []).map((article) => {
    // Skip if image already points to local banner
    if (article.image && article.image.startsWith('/images/banners/')) {
      alreadyLocal++;
      return article;
    }

    // Try to find matching banner using these fallbacks:
    // 1. article.series
    // 2. article.title first few words
    // 3. article.tags[0]
    const candidates = [];

    if (article.series) {
      candidates.push(article.series);
    }

    // Title-based matching: try first 3 words
    if (article.title) {
      const words = article.title.split(/[\s:]+/).slice(0, 3).join(' ');
      candidates.push(words);
      // Also try first 2 words
      candidates.push(article.title.split(/[\s:]+/).slice(0, 2).join(' '));
    }

    // Tag-based
    if (article.tags?.[0]) {
      candidates.push(article.tags[0]);
    }

    // Find first matching banner
    let matchedBanner = null;
    for (const cand of candidates) {
      const slug = slugify(cand);
      if (availableBanners.has(slug)) {
        matchedBanner = slug;
        break;
      }
    }

    if (!matchedBanner) {
      skippedNoMatch++;
      return article;
    }

    const newPath = `/images/banners/${matchedBanner}.jpg`;
    console.log(`  ✓ ${article.id} → ${newPath}`);
    console.log(`     "${article.title}" [${article.category}]`);

    updated++;
    return { ...article, image: newPath };
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`\n✨ Done!\n`);
  console.log(`   Updated:               ${updated}`);
  console.log(`   Already local:         ${alreadyLocal}`);
  console.log(`   Skipped (no banner):   ${skippedNoMatch}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});