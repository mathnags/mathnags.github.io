/**
 * Tour guiado pela rolagem (design 12.13.2, 13.5.2). O palco fica sticky; os cartões HTML rolam no fluxo normal da página, um
 * por passo, e um IntersectionObserver (sem listener de scroll) leva a câmera 3D ao objeto do passo no centro da tela
 * (cena.irPara(passo), com as áreas livres de 13.5.2). Nunca prende a rolagem: nenhum preventDefault em wheel/touch/teclas.
 * Passo 0 = quarto inteiro; 1 a 8 = capítulos; 9 = o SO embutido na tela do monitor, sem <dialog> (só em tela cheia).
 * "Sair do tour" e "Ir para o monitor" ficam sempre visíveis; Esc = sair. No mobile (13.9) o tour é a lista de cartões
 * da base (45%) com a câmera nos 55% de cima; sem a cena, os cartões nem aparecem (os nichos de texto fazem o papel).
 */
import { interagiu } from './anotacoes';
import { cenaAtual, aoMudarCena } from './ponte';
import { moldura } from './molduras';
import { html, mobile, modoQuarto, palco, principais } from './ctx';
import * as so from './so';

const raiz = document.getElementById('quarto')!;
const passos = [...document.querySelectorAll<HTMLElement>('.passo')];
const tracos = [...palco.querySelectorAll<HTMLElement>('.traco')];
const embutido = palco.querySelector<HTMLElement>('.so-tour')!;
const ULTIMO = 9;
let passo = 0;
let marca: Comment | null = null;
let rodada = 0;

export const passoAtual = () => passo;

/** Posiciona o SO sobre a tela 3D do monitor (a mesma geometria da vista do 01). */
function posicionarEmbutido() {
  const m = principais[0];
  const g = moldura(m, html.clientWidth, html.clientHeight);
  embutido.style.cssText = `left:${Math.round(g.x)}px;top:${Math.round(g.y)}px;width:${Math.round(g.l)}px;height:${Math.round(g.a)}px`;
}

/** Passo 9: a seção do Vértice vai para dentro da tela do monitor (conteúdo normal, alcançável por Tab). */
function montarSO() {
  if (mobile.matches) return;
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
  // Com uma vista aberta a cena não voa: só atualiza a pose de volta (o passo em que o visitante vai estar ao fechar).
  const cena = cenaAtual();
  const chegou = cena ? await cena.irPara(n, { animar }) : true;
  if (chegou && minha === rodada && n === ULTIMO && palco.dataset.estado === 'repouso') montarSO();
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

/** A vista fechou: a câmera volta ao passo em que o visitante estava (700 ms). */
export async function retomar(animar: boolean) {
  const cena = cenaAtual();
  const ok = cena ? await cena.voltar({ animar }) : true;
  if (ok && passo === ULTIMO) montarSO();
  return ok;
}

export function iniciarTour() {
  if (!passos.length) return;
  const io = new IntersectionObserver(
    (entradas) => {
      if (!modoQuarto()) return;
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

  // A cena ficou pronta (ou mudou o tamanho): a câmera corta para o passo atual e o SO acompanha a tela do monitor.
  aoMudarCena(() => {
    const cena = cenaAtual();
    if (!cena) return;
    void cena.irPara(passo, { animar: false });
    cena.aoRedimensionar(() => {
      if (!embutido.hidden) posicionarEmbutido();
    });
    if (passo === ULTIMO && palco.dataset.estado === 'repouso') montarSO();
  });
}
