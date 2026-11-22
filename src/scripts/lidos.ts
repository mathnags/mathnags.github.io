/**
 * "Lido" (sessionStorage, por capítulo) e "próximo sugerido" nos marcadores (design 12.13.4).
 * Sem contador, pontuação ou recompensa. Os textos dos estados vêm de data-* escritos pelo HTML.
 */
import { links } from './ctx';

const CHAVE = 'lidos';
const lidos = new Set<number>();
const ouvintes: (() => void)[] = [];
/** Registra um ouvinte; devolve a função que o remove. */
export const aoRenderizar = (fn: () => void) => {
  ouvintes.push(fn);
  return () => void ouvintes.splice(ouvintes.indexOf(fn) >>> 0, 1);
};

try {
  (JSON.parse(sessionStorage.getItem(CHAVE) ?? '[]') as number[]).forEach((n) => lidos.add(n));
} catch {
  /* sem sessionStorage */
}

export function render() {
  const proximo = [...new Set(links.map((l) => Number(l.dataset.cap)))].sort((a, b) => a - b).find((c) => !lidos.has(c));
  for (const l of links) {
    const cap = Number(l.dataset.cap);
    const lido = lidos.has(cap);
    const sugerido = cap === proximo;
    l.toggleAttribute('data-lido', lido);
    l.toggleAttribute('data-proximo', sugerido);
    const estado = l.querySelector<HTMLElement>('.estado');
    if (estado) {
      const texto = lido ? estado.dataset.lido : sugerido ? estado.dataset.proximo : '';
      estado.textContent = texto ? `(${texto})` : '';
    }
  }
  ouvintes.forEach((fn) => fn());
}

export function marcarLido(cap: number) {
  lidos.add(cap);
  try {
    sessionStorage.setItem(CHAVE, JSON.stringify([...lidos]));
  } catch {
    /* segue sem persistir */
  }
  render();
}
