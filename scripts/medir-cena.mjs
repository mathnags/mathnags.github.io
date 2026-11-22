// Orçamento da build (design 13.10): chunk da cena, módulo principal, script do <head>, HTML, CSS, fontes e imagens (0 bytes
// de imagem da cena). Roda depois da build (npm run verify) e derruba o CI se algo passar do limite.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const KB = 1024;
let falhou = false;
const relatar = (ok, texto) => {
  console.log(`${ok ? 'ok   ' : 'FALHA'} ${texto}`);
  if (!ok) falhou = true;
};
const gz = (conteudo) => gzipSync(conteudo).length / KB;

const dist = 'dist';
const astro = join(dist, '_astro');
const arquivos = readdirSync(astro);
const js = arquivos.filter((f) => f.endsWith('.js')).map((f) => ({ f, texto: readFileSync(join(astro, f), 'utf8') }));

// Chunk da cena: o que traz o `three` (WebGLRenderer) + addons + src/cena/**. Meta ≤ 190 KB, orçamento ≤ 250 KB.
const cena = js.filter((x) => x.texto.includes('WebGLRenderer') || x.texto.includes('CSS3D'));
relatar(cena.length > 0, 'chunk da cena encontrado em dist/_astro');
const cenaGz = cena.reduce((t, x) => t + gz(x.texto), 0);
relatar(cenaGz <= 250, `chunk da cena: ${cenaGz.toFixed(1)} KB gzip (limite 250, meta 190)`);

// Módulo principal: tudo o que NÃO é o chunk da cena, mais o que estiver inline no HTML (scripts de módulo pequenos).
const principal = js.filter((x) => !cena.includes(x)).reduce((t, x) => t + gz(x.texto), 0);
const paginas = ['dist/index.html', 'dist/en/index.html'];
for (const pagina of paginas) {
  const html = readFileSync(pagina, 'utf8');
  const tam = gz(html);
  relatar(tam <= 45, `${pagina}: ${tam.toFixed(1)} KB gzip (limite 45)`);

  // O `three` nunca pode estar referenciado direto no HTML: só entra por import() dinâmico.
  const modulos = [...html.matchAll(/<script[^>]*type="module"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
  relatar(!/WebGLRenderer/.test(html) && !modulos.includes('three'), `${pagina}: o three não está no HTML nem no módulo inline`);

  // Script do <head> (≤ 1,5 KB): o primeiro <script> inline, antes do <title>.
  const cabeca = html.match(/<head>[\s\S]*?<script>([\s\S]*?)<\/script>/)?.[1] ?? '';
  relatar(cabeca.length > 0 && gz(cabeca) <= 1.5, `${pagina}: script do <head> ${gz(cabeca).toFixed(2)} KB gzip (limite 1,5)`);

  const imgs = [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
  relatar(imgs.every((i) => /\balt=/.test(i) && /\bwidth=/.test(i) && /\bheight=/.test(i)), `${pagina}: ${imgs.length} <img> com alt, width e height`);
  relatar(!html.includes('<picture'), `${pagina}: sem <picture> (a cena não usa imagem)`);
  relatar(/<canvas[^>]*aria-hidden="true"/.test(html), `${pagina}: <canvas> decorativo com aria-hidden`);
}
relatar(principal <= 14, `módulo principal (sem a cena): ${principal.toFixed(1)} KB gzip (limite 14)`);

// CSS ≤ 24 KB gzip
const css = arquivos.filter((f) => f.endsWith('.css')).reduce((t, f) => t + gz(readFileSync(join(astro, f))), 0);
relatar(css <= 24, `CSS: ${css.toFixed(1)} KB gzip (limite 24)`);

// Fontes ≤ 130 KB
const fontes = existsSync(join(astro, 'fonts')) ? readdirSync(join(astro, 'fonts')) : arquivos.filter((f) => /\.(woff2?|ttf)$/.test(f));
const dirFontes = existsSync(join(astro, 'fonts')) ? join(astro, 'fonts') : astro;
const kbFontes = fontes.reduce((t, f) => t + statSync(join(dirFontes, f)).size, 0) / KB;
// 1ª visita = só o subset latin de cada família (os demais vêm por unicode-range, sob demanda). Mede no @font-face do HTML.
const faces = [...readFileSync('dist/index.html', 'utf8').matchAll(/@font-face\{[^}]*?\/_astro\/fonts\/(\w+\.woff2)[^}]*?unicode-range:([^;]+);/g)];
const latin = new Set(faces.filter((m) => m[2].startsWith('U+0000-00FF')).map((m) => m[1]));
const kbLatin = [...latin].reduce((t, f) => t + statSync(join(dirFontes, f)).size, 0) / KB;
relatar(latin.size > 0 && kbLatin <= 130, `fontes na 1ª visita (subsets latin, ${latin.size} arquivos): ${kbLatin.toFixed(1)} KB (limite 130)`);
console.log(`info  fontes: ${kbFontes.toFixed(1)} KB somando todos os subsets (latin-ext só baixa sob demanda)`);

// Imagens da cena: 0 bytes. Só o favicon e o og.png (compartilhamento) existem como arquivos estáticos.
relatar(!existsSync(join(dist, 'img')), 'sem imagens da cena (dist/img não existe)');
const rasters = readdirSync(dist).filter((f) => /\.(png|jpe?g|webp|avif|gif)$/.test(f));
relatar(rasters.every((f) => f === 'og.png'), `imagens estáticas: ${rasters.join(', ') || 'nenhuma'}`);
if (existsSync(join(dist, 'og.png'))) relatar(statSync(join(dist, 'og.png')).size / KB <= 150, 'og.png ≤ 150 KB');

if (falhou) process.exit(1);
