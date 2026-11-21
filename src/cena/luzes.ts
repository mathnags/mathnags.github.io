/**
 * Luz dia e noite (docs/design.md 13.7). O número de luzes é fixo nos dois temas: o tema só interpola intensidade e cor,
 * então nunca há recompilação de shader. t = 0 é dia (luz acesa) e t = 1 é noite (luz apagada).
 * Só o sol/lua projeta sombra (nível completo), com o mapa estático: a direção da luz não muda com o tema.
 */
import { Color, DirectionalLight, HemisphereLight, PointLight, SpotLight, type Object3D, type Scene } from 'three';
import type { V3 } from '../config/tipos';

/** Sol/lua: entra pela janela da parede esquerda e desenha a mancha no tapete. */
export const SOL = { pos: [-3.6, 4.4, 2.6] as V3, alvo: [1.3, 0, 1.9] as V3 };

/** Intensidades de partida do design; o critério de calibração (13.7) é o que vale, e os ajustes ficam aqui. */
const DIA = { ceu: 0xf4f1ea, chao: 0xc9b79a, hemi: 2.2, sol: 0xfff1d6, solI: 2.6, preench: 0.8, spot: 0, halo: 0, monitor: 0 };
const NOITE = { ceu: 0x2b3560, chao: 0x14120f, hemi: 2.4, sol: 0x9fb3ff, solI: 1.0, preench: 0.5, spot: 6, halo: 1.2, monitor: 0.8 };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const _a = new Color();
const _b = new Color();
const cor = (alvo: Color, a: number, b: number, t: number) => alvo.copy(_a.set(a)).lerp(_b.set(b), t);

export interface Luzes {
  /** Interpola todas as luzes entre dia (0) e noite (1). */
  aplicar(t: number): void;
  luzes: Object3D[];
  sol: DirectionalLight;
}

export function criarLuzes(cena: Scene, sombra: boolean): Luzes {
  const hemi = new HemisphereLight(DIA.ceu, DIA.chao, DIA.hemi);

  const sol = new DirectionalLight(DIA.sol, DIA.solI);
  sol.position.set(...SOL.pos);
  sol.target.position.set(...SOL.alvo);
  if (sombra) {
    sol.castShadow = true;
    sol.shadow.mapSize.set(1024, 1024);
    const c = sol.shadow.camera;
    c.left = -3.2;
    c.right = 3.2;
    c.top = 3.2;
    c.bottom = -3.2;
    c.near = 0.5;
    c.far = 12;
    sol.shadow.bias = -0.0004;
    sol.shadow.normalBias = 0.02;
    sol.shadow.radius = 3;
  }

  const preench = new DirectionalLight(0xffffff, DIA.preench);
  preench.position.set(6, 5, 8);
  preench.target.position.set(2.8, 1, 1.4);

  const spot = new SpotLight(0xffd27a, 0, 0, 0.75, 0.7, 2);
  spot.position.set(0.6, 1.14, 0.44);
  spot.target.position.set(1.15, 0.76, 0.52);

  const halo = new PointLight(0xffd27a, 0, 2.6, 2);
  halo.position.set(0.6, 1.14, 0.44);

  const monitor = new PointLight(0xbfe6da, 0, 2.0, 2);
  monitor.position.set(0.95, 1.2, 0.65);

  const todas = [hemi, sol, sol.target, preench, preench.target, spot, spot.target, halo, monitor];
  cena.add(...todas);

  return {
    luzes: todas,
    sol,
    aplicar(t) {
      hemi.color.set(DIA.ceu).lerp(_b.set(NOITE.ceu), t);
      cor(hemi.groundColor, DIA.chao, NOITE.chao, t);
      hemi.intensity = lerp(DIA.hemi, NOITE.hemi, t);
      cor(sol.color, DIA.sol, NOITE.sol, t);
      sol.intensity = lerp(DIA.solI, NOITE.solI, t);
      preench.intensity = lerp(DIA.preench, NOITE.preench, t);
      spot.intensity = lerp(DIA.spot, NOITE.spot, t);
      halo.intensity = lerp(DIA.halo, NOITE.halo, t);
      monitor.intensity = lerp(DIA.monitor, NOITE.monitor, t);
    },
  };
}
