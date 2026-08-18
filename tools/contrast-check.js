import fs from 'fs/promises';
import path from 'path';

const root = path.resolve('.');
const srcDir = path.join(root, 'src');
const cssPath = path.join(root, 'src', 'index.css');

async function readCSSColors() {
  try {
    const css = await fs.readFile(cssPath, 'utf8');
    const map = {};
    // simple regex for .text-slate-300 { color: #xxxxxx; }
    const re = /\.([\w-]+)\s*\{[^}]*color:\s*([^;\n]+);/g;
    let m;
    while ((m = re.exec(css))) {
      map[m[1]] = m[2].trim();
    }
    return map;
  } catch (e) {
    return {};
  }
}

async function walk(dir, filelist = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const ent of entries) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules' || ent.name === '.git') continue;
      await walk(p, filelist);
    } else if (/\.(ts|tsx|js|jsx)$/i.test(ent.name)) {
      filelist.push(p);
    }
  }
  return filelist;
}

function getLineNumbers(text, index) {
  const lines = text.slice(0, index).split('\n');
  return lines.length;
}

(async function main(){
  const colorMap = await readCSSColors();
  const files = await walk(srcDir);
  const findings = [];

  const lowContrastClasses = ['text-slate-300', 'text-slate-400'];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    for (const cls of lowContrastClasses) {
      const re = new RegExp(cls, 'g');
      let m;
      while ((m = re.exec(content))) {
        const line = getLineNumbers(content, m.index);
        // get a small context snippet
        const snippetStart = Math.max(0, m.index - 80);
        const snippetEnd = Math.min(content.length, m.index + 80);
        const snippet = content.slice(snippetStart, snippetEnd).replace(/\n/g, ' ');
        findings.push({ file: path.relative(root, file), line, class: cls, suggestion: 'text-slate-500', snippet, color: colorMap[cls.replace(/\./, '')] || null });
      }
    }
  }

  const out = { generatedAt: new Date().toISOString(), findings };
  await fs.mkdir(path.join(root, 'tools', 'reports'), { recursive: true });
  await fs.writeFile(path.join(root, 'tools', 'reports', 'contrast-findings.json'), JSON.stringify(out, null, 2), 'utf8');

  // also generate a human-readable md
  const md = [];
  md.push('# Contrast Check Findings');
  md.push(`Generated: ${out.generatedAt}`);
  md.push('');
  if (!findings.length) md.push('No low-contrast utility-class occurrences found for the scanned tokens.');
  else {
    md.push('| File | Line | Class | Suggestion | Context |');
    md.push('|---|---:|---|---|---|');
    for (const f of findings) {
      md.push(`| ${f.file} | ${f.line} | ${f.class} | ${f.suggestion} | ${f.snippet.replace(/\|/g, '\\|')} |`);
    }
  }
  await fs.writeFile(path.join(root, 'tools', 'reports', 'contrast-findings.md'), md.join('\n'), 'utf8');

  console.log('Contrast check complete — results in tools/reports/contrast-findings.json and .md');
})();
