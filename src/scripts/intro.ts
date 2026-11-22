/**
 * Intro "query carregando o quarto" (design 11.2, 13.10). A decisão de mostrar (data-intro) e a linha do tempo são do
 * script inline do <head> e do CSS. A intro também é a tela de carregamento da cena: se a cena não estiver pronta no fim
 * da execução (cerca de 0,45 s), a linha do tempo pausa com a barra "executando…" indeterminada, e só continua (linha de
 * resultado, saída) quando a cena ficar pronta. "Pular" esconde a intro, mas não cancela o carregamento.
 */
import { html, palco } from './ctx';

export function terminarIntro() {
  if (!('intro' in html.dataset)) return;
  const overlay = palco.querySelector<HTMLElement>('[data-intro-overlay]');
  const focoNoOverlay = overlay?.contains(document.activeElement);
  overlay?.classList.add('saindo');
  setTimeout(() => {
    delete html.dataset.intro;
    delete html.dataset.introEspera;
    overlay?.classList.remove('saindo');
    if (focoNoOverlay) palco.querySelector<HTMLElement>('.postit-contato')?.focus({ preventScroll: true });
  }, 120);
}

/** Chamado quando o carregamento da cena começa: se a intro está rodando, vigia o momento da espera. */
export function vigiarEspera() {
  if (!('intro' in html.dataset)) return;
  setTimeout(() => {
    if ('intro' in html.dataset && html.dataset.cena !== 'pronta') html.dataset.introEspera = '';
  }, 450);
}

/** A cena ficou pronta: a linha do tempo da intro segue do ponto em que parou. */
export function retomarIntro() {
  delete html.dataset.introEspera;
}

export function iniciarIntro() {
  if (!('intro' in html.dataset)) return;
  const overlay = palco.querySelector('[data-intro-overlay]');
  overlay?.addEventListener('click', terminarIntro);
  // Rolar durante a intro equivale a "Pular" (design 12.13.2).
  addEventListener('wheel', terminarIntro, { passive: true, once: true });
  addEventListener('touchmove', terminarIntro, { passive: true, once: true });
  // Fim natural: o CSS já deixou o overlay hidden; aqui só limpa o estado do <html>.
  overlay?.addEventListener('animationend', (e) => {
    if ((e as AnimationEvent).animationName === 'intro-fim' && e.target === overlay) delete html.dataset.intro;
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') terminarIntro();
  });
}
