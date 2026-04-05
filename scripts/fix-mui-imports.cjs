/**
 * fix-mui-imports-v2.cjs
 * Fixed version: ensures proper newline separation between converted imports.
 * Also repairs files already mangled by the previous run.
 */
const fs = require('fs');
const path = require('path');

function fixFileImports(content) {
  let changed = false;

  // STEP 1: Fix mangled lines where two imports got concatenated without \n
  // Pattern: "...from '...'import ..." should be "...\nimport ..."
  const mangledRe = /('|")(\s*)(import\s)/g;
  if (mangledRe.test(content)) {
    content = content.replace(/('|")(import\s)/g, (m, q, imp) => `${q}\n${imp}`);
    changed = true;
  }

  // STEP 2: Convert remaining @mui/material barrel imports
  // Handles multi-line imports like:
  //   import {
  //     Button,
  //     Box
  //   } from '@mui/material'
  const muiRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@mui\/material['"]\s*;?/g;
  if (muiRe.test(content)) {
    content = content.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*['"]@mui\/material['"]\s*;?/g,
      (match, names) => {
        const items = names
          .split(',')
          .map(s => s.replace(/\s+/g, ' ').trim())
          .filter(Boolean);
        changed = true;
        return items
          .map(item => {
            if (item.includes(' as ')) {
              const [orig, alias] = item.split(' as ').map(s => s.trim());
              return `import ${alias} from '@mui/material/${orig}'`;
            }
            return `import ${item} from '@mui/material/${item}'`;
          })
          .join('\n');
      }
    );
  }

  // STEP 3: Convert remaining @mui/icons-material barrel imports
  const iconsRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]@mui\/icons-material['"]\s*;?/g;
  if (iconsRe.test(content)) {
    content = content.replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*['"]@mui\/icons-material['"]\s*;?/g,
      (match, names) => {
        const items = names
          .split(',')
          .map(s => s.replace(/\s+/g, ' ').trim())
          .filter(Boolean);
        changed = true;
        return items
          .map(item => {
            if (item.includes(' as ')) {
              const [orig, alias] = item.split(' as ').map(s => s.trim());
              return `import ${alias} from '@mui/icons-material/${orig}'`;
            }
            return `import ${item} from '@mui/icons-material/${item}'`;
          })
          .join('\n');
      }
    );
  }

  return { content, changed };
}

function walkDir(dir) {
  const results = [];
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return results; }
  for (const f of entries) {
    const full = path.join(dir, f.name);
    if (f.isDirectory() && !['node_modules', 'dist', '.git', 'scripts'].includes(f.name)) {
      results.push(...walkDir(full));
    } else if (f.isFile() && /\.(jsx?|tsx?)$/.test(f.name)) {
      results.push(full);
    }
  }
  return results;
}

const srcDir = path.join(__dirname, '..', 'src');
const files = walkDir(srcDir);
let updatedCount = 0;

for (const filePath of files) {
  try {
    const original = fs.readFileSync(filePath, 'utf8');
    const { content, changed } = fixFileImports(original);
    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('  Fixed:', path.relative(path.join(__dirname, '..'), filePath));
      updatedCount++;
    }
  } catch (err) {
    console.error('  Error:', filePath, '—', err.message);
  }
}

console.log(`\nDone. ${updatedCount} file(s) updated.`);
