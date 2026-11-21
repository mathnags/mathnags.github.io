/** 07 · Lenço dobrado no gancho da porta. Genérico, sem símbolo de nenhuma associação (docs/design.md 13.4). */
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

export function criarLenco(caixa: Caixa, sombra: boolean) {
  return montarClicavel('lenco', caixa, sombra, ({ lote, m }) => {
    lote.add(Cyl(0.008, 0.008, 0.05, 6), m(P.metal), [5.33, 1.8, 0.06], ROT_EIXO_Z);
    lote.add(Esfera(0.012, 8, 6), m(P.metal), [5.33, 1.8, 0.085]);
    // Lenço dobrado (topo em y 1,78) e o debrum, o mesmo triângulo escalado 1,08, 5 mm atrás.
    lote.add(Ext(triangulo(), 0.008), m(P.tecido), [5.33, 1.78, 0.045]);
    lote.add(Ext(triangulo(), 0.008), m(P.papel), [5.33, 1.78, 0.04], [0, 0, 0], [1.08, 1.08, 1]);
    lote.add(Tor(0.022, 0.008, 6, 12), m(P.madeira), [5.33, 1.62, 0.058]);
  });
}
