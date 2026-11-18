/**
 * Tour guiado pela rolagem (design 12.13.2). O palco fica sticky; os cartões HTML rolam no fluxo normal, um por passo, e um
 * IntersectionObserver (sem listener de scroll) leva a câmera ao objeto do passo no centro da tela. Nunca prende a rolagem:
 * nenhum preventDefault em wheel/touch/teclas. Passo 0 = quarto inteiro; 1 a 8 = capítulos; 9 = o SO embutido na tela do
 * monitor, sem <dialog>. "Sair do tour" e "Ir para o monitor" ficam sempre visíveis; Esc = sair.
 * Sem tour no modo recrutador e na estratégia mobile (os nichos fazem esse papel).
 */
import * as cam from './camera';
import { clamp, html, mobile, modoQuarto, palco, principais, type Camera, type Rect } from './ctx';
import { interagiu } from './anotacoes';
import * as so from './so';

const raiz = document.getElementById('quarto')!;
const passos = [...document.querySelectorAll<HTMLElement>('.passo')];
const tracos = [...palco.querySelectorAll<HTMLElement>('.traco')];
const embutido = palco.querySelector<HTMLElement>('.so-tour')!;
const ULTIMO = 9;
let passo = 0;
let marca: Comment | null = null;
let rodada = 0;

const monitor = () => principais[0];

/** Câmera do passo: 0 = visão geral, 1 a 8 = tour.camera do capítulo, 9 = o monitor em 3×. */
export function cameraDoPasso(n: number): Camera {
  if (n <= 0) return cam.GERAL;
  if (n >= ULTIMO) return monitor().vista.camera;
  return principais[n - 1].tour.camera;
}

/** Câmera que vale em repouso (a do passo atual). */
export const cameraDeRepouso = () => cameraDoPasso(passo);

/** Retângulo (px, na tela) da janela do SO centrada na tela do monitor, limitado à tela. topo = faixa livre de HUD. */
export function retanguloTela(topo: number): Rect {
  const j = monitor().vista.janela!;
  const r = cam.retanguloFinal(cam.cameraAtual());
  const cx = r.left + ((j.x + j.l / 2) / 100) * r.width;
  const cy = r.top + ((j.y + j.a / 2) / 100) * r.height;
  const vw = html.clientWidth;
  const vh = html.clientHeight;
  const folga = 16;
  const l = Math.min(vw * 0.92, 1100);
  const a = Math.min(vh * 0.86, 700, vh - topo - folga);
  return { x: clamp(cx - l / 2, folga, vw - l - folga), y: clamp(cy - a / 2, topo + folga, vh - a - folga), l, a };
}

function posicionarEmbutido() {
  const g = retanguloTela(72);
  embutido.style.cssText = `left:${Math.round(g.x)}px;top:${Math.round(g.y)}px;width:${Math.round(g.l)}px;height:${Math.round(g.a)}px`;
}

/** Passo 9: a seção do Vértice vai para dentro da tela do monitor (conteúdo normal, alcançável por Tab). */
function montarSO() {
  const sec = document.getElementById('vertice');
  if (!sec || embutido.contains(sec) || sec.closest('#vista')) return;
  marca = document.createComment('vertice');
  sec.replaceWith(marca);
  embutido.append(sec);
  embutido.hidden = false;
  so.reiniciar();
  posicionarEmbutido();
}

export function desmontarSO() {
  const sec = document.getElementById('vertice');
  embutido.hidden = true;
  if (sec && marca && embutido.contains(sec)) marca.replaceWith(sec);
  marca = null;
}

function tracoAtivo() {
  for (const t of tracos) {
    const n = t.classList.contains('traco-monitor') ? ULTIMO : Number(t.dataset.n);
    t.toggleAttribute('data-feito', n <= passo);
    t.toggleAttribute('data-atual', n === passo);
  }
}

async function definirPasso(n: number, animar = true) {
  if (n === passo) return;
  const minha = ++rodada;
  const saiuDoNove = passo === ULTIMO;
  passo = n;
  palco.dataset.passo = String(n);
  raiz.dataset.passo = String(n);
  tracoAtivo();
  if (n > 0) interagiu();
  if (saiuDoNove) desmontarSO();
  if (palco.dataset.estado !== 'repouso') return;
  const chegou = await cam.ir(cameraDoPasso(n), 500, '--ease-out', animar);
  if (chegou && minha === rodada && n === ULTIMO) montarSO();
}

/** Volta ao topo e ao passo 0, na hora. */
export function sair() {
  scrollTo({ top: 0, behavior: 'instant' });
  void definirPasso(0, false);
}

function irMonitor() {
  passos[ULTIMO]?.scrollIntoView({ block: 'center', behavior: 'instant' });
  void definirPasso(ULTIMO, true);
}

/** A vista fechou: a câmera volta ao passo em que o visitante estava. */
export async function retomar(animar: boolean) {
  const ok = await cam.ir(cameraDeRepouso(), 320, '--ease-std', animar);
  if (ok && passo === ULTIMO) montarSO();
  return ok;
}

export function iniciarTour() {
  if (!passos.length) return;
  const io = new IntersectionObserver(
    (entradas) => {
      if (mobile.matches || !modoQuarto()) return;
      for (const e of entradas) if (e.isIntersecting) void definirPasso(Number((e.target as HTMLElement).dataset.passo));
    },
    { rootMargin: '-45% 0px -45% 0px' },
  );
  for (const p of passos) io.observe(p);

  palco.querySelector('[data-tour-sair]')?.addEventListener('click', sair);
  palco.querySelector('[data-tour-monitor]')?.addEventListener('click', irMonitor);

  // Esc durante o tour = "Sair do tour" (o Esc das vistas e das janelas do SO é tratado antes).
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.defaultPrevented || passo === 0 || !modoQuarto() || mobile.matches) return;
    if (palco.dataset.estado !== 'repouso' || document.querySelector('html[data-intro]')) return;
    sair();
  });

  addEventListener('resize', () => {
    requestAnimationFrame(() => {
      if (palco.dataset.estado === 'repouso') {
        cam.reaplicar();
        if (!embutido.hidden) posicionarEmbutido();
      }
    });
  });
}
