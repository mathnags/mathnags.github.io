/**
 * Vista (design 4.4, 5.6): zoom da câmera, <dialog id="vista">, seção movida para dentro e devolvida,
 * navegação anterior/próximo e histórico. Posições, destinos e enquadramentos vêm de #quarto-config.
 */
import * as cam from './camera';
import { marcarAtivo, paraDialog, paraPagina } from './capitulos';
import * as hist from './historico';
import { marcarLido } from './lidos';
import { cfg, css, dialog, linkDe, mobile, modoQuarto, palco, porId, principais, reduz, type ObjCfg } from './ctx';

type Estado = 'repouso' | 'aproximando' | 'aberto' | 'afastando';

const quadro = dialog.querySelector<HTMLElement>('.vista-quadro')!;
const barra = dialog.querySelector<HTMLElement>('.vista-barra')!;
const moldura = dialog.querySelector<HTMLElement>('.vista-moldura')!;
const miolo = dialog.querySelector<HTMLElement>('.vista-miolo')!;
const slotTitulo = dialog.querySelector<HTMLElement>('.vista-titulo')!;
const botaoAnt = dialog.querySelector<HTMLButtonElement>('.vista-ant')!;
const botaoProx = dialog.querySelector<HTMLButtonElement>('.vista-prox')!;

let estado: Estado = 'repouso';
let objAtual: ObjCfg | null = null;
let origem: HTMLElement | null = null;
let secao: HTMLElement | null = null;
let h2: HTMLElement | null = null;
let marcaSecao: Comment | null = null;
let marcaH2: Comment | null = null;
let rodada = 0;

const BARRA_PX = 56;
const FOLGA_PX = 8;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

function definirEstado(e: Estado) {
  estado = e;
  palco.dataset.estado = e;
}

/** Posição do quadro sobre o palco e da moldura dentro dele (px), a partir da config. No mobile, o CSS cobre a tela. */
function geometria(obj: ObjCfg) {
  dialog.dataset.vista = obj.vista.tipo;
  if (mobile.matches) return;
  const p = palco.getBoundingClientRect();
  const def = (nome: string, v: number) => quadro.style.setProperty(nome, `${Math.round(v)}px`);
  def('--qx', p.left);
  def('--qy', p.top);
  def('--qw', p.width);
  def('--qh', p.height);

  const maxL = p.width - 2 * FOLGA_PX;
  const maxA = p.height - BARRA_PX - 2 * FOLGA_PX;
  let x: number;
  let y: number;
  let l: number;
  let a: number;
  const j = obj.vista.janela;
  if (j) {
    // Vista "dentro": a moldura cobre a janela do objeto, com mínimo de legibilidade.
    const c = obj.vista.camera;
    const s = p.width / c.l;
    const jx = (j.x - c.x) * s;
    const jy = (j.y - c.y) * s;
    l = Math.min(maxL, Math.max(j.l * s, Math.min(560, p.width * 0.92)));
    a = Math.min(maxA, Math.max(j.a * s, Math.min(360, p.height * 0.8)));
    x = clamp(jx - (l - j.l * s) / 2, FOLGA_PX, p.width - l - FOLGA_PX);
    y = clamp(jy - (a - j.a * s) / 2, BARRA_PX + FOLGA_PX, p.height - a - FOLGA_PX);
  } else {
    // Painel estilizado: ocupa cerca de 60% do palco, do lado definido na config.
    l = p.width * 0.6;
    a = maxA;
    x = obj.vista.lado === 'esquerda' ? p.width * 0.02 : p.width * 0.38;
    y = BARRA_PX + FOLGA_PX;
  }
  def('--mx', x);
  def('--my', y);
  def('--mw', l);
  def('--mh', a);
}

function colocar(obj: ObjCfg) {
  const sec = document.getElementById(obj.secao);
  if (!(sec instanceof HTMLElement)) return;
  secao = sec;
  marcaSecao = document.createComment('vista');
  sec.replaceWith(marcaSecao);
  miolo.append(sec);
  h2 = sec.querySelector<HTMLElement>(':scope > .secao-in > h2');
  if (h2) {
    marcaH2 = document.createComment('titulo');
    h2.replaceWith(marcaH2);
    slotTitulo.append(h2);
    h2.tabIndex = -1;
    dialog.setAttribute('aria-labelledby', h2.id);
    miolo.setAttribute('aria-labelledby', h2.id);
  }
  miolo.scrollTop = 0;
}

function devolver() {
  if (h2 && marcaH2) {
    h2.removeAttribute('tabindex');
    marcaH2.replaceWith(h2);
  }
  if (secao && marcaSecao) marcaSecao.replaceWith(secao);
  secao = h2 = marcaSecao = marcaH2 = null;
  dialog.removeAttribute('aria-labelledby');
  miolo.removeAttribute('aria-labelledby');
}

function realcar(el: HTMLElement) {
  el.classList.add('alvo');
  setTimeout(() => el.classList.remove('alvo'), reduz.matches ? 3000 : 1800);
}

function rolarPara(id: string, obj: ObjCfg) {
  const el = document.getElementById(id);
  if (el && id !== obj.secao) {
    el.scrollIntoView({ block: 'start', behavior: 'auto' });
    realcar(el);
  } else {
    miolo.scrollTop = 0;
  }
}

function atualizarNavegacao(obj: ObjCfg) {
  const rotulo = (o: ObjCfg | undefined, botao: HTMLButtonElement) => {
    botao.hidden = !o;
    const alvo = botao.querySelector<HTMLElement>('.vista-alvo');
    if (o && alvo) {
      const l = linkDe(o);
      alvo.textContent = `${l.dataset.num} ${l.dataset.comum}`;
    }
  };
  rotulo(principais.find((o) => o.capitulo === obj.capitulo - 1), botaoAnt);
  rotulo(principais.find((o) => o.capitulo === obj.capitulo + 1), botaoProx);
}

const fade = (el: Element, de: number, para: number, ms: number) =>
  el.animate([{ opacity: de }, { opacity: para }], { duration: ms, easing: 'linear', fill: 'none' }).finished;

/** FLIP do mobile: o quadro cresce do ladrilho até a tela cheia (e volta). */
function flip(ida: boolean) {
  const r = origem?.getBoundingClientRect();
  if (!r) return Promise.resolve();
  const q = `translate(${r.left}px, ${r.top}px) scale(${r.width / innerWidth}, ${r.height / innerHeight})`;
  const quadros = ida ? [{ transform: q, opacity: 0.4 }, { transform: 'none', opacity: 1 }] : [{ transform: 'none', opacity: 1 }, { transform: q, opacity: 0 }];
  return quadro.animate(quadros, { duration: 300, easing: css('--ease-out'), transformOrigin: '0 0' } as KeyframeAnimationOptions).finished;
}

async function mostrar(obj: ObjCfg, alvoId: string, animar: boolean, viajando = false) {
  const minha = ++rodada;
  const comAnimacao = animar && !reduz.matches;
  if (secao) devolver();
  objAtual = obj;
  definirEstado('aproximando');
  if (viajando) dialog.dataset.fase = 'trocando';
  if (!mobile.matches) {
    const chegou = await cam.ir(obj.vista.camera, 400, '--ease-out', comAnimacao);
    if (!chegou || minha !== rodada) return;
  }
  colocar(obj);
  geometria(obj);
  atualizarNavegacao(obj);
  dialog.removeAttribute('data-fase');
  const jaAberto = dialog.open;
  if (!jaAberto) dialog.showModal();
  definirEstado('aberto');
  marcarLido(obj.capitulo);
  marcarAtivo(obj.capitulo);
  paraDialog();
  rolarPara(alvoId, obj);
  h2?.focus({ preventScroll: true });
  if (comAnimacao && !jaAberto) {
    if (mobile.matches) await flip(true);
    else await Promise.all([fade(moldura, 0, 1, 160), fade(barra, 0, 1, 160)]);
  }
}

async function fechar(animar: boolean) {
  if (estado === 'repouso') return;
  const minha = ++rodada;
  const comAnimacao = animar && !reduz.matches;
  cam.parar();
  definirEstado('afastando');
  if (dialog.open) {
    if (comAnimacao) {
      if (mobile.matches) await flip(false);
      else await fade(moldura, 1, 0, 120);
    }
    dialog.close();
  }
  devolver();
  paraPagina();
  marcarAtivo(null);
  dialog.removeAttribute('data-fase');
  if (!mobile.matches) await cam.ir(cam.inteira(), 320, '--ease-std', comAnimacao);
  if (minha !== rodada) return;
  objAtual = null;
  definirEstado('repouso');
  origem?.focus({ preventScroll: true });
}

/** Fecha na hora, sem animação nem mudança de histórico (troca de modo). */
export function fecharSemAnimar() {
  rodada++;
  cam.parar();
  if (dialog.open) dialog.close();
  devolver();
  paraPagina();
  marcarAtivo(null);
  dialog.removeAttribute('data-fase');
  cam.ir(cam.inteira(), 0, '--ease-std', false);
  objAtual = null;
  definirEstado('repouso');
}

/** Objeto que abre um #id: o que tem esse destino ou, na falta, o principal da seção dona. */
function objetoDe(id: string, secaoId: string) {
  return cfg.objetos.find((o) => o.destino === id) ?? principais.find((o) => o.secao === secaoId);
}

/** Abre (ou fecha) conforme o #id atual. Usado no carregamento, no popstate e na volta ao modo quarto. */
export function sincronizar(animarFechamento = true) {
  const id = hist.idDoHash();
  const d = modoQuarto() ? hist.dono(id) : null;
  const obj = d ? objetoDe(id, d.sec.id) : undefined;
  if (!obj) {
    if (estado !== 'repouso') void fechar(animarFechamento);
    return;
  }
  if (estado === 'aberto' && objAtual?.secao === obj.secao) {
    rolarPara(id, obj);
    return;
  }
  origem = linkDe(obj.papel === 'principal' ? obj : (principais.find((p) => p.capitulo === obj.capitulo) ?? obj));
  void mostrar(obj, id, false);
}

function pedirFechar() {
  if (estado === 'repouso') return;
  cam.parar();
  if (!hist.pedirVoltar()) void fechar(true);
}

function irPara(obj: ObjCfg, alvoId: string) {
  if (estado !== 'aberto') return;
  hist.substituir(alvoId);
  origem = linkDe(principais.find((p) => p.capitulo === obj.capitulo) ?? obj);
  void mostrar(obj, alvoId, true, true);
}

export function iniciarVista() {
  palco.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a.objeto');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const obj = porId.get(a.dataset.objeto ?? '');
    if (!obj || estado !== 'repouso' || !modoQuarto()) return;
    origem = a;
    hist.empurrar(obj.destino);
    void mostrar(obj, obj.destino, true);
  });

  // Pílula numerada (desktop) e lista do mobile: abre o capítulo, ou viaja de uma vista para outra.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('[data-cap-link]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const alvo = principais.find((o) => o.capitulo === Number(a.dataset.cap));
    if (!alvo) return;
    document.getElementById('cap-popover')?.hidePopover?.();
    if (estado === 'repouso' && modoQuarto()) linkDe(alvo).click();
    else if (estado === 'aberto' && objAtual?.capitulo !== alvo.capitulo) irPara(alvo, alvo.destino);
  });

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    pedirFechar();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && estado === 'aproximando' && !dialog.open) pedirFechar();
  });

  dialog.querySelector('[data-vista-voltar]')?.addEventListener('click', pedirFechar);
  for (const [botao, dir] of [[botaoAnt, -1], [botaoProx, 1]] as const) {
    botao.addEventListener('click', () => {
      const alvo = principais.find((o) => o.capitulo === (objAtual?.capitulo ?? 0) + dir);
      if (alvo) irPara(alvo, alvo.destino);
    });
  }

  // Links internos entre vistas (#alem-games dentro do Vértice, atalhos do mobile).
  dialog.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
    const d = hist.dono(id);
    const obj = d ? objetoDe(id, d.sec.id) : undefined;
    if (!d || !obj) return;
    e.preventDefault();
    if (objAtual && d.sec.id === objAtual.secao) {
      hist.substituir(id);
      rolarPara(id, objAtual);
    } else {
      irPara(obj, id);
    }
  });

  addEventListener('popstate', () => sincronizar(true));
  let pendente = false;
  addEventListener('resize', () => {
    if (pendente || !objAtual || estado !== 'aberto') return;
    pendente = true;
    requestAnimationFrame(() => {
      pendente = false;
      if (objAtual) geometria(objAtual);
    });
  });
}
