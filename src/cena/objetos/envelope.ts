/** 08 · Porta-cartas com envelope e selo (docs/design.md 13.4). */
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, RB } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

export function criarEnvelope(caixa: Caixa, sombra: boolean) {
  return montarClicavel('envelope', caixa, sombra, (ctx) => {
    const { lote, m } = ctx;
    lote.add(RB(0.26, 0.17, 0.04, 0.006), m(P.madeiraEscura), [4.95, 1.105, 0.06]);
    // Envelope girado em z 0,08, saindo do porta-cartas, com o selo no canto superior direito.
    const base = new Matrix4().compose(new Vector3(4.95, 1.21, 0.07), new Quaternion().setFromEuler(new Euler(0, 0, 0.08, 'YXZ')), new Vector3(1, 1, 1));
    const l = lote.filho(base);
    l.add(Box(0.22, 0.14, 0.004), m(P.papel), [0, 0, 0]);
    l.add(Box(0.03, 0.035, 0.002), m(P.coral), [0.075, 0.04, 0.003]);
  });
}
