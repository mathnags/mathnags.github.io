/**
 * Texturas de canvas (docs/design.md 13.8.5). Todas decorativas: repetem algo que já está no HTML e nunca são a única
 * fonte de um texto. Desenhadas depois de document.fonts.load() das fontes usadas, com colorSpace sRGB.
 */
import { CanvasTexture, LinearFilter, NoColorSpace, SRGBColorSpace, TextureLoader, type Texture } from 'three';
import { comBase } from '../lib/url';
import { mulberry32 } from './geo';
import { P, css } from './paleta';

const nova = (l: number, a: number) => {
  const c = document.createElement('canvas');
  c.width = l;
  c.height = a;
  const ctx = c.getContext('2d')!;
  const t = new CanvasTexture(c);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return { c, ctx, t };
};

const familia = (nome: string, padrao: string) => getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || padrao;
export const fonteMono = () => familia('--font-mono', 'ui-monospace, monospace');

/** Espera as fontes do canvas (com limite: nunca trava a montagem da cena). */
export async function carregarFontes() {
  const mono = fonteMono();
  const espera = Promise.all([document.fonts.load(`500 28px ${mono}`), document.fonts.ready]);
  await Promise.race([espera, new Promise((r) => setTimeout(r, 1500))]);
}

/* ---------- Céu e cidade: silhueta original de prédios (768×576, desenhada em 512×384 lógicos), dia e noite ---------- */
const K = 1.5;
interface Predio { x: number; w: number; h: number; perto: boolean }
interface JanelaCidade { x: number; y: number; limiar: number; perto: boolean }
let cidadeCache: { predios: Predio[]; janelas: JanelaCidade[] } | null = null;

/** Mesma cidade nas duas texturas (semente fixa): camada de longe, camada de perto, uma torre com antena e as janelas. */
function cidade() {
  if (cidadeCache) return cidadeCache;
  const rnd = mulberry32(11);
  const predios: Predio[] = [];
  for (const [perto, hMin, hMax, wMin, wMax] of [[false, 90, 220, 26, 48], [true, 110, 250, 34, 62]] as const) {
    for (let x = -8; x < 512; ) {
      const w = wMin + rnd() * (wMax - wMin);
      predios.push({ x, w, h: hMin + rnd() * (hMax - hMin), perto });
      x += w + (perto ? 2 : -4);
    }
  }
  predios.push({ x: 318, w: 24, h: 290, perto: true });
  const janelas: JanelaCidade[] = [];
  for (const p of predios)
    for (let y = 384 - p.h + 10; y < 378; y += 14)
      for (let x = p.x + 5; x + 6 < p.x + p.w; x += 10) if (rnd() < (p.perto ? 0.5 : 0.35)) janelas.push({ x, y, limiar: 0.05 + rnd() * 0.95, perto: p.perto });
  cidadeCache = { predios, janelas };
  return cidadeCache;
}

export function texturaCeu(escuro: boolean) {
  const { ctx, t } = nova(768, 576);
  ctx.scale(K, K);
  const g = ctx.createLinearGradient(0, 0, 0, 384);
  g.addColorStop(0, escuro ? '#070D24' : '#9CCBE0');
  g.addColorStop(1, escuro ? '#1B2A57' : '#DCEEF2');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 384);
  const rnd = mulberry32(5);
  if (escuro) {
    ctx.fillStyle = 'rgba(255,253,247,0.8)';
    for (let i = 0; i < 40; i++) ctx.fillRect(rnd() * 512, rnd() * 190, 1.4, 1.4);
    ctx.fillStyle = '#F2E8C9';
    ctx.beginPath();
    ctx.arc(250, 90, 13, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (const [x, y, r] of [[170, 90, 26], [200, 98, 20], [330, 140, 24], [358, 148, 18]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, r * 1.6, r * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const { predios, janelas } = cidade();
  for (const perto of [false, true]) {
    ctx.fillStyle = escuro ? (perto ? '#1A2440' : '#141D38') : perto ? '#9FB3BF' : '#B7C8D1';
    for (const p of predios) if (p.perto === perto) ctx.fillRect(p.x, 384 - p.h, p.w, p.h);
  }
  // Topos: antena da torre e caixas d'água; no dia, as janelas aparecem como vidros mais escuros.
  ctx.fillStyle = escuro ? '#1A2440' : '#9FB3BF';
  ctx.fillRect(329, 384 - 290 - 46, 2, 46);
  ctx.fillRect(322, 384 - 290 - 8, 16, 8);
  predios.filter((p, i) => p.perto && i % 4 === 1).forEach((p) => ctx.fillRect(p.x + p.w / 2 - 5, 384 - p.h - 7, 10, 7));
  if (!escuro) {
    ctx.fillStyle = 'rgba(70,100,120,0.35)';
    for (const j of janelas) if (j.perto) ctx.fillRect(j.x, j.y, 6, 8);
  }
  return t;
}

/** Janelas acesas da noite: o canal vermelho guarda o instante (0..1) em que cada uma acende (shader em decoracao.ts). */
export function texturaJanelasCidade() {
  const { ctx, t } = nova(768, 576);
  ctx.scale(K, K);
  for (const j of cidade().janelas) {
    const v = Math.round(j.limiar * 255);
    ctx.fillStyle = `rgb(${v},${v},${v})`;
    ctx.fillRect(j.x, j.y, 6, 8);
  }
  t.colorSpace = NoColorSpace;
  t.generateMipmaps = false;
  t.minFilter = LinearFilter;
  return t;
}

/** Vapor da caneca: mancha branca suave (o sprite pinta a cor). */
export function texturaFumaca() {
  const { ctx, t } = nova(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return t;
}

/** Rótulo do relógio (hover): pílula escura com o texto em fonte comum. */
export function texturaRotulo() {
  const { c, ctx, t } = nova(512, 128);
  const mono = fonteMono();
  let atual = '';
  return {
    textura: t,
    desenhar(texto: string) {
      if (texto === atual) return;
      atual = texto;
      ctx.clearRect(0, 0, 512, 128);
      ctx.fillStyle = 'rgba(43,47,56,0.92)';
      ctx.beginPath();
      ctx.roundRect(4, 16, c.width - 8, 96, 48);
      ctx.fill();
      ctx.fillStyle = css(P.papel);
      ctx.font = `600 50px ${mono}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(texto, 256, 66);
      t.needsUpdate = true;
    },
  };
}

/* ---------- Tela do monitor: a linha da carreira que dobra em 2026 (assinatura, design 6) ---------- */
// Mesmo traçado do SVG de fundo do SO (Vertice.astro, viewBox 200×80): cinza até 2026, laranja depois do vértice.
const ATE_2026 = 'M8 62H64L94 62';
const DEPOIS = 'M94 62L126 22H192';
const COMPRIMENTO_DEPOIS = 51.2 + 66;

export interface TelaMonitor {
  textura: CanvasTexture;
  /** progresso: 0..1 do trecho laranja (1 = completo). */
  desenhar(escuro: boolean, progresso?: number): void;
}

export function criarTelaMonitor(leve: boolean): TelaMonitor {
  const L = leve ? 768 : 1024;
  const A = leve ? 432 : 576;
  const { ctx, t } = nova(L, A);
  const esc = L / 1024;
  const ate = new Path2D(ATE_2026);
  const depois = new Path2D(DEPOIS);
  const mono = fonteMono();
  const desenhar = (escuro: boolean, progresso = 1) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = escuro ? '#10241F' : '#F2F6F4';
    ctx.fillRect(0, 0, L, A);
    ctx.fillStyle = escuro ? '#2E3240' : '#D6D2C6';
    const passo = 32 * esc;
    for (let y = passo / 2; y < A; y += passo) for (let x = passo / 2; x < L; x += passo) ctx.fillRect(x - 0.75 * esc, y - 0.75 * esc, 1.5 * esc, 1.5 * esc);
    const cinza = escuro ? '#A3A6AE' : '#4F545C';
    const laranja = escuro ? '#FF8A4C' : '#B8400F';
    ctx.setTransform(4.6 * esc, 0, 0, 4.6 * esc, 52 * esc, 70 * esc);
    ctx.lineWidth = 6 / 4.6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = cinza;
    ctx.stroke(ate);
    if (progresso > 0) {
      ctx.strokeStyle = laranja;
      ctx.setLineDash([COMPRIMENTO_DEPOIS * progresso, COMPRIMENTO_DEPOIS * 2]);
      ctx.stroke(depois);
      ctx.setLineDash([]);
    }
    ctx.setTransform(esc, 0, 0, esc, 0, 0);
    ctx.font = `500 28px ${mono}`;
    ctx.textAlign = 'center';
    ctx.fillStyle = cinza;
    ctx.fillText('2026', 52 + 94 * 4.6, 70 + 62 * 4.6 + 46);
    ctx.fillStyle = laranja;
    ctx.fillText('IA', 52 + 192 * 4.6 - 6, 70 + 22 * 4.6 - 26);
    t.needsUpdate = true;
  };
  desenhar(false);
  return { textura: t, desenhar };
}

/* ---------- Quadro: "A Grande Onda de Kanagawa", Hokusai, 1831 (domínio público, Wikimedia Commons; docs/design.md 14) ---------- */
/** Proporção do arquivo public/img/kanagawa.jpg (512 × 350). */
export const RAZAO_KANAGAWA = 512 / 350;

/** Único arquivo de imagem da cena. Falhou ou demorou (4 s): devolve null e o quadro fica em papel liso. */
export function carregarKanagawa(): Promise<Texture | null> {
  return new Promise((resolve) => {
    const fim = setTimeout(() => resolve(null), 4000);
    new TextureLoader().load(
      comBase('img/kanagawa.jpg'),
      (t) => {
        clearTimeout(fim);
        t.colorSpace = SRGBColorSpace;
        t.anisotropy = 4;
        resolve(t);
      },
      undefined,
      () => {
        clearTimeout(fim);
        resolve(null);
      },
    );
  });
}

/* ---------- Tela do monitor vertical: linhas de código abstratas (sem texto legível) ---------- */
export function texturaTelaVertical() {
  const { ctx, t } = nova(224, 400);
  ctx.fillStyle = '#12171d';
  ctx.fillRect(0, 0, 224, 400);
  const rnd = mulberry32(21);
  const cores = ['#6fb7a5', '#e08a4c', '#8e96a3', '#c9ccd0', '#7aa2d6'];
  ctx.fillStyle = '#1b222b';
  ctx.fillRect(0, 0, 22, 400);
  let recuo = 0;
  for (let y = 14; y < 392; y += 15) {
    recuo = Math.max(0, Math.min(3, recuo + Math.floor(rnd() * 3) - 1));
    let x = 32 + recuo * 14;
    const n = 1 + Math.floor(rnd() * 3);
    for (let k = 0; k < n; k++) {
      const w = 14 + rnd() * 52;
      ctx.fillStyle = cores[Math.floor(rnd() * cores.length)];
      ctx.globalAlpha = 0.85;
      ctx.fillRect(x, y, Math.min(w, 214 - x), 6);
      x += w + 6;
      if (x > 200) break;
    }
  }
  ctx.globalAlpha = 1;
  return t;
}

/* ---------- Folha de monstera: recortes com alpha; o tom verde vem da cor do material (aqui só luz e sombra) ---------- */
export function texturaFolha() {
  const { ctx, t } = nova(128, 128);
  const g = ctx.createLinearGradient(0, 0, 0, 128);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#cfcfcf');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(64, 112);
  ctx.bezierCurveTo(40, 128, 2, 104, 6, 64);
  ctx.bezierCurveTo(10, 26, 40, 6, 64, 4);
  ctx.bezierCurveTo(88, 6, 118, 26, 122, 64);
  ctx.bezierCurveTo(126, 104, 88, 128, 64, 112);
  ctx.fill();
  // Nervuras (só no que existe) e depois as fendas e os furos, que apagam o alfa.
  ctx.globalCompositeOperation = 'source-atop';
  ctx.strokeStyle = '#8f8f8f';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(64, 112);
  ctx.lineTo(64, 8);
  for (const y of [34, 56, 80]) for (const lado of [-1, 1]) {
    ctx.moveTo(64, y + 14);
    ctx.lineTo(64 + lado * 52, y - 6);
  }
  ctx.stroke();
  ctx.globalCompositeOperation = 'destination-out';
  for (const lado of [-1, 1])
    for (const y of [26, 48, 72, 96]) {
      ctx.beginPath();
      ctx.moveTo(64 + lado * 70, y - 3);
      ctx.lineTo(64 + lado * 22, y + 9);
      ctx.lineTo(64 + lado * 70, y + 6);
      ctx.fill();
    }
  for (const [x, y] of [[44, 66], [84, 66], [48, 40], [80, 40]]) {
    ctx.beginPath();
    ctx.ellipse(x, y, 3.5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  return t;
}

/* ---------- Páginas do caderno: pauta e esboço de 5 barras (sem números) ---------- */
export function texturaCaderno() {
  const { ctx, t } = nova(512, 320);
  ctx.fillStyle = css(P.papel);
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = '#D6D2C6';
  for (let y = 20; y < 320; y += 20) ctx.fillRect(0, y, 512, 1.5);
  ctx.strokeStyle = '#4F545C';
  ctx.lineWidth = 2;
  [60, 100, 140, 190, 240].forEach((h, i) => ctx.strokeRect(290 + i * 40, 290 - h, 28, h));
  return t;
}

/* ---------- Lombadas dos estojos (atlas 1024×128, 8 faixas; nomes em fonte comum, sem logo; faixas sem nome são lisas) ---------- */
export const NOMES_LOMBADAS = ['VALORANT', 'Counter-Strike', 'Resident Evil 4', 'Call of Duty', 'Spider-Man', '', '', ''];
const FUNDOS_LOMBADAS = [P.papel, P.metal, P.papel, P.azul, P.vermelho, P.tecido, P.papel, P.metal];

export function texturaLombadas() {
  const { ctx, t } = nova(1024, 128);
  const larg = 1024 / NOMES_LOMBADAS.length;
  const mono = fonteMono();
  NOMES_LOMBADAS.forEach((nome, i) => {
    const claro = FUNDOS_LOMBADAS[i] === P.papel;
    ctx.fillStyle = css(FUNDOS_LOMBADAS[i]);
    ctx.fillRect(i * larg, 0, larg, 128);
    if (!nome) return;
    ctx.save();
    ctx.translate(i * larg + larg / 2, 64);
    ctx.rotate(-Math.PI / 2);
    // Estojo de 14 mm × 190 mm: o texto é esticado em y para voltar à proporção na lombada.
    ctx.scale(1, 13.5);
    ctx.font = `500 7px ${mono}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = claro ? '#15171C' : '#FFFDF7';
    ctx.fillText(nome, 0, 0);
    ctx.restore();
  });
  return t;
}

/* ---------- Sombra de contato (nível leve): gradiente radial compartilhado ---------- */
export function texturaSombraContato() {
  const { ctx, t } = nova(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(21,23,28,0.18)');
  g.addColorStop(1, 'rgba(21,23,28,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return t;
}

/* ---------- Bola de vôlei: 6 grupos de 3 gomos (azul, branco, amarelo), mapa equirretangular ---------- */
export function texturaBola() {
  const L = 512, A = 256;
  const { ctx, t } = nova(L, A);
  const img = ctx.createImageData(L, A);
  const cores = [[31, 95, 191], [255, 253, 247], [242, 194, 48]];
  for (let j = 0; j < A; j++)
    for (let i = 0; i < L; i++) {
      const lon = (i / L) * Math.PI * 2, lat = (j / A) * Math.PI;
      const v = [Math.sin(lat) * Math.cos(lon), Math.cos(lat), Math.sin(lat) * Math.sin(lon)];
      const ab = v.map(Math.abs);
      const f = ab.indexOf(Math.max(...ab));
      // Gomos de faces vizinhas ficam perpendiculares (x usa y, y usa z, z usa x), como numa bola real.
      const s = v[(f + 1) % 3] / ab[f];
      const pos = ((s + 1) / 2) * 3;
      const faixa = Math.min(2, Math.floor(pos));
      const cor = cores[(faixa + f + (v[f] < 0 ? 1 : 0)) % 3];
      const costura = Math.abs(pos - Math.round(pos)) < 0.05 && pos > 0.1 && pos < 2.9 ? 0.55 : 1;
      const k = (j * L + i) * 4;
      img.data[k] = cor[0] * costura;
      img.data[k + 1] = cor[1] * costura;
      img.data[k + 2] = cor[2] * costura;
      img.data[k + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return t;
}

/* ---------- Anel RGB das ventoinhas (256×256, matiz em volta do eixo, alfa radial): girar a textura = ciclo de cor ---------- */
export function texturaAnelRgb() {
  const { ctx, t } = nova(256, 256);
  const N = 72;
  for (let i = 0; i < N; i++) {
    ctx.beginPath();
    ctx.moveTo(128, 128);
    ctx.arc(128, 128, 128, ((i - 0.5) / N) * 2 * Math.PI, ((i + 1.5) / N) * 2 * Math.PI);
    ctx.fillStyle = `hsl(${(i / N) * 360} 95% 62%)`;
    ctx.fill();
  }
  // Só o aro e um halo suave para dentro: o resto fica transparente.
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [p, a] of [[0.2, 0], [0.5, 0.3], [0.8, 0.55], [0.86, 1], [0.95, 1], [1, 0]] as const) g.addColorStop(p, `rgba(0,0,0,${a})`);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  t.center.set(0.5, 0.5);
  return t;
}
