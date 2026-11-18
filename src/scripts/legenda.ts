/** Legenda do palco e realce do objeto em hover/foco (design 5.3 e 5.5). A legenda é aria-hidden. */
import { cena, links, palco } from './ctx';
import { aoRenderizar } from './lidos';

const nome = document.querySelector<HTMLElement>('.leg-nome');
const texto = document.querySelector<HTMLElement>('.leg-texto');
let ativo: HTMLAnchorElement | null = null;

function escrever(l: HTMLAnchorElement | null) {
  if (!nome || !texto) return;
  const alvo = l ?? links.find((x) => x.hasAttribute('data-proximo')) ?? null;
  nome.textContent = alvo ? `${alvo.dataset.num} · ${alvo.dataset.tema} · ${alvo.dataset.comum}` : '';
  texto.textContent = alvo?.dataset.legenda ?? '';
}

function ativar(l: HTMLAnchorElement | null) {
  if (palco.dataset.estado !== 'repouso') l = null;
  if (l === ativo) return;
  cena.querySelectorAll('.obj.ativo').forEach((g) => g.classList.remove('ativo'));
  if (l) cena.querySelector(`.obj[data-g="${l.dataset.objeto}"]`)?.classList.add('ativo');
  ativo = l;
  escrever(l);
}

export function iniciarLegenda() {
  const de = (e: Event) => (e.target as Element).closest<HTMLAnchorElement>('a.objeto');
  palco.addEventListener('pointerover', (e) => {
    if ((e as PointerEvent).pointerType !== 'touch') ativar(de(e));
  });
  palco.addEventListener('pointerout', (e) => {
    if ((e as PointerEvent).pointerType !== 'touch' && !palco.matches(':focus-within')) ativar(null);
  });
  palco.addEventListener('focusin', (e) => ativar(de(e)));
  palco.addEventListener('focusout', () => ativar(null));
  aoRenderizar(() => escrever(ativo));
  escrever(null);
}
