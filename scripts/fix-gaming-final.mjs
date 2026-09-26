// scripts/fix-gaming-final.mjs
// Fixes gaming article images using local Steam banners
// Usage: node scripts/fix-gaming-final.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

// Manual mapping: article id -> local banner file
const FIXES = {
  // GTA series
  'g5':  '/images/banners/gta-v.jpg',
  'g6':  '/images/banners/gta-v.jpg',
  // Fortnite
  'g9':  '/images/banners/fortnite.jpg',
  'g10': '/images/banners/fortnite.jpg',
  // Call of Duty + Warzone
  'g11': '/images/banners/call-of-duty.jpg',
  'g12': '/images/banners/call-of-duty.jpg',
  // Red Dead
  'g13': '/images/banners/red-dead-redemption.jpg',
  'g14': '/images/banners/red-dead-redemption.jpg',
  // God of War
  'g17': '/images/banners/god-of-war.jpg',
  'g18': '/images/banners/god-of-war.jpg',
  // EA Sports FC
  'g31': '/images/banners/ea-sports-fc.jpg',
  'g32': '/images/banners/ea-sports-fc.jpg',
  // Minecraft (banner is small but works)
  'g7':  '/images/banners/minecraft.jpg',
  'g8':  '/images/banners/minecraft.jpg',
  // Indie games — use a generic or the Hades banner
  'g2':  '/images/banners/hades.jpg',
  // Old references
  'g3':  '/images/banners/god-of-war.jpg',
  'g4':  '/images/banners/hades.jpg',
  'g19': '/images/banners/assassins-creed.jpg',
  'g20': '/images/banners/assassins-creed.jpg',
  'g21': '/images/banners/resident-evil.jpg',
  'g22': '/images/banners/resident-evil.jpg',
  'g23': '/images/banners/elden-ring.jpg',
  'g24': '/images/banners/elden-ring.jpg',
  'g25': '/images/banners/dark-souls.jpg',
  'g26': '/images/banners/dark-souls.jpg',
  'g27': '/images/banners/the-witcher.jpg',
  'g28': '/images/banners/the-witcher.jpg',
  'g29': '/images/banners/cyberpunk-2077.jpg',
  'g30': '/images/banners/cyberpunk-2077.jpg',
  'g35': '/images/banners/counter-strike-2.jpg',
  'g36': '/images/banners/counter-strike-2.jpg',
  'g37': '/images/banners/rainbow-six-siege.jpg',
  'g38': '/images/banners/rainbow-six-siege.jpg',
  'g39': '/images/banners/valorant.jpg',
  'g40': '/images/banners/valorant.jpg',
};

async function main() {
  console.log('📖 Reading content.json...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  let fixed = 0, notFound = 0;

  content.content = content.content.map((article) => {
    if (article.category !== 'gaming') return article;

    const newPath = FIXES[article.id];
    if (!newPath) {
      notFound++;
      console.log(`  ⚠ No fix for: ${article.id} — "${article.title}"`);
      return article;
    }

    if (article.image === newPath) {
      console.log(`  ✓ ${article.id} already correct`);
      return article;
    }

    console.log(`  ✓ ${article.id} → ${newPath}`);
    console.log(`     "${article.title}"`);
    fixed++;
    return { ...article, image: newPath };
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log(`\n✨ Done!`);
  console.log(`   Fixed:      ${fixed}`);
  console.log(`   Not found:  ${notFound} (not in FIXES map)`);
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});