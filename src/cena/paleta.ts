/**
 * Paleta da cena (docs/design.md 13.2). A cena usa SEMPRE os valores de dia como albedo, nos dois temas:
 * a noite vem da luz (luzes.ts) e só os materiais emissivos trocam de cor. Valores copiados de 2.1 (tokens de dia).
 */
export const P = {
  parede: 0xefe9dc,
  paredeSombra: 0xe2daca,
  piso: 0xc9b79a,
  madeira: 0xa9774e,
  madeiraEscura: 0x7c5536,
  metal: 0x2b2f38,
  cortica: 0xc89b63,
  papel: 0xfffdf7,
  tecido: 0x6f8f86,
  superficie2: 0xece8dd,
  vermelho: 0xc8352e,
  azul: 0x2d4f8e,
  coral: 0xff5f57,
  ervaVerde: 0x4f8a3c,
  ervaVermelha: 0xc2413a,
  /** Emissivos. */
  lampadaApagada: 0xd6d2c6,
  lampadaAcesa: 0xffd27a,
  tachinha: 0xf2b84b,
  sol: 0xfff1d6,
  luaSol: 0x9fb3ff,
  /** Cor de destaque do tema (--accent) em cada modo. */
  contornoDia: 0xb8400f,
  contornoNoite: 0xff8a4c,
} as const;

/** Mesmas cores em texto, para as texturas de canvas. */
export const css = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
