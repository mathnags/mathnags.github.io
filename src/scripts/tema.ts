/**
 * Interruptor de luz = tema (design 12.13.6, 13.7): aria-pressed, localStorage.tema e prefers-color-scheme.
 * A cena 3D ouve a mudança de data-theme no <html> (MutationObserver) e interpola as luzes em 320 ms; aqui só
 * o estado do botão e a escolha salva.
 */
import { guardar, html } from './ctx';

const sistema = matchMedia('(prefers-color-scheme: dark)');
const escuro = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sistema.matches);

export function iniciarTema() {
  const botao = document.querySelector<HTMLButtonElement>('[data-luz]');
  if (!botao) return;
  const sincronizar = () => botao.setAttribute('aria-pressed', String(escuro()));
  botao.addEventListener('click', () => {
    const novo = escuro() ? 'light' : 'dark';
    html.dataset.theme = novo;
    guardar('tema', novo);
    sincronizar();
  });
  sistema.addEventListener('change', sincronizar);
  sincronizar();
}
