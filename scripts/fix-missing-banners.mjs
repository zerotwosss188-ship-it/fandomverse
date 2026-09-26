// scripts/fix-missing-banners.mjs
// Auto-fills missing banner field based on series/title matching
// Usage: node scripts/fix-missing-banners.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

// Series/title keyword → banner path
const BANNER_MAP = {
  // Gaming
  'GTA VI': '/images/banners/gta-vi.jpg',
  'GTA V': '/images/banners/gta-v.jpg',
  'Hades II': '/images/banners/hades.jpg',
  Hades: '/images/banners/hades.jpg',
  Minecraft: '/images/banners/minecraft.jpg',
  'Call of Duty': '/images/banners/call-of-duty.jpg',
  Warzone: '/images/banners/warzone.jpg',
  Cyberpunk: '/images/banners/cyberpunk-2077.jpg',
  'EA Sports FC': '/images/banners/ea-sports-fc.jpg',
  'EA FC': '/images/banners/ea-sports-fc.jpg',
  Valorant: '/images/banners/valorant.jpg',
  'Counter-Strike': '/images/banners/counter-strike-2.jpg',
  'Rainbow Six': '/images/banners/rainbow-six-siege.jpg',
  Siege: '/images/banners/rainbow-six-siege.jpg',
  'League of Legends': '/images/banners/league-of-legends.jpg',
  'LoL': '/images/banners/league-of-legends.jpg',

  // K-Pop
  IVE: '/images/banners/ive.jpg',
  'LE SSERAFIM': '/images/banners/le-sserafim.jpg',
  'Sakura': '/images/banners/le-sserafim.jpg',
  Wonyoung: '/images/banners/ive.jpg',
  Yujin: '/images/banners/ive.jpg',

  // Comics
  Guardians: '/images/banners/guardians.jpg',
  'Rocket Raccoon': '/images/banners/guardians.jpg',
  'Green Lantern': '/images/banners/green-lantern.jpg',
  Sinestro: '/images/banners/green-lantern.jpg',
  'Teen Titans': '/images/banners/teen-titans.jpg',
  Deathstroke: '/images/banners/teen-titans.jpg',
  'Suicide Squad': '/images/banners/suicide-squad.jpg',
  'Harley Quinn': '/images/banners/suicide-squad.jpg',
  Watchmen: '/images/banners/watchmen.jpg',

  // Manga
  Berserk: '/images/banners/berserk.jpg',
};

function inferBanner(article) {
  // Try series field first
  if (article.series && BANNER_MAP[article.series]) {
    return BANNER_MAP[article.series];
  }

  // Try title matching
  const titleLower = (article.title || '').toLowerCase();
  for (const [keyword, path] of Object.entries(BANNER_MAP)) {
    if (titleLower.includes(keyword.toLowerCase())) {
      return path;
    }
  }

  return null;
}

async function main() {
  console.log('📖 Reading content.json...\n');
  const data = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  let fixed = 0;
  let skipped = 0;
  const stillMissing = [];

  data.content = data.content.map((a) => {
    if (a.banner) return a;

    const banner = inferBanner(a);
    if (banner) {
      fixed++;
      return { ...a, banner };
    }

    skipped++;
    stillMissing.push(`${a.id} | ${a.category} | ${a.title}`);
    return a;
  });

  await fs.writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log('✨ Done!\n');
  console.log(`   Banner added: ${fixed}`);
  console.log(`   Still missing: ${skipped}`);

  if (stillMissing.length > 0) {
    console.log('\n⚠ Manual fix needed for:');
    stillMissing.forEach((s) => console.log(`   ${s}`));
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});