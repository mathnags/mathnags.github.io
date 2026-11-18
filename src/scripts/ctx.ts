/**
 * Referências e tipos compartilhados do script do quarto. Nenhuma coordenada ou texto fixo aqui:
 * tudo vem de #quarto-config (serializado pela config) e dos atributos que o HTML já traz.
 */
export interface Rect {
  x: number;
  y: number;
  l: number;
  a: number;
}

export interface ObjCfg {
  id: string;
  capitulo: number;
  papel: 'principal' | 'secundario';
  destino: string;
  secao: string;
  vista: { tipo: string; camera: Rect; janela?: Rect; lado?: 'esquerda' | 'direita' };
}

export const html = document.documentElement;
export const cfg: { viewBox: { l: number; a: number }; objetos: ObjCfg[] } = JSON.parse(
  document.getElementById('quarto-config')?.textContent ?? '{"viewBox":{"l":1,"a":1},"objetos":[]}',
);
export const reduz = matchMedia('(prefers-reduced-motion: reduce)');
export const mobile = matchMedia('(max-width: 767px)');
export const palco = document.querySelector<HTMLElement>('.palco')!;
export const cena = palco.querySelector<SVGSVGElement>('svg.cena')!;
export const dialog = document.getElementById('vista') as HTMLDialogElement;
export const links = [...palco.querySelectorAll<HTMLAnchorElement>('a.objeto')];
export const porId = new Map(cfg.objetos.map((o) => [o.id, o]));
export const modoQuarto = () => html.dataset.modo === 'quarto';
export const css = (nome: string) => getComputedStyle(html).getPropertyValue(nome).trim();
export const linkDe = (o: ObjCfg) => links.find((l) => l.dataset.objeto === o.id)!;
export const principais = cfg.objetos.filter((o) => o.papel === 'principal').sort((a, b) => a.capitulo - b.capitulo);

export function guardar(chave: string, valor: string) {
  try {
    localStorage.setItem(chave, valor);
  } catch {
    /* armazenamento indisponível: segue sem persistir */
  }
}
