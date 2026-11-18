/**
 * Câmera por transform (design 12.5): a caixa da cena (imagem + objetos + nome) recebe translate + scale, com a
 * translação limitada às bordas da imagem. Animação por WAAPI (só transform, composto na GPU); com movimento
 * reduzido, é corte direto. No mobile não há câmera.
 */
import { caixa, clamp, css, mobile, palco, reduz, type Camera } from './ctx';

export const GERAL: Camera = { cx: 50, cy: 50, escala: 1 };

let atual: Camera = GERAL;
let anim: Animation | null = null;

/** Retângulo (px, na tela) que a caixa terá com a câmera "c" já aplicada, sem esperar a animação. */
export function retanguloFinal(c: Camera) {
  const L = caixa.offsetWidth;
  const A = caixa.offsetHeight;
  const s = c.escala;
  const [tx, ty] = (transformDe(c).match(/-?[0-9.]+(?=px)/g) ?? ['0', '0']).map(Number);
  const pr = palco.getBoundingClientRect();
  return { left: pr.left + palco.clientWidth / 2 + tx - (L * s) / 2, top: pr.top + palco.clientHeight / 2 + ty - (A * s) / 2, width: L * s, height: A * s };
}

/** transform que leva o ponto (cx, cy) da imagem ao centro da tela, sem mostrar nada fora da imagem. */
export function transformDe(c: Camera): string {
  const L = caixa.offsetWidth;
  const A = caixa.offsetHeight;
  const vw = palco.clientWidth;
  const vh = palco.clientHeight;
  const s = c.escala;
  const mx = Math.max(0, (L * s - vw) / 2);
  const my = Math.max(0, (A * s - vh) / 2);
  const tx = clamp(-(c.cx / 100 - 0.5) * L * s, -mx, mx);
  const ty = clamp(-(c.cy / 100 - 0.5) * A * s, -my, my);
  return `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${s})`;
}

function pararAnim() {
  if (!anim) return;
  const emCurso = getComputedStyle(caixa).transform;
  anim.cancel();
  anim = null;
  caixa.style.transform = emCurso;
  caixa.style.willChange = '';
}

/** Interrompe a animação em curso (a promessa dela resolve com false). */
export function parar() {
  pararAnim();
}

export const cameraAtual = () => atual;

/** Leva a câmera até "para". Resolve true ao terminar e false se foi interrompida. */
export function ir(para: Camera, duracaoMs: number, easing: '--ease-out' | '--ease-std', animar: boolean): Promise<boolean> {
  if (mobile.matches) return Promise.resolve(true);
  pararAnim();
  const ate = transformDe(para);
  const de = caixa.style.transform || transformDe(GERAL);
  atual = para;
  if (!animar || reduz.matches || duracaoMs <= 0 || de === ate) {
    caixa.style.transform = ate;
    return Promise.resolve(true);
  }
  caixa.style.willChange = 'transform';
  const a = caixa.animate([{ transform: de }, { transform: ate }], { duration: duracaoMs, easing: css(easing), fill: 'forwards' });
  anim = a;
  return a.finished.then(
    () => {
      if (anim === a) {
        caixa.style.transform = ate;
        a.cancel();
        anim = null;
        caixa.style.willChange = '';
      }
      return true;
    },
    () => false,
  );
}

/** Reaplica a câmera atual (mudança de tamanho da janela). */
export function reaplicar() {
  if (anim || mobile.matches) return;
  caixa.style.transform = transformDe(atual);
}

// Ao cruzar a fronteira entre tela cheia e mobile, a câmera é zerada (mobile) ou reaplicada (tela cheia).
mobile.addEventListener('change', () => {
  pararAnim();
  if (mobile.matches) caixa.style.transform = '';
  else reaplicar();
});
