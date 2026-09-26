// scripts/mark-featured.mjs
// Marks a curated list of articles as featured
// Usage: node scripts/mark-featured.mjs

import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

// Curated featured picks — 2-3 per category, spread across types
const FEATURED_IDS = [
  // Anime
  'a5',   // One Piece: Final Saga's Biggest Reveals
  'a7',   // Solo Leveling: Rise of the Shadow Monarch
  'a19',  // Dan Da Dan: Supernatural Chaos Done Right

  // Gaming
  'g1',   // GTA VI Breaks All Records
  'g5',   // GTA V: A Decade of Dominance
  'g23',  // Elden Ring: Shadow of the Erdtree

  // Movies
  'm1',   // Avengers: Earth's Mightiest Heroes
  'm3',   // Spider-Man: No Way Home
  'm11',  // Avatar: Pandora's Box Office Legacy

  // TV Shows
  'tva1', // Stranger Things Final Season
  'tva5', // Breaking Bad: The Perfect TV Drama
  'tva23',// Squid Game Season 3

  // K-Pop
  'kpa1', // BTS Reunion World Tour
  'kpa5', // TWICE: A Decade of Dominance
  'kpa15',// aespa: K-pop's Metaverse Pioneers

  // Comics
  'ca1',  // X-Men: Krakoan Era Retrospective
  'ca23', // Batman: Greatest Stories
  'ca39', // Watchmen: The Graphic Novel

  // Manga
  'mga1', // One Piece Manga: 28 Years
  'mga17',// Fullmetal Alchemist: A Perfect Story
  'mga19',// Berserk: A Tribute to Miura
];

async function main() {
  console.log('📖 Reading content.json...\n');
  const content = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));

  let marked = 0;
  let already = 0;
  let notFound = 0;
  const foundIds = new Set();

  content.content = content.content.map((article) => {
    if (FEATURED_IDS.includes(article.id)) {
      foundIds.add(article.id);
      if (article.featured) {
        already++;
        return article;
      }
      marked++;
      return { ...article, featured: true };
    }
    return article;
  });

  // Check for IDs not found
  const missing = FEATURED_IDS.filter((id) => !foundIds.has(id));
  notFound = missing.length;

  await fs.writeFile(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8');

  console.log('✨ Done!\n');
  console.log(`   Marked as featured: ${marked}`);
  console.log(`   Already featured:   ${already}`);
  console.log(`   Not found (skip):   ${notFound}`);

  if (missing.length > 0) {
    console.log(`\n⚠ These IDs didn't exist in content.json:`);
    missing.forEach((id) => console.log(`   - ${id}`));
    console.log(`\n   Edit FEATURED_IDS in the script and re-run.`);
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});