/** 06 · Estante com ~46 livros em InstancedMesh e 2 certificados (docs/design.md 13.4). Livros e certificados somem com a vista aberta. */
import { Color, InstancedMesh, MeshLambertMaterial, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Plane, RB, graus, mulberry32 } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

const CORES_LIVROS = [P.tecido, P.azul, P.papel, P.madeiraEscura, P.cortica, P.metal, P.vermelho];
/** Fileiras: topo da prateleira (y) e quantos livros. Os 3 compartimentos de baixo recebem livros (3 × 15 = 45, mais 1). */
const FILEIRAS: [number, number][] = [[0.05, 15], [0.4925, 16], [0.9325, 15]];

export function criarEstante(caixa: Caixa, sombra: boolean) {
  return montarClicavel('estante', caixa, sombra, ({ lote, oculto, m, avulso, proprio }) => {
    const madeira = m(P.madeira);
    lote.add(RB(0.03, 1.95, 0.34, 0.006), madeira, [3.665, 0.975, 0.17]);
    lote.add(RB(0.03, 1.95, 0.34, 0.006), madeira, [4.535, 0.975, 0.17]);
    lote.add(Box(0.84, 0.03, 0.34), madeira, [4.1, 0.035, 0.17]);
    lote.add(Box(0.84, 0.03, 0.34), madeira, [4.1, 1.935, 0.17]);
    for (const y of [0.48, 0.92, 1.36]) lote.add(Box(0.84, 0.025, 0.32), madeira, [4.1, y, 0.17]);
    lote.add(Box(0.84, 1.95, 0.01), m(P.madeiraEscura), [4.1, 0.975, 0.005]);

    // Livros: 1 InstancedMesh, cores sorteadas com semente fixa.
    const rnd = mulberry32(7);
    const total = FILEIRAS.reduce((s, f) => s + f[1], 0);
    const livros = new InstancedMesh(Box(1, 1, 1), proprio(new MeshLambertMaterial({ color: 0xffffff })), total);
    const mtx = new Matrix4();
    let i = 0;
    for (const [topo, n] of FILEIRAS) {
      let x = 3.69;
      for (let k = 0; k < n; k++) {
        const l = 0.028 + rnd() * 0.022;
        const h = 0.2 + rnd() * 0.1;
        const p = 0.2 + rnd() * 0.04;
        const inclinado = k >= n - 2;
        const rz = inclinado ? graus(-12) : 0;
        if (inclinado && k === n - 2) x += 0.02;
        mtx.compose(new Vector3(x + l / 2, topo + 0.0125 + h / 2, 0.02 + p / 2), new Quaternion().setFromEuler(new Euler(0, 0, rz)), new Vector3(l, h, p));
        livros.setMatrixAt(i, mtx);
        livros.setColorAt(i, new Color(CORES_LIVROS[Math.floor(rnd() * CORES_LIVROS.length)]));
        x += l + 0.002;
        i++;
      }
    }
    livros.castShadow = livros.receiveShadow = sombra;
    avulso(livros, true);

    // Compartimento de cima: 2 quadros de certificado encostados a 10° (miolo em papel).
    for (const [x, giro] of [[3.95, 10], [4.2, -10]] as const) {
      oculto.add(RB(0.18, 0.14, 0.015, 0.004), m(P.madeira), [x, 1.443, 0.1], [0, 0, graus(giro)]);
      oculto.add(Plane(0.15, 0.11), m(P.papel), [x, 1.443, 0.1085], [0, 0, graus(giro)]);
    }
  });
}
