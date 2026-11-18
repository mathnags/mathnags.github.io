/**
 * Pílula numerada de capítulos (design 11.4): estados (ativo, lido, próximo, foco no quarto), rótulo do botão
 * do mobile e a mudança da pílula entre a página e o <dialog> (uma única instância, como as seções).
 * Nenhum texto fixo: nomes e números vêm do HTML (CapitulosLista.astro).
 */
import { dialog, links, mobile } from './ctx';
import { aoRenderizar } from './lidos';

const slot = document.querySelector<HTMLElement>('.capitulos-slot');
const itens = () => [...document.querySelectorAll<HTMLAnchorElement>('[data-cap-link]')];
const rotuloBotao = dialog.querySelector<HTMLElement>('.vista-cap-rotulo');
let espaco: HTMLElement | null = null;

function refletirEstados() {
  for (const a of itens()) {
    const principal = links.find((l) => l.dataset.papel === 'principal' && l.dataset.cap === a.dataset.cap);
    a.toggleAttribute('data-lido', !!principal?.hasAttribute('data-lido'));
    a.toggleAttribute('data-proximo', !!principal?.hasAttribute('data-proximo'));
  }
}

/** Capítulo da vista aberta (null = nenhuma). */
export function marcarAtivo(cap: number | null) {
  for (const a of itens()) {
    if (cap !== null && Number(a.dataset.cap) === cap) a.setAttribute('aria-current', 'true');
    else a.removeAttribute('aria-current');
  }
  const atual = cap === null ? null : itens().find((a) => Number(a.dataset.cap) === cap);
  if (rotuloBotao) {
    rotuloBotao.textContent = atual ? `${atual.querySelector('.num')?.textContent} · ${atual.querySelector('.nome')?.textContent}` : '';
  }
}

/** Objeto em hover ou foco no quarto: o item da pílula acompanha. */
export function focoNoCapitulo(cap: number | null) {
  for (const a of itens()) a.toggleAttribute('data-foco', cap !== null && Number(a.dataset.cap) === cap);
}

/** Desktop e tablet: leva a pílula para o <dialog>, na mesma posição da tela. */
export function paraDialog() {
  if (!slot || mobile.matches || espaco) return;
  const r = slot.getBoundingClientRect();
  if (r.width === 0) return;
  espaco = document.createElement('div');
  espaco.className = 'capitulos-espaco';
  espaco.style.gridArea = 'barra';
  espaco.style.height = `${r.height}px`;
  slot.replaceWith(espaco);
  slot.style.left = `${Math.round(r.left)}px`;
  slot.style.top = `${Math.round(r.top)}px`;
  slot.style.width = `${Math.round(r.width)}px`;
  slot.style.bottom = 'auto';
  dialog.querySelector('.vista-quadro')?.append(slot);
}

export function paraPagina() {
  if (!slot || !espaco) return;
  espaco.replaceWith(slot);
  slot.removeAttribute('style');
  espaco = null;
}

export function iniciarCapitulos() {
  aoRenderizar(refletirEstados);
  refletirEstados();
}
