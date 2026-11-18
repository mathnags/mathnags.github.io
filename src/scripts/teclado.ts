/**
 * Teclado no palco (design 7.1): setas, Home e End movem o foco entre objetos; Espaço abre (Enter já é do link).
 * Sem atalhos de tecla única: só vale com o foco num objeto e sem modificadores.
 */
import { links, palco } from './ctx';

export function iniciarTeclado() {
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
