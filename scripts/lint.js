const { readdirSync, readFileSync, statSync } = require('node:fs');
const { join } = require('node:path');

function collectJS(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) files.push(...collectJS(full));
    if (stat.isFile() && full.endsWith('.js')) files.push(full);
  }
  return files;
}

const files = [...collectJS('src'), ...collectJS('tests'), ...collectJS('scripts')];
let failed = false;

for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (text.includes('\t')) {
    console.error(`Tab character found: ${file}`);
    failed = true;
  }
  const forbiddenMarker = 'TO' + 'DO';
  if (text.includes(forbiddenMarker)) {
    console.error(`Forbidden marker found: ${file}`);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log(`Lint passed for ${files.length} files.`);
