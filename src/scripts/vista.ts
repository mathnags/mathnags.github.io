/**
 * Vista (design 4.4, 5.6, 12.5): zoom da câmera por transform, <dialog id="vista">, seção(ões) movida(s) para dentro e
 * devolvida(s), navegação anterior/próximo e histórico. Posições, destinos e enquadramentos vêm de #quarto-config.
 */
import * as cam from './camera';
import * as hist from './historico';
import { interagiu } from './anotacoes';
import { marcarLido } from './lidos';
import * as so from './so';
import * as tour from './tour';
import { cfg, clamp, css, dialog, html, linkDe, mobile, modoQuarto, objetoDe, palco, principais, reduz, type ObjCfg } from './ctx';

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
/** Seções movidas para o miolo, cada uma com a marca do lugar de onde saiu. */
let movidas: { sec: HTMLElement; marca: Comment }[] = [];
let h2: HTMLElement | null = null;
let marcaH2: Comment | null = null;
let rodada = 0;

const BARRA_PX = 56;
const FOLGA_PX = 8;

function definirEstado(e: Estado) {
  estado = e;
  palco.dataset.estado = e;
}

/** Posição da moldura (px, na tela), a partir da config. No mobile, o CSS cobre a tela. */
function geometria(obj: ObjCfg) {
  dialog.dataset.vista = obj.vista.tipo;
  if (mobile.matches) return;
  const vw = html.clientWidth;
  const vh = html.clientHeight;
  const def = (nome: string, v: number) => quadro.style.setProperty(nome, `${Math.round(v)}px`);
  let x: number;
  let y: number;
  let l: number;
  let a: number;
  if (obj.vista.tipo === 'tela') {
    ({ x, y, l, a } = tour.retanguloTela(BARRA_PX));
  } else if (obj.vista.janela) {
    // Vista "dentro": a moldura cobre a janela do objeto (depois do zoom), com mínimo de legibilidade.
    const j = obj.vista.janela;
    const r = cam.retanguloFinal(cam.cameraAtual());
    const jx = r.left + (j.x / 100) * r.width;
    const jy = r.top + (j.y / 100) * r.height;
    const jl = (j.l / 100) * r.width;
    const ja = (j.a / 100) * r.height;
    l = Math.min(vw - 2 * FOLGA_PX, Math.max(jl, Math.min(560, vw * 0.92)));
    a = Math.min(vh - BARRA_PX - 2 * FOLGA_PX, Math.max(ja, Math.min(360, vh * 0.8)));
    x = clamp(jx - (l - jl) / 2, FOLGA_PX, vw - l - FOLGA_PX);
    y = clamp(jy - (a - ja) / 2, BARRA_PX + FOLGA_PX, vh - a - FOLGA_PX);
  } else {
    // Painel estilizado: cerca de 60% da tela, do lado definido na config (o objeto fica no lado oposto).
    l = vw * 0.6;
    a = vh - BARRA_PX - 2 * FOLGA_PX;
    x = obj.vista.lado === 'esquerda' ? vw * 0.02 : vw * 0.38;
    y = BARRA_PX + FOLGA_PX;
  }
  def('--mx', x);
  def('--my', y);
  def('--mw', l);
  def('--mh', a);
}

function colocar(obj: ObjCfg) {
  for (const id of obj.secoes) {
    const sec = document.getElementById(id);
    if (!(sec instanceof HTMLElement)) continue;
    const marca = document.createComment('vista');
    sec.replaceWith(marca);
    miolo.append(sec);
    movidas.push({ sec, marca });
  }
  const principal = movidas[movidas.length - 1]?.sec;
  h2 = principal?.querySelector<HTMLElement>(':scope > .secao-in > h2') ?? null;
  if (h2) {
    marcaH2 = document.createComment('titulo');
    h2.replaceWith(marcaH2);
    slotTitulo.append(h2);
    h2.tabIndex = -1;
    dialog.setAttribute('aria-labelledby', h2.id);
  }
  miolo.scrollTop = 0;
  if (obj.vista.tipo === 'tela') so.reiniciar();
}

function devolver() {
  if (h2 && marcaH2) {
    h2.removeAttribute('tabindex');
    marcaH2.replaceWith(h2);
  }
  for (const { sec, marca } of [...movidas].reverse()) marca.replaceWith(sec);
  movidas = [];
  h2 = marcaH2 = null;
  dialog.removeAttribute('aria-labelledby');
}

function realcar(el: HTMLElement) {
  el.classList.add('alvo');
  setTimeout(() => el.classList.remove('alvo'), reduz.matches ? 3000 : 1800);
}

function rolarPara(id: string, obj: ObjCfg) {
  const el = document.getElementById(id);
  if (el && id !== obj.destino && id !== 'ficha') {
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
    const l = o ? linkDe(o) : null;
    if (o && alvo && l) {
      const c = document.createElement('span');
      c.className = 'c';
      c.textContent = ` ${l.querySelector('.p-nome')?.textContent ?? ''}`;
      alvo.replaceChildren(l.querySelector('.p-num')?.textContent ?? '', c);
    }
  };
  rotulo(principais.find((o) => o.capitulo === obj.capitulo - 1), botaoAnt);
  rotulo(principais.find((o) => o.capitulo === obj.capitulo + 1), botaoProx);
}

const fade = (el: Element, de: number, para: number, ms: number) =>
  el.animate([{ opacity: de }, { opacity: para }], { duration: ms, easing: 'linear', fill: 'none' }).finished;

/** FLIP do mobile: o quadro cresce do nicho até a tela cheia (e volta). */
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
  if (movidas.length) devolver();
  objAtual = obj;
  definirEstado('aproximando');
  interagiu();
  if (viajando) dialog.dataset.fase = 'trocando';
  // O painel não espera o zoom: aparece junto com ele (fade de 200 ms), já na posição final.
  const zoom = mobile.matches ? Promise.resolve(true) : cam.ir(obj.vista.camera, 400, '--ease-out', comAnimacao);
  if (viajando && !mobile.matches) {
    const chegou = await zoom;
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
  rolarPara(alvoId, obj);
  if (obj.vista.tipo !== 'tela' || mobile.matches) h2?.focus({ preventScroll: true });
  else document.getElementById('vertice-leiame-titulo')?.focus({ preventScroll: true });
  if (comAnimacao && !jaAberto) {
    if (mobile.matches) await flip(true);
    else {
      void fade(moldura, 0, 1, 200);
      void fade(barra, 0, 1, 200);
    }
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
  dialog.removeAttribute('data-fase');
  if (!mobile.matches) await tour.retomar(comAnimacao);
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
  dialog.removeAttribute('data-fase');
  void tour.retomar(false);
  objAtual = null;
  definirEstado('repouso');
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
  if (estado === 'aberto' && objAtual?.destino === obj.destino) {
    rolarPara(id, obj);
    return;
  }
  origem = linkDe(obj);
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
  origem = linkDe(obj);
  void mostrar(obj, alvoId, true, true);
}

export function iniciarVista() {
  // Post-its, nichos e botões "Abrir capítulo": abrem a vista (ou ignoram durante o zoom).
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-objeto]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!modoQuarto()) return;
    e.preventDefault();
    const obj = cfg.objetos.find((o) => o.id === a.dataset.objeto);
    if (!obj || estado !== 'repouso') return;
    origem = a;
    hist.empurrar(obj.destino);
    void mostrar(obj, obj.destino, true);
  });

  // Links internos para outra vista, a partir do SO embutido no tour (#alem-games) ou de dentro do <dialog>.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.dataset.objeto !== undefined) return;
    const emTour = a.closest('.so-tour');
    const emVista = a.closest('#vista');
    if (!emTour && !emVista) return;
    const id = decodeURIComponent(a.getAttribute('href')!.slice(1));
    const d = hist.dono(id);
    const obj = d ? objetoDe(id, d.sec.id) : undefined;
    if (!d || !obj) return;
    e.preventDefault();
    if (emTour && estado === 'repouso') {
      origem = linkDe(obj);
      hist.empurrar(id);
      void mostrar(obj, id, true);
    } else if (objAtual && obj.destino === objAtual.destino) {
      hist.substituir(id);
      rolarPara(id, objAtual);
    } else {
      irPara(obj, id);
    }
  });

  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    if (so.escRecente()) return;
    if (so.janelaAberta()) {
      so.fechar(true);
      return;
    }
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

  addEventListener('popstate', () => sincronizar(true));
  let pendente = false;
  addEventListener('resize', () => {
    if (pendente || !objAtual || estado !== 'aberto') return;
    pendente = true;
    requestAnimationFrame(() => {
      pendente = false;
      if (objAtual) {
        cam.reaplicar();
        geometria(objAtual);
      }
    });
  });
}
