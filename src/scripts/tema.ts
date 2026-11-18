/** Interruptor de luz = tema (design 5.7): aria-pressed, localStorage.tema e prefers-color-scheme. */
import { guardar, html } from './ctx';

export function iniciarTema() {
  const botao = document.querySelector<HTMLButtonElement>('[data-luz]');
  if (!botao) return;
  const sistema = matchMedia('(prefers-color-scheme: dark)');
  const escuro = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sistema.matches);
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
