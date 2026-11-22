/**
 * Primitivas com as abreviações de docs/design.md 13.2. Medidas em metros, na ordem largura (x) × altura (y) × profundidade (z).
 * Só importações nomeadas (tree-shaking): nunca `import * as THREE`.
 */
import {
  BoxGeometry, BufferGeometry, CatmullRomCurve3, CircleGeometry, ConeGeometry, CylinderGeometry, ExtrudeGeometry, IcosahedronGeometry,
  MeshLambertMaterial, PlaneGeometry, Quaternion, Shape, SphereGeometry, TorusGeometry, TubeGeometry, Vector3, type ColorRepresentation,
  type MeshLambertMaterialParameters,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import type { V3 } from '../config/tipos';

export const RB = (l: number, a: number, p: number, r: number) => new RoundedBoxGeometry(l, a, p, 2, r);
export const Box = (l: number, a: number, p: number) => new BoxGeometry(l, a, p);
export const Cyl = (rTopo: number, rBase: number, a: number, seg: number, aberto = false) => new CylinderGeometry(rTopo, rBase, a, seg, 1, aberto);
export const Ico = (r: number, det: number) => new IcosahedronGeometry(r, det);
export const Tor = (r: number, tubo: number, segR: number, segT: number, arco = Math.PI * 2) => new TorusGeometry(r, tubo, segR, segT, arco);
export const Cone = (r: number, a: number, seg: number, aberto = false) => new ConeGeometry(r, a, seg, 1, aberto);
export const Plane = (l: number, a: number) => new PlaneGeometry(l, a);
export const Esfera = (r: number, w: number, h: number) => new SphereGeometry(r, w, h);
export const Circulo = (r: number, seg: number) => new CircleGeometry(r, seg);
export const Ext = (forma: Shape, prof: number) => new ExtrudeGeometry(forma, { depth: prof, bevelEnabled: false });
export const Tube = (curva: CatmullRomCurve3, seg: number, r: number) => new TubeGeometry(curva, seg, r, 6, false);

export const graus = (g: number) => (g * Math.PI) / 180;

/** Cilindro (eixo y) deitado ao longo de um eixo: devolve a rotação para x ou z. */
export const ROT_EIXO_X: V3 = [0, 0, Math.PI / 2];
export const ROT_EIXO_Z: V3 = [Math.PI / 2, 0, 0];

/** Cilindro do ponto a ao ponto b: devolve centro, quaternion e comprimento. */
export function entre(a: V3, b: V3) {
  const va = new Vector3(...a);
  const vb = new Vector3(...b);
  const dir = vb.clone().sub(va);
  const comprimento = dir.length();
  const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize());
  return { centro: va.add(vb).multiplyScalar(0.5).toArray() as V3, q, comprimento };
}

/** Material de objeto com luz. Cada clicável usa os seus (clonados), para o destaque não vazar. */
export const mat = (cor: ColorRepresentation, extra: MeshLambertMaterialParameters = {}) => new MeshLambertMaterial({ color: cor, ...extra });

/** Gerador pseudoaleatório com semente fixa (docs 13.4: mulberry32(7)). */
export function mulberry32(semente: number) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type { BufferGeometry };

/** Cache de materiais por cor (decoração compartilha materiais; clicáveis usam o seu próprio cache). */
export function estoque() {
  const mapa = new Map<string, MeshLambertMaterial>();
  return {
    get(cor: number, extra: MeshLambertMaterialParameters = {}) {
      const chave = `${cor}|${JSON.stringify(extra)}`;
      let m = mapa.get(chave);
      if (!m) mapa.set(chave, (m = mat(cor, extra)));
      return m;
    },
    todos: () => [...mapa.values()],
  };
}

/** Devolve o controle à thread principal (scheduler.yield se existir, senão setTimeout 0): separa tarefas longas. */
export const ceder = (): Promise<void> => {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
};
