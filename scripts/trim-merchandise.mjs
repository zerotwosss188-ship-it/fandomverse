// scripts/trim-merchandise.mjs
// Trims merchandise.json so each category has ~8 items.
// Picks DIVERSE items (round-robin across series) rather than first-N.
// Usage: node scripts/trim-merchandise.mjs

import fs from 'fs/promises';

const MERCH_FILE = './public/data/merchandise.json';
const TARGET = 8; // items per category

async function main() {
  console.log('📖 Reading merchandise.json...\n');
  const data = JSON.parse(await fs.readFile(MERCH_FILE, 'utf-8'));

  // Group by category
  const byCat = {};
  data.merchandise.forEach((m) => {
    (byCat[m.category] ||= []).push(m);
  });

  const trimmed = [];
  const report = [];

  for (const [cat, items] of Object.entries(byCat)) {
    if (items.length <= TARGET) {
      trimmed.push(...items);
      report.push(`  ${cat}: ${items.length} → ${items.length} (kept)`);
      continue;
    }

    // Group by series inside category
    const bySeries = {};
    items.forEach((m) => {
      const s = m.series || 'Other';
      (bySeries[s] ||= []).push(m);
    });

    // Round-robin pick from each series for diversity
    const picked = [];
    const seriesList = Object.keys(bySeries);
    let round = 0;
    while (picked.length < TARGET) {
      let added = false;
      for (const s of seriesList) {
        if (picked.length >= TARGET) break;
        if (bySeries[s][round]) {
          picked.push(bySeries[s][round]);
          added = true;
        }
      }
      if (!added) break;
      round++;
    }

    trimmed.push(...picked);
    report.push(`  ${cat}: ${items.length} → ${picked.length}`);
  }

  data.merchandise = trimmed;

  await fs.writeFile(MERCH_FILE, JSON.stringify(data, null, 2), 'utf-8');

  console.log('✨ Done!\n');
  report.forEach((r) => console.log(r));
  console.log(`\nTotal items now: ${trimmed.length}`);
}

main().catch((e) => { console.error('Fatal:', e); process.exit(1); });