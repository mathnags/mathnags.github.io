/**
 * Interruptor de luz = tema (design 12.13.6, 12.4): aria-pressed, localStorage.tema e prefers-color-scheme.
 * Também escolhe a imagem do quarto: o <picture> já traz <source media="(prefers-color-scheme: dark)">; quando a
 * escolha manual difere do sistema, o `media` das fontes é reescrito (só a imagem do tema ativo é baixada).
 * A imagem do outro tema é pré-carregada com prioridade baixa quando o ponteiro passa pelo interruptor.
 */
import { guardar, html, palco, reduz } from './ctx';

const sistema = matchMedia('(prefers-color-scheme: dark)');
const escuro = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sistema.matches);
const fontes = () => [...document.querySelectorAll<HTMLSourceElement>('source[data-tema]')];

function aplicarImagens() {
  const manual = !!html.dataset.theme && (html.dataset.theme === 'dark') !== sistema.matches;
  const dark = escuro();
  for (const s of fontes()) {
    s.dataset.original ??= s.getAttribute('media') ?? '-';
    if (!manual) {
      if (s.dataset.original === '-') s.removeAttribute('media');
      else s.media = s.dataset.original;
    } else {
      s.media = (s.dataset.tema === 'dark') === dark ? (s.dataset.mq ?? 'all') : 'not all';
    }
  }
}

/** Baixa, com prioridade baixa, a imagem do tema oposto (a mesma variante de tela e de formato). */
let preaquecido = false;
function preaquecer() {
  if (preaquecido) return;
  preaquecido = true;
  const outro = escuro() ? 'light' : 'dark';
  const fonte = fontes().find((s) => s.dataset.tema === outro && s.type === 'image/avif' && matchMedia(s.dataset.mq ?? 'all').matches && palco.contains(s));
  if (!fonte) return;
  const img = new Image();
  img.fetchPriority = 'low';
  img.sizes = fonte.sizes;
  img.srcset = fonte.srcset;
}

export function iniciarTema() {
  const botao = document.querySelector<HTMLButtonElement>('[data-luz]');
  if (!botao) return;
  const sincronizar = () => botao.setAttribute('aria-pressed', String(escuro()));
  botao.addEventListener('click', () => {
    const novo = escuro() ? 'light' : 'dark';
    html.dataset.theme = novo;
    guardar('tema', novo);
    sincronizar();
    aplicarImagens();
    preaquecido = false;
    // A nova imagem entra com opacidade em 320 ms (instantâneo em reduced motion); até lá, a atual continua na tela.
    const img = palco.querySelector<HTMLImageElement>('.caixa img');
    if (img && !reduz.matches) img.addEventListener('load', () => img.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 320, easing: 'linear' }), { once: true });
  });
  botao.addEventListener('pointerenter', preaquecer, { once: true });
  botao.addEventListener('focus', preaquecer, { once: true });
  sistema.addEventListener('change', () => {
    sincronizar();
    aplicarImagens();
  });
  sincronizar();
  aplicarImagens();
}
