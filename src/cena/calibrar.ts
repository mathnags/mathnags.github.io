/**
 * Calibração (só em desenvolvimento, docs/design.md 13.12): ?calibrar=1 mostra os alvos de clique em wireframe, os `alvo`s como
 * esferas de 2 cm, as `janela`s em contorno vermelho e as âncoras dos marcadores. ?calibrar=og renderiza a visão geral em 1200×630, sem HUD (CSS), para capturar o og.png.
 * Este módulo só é importado sob `import.meta.env.DEV`: não entra na build de produção.
 */
import { BoxGeometry, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, SphereGeometry, type Scene } from 'three';
import type { CfgCliente } from './index';

export function aplicarCalibracao(cena: Scene, cfg: CfgCliente) {
  const g = new Group();
  g.name = 'calibracao';
  const alvoMat = new LineBasicMaterial({ color: 0xff00c8, depthTest: false });
  const janelaMat = new LineBasicMaterial({ color: 0xff0000, depthTest: false });
  const esfera = new SphereGeometry(0.02, 12, 8);
  for (const o of cfg.objetos) {
    const [l, a, p] = o.caixa.max.map((v, i) => v - o.caixa.min[i] + 0.04);
    const alvos = new LineSegments(new EdgesGeometry(new BoxGeometry(l, a, p)), alvoMat);
    alvos.position.set(...(o.caixa.min.map((v, i) => (v + o.caixa.max[i]) / 2) as [number, number, number]));
    g.add(alvos);
    const foco = new Mesh(esfera, new MeshBasicMaterial({ color: 0x00b8ff, depthTest: false }));
    foco.position.set(...o.foco.alvo);
    g.add(foco);
    const ancora = new Mesh(esfera, new MeshBasicMaterial({ color: 0x00aa44, depthTest: false }));
    ancora.position.set(...o.marcador);
    g.add(ancora);
    if (o.janela) {
      const { min, max } = o.janela;
      const contorno = new LineSegments(new EdgesGeometry(new BoxGeometry(max[0] - min[0] || 0.002, max[1] - min[1], max[2] - min[2] || 0.002)), janelaMat);
      contorno.position.set((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, (min[2] + max[2]) / 2);
      g.add(contorno);
    }
  }
  cena.add(g);

}
