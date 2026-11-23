/** 06 · Estante alta de madeira com nichos irregulares, livros em InstancedMesh, bonecos genéricos, 2 tubos de diploma e 2 certificados (docs/design.md 13.4). O conteúdo some com a vista aberta. */
import { Color, InstancedMesh, MeshLambertMaterial, Euler, Matrix4, Quaternion, Vector3 } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Cyl, Esfera, Plane, RB, graus, mulberry32 } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

const CORES_LIVROS = [P.tecido, P.azul, P.papel, P.cortica, P.vermelho, P.coral, P.superficie2, P.madeira];
/** Interior: x 3,68–4,52. Prateleiras (centro y) e chão de cada fileira; divisórias verticais alternadas (x), uma por fileira. */
const PRATELEIRAS = [0.42, 0.8, 1.18, 1.56];
const CHAO = [0.05, 0.4325, 0.8125, 1.1925, 1.5725];
const DIVISORIAS: (number | null)[] = [4.2, 3.957, 4.285, 3.957, null];
const Z = 0.17;

interface Livro { x: number; y: number; l: number; h: number; p: number; rz: number; cor: number }

export function criarEstante(caixa: Caixa, sombra: boolean) {
  return montarClicavel('estante', caixa, sombra, ({ lote, oculto, m, avulso, proprio }) => {
    const grafite = m(P.madeiraEscura);
    lote.add(RB(0.03, 1.95, 0.34, 0.006), grafite, [3.665, 0.975, 0.17]);
    lote.add(RB(0.03, 1.95, 0.34, 0.006), grafite, [4.535, 0.975, 0.17]);
    lote.add(Box(0.84, 0.03, 0.34), grafite, [4.1, 0.035, 0.17]);
    lote.add(Box(0.84, 0.03, 0.34), grafite, [4.1, 1.935, 0.17]);
    for (const y of PRATELEIRAS) lote.add(Box(0.84, 0.025, 0.32), grafite, [4.1, y, 0.17]);
    DIVISORIAS.forEach((x, f) => {
      if (x === null) return;
      const topo = f < PRATELEIRAS.length ? PRATELEIRAS[f] - 0.0125 : 1.935;
      lote.add(Box(0.02, topo - CHAO[f], 0.32), grafite, [x, (topo + CHAO[f]) / 2, 0.17]);
    });
    lote.add(Box(0.84, 1.95, 0.01), m(P.madeira), [4.1, 0.975, 0.005]);

    const rnd = mulberry32(7);
    const livros: Livro[] = [];
    /** Livros em pé de xa até xb sobre o chão y; o último inclina se couber. */
    const fila = (xa: number, xb: number, y: number, inclinar = false) => {
      let x = xa;
      for (;;) {
        const l = 0.028 + rnd() * 0.022;
        if (x + l > xb) break;
        livros.push({ x: x + l / 2, y, l, h: 0.2 + rnd() * 0.09, p: 0.2 + rnd() * 0.04, rz: 0, cor: CORES_LIVROS[Math.floor(rnd() * CORES_LIVROS.length)] });
        x += l + 0.002;
      }
      if (inclinar && livros.length) {
        const u = livros[livros.length - 1];
        u.rz = graus(-12);
        u.x += 0.012;
      }
    };
    /** Livros deitados em pilha, centrada em x. */
    const pilha = (x: number, y: number, n: number, larg = 0.2) => {
      for (let k = 0; k < n; k++) livros.push({ x, y: y + k * 0.026, l: larg - k * 0.015, h: 0.024, p: 0.16, rz: 0, cor: CORES_LIVROS[Math.floor(rnd() * CORES_LIVROS.length)] });
    };

    // Boneco genérico (sem rosto nem personagem): base, pernas, tronco, braços e cabeça lisa. pose = ângulo do braço direito.
    const figura = (x: number, y: number, cor: number, pose = 0.2) => {
      oculto.add(Cyl(0.035, 0.035, 0.008, 14), m(P.metal), [x, y + 0.004, Z]);
      for (const d of [-0.014, 0.014]) oculto.add(RB(0.022, 0.07, 0.026, 0.008), m(P.preto), [x + d, y + 0.043, Z]);
      oculto.add(RB(0.06, 0.065, 0.035, 0.012), m(cor), [x, y + 0.112, Z]);
      oculto.add(RB(0.018, 0.06, 0.02, 0.007), m(cor), [x - 0.042, y + 0.112, Z], [0, 0, 0.2]);
      oculto.add(RB(0.018, 0.06, 0.02, 0.007), m(cor), [x + 0.042 + Math.sin(pose) * 0.03, y + 0.112 + Math.sin(pose) * 0.01, Z], [0, 0, -pose]);
      oculto.add(Esfera(0.028, 10, 8), m(P.superficie2), [x, y + 0.172, Z]);
    };
    const vaso = (x: number, y: number, cor: number, alt: number) => {
      oculto.add(Cyl(0.045, 0.06, alt, 14), m(cor), [x, y + alt / 2, Z]);
      oculto.add(Cyl(0.03, 0.045, alt * 0.3, 14), m(cor), [x, y + alt + alt * 0.15, Z]);
    };
    const tuboDiploma = (x: number, y: number, cor: number, tampa: number) => {
      oculto.add(Cyl(0.024, 0.024, 0.3, 14), m(cor), [x, y + 0.15, Z]);
      for (const dy of [0.0125, 0.2875]) oculto.add(Cyl(0.027, 0.027, 0.025, 14), m(tampa), [x, y + dy, Z]);
    };

    // Fileira 0 (baixo): caixas empilhadas e vaso.
    oculto.add(RB(0.3, 0.1, 0.22, 0.01), m(P.cortica), [3.84, CHAO[0] + 0.05, Z]);
    oculto.add(RB(0.24, 0.07, 0.19, 0.01), m(P.superficie2), [3.845, CHAO[0] + 0.135, Z]);
    pilha(4.07, CHAO[0], 3, 0.16);
    vaso(4.36, CHAO[0], P.terracota, 0.2);
    // Fileira 1: dois bonecos no nicho estreito; livros em pé e pilha com boneco à direita.
    figura(3.77, CHAO[1], P.coral, 0.9);
    figura(3.87, CHAO[1], P.azul);
    fila(3.98, 4.3, CHAO[1]);
    pilha(4.41, CHAO[1], 3, 0.18);
    figura(4.41, CHAO[1] + 0.0775, P.tecido, 1.2);
    // Fileira 2: livros, boneco, e os 2 tubos de diploma no nicho estreito.
    fila(3.69, 4.0, CHAO[2]);
    figura(4.15, CHAO[2], P.laranja, 0.4);
    tuboDiploma(4.35, CHAO[2], P.cortica, P.vermelho);
    tuboDiploma(4.44, CHAO[2], P.papel, P.madeiraEscura);
    // Fileira 3: boneco em cima de livros no nicho estreito; livros em pé e boneco à direita.
    pilha(3.82, CHAO[3], 2, 0.16);
    figura(3.82, CHAO[3] + 0.052, P.vermelho, 1.0);
    fila(3.98, 4.22, CHAO[3], true);
    figura(4.4, CHAO[3], P.azul, 0.2);
    // Fileira 4 (topo): livros e 2 certificados encostados a 10°.
    fila(3.69, 4.15, CHAO[4], true);
    for (const [x, giro] of [[4.27, 10], [4.43, -10]] as const) {
      oculto.add(RB(0.15, 0.12, 0.015, 0.004), m(P.madeira), [x, CHAO[4] + 0.06, 0.1], [0, 0, graus(giro)]);
      oculto.add(Plane(0.12, 0.09), m(P.papel), [x, CHAO[4] + 0.06, 0.1085], [0, 0, graus(giro)]);
    }

    // Livros: 1 InstancedMesh, cores sorteadas com semente fixa.
    const inst = new InstancedMesh(Box(1, 1, 1), proprio(new MeshLambertMaterial({ color: 0xffffff })), livros.length);
    const mtx = new Matrix4();
    livros.forEach((b, i) => {
      mtx.compose(new Vector3(b.x, b.y + b.h / 2, 0.02 + b.p / 2), new Quaternion().setFromEuler(new Euler(0, 0, b.rz)), new Vector3(b.l, b.h, b.p));
      inst.setMatrixAt(i, mtx);
      inst.setColorAt(i, new Color(b.cor));
    });
    inst.castShadow = inst.receiveShadow = sombra;
    avulso(inst, true);
  });
}
