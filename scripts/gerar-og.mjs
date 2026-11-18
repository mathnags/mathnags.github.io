// Gera public/og.png (1200x630) a partir de um SVG próprio. Rodar: node scripts/gerar-og.mjs
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#efe9dc"/>
  <rect y="500" width="1200" height="130" fill="#c9b79a"/>
  <rect y="494" width="1200" height="8" fill="#e2daca"/>
  <g transform="translate(700 120) scale(1.7)">
    <rect x="108" y="222" width="64" height="12" rx="4" fill="#2b2f38"/>
    <rect x="130" y="196" width="20" height="30" fill="#2b2f38"/>
    <rect x="100" y="238" width="80" height="12" rx="5" fill="#2b2f38"/>
    <rect width="280" height="206" rx="14" fill="#2b2f38"/>
    <rect x="14" y="12" width="252" height="158" rx="4" fill="#f2f6f4"/>
    <path d="M36 120H183" fill="none" stroke="#4f545c" stroke-width="4" stroke-linecap="round"/>
    <circle cx="36" cy="120" r="6" fill="#4f545c"/><circle cx="57" cy="120" r="6" fill="#4f545c"/>
    <circle cx="78" cy="120" r="6" fill="#4f545c"/><circle cx="120" cy="120" r="6" fill="#4f545c"/>
    <path d="M183 120L238 62" fill="none" stroke="#b8400f" stroke-width="5" stroke-linecap="round"/>
    <path d="M183 106l14 14-14 14-14-14z" fill="#b8400f"/>
    <circle cx="244" cy="54" r="10" fill="none" stroke="#1e6b5a" stroke-width="4"/>
  </g>
  <text x="70" y="270" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="72" fill="#15171c">Matheus Maki</text>
  <text x="70" y="352" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="72" fill="#15171c">Nagano</text>
  <text x="70" y="430" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="44" fill="#b8400f">Dados → IA</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
