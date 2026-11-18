// Orçamento da build (design 12.9 e 12.13.8): imagens do quarto, HTML, CSS e JS. Roda depois da build (npm run verify).
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;
let falhou = false;
const relatar = (ok, texto) => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${texto}`);
  if (!ok) falhou = true;
};

// Imagens: cena AVIF (100/180/290 KB; WebP +45%), herói 720w ≤ 85 KB, nichos ≤ 55 KB.
const AVIF = { 'dia-1280': 100, 'dia-1920': 180, 'dia-2560': 290, 'noite-1280': 100, 'noite-1920': 180, 'noite-2560': 290, 'heroi-dia-720': 85, 'heroi-noite-720': 85 };
const dir = 'dist/img/quarto';
const arquivos = readdirSync(dir);
relatar(arquivos.length >= 80, `${arquivos.length} imagens do quarto em ${dir}`);
for (const f of arquivos) {
  const kb = statSync(join(dir, f)).size / KB;
  const [base, ext] = [f.replace(/\.(avif|webp)$/, ''), f.split('.').pop()];
  const lim = base.startsWith('obj-') ? 55 : (AVIF[base] ?? (base.startsWith('heroi-') ? 140 : 290));
  const limite = ext === 'webp' ? lim * 1.45 : lim;
  if (kb > limite) relatar(false, `${f}: ${kb.toFixed(1)} KB (limite ${limite.toFixed(0)})`);
}

for (const pagina of ['dist/index.html', 'dist/en/index.html']) {
  const html = readFileSync(pagina, 'utf8');
  const gz = gzipSync(html).length / KB;
  relatar(gz <= 45, `${pagina}: ${gz.toFixed(1)} KB gzip (limite 45)`);
  relatar(!html.includes('<svg class="cena"'), `${pagina}: sem cena em SVG`);
  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  relatar(imgs.every((i) => /\balt=/.test(i) && /\bwidth=/.test(i) && /\bheight=/.test(i)), `${pagina}: ${imgs.length} <img> com alt, width e height`);
}

// CSS ≤ 24 KB gzip e JS do módulo ≤ 13 KB gzip (12.13.8)
const assets = readdirSync('dist/_astro');
const soma = (ext) => assets.filter((f) => f.endsWith(ext)).reduce((t, f) => t + gzipSync(readFileSync(join('dist/_astro', f))).length, 0) / KB;
relatar(soma('.css') <= 24, `CSS: ${soma('.css').toFixed(1)} KB gzip (limite 24)`);
relatar(soma('.js') <= 13, `JS: ${soma('.js').toFixed(1)} KB gzip (limite 13)`);

if (falhou) process.exit(1);
