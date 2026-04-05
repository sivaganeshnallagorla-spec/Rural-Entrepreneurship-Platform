/**
 * fix-mangled-lines.cjs
 * Finds any line where a closing quote from an import is immediately
 * followed by a JS keyword (const, let, var, function, export, class, etc.)
 * without a newline, and inserts one.
 */
const fs = require('fs');
const path = require('path');

const KEYWORDS = /^(const |let |var |function |export |class |\/\/|\/\*|if |return |switch |for |while |try |async )/;

function fixMangled(content) {
  const lines = content.split('\n');
  const out = [];
  let changed = false;

  for (const line of lines) {
    // Pattern: ...from '@mui/...'const ...  OR  ...from '@mui/...'export ...
    // More generally: any line ending with a quoted import that has code glued on
    const match = line.match(/^(.*from\s+['"][^'"]+['"])\s*(const |let |var |function |export |class |\/\/|\/\*|if |return |switch |for |while |try |async )/);
    if (match) {
      out.push(match[1]);
      out.push('');
      out.push(match[2] + line.slice(match[0].length));
      changed = true;
      continue;
    }

    // Also catch: import Foo from '...'import Bar  (already handled by v2 but just in case)
    const match2 = line.match(/^(.*from\s+['"][^'"]+['"])\s*(import )/);
    if (match2) {
      out.push(match2[1]);
      out.push(match2[2] + line.slice(match2[0].length));
      changed = true;
      continue;
    }

    out.push(line);
  }

  return { content: out.join('\n'), changed };
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
let count = 0;

for (const fp of files) {
  const orig = fs.readFileSync(fp, 'utf8');
  const { content, changed } = fixMangled(orig);
  if (changed) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('  Fixed:', path.relative(path.join(__dirname, '..'), fp));
    count++;
  }
}

console.log(`\nDone. ${count} file(s) repaired.`);
