/**
 * O monitor como "SO" (design 12.13.1): ícones abrem um arquivo por vez (janela única, sem arrastar), "×" e Esc fecham
 * e devolvem o foco ao ícone, setas movem entre os ícones. Só vale no modo quarto; no modo recrutador (e sem JS)
 * o CSS mostra os <article>s em sequência e nada disso é usado. A <section id="vertice"> é um único nó, movido
 * entre a página, a vista (<dialog>) e a tela do monitor no fim do tour.
 */
import { mobile, modoQuarto } from './ctx';

const sec = () => document.getElementById('vertice');
const so = () => sec()?.querySelector<HTMLElement>('[data-so]') ?? null;
const arquivos = () => [...(so()?.querySelectorAll<HTMLElement>('.so-arquivo') ?? [])];
const aberto = () => arquivos().find((a) => a.hasAttribute('data-aberto')) ?? null;
let escEm = 0;

/** true se o Esc acabou de ser tratado por uma janela do SO (o <dialog> não deve fechar). */
export const escRecente = () => performance.now() - escEm < 80;
/** Só conta se o SO está visível (depois de "Sair do tour" ele volta para a página, oculto). */
export const janelaAberta = () => modoQuarto() && aberto() !== null && (so()?.getClientRects().length ?? 0) > 0;

function marcar(id: string | null) {
  const raiz = so();
  if (!raiz) return;
  for (const a of arquivos()) a.toggleAttribute('data-aberto', a.id === id);
  for (const b of raiz.querySelectorAll<HTMLElement>('[data-so-abrir]')) b.setAttribute('aria-expanded', String(b.dataset.soAbrir === id));
  const aba = raiz.querySelector<HTMLElement>('.so-aba');
  const titulo = id ? document.getElementById(`${id}-titulo`) : null;
  if (aba) aba.textContent = titulo?.textContent ?? '';
  raiz.toggleAttribute('data-janela', id !== null);
}

export function abrir(id: string, focar: boolean) {
  marcar(id);
  if (focar) document.getElementById(`${id}-titulo`)?.focus({ preventScroll: true });
}

export function fechar(focar: boolean) {
  const id = aberto()?.id ?? null;
  marcar(null);
  if (focar && id) so()?.querySelector<HTMLElement>(`[data-so-abrir="${id}"]`)?.focus({ preventScroll: true });
}

/** Estado de entrada: no desktop o LEIA-ME já vem aberto; no mobile começa na área de trabalho. */
export function reiniciar() {
  const primeiro = arquivos()[0];
  if (mobile.matches || !primeiro) marcar(null);
  else marcar(primeiro.id);
}

export function iniciarSO() {
  document.addEventListener('click', (e) => {
    const alvo = e.target as Element;
    const abrirBtn = alvo.closest<HTMLElement>('[data-so-abrir]');
    if (abrirBtn && modoQuarto()) return abrir(abrirBtn.dataset.soAbrir ?? '', true);
    if (alvo.closest('[data-so-fechar]') && modoQuarto()) fechar(true);
  });

  // Esc fecha a janela (1º Esc); o 2º Esc cai no <dialog> ou no tour.
  document.addEventListener(
    'keydown',
    (e) => {
      if (e.key !== 'Escape' || !janelaAberta() || e.defaultPrevented) return;
      escEm = performance.now();
      e.preventDefault();
      e.stopImmediatePropagation();
      fechar(true);
    },
    true,
  );

  // Setas entre os ícones (todos continuam na ordem do Tab).
  document.addEventListener('keydown', (e) => {
    if (!modoQuarto() || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const atual = e.target instanceof Element ? e.target.closest<HTMLElement>('.so-icone') : null;
    if (!atual) return;
    const itens = [...(so()?.querySelectorAll<HTMLElement>('.so-icone') ?? [])];
    const i = itens.indexOf(atual);
    const prox = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? itens[i + 1] : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? itens[i - 1] : undefined;
    if (!prox) return;
    e.preventDefault();
    prox.focus();
  });
}
