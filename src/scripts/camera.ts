/**
 * Câmera: interpola o viewBox do SVG do quarto só durante o zoom (400 ms ida / 320 ms volta).
 * Com movimento reduzido, é corte direto.
 */
import { cena, cfg, css, reduz, type Rect } from './ctx';

let epoca = 0;

export const inteira = (): Rect => ({ x: 0, y: 0, l: cfg.viewBox.l, a: cfg.viewBox.a });

function atual(): Rect {
  const [x, y, l, a] = (cena.getAttribute('viewBox') ?? '').split(' ').map(Number);
  return { x, y, l, a };
}

const aplicar = (r: Rect) => cena.setAttribute('viewBox', `${r.x} ${r.y} ${r.l} ${r.a}`);

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-4 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    return sy(t);
  };
}

/** Interrompe a animação em curso (a promessa dela resolve com false). */
export function parar() {
  epoca++;
}

/** Leva o viewBox até "para". Resolve true ao terminar e false se foi interrompida. */
export function ir(para: Rect, duracaoMs: number, easing: '--ease-out' | '--ease-std', animar: boolean): Promise<boolean> {
  const minha = ++epoca;
  if (!animar || reduz.matches) {
    aplicar(para);
    return Promise.resolve(true);
  }
  const de = atual();
  const curva = (css(easing).match(/-?[\d.]+/g) ?? ['0', '0', '1', '1']).map(Number);
  const f = bezier(curva[0], curva[1], curva[2], curva[3]);
  const inicio = performance.now();
  return new Promise((resolve) => {
    const passo = (agora: number) => {
      if (minha !== epoca) return resolve(false);
      const t = Math.min(1, (agora - inicio) / duracaoMs);
      const k = f(t);
      aplicar({
        x: de.x + (para.x - de.x) * k,
        y: de.y + (para.y - de.y) * k,
        l: de.l + (para.l - de.l) * k,
        a: de.a + (para.a - de.a) * k,
      });
      if (t < 1) requestAnimationFrame(passo);
      else resolve(true);
    };
    requestAnimationFrame(passo);
  });
}
