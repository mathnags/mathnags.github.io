/** 03 · Mural de cortiça com moldura, 3 papéis e 3 tachinhas (docs/design.md 13.4). Os papéis somem com a vista aberta. */
import type { Caixa } from '../../config/tipos';
import { Box, Esfera, RB, graus } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

export function criarMural(caixa: Caixa, sombra: boolean) {
  return montarClicavel('mural', caixa, sombra, ({ lote, oculto, m }) => {
    lote.add(Box(1.0, 0.78, 0.03), m(P.cortica), [2.95, 1.45, 0.015]);
    const moldura = m(P.madeira);
    lote.add(Box(1.06, 0.03, 0.04), moldura, [2.95, 1.855, 0.02]);
    lote.add(Box(1.06, 0.03, 0.04), moldura, [2.95, 1.045, 0.02]);
    lote.add(Box(0.03, 0.78, 0.04), moldura, [2.435, 1.45, 0.02]);
    lote.add(Box(0.03, 0.78, 0.04), moldura, [3.465, 1.45, 0.02]);
    const papeis: [number, number, number][] = [[2.62, 1.52, -4], [2.92, 1.38, 3], [3.2, 1.3, -2]];
    for (const [x, y, rot] of papeis) {
      oculto.add(RB(0.2, 0.26, 0.004, 0.002), m(P.papel), [x, y, 0.033], [0, 0, graus(rot)]);
      oculto.add(Esfera(0.012, 8, 6), m(P.tachinha), [x, y + 0.11, 0.037]);
    }
  });
}
