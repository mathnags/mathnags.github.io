/**
 * Histórico das vistas (arquitetura 5.5), centralizado aqui:
 * abrir a partir do quarto = pushState; anterior/próximo e links internos = replaceState;
 * fechar = history.back() se a vista veio de um pushState, senão replaceState sem hash.
 */
type Estado = { vista: string; push: boolean } | null;

const ouvintes: (() => void)[] = [];
export const aoMudar = (fn: () => void) => ouvintes.push(fn);
const avisar = () => ouvintes.forEach((fn) => fn());

export const idDoHash = () => {
  try {
    return decodeURIComponent(location.hash.slice(1));
  } catch {
    return '';
  }
};

/** Dono de um #id qualquer: a <section> ancestral do elemento (esteja em main ou no dialog). */
export function dono(id: string) {
  const el = id ? document.getElementById(id) : null;
  const sec = el?.closest<HTMLElement>('section.secao, section.ficha') ?? null;
  return el && sec ? { el, sec } : null;
}

export function empurrar(id: string) {
  history.pushState({ vista: id, push: true } satisfies Estado, '', `#${id}`);
  avisar();
}

export function substituir(id: string) {
  const push = (history.state as Estado)?.push === true;
  history.replaceState({ vista: id, push } satisfies Estado, '', `#${id}`);
  avisar();
}

export function limparHash() {
  history.replaceState(null, '', location.pathname + location.search);
  avisar();
}

/** true = o history.back() foi pedido e o popstate fará o resto. */
export function pedirVoltar(): boolean {
  if ((history.state as Estado)?.push === true) {
    history.back();
    return true;
  }
  limparHash();
  return false;
}
