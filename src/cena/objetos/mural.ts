/** 03 · Mural de cortiça com moldura e crachás de empresa (cordão + crachá, só texto) presos por tachinhas (docs/design.md 13.4). Ficam visíveis na aproximação; a vista aberta os cobre com o HTML. */
import { BufferAttribute, Euler, Matrix4, MeshLambertMaterial, Quaternion, Vector3, type Texture } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Cyl, Esfera, Plane, RB, entre, graus } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

/** "n" crachás, na ordem de "atlas" (texturaCrachas), distribuídos em x no centro do mural. */
export function criarMural(caixa: Caixa, sombra: boolean, atlas: Texture, n: number) {
  return montarClicavel('mural', caixa, sombra, ({ lote, m, proprio }) => {
    lote.add(Box(1.0, 0.78, 0.03), m(P.cortica), [2.95, 1.45, 0.015]);
    const moldura = m(P.madeira);
    lote.add(Box(1.06, 0.03, 0.04), moldura, [2.95, 1.855, 0.02]);
    lote.add(Box(1.06, 0.03, 0.04), moldura, [2.95, 1.045, 0.02]);
    lote.add(Box(0.03, 0.78, 0.04), moldura, [2.435, 1.45, 0.02]);
    lote.add(Box(0.03, 0.78, 0.04), moldura, [3.465, 1.45, 0.02]);
    const face = proprio(new MeshLambertMaterial({ map: atlas }));
    const rots = [-3, 2, -2];
    for (let i = 0; i < n; i++) {
      // Origem local na tachinha (topo); o crachá pende 0,31 m abaixo, preso por clipe e cordão em V.
      const base = new Matrix4().compose(new Vector3(2.95 + (i - (n - 1) / 2) * 0.3, 1.76, 0.037), new Quaternion().setFromEuler(new Euler(0, 0, graus(rots[i % 3]))), new Vector3(1, 1, 1));
      const l = lote.filho(base);
      l.add(Esfera(0.012, 8, 6), m(P.tachinha), [0, 0, 0.004]);
      for (const lado of [-1, 1]) {
        const c = entre([0, 0, 0.002], [lado * 0.03, -0.13, 0.002]);
        l.add(Cyl(0.0025, 0.0025, c.comprimento, 5), m(P.metal), c.centro, c.q);
      }
      l.add(RB(0.07, 0.025, 0.008, 0.003), m(P.cinzaMetal), [0, -0.14, 0.002]);
      l.add(RB(0.2, 0.3, 0.006, 0.003), m(P.papel), [0, -0.31, 0]);
      const plano = Plane(0.19, 0.29);
      const uv = plano.attributes.uv as BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setX(k, (uv.getX(k) + i) / n);
      l.add(plano, face, [0, -0.31, 0.0035]);
    }
  });
}
