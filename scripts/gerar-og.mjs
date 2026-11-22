// Gera public/og.png (1200x630, ≤150 KB): captura do quarto 3D + nome e "Aberto a oportunidades".
// A captura (scripts/og-cena.png) vem de `npm run dev` + http://localhost:4321/?modo=quarto&calibrar=og (1200×630, tema claro).
// Depois de recapturar, rode: node scripts/gerar-og.mjs
import sharp from 'sharp';

const W = 780;
const H = 595;
// Máscaras de alfa (dest-in) que esmaecem as bordas esquerda, superior e inferior da captura (some a barra de controles e o degradê).
const mascara = (x2, y2, de, ate, a1, a2) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><linearGradient id="g" x1="0" y1="0" x2="${x2}" y2="${y2}">` +
      `<stop offset="${de}" stop-color="#fff" stop-opacity="${a1}"/><stop offset="${ate}" stop-color="#fff" stop-opacity="${a2}"/></linearGradient></defs>` +
      `<rect width="${W}" height="${H}" fill="url(#g)"/></svg>`,
  );
const bordas = [mascara(1, 0, 0, 0.18, 0, 1), mascara(0, 1, 0, 0.08, 0, 1), mascara(0, 1, 0.88, 1, 1, 0)];

let quarto = await sharp('scripts/og-cena.png').extract({ left: 140, top: 0, width: W, height: H }).png().toBuffer();
for (const m of bordas) quarto = await sharp(quarto).composite([{ input: m, blend: 'dest-in' }]).png().toBuffer();

const fonte = 'font-family="Arial, Helvetica, sans-serif" font-weight="700"';
const texto = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <text x="70" y="255" ${fonte} font-size="64" fill="#15171c">Matheus Maki</text>
  <text x="70" y="330" ${fonte} font-size="64" fill="#15171c">Nagano</text>
  <text x="70" y="405" ${fonte} font-size="38" fill="#b8400f">Aberto a oportunidades</text>
</svg>`;

await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#f5f2eb' } })
  .composite([{ input: quarto, left: 440, top: 25 }, { input: Buffer.from(texto), left: 0, top: 0 }])
  .png({ palette: true, quality: 90, effort: 10, colours: 128 })
  .toFile('public/og.png');
