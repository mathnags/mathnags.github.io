/**
 * Fusão por material (docs/design.md 13.3): geometrias posicionadas em coordenadas do mundo são agrupadas por material
 * e fundidas com mergeGeometries, para economizar draw calls.
 */
import { BufferGeometry, Euler, Matrix4, Mesh, Quaternion, Vector3, type Material } from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import type { V3 } from '../config/tipos';

const eixo = new Matrix4();

export class Lote {
  /** Matriz base (a do grupo pai), aplicada antes da posição local. Os filhos compartilham os mesmos grupos. */
  constructor(private base = new Matrix4(), private grupos = new Map<Material, BufferGeometry[]>()) {}

  /** Mesmo lote, mas com outra matriz base (peças de um grupo posicionado e girado). */
  filho(base: Matrix4): Lote {
    return new Lote(base, this.grupos);
  }

  /** Adiciona uma geometria já criada. p = posição, r = rotação em radianos (x, y, z), e = escala. A geometria é consumida. */
  add(geo: BufferGeometry, mat: Material, p: V3 = [0, 0, 0], r: V3 | Quaternion = [0, 0, 0], e: V3 | number = 1): this {
    const s = typeof e === 'number' ? new Vector3(e, e, e) : new Vector3(...e);
    eixo.compose(new Vector3(...p), Array.isArray(r) ? new Quaternion().setFromEuler(new Euler(r[0], r[1], r[2], 'YXZ')) : r, s);
    geo.applyMatrix4(eixo.premultiply(this.base));
    const lista = this.grupos.get(mat) ?? [];
    lista.push(geo);
    this.grupos.set(mat, lista);
    return this;
  }

  /** Todas as geometrias do lote, fundidas num só buffer (para o contorno de destaque). */
  geometriaUnica(): BufferGeometry {
    const todas = [...this.grupos.values()].flat().map((g) => g.clone());
    return fundir(todas);
  }

  /** Uma malha por material. */
  malhas(sombra = true): Mesh[] {
    return [...this.grupos].map(([mat, lista]) => {
      const m = new Mesh(fundir(lista), mat);
      m.castShadow = sombra;
      m.receiveShadow = sombra;
      return m;
    });
  }
}

/** Funde, uniformizando indexação e atributos (Polyhedron e Extrude não têm índice). */
export function fundir(lista: BufferGeometry[]): BufferGeometry {
  const algumSemIndice = lista.some((g) => !g.index);
  const prontas = lista.map((g) => {
    const x = algumSemIndice && g.index ? g.toNonIndexed() : g;
    for (const nome of Object.keys(x.attributes)) if (nome !== 'position' && nome !== 'normal' && nome !== 'uv') x.deleteAttribute(nome);
    return x;
  });
  return prontas.length === 1 ? prontas[0] : mergeGeometries(prontas, false);
}
