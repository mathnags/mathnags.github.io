/**
 * Texturas de canvas (docs/design.md 13.8.5). Todas decorativas: repetem algo que já está no HTML e nunca são a única
 * fonte de um texto. Desenhadas depois de document.fonts.load() das fontes usadas, com colorSpace sRGB.
 */
import { CanvasTexture, SRGBColorSpace } from 'three';
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

/* ---------- Céu e cidade (512×384, dia e noite) ---------- */
const PREDIOS: [number, number, number][] = [
  [0, 210, 46], [44, 160, 52], [94, 230, 40], [132, 180, 60], [190, 140, 48], [236, 250, 56], [290, 190, 44], [332, 150, 70], [400, 220, 112],
];
const JANELAS_NOITE: [number, number][] = [
  [12, 240], [24, 270], [60, 200], [76, 250], [108, 270], [150, 230], [168, 280], [208, 190], [250, 290], [304, 240], [350, 200], [372, 270], [430, 260], [470, 300],
];

export function texturaCeu(escuro: boolean) {
  const { ctx, t } = nova(512, 384);
  ctx.fillStyle = escuro ? '#0B1430' : '#BFDDE8';
  ctx.fillRect(0, 0, 512, 384);
  ctx.fillStyle = escuro ? '#1A2440' : '#9FB3BF';
  for (const [x, a, l] of PREDIOS) ctx.fillRect(x, 384 - a, l, a);
  if (escuro) {
    ctx.fillStyle = '#FFD27A';
    for (const [x, y] of JANELAS_NOITE) ctx.fillRect(x, y, 6, 8);
    ctx.fillStyle = '#F2E8C9';
    ctx.beginPath();
    ctx.arc(400, 70, 13, 0, Math.PI * 2);
    ctx.fill();
  }
  return t;
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

/* ---------- Pôster (aceno original, sem figura, máscara, logo ou texto) ---------- */
export function texturaPoster() {
  const { ctx, t } = nova(256, 352);
  ctx.fillStyle = css(P.vermelho);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(256, 0);
  ctx.lineTo(0, 352);
  ctx.fill();
  ctx.fillStyle = css(P.azul);
  ctx.beginPath();
  ctx.moveTo(256, 0);
  ctx.lineTo(256, 352);
  ctx.lineTo(0, 352);
  ctx.fill();
  // Teia geométrica original: 7 raios retos a partir do canto inferior esquerdo + 4 anéis poligonais concêntricos.
  ctx.strokeStyle = 'rgba(255,253,247,0.55)';
  ctx.lineWidth = 2;
  const raios = Array.from({ length: 7 }, (_, i) => (-Math.PI / 2) * (i / 6));
  for (const a of raios) {
    ctx.beginPath();
    ctx.moveTo(0, 352);
    ctx.lineTo(Math.cos(a) * 420, 352 + Math.sin(a) * 420);
    ctx.stroke();
  }
  for (let k = 1; k <= 4; k++) {
    const r = k * 75;
    ctx.beginPath();
    raios.forEach((a, i) => ctx[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, 352 + Math.sin(a) * r));
    ctx.stroke();
  }
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

/* ---------- Lombadas dos estojos (atlas 512×128, 5 faixas; texto em fonte comum, sem logo) ---------- */
export const NOMES_LOMBADAS = ['VALORANT', 'Counter-Strike', 'Resident Evil 4', 'Call of Duty', ''];

export function texturaLombadas() {
  const { ctx, t } = nova(512, 128);
  const larg = 512 / 5;
  const mono = fonteMono();
  NOMES_LOMBADAS.forEach((nome, i) => {
    const claro = i % 2 === 0;
    ctx.fillStyle = claro ? css(P.papel) : css(P.metal);
    ctx.fillRect(i * larg, 0, larg, 128);
    if (!nome) return;
    ctx.save();
    ctx.translate(i * larg + larg / 2, 64);
    ctx.rotate(-Math.PI / 2);
    ctx.scale(1, 10.8);
    ctx.font = `500 8px ${mono}`;
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
