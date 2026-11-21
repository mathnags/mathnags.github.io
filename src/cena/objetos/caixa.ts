/** 05 · Caixa de ferramentas vermelha no chão (docs/design.md 13.4). Genérica, sem marca. */
import { Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, RB, Tor } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

export function criarCaixa(caixa: Caixa, sombra: boolean) {
  return montarClicavel('caixa', caixa, sombra, (ctx) => {
    const { m } = ctx;
    // Grupo no chão em (3.42, 0, 0.70), rotation.y = −0.25.
    const base = new Matrix4().compose(new Vector3(3.42, 0, 0.7), new Quaternion().setFromEuler(new Euler(0, -0.25, 0, 'YXZ')), new Vector3(1, 1, 1));
    const l = ctx.lote.filho(base);
    const vermelho = m(P.vermelho);
    const metal = m(P.metal);
    l.add(RB(0.44, 0.2, 0.22, 0.012), vermelho, [0, 0.1, 0]);
    l.add(RB(0.45, 0.04, 0.23, 0.012), vermelho, [0, 0.21, 0]);
    l.add(Box(0.452, 0.008, 0.232), metal, [0, 0.19, 0]);
    l.add(Tor(0.07, 0.011, 6, 12, Math.PI), metal, [0, 0.235, 0]);
    l.add(Box(0.04, 0.05, 0.012), metal, [-0.12, 0.19, 0.116]);
    l.add(Box(0.04, 0.05, 0.012), metal, [0.12, 0.19, 0.116]);
  });
}
