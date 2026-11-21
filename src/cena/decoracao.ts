/**
 * Decoração estática, não clicável (docs/design.md 13.3). Tudo é fundido por material (Lote) depois de posicionado.
 * Proibido na cena: logos, personagens, máscaras, rostos, armas, miras, símbolo da Umbrella, teia ou traje reconhecível,
 * padrões oficiais de bola. A teia do pôster é geométrica e original (texturas.ts).
 */
import {
  AdditiveBlending, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, DoubleSide, Group, InstancedMesh, Matrix4, Mesh,
  MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, Quaternion, Vector3, type Texture,
} from 'three';
import type { V3 } from '../config/tipos';
import { Box, Circulo, Cone, Cyl, Esfera, Ico, Plane, RB, ROT_EIXO_X, ROT_EIXO_Z, Tor, Tube, entre, estoque, graus } from './geo';
import { Lote } from './lote';
import { P } from './paleta';
import { SOL } from './luzes';

export interface Decoracao {
  grupo: Group;
  /** Emissivo das lâmpadas do varal e da luminária: a cor vai de apagada a acesa com o tema. */
  lampada: MeshBasicMaterial;
  /** Céu da janela: o mapa troca com o tema. */
  ceu: MeshBasicMaterial;
  feixe: Mesh;
  /** Decalque de sol e sombras de contato: só aparecem sem sombras em tempo real (nível leve). */
  leveGrupo: Group;
  decalqueMat: MeshBasicMaterial;
  dispose(): void;
}

interface Opcoes {
  sombra: boolean;
  leve: boolean;
  ceuDia: Texture;
  poster: Texture;
  lombadas: Texture;
  sombraContato: Texture;
}

/** Ponto onde o raio de luz que passa por "p" encontra o plano y. */
function projetarNoPlano(p: V3, y: number): V3 {
  const d = new Vector3(...SOL.alvo).sub(new Vector3(...SOL.pos));
  const t = (y - p[1]) / d.y;
  return [p[0] + d.x * t, y, p[2] + d.z * t];
}

/** Topo do tapete (0,013): a mancha de sol cai sobre ele. */
const Y_TAPETE = 0.0145;

export function criarDecoracao(o: Opcoes): Decoracao {
  const m = estoque();
  const lote = new Lote();
  const lampada = new MeshBasicMaterial({ color: P.lampadaApagada, toneMapped: false });
  const g = new Group();
  g.name = 'decoracao';

  /* ---------- Janela (parede esquerda) ---------- */
  const papel = m.get(P.papel);
  const metal = m.get(P.metal);
  const madeira = m.get(P.madeira);
  lote.add(Box(0.12, 0.05, 1.2), papel, [-0.06, 2.125, 1.9]);
  lote.add(Box(0.12, 0.05, 1.2), papel, [-0.06, 0.975, 1.9]);
  lote.add(Box(0.12, 1.2, 0.05), papel, [-0.06, 1.55, 1.325]);
  lote.add(Box(0.12, 1.2, 0.05), papel, [-0.06, 1.55, 2.475]);
  lote.add(Box(0.12, 1.1, 0.03), papel, [-0.06, 1.55, 1.9]);
  lote.add(Box(0.18, 0.03, 1.24), papel, [0.03, 0.985, 1.9]);

  const ceu = new MeshBasicMaterial({ map: o.ceuDia, toneMapped: false });
  // Céu e cidade: só aparecem pelo vão. O plano do design (3,2 × 2,4 m em x −0,9) ficava aparente fora da parede, flutuando à
  // esquerda da maquete; este, de 2,0 × 1,5 m logo atrás do vão (x −0,45), é visto só pela janela (13.3, ajuste).
  const planoCeu = new Mesh(Plane(2.0, 1.5), ceu);
  planoCeu.rotation.y = Math.PI / 2;
  planoCeu.position.set(-0.45, 1.55, 1.9);
  g.add(planoCeu);

  // Cortina: 8 segmentos, deslocada em x por 0,03·sin(u·3π); varão ao longo de z.
  const cortina = new PlaneGeometry(0.28, 1.5, 8, 1);
  const pos = cortina.attributes.position as BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, 0.03 * Math.sin(((pos.getX(i) + 0.14) / 0.28) * 3 * Math.PI));
  cortina.computeVertexNormals();
  lote.add(cortina, m.get(P.tecido, { side: DoubleSide }), [0.06, 1.5, 1.22], [0, Math.PI / 2, 0]);
  lote.add(Cyl(0.012, 0.012, 1.6, 8), metal, [0.06, 2.25, 1.9], ROT_EIXO_Z);

  /* ---------- Pôster (aceno original, sem figura) ---------- */
  lote.add(RB(0.01, 0.82, 0.6, 0.004), papel, [0.006, 1.58, 3.05]);
  const poster = new Mesh(Plane(0.6, 0.82), new MeshLambertMaterial({ map: o.poster }));
  poster.rotation.y = Math.PI / 2;
  poster.position.set(0.0115, 1.58, 3.05);
  g.add(poster);

  /* ---------- Prateleira de estojos (aceno aos games) ---------- */
  lote.add(Box(0.22, 0.025, 0.6), madeira, [0.11, 1.55, 0.55]);
  lote.add(Box(0.02, 0.1, 0.02), metal, [0.02, 1.49, 0.35]);
  lote.add(Box(0.02, 0.1, 0.02), metal, [0.02, 1.49, 0.75]);
  // 5 estojos em pé, lombadas viradas para +x, com o atlas de lombadas (uma faixa de UV por estojo).
  const matLombada = new MeshLambertMaterial({ map: o.lombadas });
  for (let i = 0; i < 5; i++) {
    const z = 0.3 + i * 0.025;
    lote.add(Box(0.135, 0.19, 0.014), i % 2 === 0 ? papel : metal, [0.11, 1.6575, z]);
    const lombada = Plane(0.014, 0.19);
    const uv = lombada.attributes.uv as BufferAttribute;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / 5);
    lote.add(lombada, matLombada, [0.1785, 1.6575, z], [0, Math.PI / 2, 0]);
  }

  /* ---------- Mesa, gaveteiro e o que fica sobre ela ---------- */
  lote.add(RB(2.0, 0.04, 0.76, 0.012), madeira, [1.25, 0.74, 0.42]);
  lote.add(Box(0.04, 0.72, 0.04), metal, [0.29, 0.36, 0.1]);
  lote.add(Box(0.04, 0.72, 0.04), metal, [0.29, 0.36, 0.74]);
  lote.add(RB(0.4, 0.7, 0.62, 0.01), madeira, [2.02, 0.35, 0.4]);
  lote.add(Box(0.36, 0.004, 0.005), m.get(P.madeiraEscura), [2.02, 0.36, 0.712]);
  lote.add(Box(0.36, 0.004, 0.005), m.get(P.madeiraEscura), [2.02, 0.03, 0.712]);
  lote.add(Box(0.1, 0.015, 0.015), metal, [2.02, 0.55, 0.72]);
  lote.add(Box(0.1, 0.015, 0.015), metal, [2.02, 0.2, 0.72]);
  lote.add(RB(0.46, 0.022, 0.15, 0.006), m.get(P.superficie2), [0.95, 0.771, 0.58]);
  lote.add(Box(0.32, 0.004, 0.24), m.get(P.coral), [1.46, 0.762, 0.56]);
  lote.add(Esfera(0.03, 10, 8), metal, [1.48, 0.775, 0.56], [0, 0, 0], [1, 0.5, 1.5]);
  lote.add(Cyl(0.04, 0.04, 0.09, 12), papel, [1.5, 0.805, 0.24]);
  lote.add(Tor(0.025, 0.007, 6, 12, Math.PI), papel, [1.54, 0.805, 0.24], [0, 0, -Math.PI / 2]);

  // Headset no suporte (genérico, sem marca)
  lote.add(Cyl(0.06, 0.06, 0.012, 12), metal, [2.08, 0.766, 0.22]);
  lote.add(Cyl(0.008, 0.008, 0.26, 6), metal, [2.08, 0.89, 0.22]);
  lote.add(Tor(0.085, 0.012, 6, 16, Math.PI), metal, [2.08, 0.97, 0.22]);
  lote.add(Cyl(0.04, 0.04, 0.03, 12), metal, [2.165, 0.97, 0.22], ROT_EIXO_X);
  lote.add(Cyl(0.04, 0.04, 0.03, 12), metal, [1.995, 0.97, 0.22], ROT_EIXO_X);

  // Luminária (fonte de luz da noite)
  lote.add(Cyl(0.07, 0.07, 0.02, 16), metal, [0.42, 0.77, 0.24]);
  const bracos: [V3, V3][] = [[[0.42, 0.78, 0.24], [0.4, 1.1, 0.26]], [[0.4, 1.1, 0.26], [0.58, 1.18, 0.42]]];
  for (const [a, b] of bracos) {
    const s = entre(a, b);
    lote.add(Cyl(0.012, 0.012, s.comprimento, 8), metal, s.centro, s.q);
  }
  const cupula = new Vector3(1.15, 0.76, 0.52).sub(new Vector3(0.6, 1.14, 0.44)).normalize();
  lote.add(Cone(0.075, 0.12, 12, true), metal, [0.6, 1.14, 0.44], new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), cupula));
  const bulbo = new Mesh(Esfera(0.025, 8, 6), lampada);
  bulbo.position.set(0.6, 1.14, 0.44).addScaledVector(cupula, -0.02);
  g.add(bulbo);

  // Cadeira (grupo em (1.05, 0, 1.30), rotation.y = −0.35)
  const baseCadeira = new Matrix4().compose(new Vector3(1.05, 0, 1.3), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -0.35), new Vector3(1, 1, 1));
  const cad = new Lote(baseCadeira);
  cad.add(RB(0.46, 0.07, 0.44, 0.02), metal, [0, 0.46, 0]);
  cad.add(RB(0.44, 0.48, 0.06, 0.02), metal, [0, 0.75, 0.19]);
  cad.add(Cyl(0.025, 0.025, 0.36, 8), metal, [0, 0.28, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5;
    cad.add(Box(0.28, 0.025, 0.04), metal, [Math.cos(a) * 0.12, 0.08, -Math.sin(a) * 0.12], [0, a, 0]);
    cad.add(Esfera(0.022, 6, 4), metal, [Math.cos(a) * 0.26, 0.03, -Math.sin(a) * 0.26]);
  }
  g.add(...cad.malhas(o.sombra));

  /* ---------- Tapete, mesinha, vaso ---------- */
  lote.add(RB(2.0, 0.012, 1.3, 0.004), m.get(P.tecido), [1.75, 0.006, 1.65]);
  lote.add(Box(1.8, 0.013, 1.1), m.get(P.paredeSombra), [1.75, 0.0065, 1.65]);
  lote.add(RB(0.7, 0.03, 0.45, 0.01), madeira, [2.85, 0.515, 0.305]);
  for (const [x, z] of [[2.54, 0.12], [3.16, 0.12], [2.54, 0.49], [3.16, 0.49]]) lote.add(Cyl(0.018, 0.018, 0.5, 8), m.get(P.madeiraEscura), [x, 0.25, z]);

  lote.add(Cyl(0.06, 0.045, 0.1, 12), m.get(P.paredeSombra), [3.08, 0.58, 0.2]);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const h = 0.1 + (i % 3) * 0.02;
    lote.add(Cone(0.02, h, 6), m.get(i % 2 === 0 ? P.ervaVerde : P.ervaVermelha), [3.08 + Math.cos(a) * 0.02, 0.63 + h / 2, 0.2 + Math.sin(a) * 0.02], [graus(15) * Math.sin(a), 0, -graus(15) * Math.cos(a)]);
  }

  /* ---------- Porta (recebe o 07 e o 08) ---------- */
  lote.add(RB(0.85, 2.05, 0.04, 0.01), madeira, [5.1, 1.025, 0.02]);
  lote.add(Box(0.06, 2.1, 0.03), m.get(P.madeiraEscura), [4.645, 1.05, 0.015]);
  lote.add(Box(0.06, 2.1, 0.03), m.get(P.madeiraEscura), [5.555, 1.05, 0.015]);
  lote.add(Box(0.97, 0.06, 0.03), m.get(P.madeiraEscura), [5.1, 2.08, 0.015]);
  lote.add(Esfera(0.028, 10, 8), metal, [4.76, 0.95, 0.07]);
  lote.add(Box(0.02, 0.08, 0.01), metal, [5.52, 0.35, 0.045]);
  lote.add(Box(0.02, 0.08, 0.01), metal, [5.52, 1.7, 0.045]);

  /* ---------- Bola e joelheiras de vôlei (genéricas) e planta de chão ---------- */
  lote.add(Ico(0.105, 1), m.get(P.papel, { flatShading: true }), [4.98, 0.105, 0.78]);
  lote.add(Cyl(0.05, 0.05, 0.09, 12), metal, [5.24, 0.05, 0.7], ROT_EIXO_X);
  lote.add(Cyl(0.05, 0.05, 0.09, 12), metal, [5.3, 0.05, 0.82], ROT_EIXO_X);

  lote.add(Cyl(0.14, 0.11, 0.3, 12), m.get(P.paredeSombra), [0.3, 0.15, 3.25]);
  const folhas: V3[] = [[0.08, 0.55, 0.05], [-0.07, 0.65, 0.07], [0.02, 0.75, -0.09], [-0.05, 0.85, -0.04]];
  for (const [dx, y, dz] of folhas) lote.add(Ico(0.16, 0), m.get(P.ervaVerde), [0.3 + dx, y, 3.25 + dz]);
  const hastes: [number, number, number, number][] = [[0.03, 0.02, 0.25, -0.2], [-0.04, 0.03, -0.2, 0.25], [0.0, -0.05, 0.2, 0.1]];
  for (const [dx, dz, rx, rz] of hastes) lote.add(Cone(0.06, 0.45, 5), m.get(P.ervaVerde), [0.3 + dx, 0.7, 3.25 + dz], [rx, 0, rz]);

  g.add(...lote.malhas(o.sombra));

  /* ---------- Varal de luzinhas: fio + 24 lâmpadas em InstancedMesh, por comprimento de arco ---------- */
  const pontos: V3[] = [[0.15, 2.7, 0.03], [1.0, 2.62, 0.05], [1.9, 2.7, 0.03], [2.8, 2.62, 0.05], [3.7, 2.7, 0.03], [4.6, 2.62, 0.05], [5.5, 2.7, 0.03]];
  const curva = new CatmullRomCurve3(pontos.map((p) => new Vector3(...p)));
  g.add(new Mesh(Tube(curva, 64, 0.004), metal));
  const lampadas = new InstancedMesh(Esfera(0.022, 8, 6), lampada, 24);
  const eixo = new Matrix4();
  for (let i = 0; i < 24; i++) {
    const p = curva.getPointAt((i + 0.5) / 24);
    lampadas.setMatrixAt(i, eixo.makeTranslation(p.x, p.y - 0.03, p.z));
  }
  g.add(lampadas);

  /* ---------- Feixe de sol: tronco aberto do vão da janela até a mancha no piso (só de dia) ---------- */
  const janela: V3[] = [[0, 1.0, 1.35], [0, 1.0, 2.45], [0, 2.1, 2.45], [0, 2.1, 1.35]];
  const mancha = janela.map((p) => projetarNoPlano(p, Y_TAPETE));
  const feixeGeo = new BufferGeometry();
  feixeGeo.setAttribute('position', new BufferAttribute(new Float32Array([...janela, ...mancha].flat()), 3));
  const cor = new Color(P.sol);
  const alfa = [0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0];
  feixeGeo.setAttribute('color', new BufferAttribute(new Float32Array(alfa.flatMap((a) => [cor.r, cor.g, cor.b, a])), 4));
  feixeGeo.setIndex([0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7]);
  const feixe = new Mesh(feixeGeo, new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide, toneMapped: false }));
  g.add(feixe);

  /* ---------- Nível leve: decalque de sol e sombras de contato (sem sombras em tempo real) ---------- */
  const leveGrupo = new Group();
  leveGrupo.visible = o.leve;
  g.add(leveGrupo);
  const decalqueMat = new MeshBasicMaterial({ color: P.sol, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false, side: DoubleSide });
  {
    const geo = new BufferGeometry();
    const quad = mancha.flatMap((p) => [p[0], Y_TAPETE + 0.001, p[2]]);
    geo.setAttribute('position', new BufferAttribute(new Float32Array(quad), 3));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    leveGrupo.add(new Mesh(geo, decalqueMat));

    const matSombra = new MeshBasicMaterial({ map: o.sombraContato, transparent: true, depthWrite: false, toneMapped: false });
    const sombras: [number, number, number, number, number][] = [
      [1.05, 1.3, 0.38, 0.38, Y_TAPETE], [2.85, 0.31, 0.5, 0.36, 0.005], [3.42, 0.7, 0.34, 0.2, 0.005], [4.98, 0.78, 0.16, 0.16, 0.005], [0.3, 3.25, 0.22, 0.22, 0.005],
    ];
    for (const [x, z, rx, rz, y] of sombras) {
      const s = new Mesh(Circulo(1, 24), matSombra);
      s.rotation.x = -Math.PI / 2;
      s.scale.set(rx, rz, 1);
      s.position.set(x, y, z);
      leveGrupo.add(s);
    }
  }

  return {
    grupo: g,
    lampada,
    ceu,
    feixe,
    leveGrupo,
    decalqueMat,
    dispose() {
      g.traverse((n) => {
        if (n instanceof Mesh) {
          n.geometry.dispose();
          for (const mm of Array.isArray(n.material) ? n.material : [n.material]) mm.dispose();
        }
      });
    },
  };
}
