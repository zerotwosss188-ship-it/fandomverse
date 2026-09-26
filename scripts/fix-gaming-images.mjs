// scripts/fix-gaming-images.mjs
// Fixes gaming articles: restores YouTube thumbnail URLs by matching with trailers.json
// Usage: node scripts/fix-gaming-images.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';
const TRAILERS_FILE = './public/data/trailers.json';

async function main() {
  console.log('📖 Reading files...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const trailers = JSON.parse(await fs.readFile(TRAILERS_FILE, 'utf-8'));

  // Get all gaming trailers with YouTube IDs
  const gamingTrailers = (trailers.trailers || []).filter(
    (t) => t.category === 'gaming' && t.youtubeId
  );

  console.log(`Found ${gamingTrailers.length} gaming trailers with YouTube IDs.\n`);
  gamingTrailers.forEach((t) => console.log(`  - ${t.title} → ${t.youtubeId}`));
  console.log('');

  // Build keyword map from each trailer title
  function extractKeywords(str) {
    return str.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter((w) => w.length > 3);
  }

  let fixed = 0, skipped = 0, notFound = 0;

  content.content = content.content.map((article) => {
    // Only fix gaming articles
    if (article.category !== 'gaming') return article;

    // Skip if already has proper YouTube URL
    if (article.image && article.image.includes('img.youtube.com')) {
      skipped++;
      return article;
    }

    const articleWords = extractKeywords(
      article.title + ' ' + (article.series || '') + ' ' + (article.tags || []).join(' ')
    );

    // Find best matching trailer
    let bestTrailer = null;
    let bestScore = 0;

    for (const t of gamingTrailers) {
      const tWords = extractKeywords(t.title);
      const score = tWords.filter((w) => articleWords.includes(w)).length;
      if (score > bestScore) {
        bestScore = score;
        bestTrailer = t;
      }
    }

    if (!bestTrailer || bestScore === 0) {
      console.log(`  ✗ No match: "${article.title}"`);
      notFound++;
      return article;
    }

    const newUrl = `https://img.youtube.com/vi/${bestTrailer.youtubeId}/maxresdefault.jpg`;
    console.log(`  ✓ ${article.id} → ${bestTrailer.youtubeId} (score ${bestScore})`);
    console.log(`     "${article.title}" → "${bestTrailer.title}"`);
    fixed++;
    return { ...article, image: newUrl };
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`\n✨ Done!\n`);
  console.log(`   Fixed:      ${fixed}`);
  console.log(`   Skipped:    ${skipped} (already YouTube)`);
  console.log(`   Not found:  ${notFound} (no matching trailer)`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});