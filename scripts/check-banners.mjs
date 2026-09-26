import fs from 'fs/promises';

const CONTENT_FILE = './public/data/content.json';

async function main() {
  const d = JSON.parse(await fs.readFile(CONTENT_FILE, 'utf-8'));
  const missing = d.content.filter((a) => !a.banner);

  console.log('Total articles:', d.content.length);
  console.log('Missing banner:', missing.length);
  console.log('');

  if (missing.length === 0) {
    console.log('✅ All articles have banner field');
    return;
  }

  missing.forEach((m) =>
    console.log(`  - ${m.id} | ${m.category} | ${m.title}`)
  );
}

main().catch(console.error);