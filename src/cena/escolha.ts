/**
 * Escolha de objetos por raio (docs/design.md 13.6). Um Box invisível por objeto, do tamanho da caixa + 0,04 m em cada
 * eixo, FORA do grafo da cena (matriz atualizada uma vez). São os únicos alvos do Raycaster, no máximo uma vez por quadro.
 */
import { BoxGeometry, Mesh, MeshBasicMaterial, Raycaster, Vector2, type PerspectiveCamera } from 'three';
import type { Caixa, IdObjeto } from '../config/tipos';

export class Escolha {
  private alvos: { id: IdObjeto; malha: Mesh }[] = [];
  private raio = new Raycaster();
  private p = new Vector2();
  private material = new MeshBasicMaterial({ visible: false });

  constructor(caixas: { id: IdObjeto; caixa: Caixa }[]) {
    for (const { id, caixa } of caixas) {
      const [l, a, p] = caixa.max.map((v, i) => v - caixa.min[i] + 0.04);
      const malha = new Mesh(new BoxGeometry(l, a, p), this.material);
      malha.position.set(...(caixa.min.map((v, i) => (v + caixa.max[i]) / 2) as [number, number, number]));
      malha.updateMatrixWorld(true);
      this.alvos.push({ id, malha });
    }
  }

  /** x, y em px relativos ao canvas. */
  em(cam: PerspectiveCamera, x: number, y: number, L: number, A: number): IdObjeto | null {
    this.p.set((x / L) * 2 - 1, -(y / A) * 2 + 1);
    this.raio.setFromCamera(this.p, cam);
    const acertos = this.raio.intersectObjects(
      this.alvos.map((a) => a.malha),
      false,
    );
    const primeiro = acertos[0]?.object;
    return this.alvos.find((a) => a.malha === primeiro)?.id ?? null;
  }

  dispose() {
    for (const a of this.alvos) a.malha.geometry.dispose();
    this.material.dispose();
  }
}
