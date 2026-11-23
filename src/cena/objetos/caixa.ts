/** 05 · Mochila de notebook cinza-chumbo/azul-petróleo encostada na parede, perto da estante (docs/design.md 13.4). Genérica, sem marca; etiquetas só de texto. */
import { BufferAttribute, Euler, Matrix4, MeshLambertMaterial, Quaternion, Vector3, type Texture } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Plane, RB, Tor } from '../geo';
import { P } from '../paleta';
import { NOMES_ETIQUETAS } from '../texturas';
import { montarClicavel } from './base';

// O id e o destino continuam "caixa"/"habilidades" (renomear atravessa tipos, CSS e vistas); só o objeto mudou.
export function criarCaixa(caixa: Caixa, sombra: boolean, etiquetas: Texture) {
  return montarClicavel('caixa', caixa, sombra, (ctx) => {
    const { m, proprio } = ctx;
    // Base em (3.2, 0, 0.18), inclinada 0,12 rad para a parede (topo para trás) e girada 0,1 rad.
    const base = new Matrix4().compose(new Vector3(3.2, 0, 0.18), new Quaternion().setFromEuler(new Euler(-0.12, 0.1, 0, 'YXZ')), new Vector3(1, 1, 1));
    const l = ctx.lote.filho(base);
    const chumbo = m(P.chumbo), petroleo = m(P.petroleo), preto = m(P.preto), cromo = m(P.cromo);
    l.add(RB(0.32, 0.46, 0.18, 0.05), chumbo, [0, 0.23, 0]);
    // Notebook aparecendo no topo, atrás do zíper.
    l.add(RB(0.27, 0.12, 0.012, 0.004), cromo, [0, 0.475, -0.02]);
    // Bolso frontal com zíper e puxador.
    l.add(RB(0.26, 0.22, 0.07, 0.03), petroleo, [0, 0.16, 0.115]);
    l.add(Box(0.2, 0.007, 0.01), cromo, [0, 0.262, 0.152]);
    l.add(Box(0.012, 0.03, 0.008), preto, [0.09, 0.248, 0.156]);
    // Zíper principal no topo e alça de mão.
    l.add(Box(0.27, 0.008, 0.01), cromo, [0, 0.43, 0.093]);
    l.add(Box(0.012, 0.035, 0.008), preto, [-0.1, 0.415, 0.097]);
    l.add(Tor(0.04, 0.008, 6, 12, Math.PI), preto, [0, 0.455, 0]);
    // Alças dos ombros (aparecem nas laterais) e faixa de base.
    for (const lado of [-1, 1]) l.add(RB(0.014, 0.34, 0.05, 0.005), preto, [lado * 0.165, 0.24, -0.03]);
    l.add(RB(0.33, 0.05, 0.19, 0.02), petroleo, [0, 0.025, 0]);
    // Etiquetas de texto no bolso (uma faixa do atlas cada).
    const face = proprio(new MeshLambertMaterial({ map: etiquetas }));
    const n = NOMES_ETIQUETAS.length;
    NOMES_ETIQUETAS.forEach((_, i) => {
      const plano = Plane(0.09, 0.0225);
      const uv = plano.attributes.uv as BufferAttribute;
      for (let k = 0; k < uv.count; k++) uv.setY(k, (uv.getY(k) + (n - 1 - i)) / n);
      l.add(plano, face, [-0.05 + (i === 1 ? 0.05 : 0), 0.2 - i * 0.04, 0.1505]);
    });
  });
}
