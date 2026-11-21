/**
 * Câmera (docs/design.md 13.5): lente de 30°, enquadramento calculado (enquadrar), voo em arco com ease-in-out cúbico,
 * interrupção sem salto e cortes com movimento reduzido. A distância NUNCA é fixa: sai de enquadrar().
 */
import { Box3, PerspectiveCamera, Vector3 } from 'three';
import type { Rect } from './areas';

const UP = new Vector3(0, 1, 0);

export interface Pose {
  pos: Vector3;
  alvo: Vector3;
  /** Deslocamento de tela para centralizar o objeto na área livre: camera.setViewOffset(L, A, offX, offY, L, A). */
  offX: number;
  offY: number;
}

/** Direção do alvo para a câmera: az a partir de +z (positivo para +x) e el, em graus. */
export function direcao(az: number, el: number) {
  const a = (az * Math.PI) / 180;
  const e = (el * Math.PI) / 180;
  return new Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e)).normalize();
}

function cantos(c: Box3): Vector3[] {
  const { min, max } = c;
  const lista: Vector3[] = [];
  for (const x of [min.x, max.x]) for (const y of [min.y, max.y]) for (const z of [min.z, max.z]) lista.push(new Vector3(x, y, z));
  return lista;
}

/**
 * Posição que faz a caixa caber INTEIRA na área livre, em qualquer proporção de tela, e o deslocamento de tela que
 * centraliza o objeto nessa área. caixa: Box3 (ou a janela, nas vistas "dentro", com margem 0); dir: unitário, do alvo
 * para a câmera; vp: tamanho do canvas em px; livre: retângulo em px; fovV em radianos.
 */
export function enquadrar(caixa: Box3, alvo: Vector3, dir: Vector3, fovV: number, vp: { L: number; A: number }, livre: Rect, margem: number): Pose {
  const t = Math.tan(fovV / 2);
  const tH = t * (livre.l / vp.A) * (1 - margem);
  const tV = t * (livre.a / vp.A) * (1 - margem);
  const r = new Vector3().crossVectors(dir.clone().negate(), UP).normalize();
  const u = new Vector3().crossVectors(r, dir.clone().negate());
  let d = 0.6; // distância mínima
  for (const p of cantos(caixa)) {
    const q = p.clone().sub(alvo);
    const prof = q.dot(dir);
    d = Math.max(d, prof + Math.abs(q.dot(r)) / tH, prof + Math.abs(q.dot(u)) / tV);
  }
  return {
    pos: alvo.clone().addScaledVector(dir, d),
    alvo: alvo.clone(),
    offX: vp.L / 2 - (livre.x + livre.l / 2),
    offY: vp.A / 2 - (livre.y + livre.a / 2),
  };
}

/** Aplica a pose a uma câmera de perspectiva já com aspect, fov e tamanho definidos. */
export function aplicarPose(cam: PerspectiveCamera, p: Pose, vp: { L: number; A: number }) {
  cam.position.copy(p.pos);
  cam.lookAt(p.alvo);
  cam.setViewOffset(vp.L, vp.A, p.offX, p.offY, vp.L, vp.A);
  cam.updateMatrixWorld(true);
}

/* ---------- Curvas de tempo ---------- */
/** cubic-bezier(x1, y1, x2, y2) como no CSS (Newton com reserva por bisseção). */
export function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const x = (s: number) => ((ax * s + bx) * s + cx) * s;
  const y = (s: number) => ((ay * s + by) * s + cy) * s;
  const dx = (s: number) => (3 * ax * s + 2 * bx) * s + cx;
  return (t: number) => {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    let s = t;
    for (let i = 0; i < 8; i++) {
      const e = x(s) - t;
      if (Math.abs(e) < 1e-6) return y(s);
      const d = dx(s);
      if (Math.abs(d) < 1e-6) break;
      s -= e / d;
    }
    let lo = 0;
    let hi = 1;
    s = t;
    while (hi - lo > 1e-6) {
      if (x(s) < t) lo = s;
      else hi = s;
      s = (lo + hi) / 2;
    }
    return y(s);
  };
}

/** --ease-voo (ease-in-out cúbico) e --ease-chegada, de tokens.css. */
export const EASE_VOO = bezier(0.65, 0, 0.35, 1);
export const EASE_CHEGADA = bezier(0.33, 1, 0.68, 1);

export function clonar(p: Pose): Pose {
  return { pos: p.pos.clone(), alvo: p.alvo.clone(), offX: p.offX, offY: p.offY };
}

interface Voo {
  de: Pose;
  para: Pose;
  inicio: number;
  ms: number;
  ease: (t: number) => number;
  em75?: () => void;
  feito75: boolean;
  fim: (ok: boolean) => void;
}

/** Controla a pose atual e o voo em arco entre duas poses. */
export class Piloto {
  pose: Pose;
  private voo: Voo | null = null;
  vp = { L: 1, A: 1 };

  constructor(
    readonly cam: PerspectiveCamera,
    inicial: Pose,
  ) {
    this.pose = clonar(inicial);
  }

  get voando() {
    return this.voo !== null;
  }

  aplicar() {
    aplicarPose(this.cam, this.pose, this.vp);
  }

  /** Corte direto (movimento reduzido, redimensionamento, link direto). Cancela qualquer voo. */
  cortar(p: Pose) {
    this.terminar(false);
    this.pose = clonar(p);
    this.aplicar();
  }

  /** Voa da pose ATUAL até "p" (interrupção sem salto). Resolve true na chegada e false se foi interrompido. */
  voar(p: Pose, ms: number, ease: (t: number) => number, agora: number, em75?: () => void): Promise<boolean> {
    this.terminar(false);
    return new Promise((fim) => {
      this.voo = { de: clonar(this.pose), para: clonar(p), inicio: agora, ms, ease, em75, feito75: false, fim };
    });
  }

  /** Avança o voo. Devolve true enquanto ainda há movimento. */
  quadro(agora: number): boolean {
    const v = this.voo;
    if (!v) return false;
    const bruto = Math.min(1, Math.max(0, (agora - v.inicio) / v.ms));
    if (!v.feito75 && bruto >= 0.75) {
      v.feito75 = true;
      v.em75?.();
    }
    const t = v.ease(bruto);
    const { de, para } = v;
    // Bézier quadrática com o ponto de controle erguido: C = (P0 + P1)/2 + ŷ · min(0,6, 0,18·|P1 − P0|).
    const c = de.pos.clone().add(para.pos).multiplyScalar(0.5);
    c.y += Math.min(0.6, 0.18 * de.pos.distanceTo(para.pos));
    const a = 1 - t;
    this.pose.pos.set(0, 0, 0).addScaledVector(de.pos, a * a).addScaledVector(c, 2 * a * t).addScaledVector(para.pos, t * t);
    this.pose.alvo.lerpVectors(de.alvo, para.alvo, t);
    this.pose.offX = de.offX + (para.offX - de.offX) * t;
    this.pose.offY = de.offY + (para.offY - de.offY) * t;
    this.aplicar();
    if (bruto >= 1) {
      this.terminar(true);
      return false;
    }
    return true;
  }

  private terminar(ok: boolean) {
    const v = this.voo;
    if (!v) return;
    this.voo = null;
    if (ok) this.pose = clonar(v.para);
    v.fim(ok);
  }

  cancelar() {
    this.terminar(false);
  }
}
