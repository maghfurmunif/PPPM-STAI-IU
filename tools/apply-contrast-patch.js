import fs from 'fs/promises';
import path from 'path';

const root = path.resolve('.');
const src = path.join(root, 'src');
const targets = ['text-slate-300', 'text-slate-400'];
const replacement = 'text-slate-500';

async function walk(dir) {
  const out = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git') continue;
      out.push(...await walk(p));
    } else if (/\.(ts|tsx|js|jsx)$/i.test(e.name)) out.push(p);
  }
  return out;
}

(async function main(){
  const files = await walk(src);
  let changed = 0;
  for (const f of files) {
    let content = await fs.readFile(f, 'utf8');
    let newContent = content;
    for (const t of targets) newContent = newContent.split(t).join(replacement);
    if (newContent !== content) {
      await fs.writeFile(f, newContent, 'utf8');
      changed++;
      console.log('Patched:', path.relative(root, f));
    }
  }
  console.log(`Done. Files changed: ${changed}`);
})();
