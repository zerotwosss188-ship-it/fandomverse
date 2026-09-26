// scripts/find-unused.mjs
// Finds components with zero imports in src/
// Usage: node scripts/find-unused.mjs

import fs from 'fs/promises';
import path from 'path';

const SRC_DIR = './src';
const COMPONENTS_DIR = './src/components';

async function getAllFiles(dir, ext = ['.jsx', '.js']) {
  const results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await getAllFiles(fullPath, ext)));
    } else if (ext.some((e) => entry.name.endsWith(e))) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const componentFiles = await fs.readdir(COMPONENTS_DIR);
  const components = componentFiles
    .filter((f) => f.endsWith('.jsx') || f.endsWith('.js'))
    .map((f) => ({
      name: f.replace(/\.(jsx|js)$/, ''),
      file: f,
    }));

  // All src files (for searching imports)
  const allSrcFiles = await getAllFiles(SRC_DIR);
  const searchableFiles = allSrcFiles.filter(
    (f) => !f.includes('components' + path.sep) || f.endsWith('.jsx')
  );

  // Read all src files into memory
  const contents = {};
  for (const f of searchableFiles) {
    contents[f] = await fs.readFile(f, 'utf-8');
  }

  console.log('🔍 Scanning for unused components...\n');

  const unused = [];

  for (const comp of components) {
    let used = false;
    for (const [file, content] of Object.entries(contents)) {
      // Skip self-reference
      if (file.includes(path.sep + 'components' + path.sep + comp.file)) continue;

      // Check for imports
      const regex = new RegExp(
        `(from\\s+['"][^'"]*[/\\\\]${comp.name}['"])|(from\\s+['"]\\.\\/${comp.name}['"])|(import\\s+['"][^'"]*[/\\\\]${comp.name}['"])`,
        'm'
      );
      if (regex.test(content)) {
        used = true;
        break;
      }
    }
    if (!used) unused.push(comp);
  }

  console.log(`📦 Total components: ${components.length}`);
  console.log(`✅ Used:             ${components.length - unused.length}`);
  console.log(`❌ Unused:           ${unused.length}\n`);

  if (unused.length > 0) {
    console.log('Unused components:');
    unused
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((c) => console.log(`  - ${c.file}`));
    console.log('\n🗑️  To delete all:');
    console.log(
      `   ${unused.map((c) => `src/components/${c.file}`).join(' ')}`
    );
  } else {
    console.log('🎉 No unused components found.');
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});