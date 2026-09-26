// scripts/restore-cards-add-banner.mjs
// 1. Restores `image` field to YouTube thumbnails (using trailers.json series match)
// 2. Adds `banner` field with local /images/banners/ path
// Usage: node scripts/restore-cards-add-banner.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';
const TRAILERS_FILE = './public/data/trailers.json';
const BANNER_DIR = './public/images/banners';

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

async function main() {
  console.log('📖 Reading files...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const trailers = JSON.parse(await fs.readFile(TRAILERS_FILE, 'utf-8'));

  const bannerFiles = await fs.readdir(BANNER_DIR).catch(() => []);
  const availableBanners = new Set(
    bannerFiles.filter((f) => f.endsWith('.jpg')).map((f) => f.replace('.jpg', ''))
  );

  console.log(`Found ${availableBanners.size} local banners.\n`);

  // Build series → youtubeId map (first trailer per series)
  const seriesToYoutube = new Map();
  (trailers.trailers || []).forEach((t) => {
    if (t.series && t.youtubeId && !seriesToYoutube.has(t.series)) {
      seriesToYoutube.set(t.series, t.youtubeId);
    }
  });

  console.log(`Found ${seriesToYoutube.size} series with YouTube IDs.\n`);

  let total = 0, ytRestored = 0, bannerAdded = 0, bothMissing = 0;

  content.content = content.content.map((article) => {
    total++;

    // Match to local banner
    const candidates = [];
    if (article.series) candidates.push(article.series);
    if (article.title) {
      candidates.push(article.title.split(/[\s:]+/).slice(0, 3).join(' '));
      candidates.push(article.title.split(/[\s:]+/).slice(0, 2).join(' '));
    }
    if (article.tags?.[0]) candidates.push(article.tags[0]);

    let bannerSlug = null;
    for (const c of candidates) {
      const slug = slugify(c);
      if (availableBanners.has(slug)) {
        bannerSlug = slug;
        break;
      }
    }

    // Match to YouTube ID
    let youtubeId = null;
    if (article.series && seriesToYoutube.has(article.series)) {
      youtubeId = seriesToYoutube.get(article.series);
    } else {
      const titleLower = article.title.toLowerCase();
      for (const [series, id] of seriesToYoutube.entries()) {
        if (titleLower.includes(series.toLowerCase())) {
          youtubeId = id;
          break;
        }
      }
    }

    const updated = { ...article };

    // Restore YouTube image
    if (youtubeId) {
      updated.image = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
      ytRestored++;
    }

    // Add banner field for hero
    if (bannerSlug) {
      updated.banner = `/images/banners/${bannerSlug}.jpg`;
      bannerAdded++;
    }

    if (!youtubeId && !bannerSlug) bothMissing++;

    return updated;
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`✨ Done!\n`);
  console.log(`   Total articles:        ${total}`);
  console.log(`   YouTube restored:      ${ytRestored}`);
  console.log(`   Banner added:          ${bannerAdded}`);
  console.log(`   Both missing:          ${bothMissing}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});