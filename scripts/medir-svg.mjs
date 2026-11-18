// Orçamento do SVG do quarto (design 11.5): <= 11 KB gzip e <= 450 elementos. Roda depois da build (npm run verify).
import { readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';

const LIMITE_GZ = 11 * 1024;
const LIMITE_ELEMENTOS = 450;
let falhou = false;

for (const pagina of ['dist/index.html', 'dist/en/index.html']) {
  const html = readFileSync(pagina, 'utf8');
  const ini = html.indexOf('<svg class="cena"');
  if (ini < 0) throw new Error(`${pagina}: SVG do quarto não encontrado`);
  let prof = 0;
  let fim = -1;
  for (const m of html.slice(ini).matchAll(/<svg\b|<\/svg>/g)) {
    prof += m[0] === '</svg>' ? -1 : 1;
    if (prof === 0) {
      fim = ini + m.index + m[0].length;
      break;
    }
  }
  const svg = html.slice(ini, fim);
  const gz = gzipSync(svg).length;
  const elementos = (svg.match(/<[a-z]/g) ?? []).length;
  const ok = gz <= LIMITE_GZ && elementos <= LIMITE_ELEMENTOS;
  console.log(`${ok ? 'ok ' : 'FALHA'} ${pagina}: SVG do quarto ${(gz / 1024).toFixed(1)} KB gzip (limite 11), ${elementos} elementos (limite ${LIMITE_ELEMENTOS})`);
  if (!ok) falhou = true;
}
if (falhou) process.exit(1);
