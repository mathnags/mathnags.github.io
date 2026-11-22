/**
 * Áreas livres e molduras em px (docs/design.md 13.5.2 e 13.9). Funções puras, SEM `three`: são usadas pelo módulo
 * principal (vista.ts) e pela cena. Todas recebem o tamanho do palco (L × A, em px).
 */
export interface Rect {
  x: number;
  y: number;
  l: number;
  a: number;
}

export type Lado = 'esquerda' | 'direita';

/** Mobile e retrato (largura < 768 ou proporção < 1,3): o palco é o do tour mobile e a vista é uma folha inferior. */
export const compacto = (L: number, A: number) => L < 768 || L / A < 1.3;

/** Faixa de HUD no topo e anotação "role" na base (visão geral em tela cheia). */
const HUD_TOPO = 72;
const BASE_GERAL = 64;
/** Barra da vista (voltar, anterior, próximo) e folga. */
export const BARRA = 56;
const FOLGA = 8;
/** Borda direita reservada ao trilho do tour: 12 px de margem + 28 px de largura + 16 px de ar. */
export const TRILHO = 56;

/** Visão geral. Mobile: do HUD até o cartão do nome (28% da base), para o quarto ficar centrado no espaço livre e não colado ao topo. */
export function areaGeral(L: number, A: number): Rect {
  if (compacto(L, A)) return { x: 0, y: BARRA, l: L, a: 0.72 * A - BARRA };
  return { x: 0, y: HUD_TOPO, l: L, a: A - HUD_TOPO - BASE_GERAL };
}

/** Passo do tour (1–8): cartão `min(420px, 34vw)` a 24 px da borda do lado configurado; área livre = o outro lado. */
export function areaTour(lado: Lado, L: number, A: number): Rect {
  if (compacto(L, A)) return { x: 0, y: BARRA, l: L, a: 0.55 * A - BARRA };
  const cartao = Math.min(420, 0.34 * L);
  const y = HUD_TOPO;
  const a = A - 24 - y;
  // Cartão à direita (a 56 px da borda, para não cobrir o trilho do tour): o objeto fica à esquerda, de 24 px da borda até 24 px do cartão.
  if (lado === 'direita') return { x: 24, y, l: L - TRILHO - cartao - 24 - 24, a };
  // Cartão à esquerda: o objeto fica à direita, a 24 px do cartão, até L − 48 (o trilho fica à direita).
  const x = 24 + cartao + 24;
  return { x, y, l: L - 48 - x, a };
}

/** Painel de vista (02, 04, 05, 07, 08): `min(56vw, 760px)` no lado da config; a área livre é o restante. */
export function painelVista(lado: Lado, L: number, A: number): { painel: Rect; livre: Rect } {
  if (compacto(L, A)) {
    const topo = 0.3 * A;
    return { painel: { x: 0, y: topo, l: L, a: A - topo }, livre: { x: 16, y: 16, l: L - 32, a: topo - 8 - 16 } };
  }
  const l = Math.min(0.56 * L, 760);
  const y = BARRA + FOLGA;
  const a = A - y - FOLGA;
  const x = lado === 'esquerda' ? 16 : L - 16 - l;
  const livreX = lado === 'esquerda' ? x + l + 16 : 16;
  const livreL = lado === 'esquerda' ? L - livreX - 16 : x - 16 - livreX;
  return { painel: { x, y, l, a }, livre: { x: livreX, y, l: livreL, a: A - 16 - y } };
}

export interface Preencher {
  lVw: number;
  lMax: number;
  aVh: number;
  aMenos: number;
  aMax: number;
}

/** Vista dentro (01, 03, 06): a moldura alvo, centralizada em x e verticalmente em y de 56 a A. */
export function molduraDentro(p: Preencher, L: number, A: number): Rect {
  if (compacto(L, A)) return painelVista('direita', L, A).livre;
  const l = Math.min(p.lVw * L, p.lMax);
  const a = Math.min(p.aVh * A - p.aMenos, p.aMax);
  return { x: (L - l) / 2, y: BARRA + (A - BARRA - a) / 2, l, a };
}
