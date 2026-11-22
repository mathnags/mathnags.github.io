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
  /** Mesa industrial, cadeira, headset e monstera. */
  mel: 0xc58b48,
  preto: 0x1b1d22,
  telaCadeira: 0x2f333a,
  cromo: 0xc4c9d1,
  cinzaMetal: 0x7f858e,
  almofada: 0xc9ccd0,
  terracota: 0xb4553a,
  folhaClara: 0x74ad4e,
  haste: 0x3f6b2e,
  /** Controle: corpo grafite e faixa de luz (dia mais fraca, noite viva). */
  grafite: 0x3b3f47,
  ledDia: 0x4f86b8,
  ledNoite: 0x6fd0ff,
  /** Gabinete: vidro temperado. */
  vidro: 0xcfe6f5,
  /** Emissivos. */
  lampadaApagada: 0xd6d2c6,
  lampadaAcesa: 0xffd27a,
  tachinha: 0xf2b84b,
  sol: 0xfff1d6,
  luaSol: 0x9fb3ff,
  /** Luz dos objetos interativos (emissive) e contorno fino do hover/foco. */
  brilho: 0xfff1d0,
  contornoHover: 0xfffaf0,
} as const;

/** Mesmas cores em texto, para as texturas de canvas. */
export const css = (n: number) => `#${n.toString(16).padStart(6, '0')}`;
