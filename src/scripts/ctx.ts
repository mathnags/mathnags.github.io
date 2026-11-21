/**
 * Referências e tipos compartilhados do script do quarto. Nenhuma coordenada ou texto fixo aqui:
 * tudo vem de #quarto-config (serializado pela config) e dos atributos que o HTML já traz.
 */
import type { CfgCliente } from '../cena/index';

export type { Rect } from '../cena/areas';
export type ObjCfg = CfgCliente['objetos'][number];

export const html = document.documentElement;
export const cfg: CfgCliente = JSON.parse(document.getElementById('quarto-config')?.textContent ?? '{"objetos":[],"anotacoes":[]}');
export const reduz = matchMedia('(prefers-reduced-motion: reduce)');
/** Estratégia mobile (design 13.9): largura < 768 ou proporção < 1.3. Complemento exato de "tela cheia". */
export const mobile = matchMedia('not all and (min-width: 768px) and (min-aspect-ratio: 13/10)');
export const palco = document.querySelector<HTMLElement>('.palco')!;
export const canvas = palco.querySelector<HTMLCanvasElement>('canvas.cena')!;
export const dialog = document.getElementById('vista') as HTMLDialogElement;
/** Links dos objetos: os post-its do palco e os nichos de texto (mobile sem 3D). Só um dos dois grupos aparece por vez. */
export const links = [...document.querySelectorAll<HTMLAnchorElement>('#quarto a.objeto, #quarto a.nicho')];
export const porId = new Map(cfg.objetos.map((o) => [o.id, o]));
export const modoQuarto = () => html.dataset.modo === 'quarto';
export const css = (nome: string) => getComputedStyle(html).getPropertyValue(nome).trim();
export const principais = [...cfg.objetos].sort((a, b) => a.capitulo - b.capitulo);
/** Link visível do objeto (palco ou nicho): é o que recebe o foco de volta. */
export const linkDe = (o: ObjCfg) => {
  const meus = links.filter((l) => l.dataset.objeto === o.id);
  return meus.find((l) => l.getClientRects().length > 0) ?? meus[0];
};
/** Objeto que abre um #id: o que tem esse destino ou, na falta, o dono da seção. */
export const objetoDe = (id: string, secaoId: string) =>
  cfg.objetos.find((o) => o.destino === id) ?? cfg.objetos.find((o) => o.secoes.includes(secaoId));
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function guardar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* armazenamento indisponível: segue sem persistir */
  }
}
