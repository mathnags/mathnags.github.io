/** 07 · Lenço dobrado no gancho da porta: amarelo com duas faixas marrons nas bordas. Genérico, sem símbolo de nenhuma associação (docs/design.md 13.4). */
import { Shape } from 'three';
import type { Caixa } from '../../config/tipos';
import { Cyl, Esfera, Ext, Tor, ROT_EIXO_Z } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

function triangulo() {
  const f = new Shape();
  f.moveTo(-0.16, 0);
  f.lineTo(0.16, 0);
  f.lineTo(0, -0.42);
  f.closePath();
  return f;
}

/** Camadas de trás para a frente: o mesmo triângulo em escalas menores, cada uma 5 mm à frente, forma as faixas. */
const CAMADAS: [number, number][] = [
  [P.madeiraEscura, 1.12],
  [P.amarelo, 1.05],
  [P.madeiraEscura, 0.99],
  [P.amarelo, 0.9],
];

export function criarLenco(caixa: Caixa, sombra: boolean) {
  return montarClicavel('lenco', caixa, sombra, ({ lote, m }) => {
    lote.add(Cyl(0.008, 0.008, 0.05, 6), m(P.metal), [5.33, 1.8, 0.06], ROT_EIXO_Z);
    lote.add(Esfera(0.012, 8, 6), m(P.metal), [5.33, 1.8, 0.085]);
    CAMADAS.forEach(([cor, s], i) => lote.add(Ext(triangulo(), 0.008), m(cor), [5.33, 1.78, 0.04 + i * 0.005], [0, 0, 0], [s, s, 1]));
    lote.add(Tor(0.022, 0.008, 6, 12), m(P.madeira), [5.33, 1.62, 0.07]);
  });
}
