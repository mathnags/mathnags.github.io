/**
 * Intro "query carregando o quarto" (design 11.2). A decisão de mostrar (data-intro) e a linha do tempo são do
 * script inline do <head> e do CSS. Aqui só: Pular, Esc, clique no palco e o fim antecipado.
 */
import { html, links, palco } from './ctx';

export function terminarIntro() {
  if (!('intro' in html.dataset)) return;
  const overlay = palco.querySelector<HTMLElement>('[data-intro-overlay]');
  const focoNoOverlay = overlay?.contains(document.activeElement);
  overlay?.classList.add('saindo');
  setTimeout(() => {
    delete html.dataset.intro;
    overlay?.classList.remove('saindo');
    if (focoNoOverlay) links[0]?.focus({ preventScroll: true });
  }, 120);
}

export function iniciarIntro() {
  if (!('intro' in html.dataset)) return;
  palco.querySelector('[data-intro-overlay]')?.addEventListener('click', terminarIntro);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') terminarIntro();
  });
}
