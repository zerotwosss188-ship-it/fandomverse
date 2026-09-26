// scripts/fix-content-json.mjs
// Fixes missing category/type/banner fields in content.json
// Usage: node scripts/fix-content-json.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

// Map id prefix → { category, type }
function inferFromId(id) {
  const match = id.match(/^([a-z]+)/);
  if (!match) return null;
  const prefix = match[1];

  const map = {
    a: { category: 'anime', type: 'article' },
    g: { category: 'gaming', type: 'article' },
    m: { category: 'movies', type: 'article' },
    tva: { category: 'tv-shows', type: 'article' },
    kpa: { category: 'kpop', type: 'article' },
    ca: { category: 'comics', type: 'article' },
    mga: { category: 'manga', type: 'article' },
  };

  return map[prefix] || null;
}

// If banner is missing but image is a local path, use it as banner
function inferBanner(article) {
  if (article.banner) return null;
  if (article.image && article.image.startsWith('/images/')) {
    return article.image;
  }
  return null;
}

async function main() {
  console.log('📖 Reading content.json...\n');
  const data = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  let fixedCategory = 0;
  let fixedType = 0;
  let fixedBanner = 0;
  const fixes = [];

  data.content = data.content.map((article) => {
    const inferred = inferFromId(article.id);
    if (!inferred) {
      console.log(`  ⚠ Unknown id prefix: ${article.id}`);
      return article;
    }

    const updated = { ...article };
    let changed = false;

    if (!updated.category) {
      updated.category = inferred.category;
      fixedCategory++;
      changed = true;
    }

    if (!updated.type) {
      updated.type = inferred.type;
      fixedType++;
      changed = true;
    }

    const banner = inferBanner(updated);
    if (banner) {
      updated.banner = banner;
      fixedBanner++;
      changed = true;
    }

    if (changed) {
      fixes.push(`  ✓ ${updated.id} → category="${updated.category}" type="${updated.type}"${banner ? ` banner="${banner}"` : ''}`);
    }

    return updated;
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log('Fixed:');
  fixes.forEach((f) => console.log(f));

  console.log('\n✨ Done!\n');
  console.log(`   category added: ${fixedCategory}`);
  console.log(`   type added:     ${fixedType}`);
  console.log(`   banner added:   ${fixedBanner}`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});