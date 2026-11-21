/** 04 · Caderno aberto sobre a mesinha, com pauta e esboço de gráfico de barras (docs/design.md 13.4). */
import { BufferAttribute, Euler, Matrix4, MeshLambertMaterial, Quaternion, Vector3, type Texture } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Cyl, Plane, RB } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

export function criarCaderno(caixa: Caixa, sombra: boolean, paginas: Texture) {
  return montarClicavel('caderno', caixa, sombra, (ctx) => {
    const { m } = ctx;
    // Grupo em (2.76, 0.53, 0.33), rotation.y = −0.20.
    const base = new Matrix4().compose(new Vector3(2.76, 0.53, 0.33), new Quaternion().setFromEuler(new Euler(0, -0.2, 0, 'YXZ')), new Vector3(1, 1, 1));
    const l = ctx.lote.filho(base);
    const folha = ctx.proprio(new MeshLambertMaterial({ map: paginas }));
    l.add(Box(0.42, 0.006, 0.285), m(P.metal), [0, 0.003, 0]);
    // Duas páginas em V (giradas em z ±0,06 rad); cada uma recebe metade da textura (esquerda: pauta; direita: pauta + barras).
    for (const lado of [-1, 1]) {
      const giro = lado * 0.06;
      l.add(RB(0.2, 0.012, 0.27, 0.004), m(P.papel), [lado * 0.1, 0.012, 0], [0, 0, giro]);
      const plano = Plane(0.19, 0.26);
      const uv = plano.attributes.uv as BufferAttribute;
      for (let i = 0; i < uv.count; i++) uv.setX(i, (uv.getX(i) + (lado < 0 ? 0 : 1)) / 2);
      const deitar = new Quaternion().setFromEuler(new Euler(0, 0, giro)).multiply(new Quaternion().setFromEuler(new Euler(-Math.PI / 2, 0, 0)));
      l.add(plano, folha, [lado * 0.1, 0.0195, 0], deitar);
    }
    // Caneta na diagonal sobre a página direita.
    l.add(Cyl(0.006, 0.006, 0.15, 6), m(P.azul), [0.12, 0.03, 0.02], [0, 0.6, Math.PI / 2]);
  });
}
