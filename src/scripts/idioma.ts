/** Seletor de idioma (design 5.8): preserva o #hash, para a vista reabrir na outra língua já aproximada. */
import { aoMudar } from './historico';

export function iniciarIdioma() {
  const seletores = [...document.querySelectorAll<HTMLAnchorElement>('a[data-idioma]')];
  for (const a of seletores) a.dataset.base = a.getAttribute('href') ?? '';
  const atualizar = () => {
    for (const a of seletores) a.setAttribute('href', (a.dataset.base ?? '') + location.hash);
  };
  aoMudar(atualizar);
  addEventListener('hashchange', atualizar);
  addEventListener('popstate', atualizar);
  atualizar();
}
