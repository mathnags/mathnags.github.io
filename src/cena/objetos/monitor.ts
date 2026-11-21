/** 01 · Monitor widescreen moderno, não retrô (docs/design.md 13.4). A tela mostra a assinatura: a carreira que dobra em 2026. */
import { Mesh, MeshBasicMaterial } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Plane, RB } from '../geo';
import { P } from '../paleta';
import type { TelaMonitor } from '../texturas';
import { montarClicavel } from './base';

export function criarMonitor(caixa: Caixa, sombra: boolean, tela: TelaMonitor) {
  const c = montarClicavel('monitor', caixa, sombra, ({ lote, m, avulso }) => {
    const metal = m(P.metal);
    lote.add(RB(0.78, 0.46, 0.035, 0.012), metal, [0.95, 1.22, 0.3]);
    lote.add(Box(0.06, 0.22, 0.04), metal, [0.95, 0.88, 0.27]);
    lote.add(RB(0.26, 0.015, 0.18, 0.005), metal, [0.95, 0.768, 0.3]);
    // Tela emissiva (13.7): fora do contorno e sem luz.
    const plano = new Mesh(Plane(0.74, 0.42), new MeshBasicMaterial({ map: tela.textura, toneMapped: false }));
    plano.position.set(0.95, 1.22, 0.318);
    avulso(plano);
  });
  c.tela = tela;
  return c;
}
