/**
 * Âncoras dos links dos objetos e anotações à mão (docs/design.md 13.8.2 e 13.8.3): HTML de frente para a tela, centrado na projeção de
 * uma âncora 3D. O <a class="objeto"> (44 × 44 px, invisível) é o elemento acessível; aqui só muda a posição, em --tx/--ty, e só
 * nos quadros em que a câmera se move.
 */
import { Vector3, type PerspectiveCamera } from 'three';
import type { V3 } from '../config/tipos';

export interface MarcadorProj {
  el: HTMLElement;
  ancora: V3;
}

export interface AnotacaoProj {
  /** Texto à mão. */
  el: HTMLElement;
  /** Traço da seta: o halo e o traço escuro (mesmo `d`). */
  tracos: SVGPathElement[];
  tipo: 'comece' | 'role';
  /** 'comece': deslocamento (px) do canto superior esquerdo do marcador. */
  dx?: number;
  dy?: number;
  larguraMax: number;
  relativoA?: string;
}

const _v = new Vector3();

/** Lado (px) da área de toque do link. */
const LADO = 44;

export class Projecao {
  /** Posição (px) do canto superior esquerdo de cada marcador, para a anotação relativa. */
  private cantos = new Map<string, [number, number]>();

  constructor(
    private marcadores: MarcadorProj[],
    private anotacoes: AnotacaoProj[],
  ) {}

  atualizar(cam: PerspectiveCamera, L: number, A: number) {
    for (const p of this.marcadores) {
      _v.set(...p.ancora).project(cam);
      const x = (_v.x * 0.5 + 0.5) * L - LADO / 2;
      const y = (-_v.y * 0.5 + 0.5) * A - LADO / 2;
      p.el.style.setProperty('--tx', `${x.toFixed(1)}px`);
      p.el.style.setProperty('--ty', `${y.toFixed(1)}px`);
      this.cantos.set(p.el.dataset.objeto ?? '', [x, y]);
    }
    this.anotar(L);
  }

  private anotar(L: number) {
    for (const an of this.anotacoes) {
      const w = Math.min(an.larguraMax, an.el.scrollWidth || an.larguraMax);
      const h = an.el.offsetHeight;
      let x1: number;
      let y1: number;
      let x2: number;
      let y2: number;
      let curva = 0;
      if (an.tipo === 'comece') {
        const c = this.cantos.get(an.relativoA ?? '');
        if (!c) continue;
        const tx = c[0] + (an.dx ?? 0);
        const ty = c[1] + (an.dy ?? 0);
        an.el.style.left = `${tx.toFixed(1)}px`;
        an.el.style.top = `${ty.toFixed(1)}px`;
        x1 = tx + w * 0.7;
        y1 = ty + h + 2;
        x2 = c[0] - 4;
        y2 = c[1] - 2;
        curva = 0.3;
      } else {
        x1 = L / 2;
        y1 = an.el.offsetTop + h + 6;
        x2 = x1;
        y2 = y1 + 30;
      }
      const cx = (x1 + x2) / 2 - (y2 - y1) * curva * 0.5;
      const cy = (y1 + y2) / 2 + (x2 - x1) * curva * 0.5;
      const ang = Math.atan2(y2 - cy, x2 - cx);
      const f = (n: number) => n.toFixed(1);
      const bico = (d: number) => `${f(x2 - 10 * Math.cos(ang + d))} ${f(y2 - 10 * Math.sin(ang + d))}`;
      const d = `M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}M${bico(0.5)}L${f(x2)} ${f(y2)}L${bico(-0.5)}`;
      for (const t of an.tracos) t.setAttribute('d', d);
    }
  }
}
