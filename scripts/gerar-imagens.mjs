// Gera as imagens do quarto (design 12.2, 12.3, 12.13.8) a partir dos originais privados em content/fonte/arte/.
// Uso: npm run imagens. Só os derivados (public/img/quarto/ e src/assets/lqip.json) vão para o Git.
// Falha se algum arquivo passar do orçamento; reduz a qualidade em passos até caber.
import { mkdir, readFile, writeFile, stat } from 'node:fs/promises';
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from 'sharp';

const RAIZ = new URL('..', import.meta.url);
const ORIGEM = { dia: 'content/fonte/arte/quarto-dia.jpeg', noite: 'content/fonte/arte/quarto-noite.jpeg' };
const SAIDA = new URL('public/img/quarto/', RAIZ);
const { imagem, heroi, nichos } = JSON.parse(await readFile(new URL('src/config/recortes.json', RAIZ), 'utf8'));
const KB = 1024;
// Orçamentos em bytes (AVIF; WebP = +45%). Cena 12.13.8, herói 720w <= 85 KB, nichos 480w <= 30 KB.
const CENA = { 1280: 100 * KB, 1920: 180 * KB, 2560: 290 * KB };
const HEROI = { 480: 45 * KB, 720: 85 * KB, 1080: 140 * KB };
const NICHO = { 480: 30 * KB, 720: 55 * KB };
const FATOR_WEBP = 1.45;

await mkdir(SAIDA, { recursive: true });
let falhou = false;

async function gravar(nome, base, largura, fmt, orcamento) {
  let q = fmt === 'avif' ? 62 : 80;
  for (;;) {
    const img = base.clone().resize({ width: largura, kernel: 'lanczos3' });
    const buf = await (fmt === 'avif' ? img.avif({ quality: q, effort: 6 }) : img.webp({ quality: q, effort: 6 })).toBuffer();
    const lim = fmt === 'avif' ? orcamento : Math.round(orcamento * FATOR_WEBP);
    if (buf.length <= lim || q <= 30) {
      await writeFile(new URL(`${nome}.${fmt}`, SAIDA), buf);
      const ok = buf.length <= lim;
      if (!ok) falhou = true;
      console.log(`${ok ? 'ok   ' : 'FALHA'} ${nome}.${fmt} ${(buf.length / KB).toFixed(1)} KB (limite ${(lim / KB).toFixed(0)}) q${q}`);
      return;
    }
    q -= 4;
  }
}

const lqip = {};
for (const [tema, arquivo] of Object.entries(ORIGEM)) {
  const caminho = fileURLToPath(new URL(arquivo, RAIZ));
  if (!existsSync(caminho)) throw new Error(`Original ausente: ${arquivo} (fica só local, fora do Git).`);
  // A versão noturna tem 1376x768: é ampliada para a mesma largura da diurna (mesma composição, diferença < 1%).
  const mestre = await sharp(caminho).rotate().resize({ width: imagem.l, height: imagem.a, fit: 'fill', kernel: 'lanczos3' }).toBuffer();
  const base = sharp(mestre);

  for (const [l, orc] of Object.entries(CENA)) for (const fmt of ['avif', 'webp']) await gravar(`${tema}-${l}`, base, Number(l), fmt, orc);

  // Herói 9:16 (recorte vertical)
  const hl = Math.round((imagem.a * 9) / 16);
  const x0 = Math.round((heroi.x0 / 100) * imagem.l);
  const recHeroi = sharp(mestre).extract({ left: x0, top: 0, width: hl, height: imagem.a });
  const heroiBuf = await recHeroi.toBuffer();
  for (const [l, orc] of Object.entries(HEROI)) for (const fmt of ['avif', 'webp']) await gravar(`heroi-${tema}-${l}`, sharp(heroiBuf), Number(l), fmt, orc);

  // Nichos 4:3 em torno de cada objeto
  for (const [id, n] of Object.entries(nichos)) {
    const w = Math.round((n.l / 100) * imagem.l);
    const h = Math.round((w * 3) / 4);
    const left = Math.max(0, Math.min(imagem.l - w, Math.round((n.cx / 100) * imagem.l - w / 2)));
    const top = Math.max(0, Math.min(imagem.a - h, Math.round((n.cy / 100) * imagem.a - h / 2)));
    const rec = await sharp(mestre).extract({ left, top, width: w, height: h }).toBuffer();
    for (const [l, orc] of Object.entries(NICHO)) for (const fmt of ['avif', 'webp']) await gravar(`obj-${id}-${tema}-${l}`, sharp(rec), Number(l), fmt, orc);
  }

  // LQIP (32x18 WebP em base64) da cena e do herói (32x57)
  const miniCena = await sharp(mestre).resize(32, 18).webp({ quality: 40 }).toBuffer();
  const miniHeroi = await sharp(heroiBuf).resize(32, 57).webp({ quality: 40 }).toBuffer();
  lqip[tema] = `data:image/webp;base64,${miniCena.toString('base64')}`;
  lqip[`heroi-${tema}`] = `data:image/webp;base64,${miniHeroi.toString('base64')}`;
  for (const [k, v] of Object.entries(lqip)) if (v.length > 900) console.log(`aviso: LQIP ${k} com ${v.length} caracteres`);
}
await writeFile(new URL('src/assets/lqip.json', RAIZ), JSON.stringify(lqip, null, 1) + '\n');
await stat(SAIDA);
if (falhou) {
  console.error('Algum arquivo passou do orçamento.');
  process.exit(1);
}
