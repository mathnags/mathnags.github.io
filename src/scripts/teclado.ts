/**
 * Teclado no palco (design 7.1): setas, Home e End movem o foco entre objetos; Espaço abre (Enter já é do link).
 * Sem atalhos de tecla única: só vale com o foco num objeto e sem modificadores.
 */
import { links, palco } from './ctx';

/**
 * Uma parada de Tab por destino: com os marcadores à vista, os botões "Abrir capítulo" do tour (mesmos destinos) saem da ordem de
 * Tab e da árvore de acessibilidade, mas continuam clicáveis. Sem marcadores (mobile), os botões são o caminho do teclado.
 */
function unificarParadas() {
  const marcadores = document.querySelector('a.objeto');
  const repetidos = () => {
    const ocultar = (marcadores?.getClientRects().length ?? 0) > 0;
    for (const a of document.querySelectorAll<HTMLAnchorElement>('.tour-abrir')) {
      if (ocultar) {
        a.tabIndex = -1;
        a.setAttribute('aria-hidden', 'true');
      } else {
        a.removeAttribute('tabindex');
        a.removeAttribute('aria-hidden');
      }
    }
  };
  repetidos();
  addEventListener('resize', repetidos);
  new MutationObserver(repetidos).observe(document.documentElement, { attributes: true, attributeFilter: ['data-modo', 'data-cena'] });
}

export function iniciarTeclado() {
  unificarParadas();
  palco.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const atual = (e.target as Element).closest<HTMLAnchorElement>('a.objeto');
    if (!atual || palco.dataset.estado !== 'repouso') return;
    if (e.key === ' ') {
      e.preventDefault();
      atual.click();
      return;
    }
    const visiveis = links.filter((l) => l.getClientRects().length > 0);
    const i = visiveis.indexOf(atual);
    const destino =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? visiveis[i + 1]
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? visiveis[i - 1]
          : e.key === 'Home'
            ? visiveis[0]
            : e.key === 'End'
              ? visiveis[visiveis.length - 1]
              : undefined;
    if (!destino) return;
    e.preventDefault();
    destino.focus();
  });
}
