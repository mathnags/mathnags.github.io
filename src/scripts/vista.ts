/**
 * Vista (design 4.4, 5.6, 13.5.3, 13.8.4): voo da câmera 3D até o objeto, <dialog id="vista"> aberto aos 75% do voo,
 * seção(ões) movida(s) para dentro e devolvida(s), navegação anterior/próximo e histórico. Destinos e focos vêm de #quarto-config;
 * a geometria da moldura vem de molduras.ts (projeção da `janela` pela cena, ou o painel padrão sem ela).
 */
import * as hist from './historico';
import { interagiu } from './anotacoes';
import { marcarLido } from './lidos';
import { moldura as molduraDe } from './molduras';
import { aoMudarCena, cenaAtual } from './ponte';
import * as so from './so';
import * as tour from './tour';
import { cfg, css, dialog, html, linkDe, mobile, modoQuarto, objetoDe, palco, principais, reduz, type ObjCfg } from './ctx';

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

/** Há mais conteúdo abaixo? A moldura ganha data-mais e o CSS esmaece a borda inferior do miolo (sinal de rolagem). */
const indicarRolagem = () => moldura.toggleAttribute('data-mais', miolo.scrollHeight - miolo.scrollTop - miolo.clientHeight > 8);
const observador = new ResizeObserver(indicarRolagem);
miolo.addEventListener('scroll', indicarRolagem, { passive: true });

function definirEstado(e: Estado) {
  estado = e;
  palco.dataset.estado = e;
}

/** Posição da moldura (px, na tela). No mobile, o CSS a ancora na base como folha inferior de 70svh. */
function geometria(obj: ObjCfg) {
  dialog.dataset.vista = obj.vista.tipo;
  // Mobile: folha inferior de 70svh com a cena no topo; sem a cena, a vista cobre a tela (como os nichos de texto).
  dialog.dataset.folha = cenaAtual() ? 'baixo' : 'cheia';
  if (mobile.matches) return;
  const { x, y, l, a } = molduraDe(obj, html.clientWidth, html.clientHeight);
  const def = (nome: string, v: number) => quadro.style.setProperty(nome, `${Math.round(v)}px`);
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
    observador.observe(sec);
  }
  observador.observe(miolo);
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
  observador.disconnect();
  moldura.removeAttribute('data-mais');
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
    if (o && alvo && l) alvo.textContent = l.querySelector('.p-nome')?.textContent ?? '';
  };
  rotulo(principais.find((o) => o.capitulo === obj.capitulo - 1), botaoAnt);
  rotulo(principais.find((o) => o.capitulo === obj.capitulo + 1), botaoProx);
}

const fade = (el: Element, de: number, para: number, ms: number) =>
  el.animate([{ opacity: de }, { opacity: para }], { duration: ms, easing: 'linear', fill: 'none' }).finished;

/** Folha inferior do mobile: entra subindo da base (e sai descendo). */
function folha(ida: boolean) {
  const quadros = ida ? [{ transform: 'translateY(100%)' }, { transform: 'none' }] : [{ transform: 'none' }, { transform: 'translateY(100%)' }];
  return quadro.animate(quadros, { duration: 220, easing: css('--ease-out') }).finished;
}

/** Abre a vista na hora: seção movida para o dialog, moldura na geometria certa, foco no título. */
function abrirVista(obj: ObjCfg, alvoId: string, comAnimacao: boolean) {
  colocar(obj);
  geometria(obj);
  atualizarNavegacao(obj);
  dialog.removeAttribute('data-fase');
  const jaAberto = dialog.open;
  if (!jaAberto) dialog.showModal();
  definirEstado('aberto');
  marcarLido(obj.capitulo);
  rolarPara(alvoId, obj);
  // A rolagem nativa do #fragmento pode chegar depois (hashchange): reaplica nos próximos quadros.
  requestAnimationFrame(() => requestAnimationFrame(() => objAtual === obj && rolarPara(alvoId, obj)));
  // O navegador rola o #fragmento para o alvo ao fim do load, já dentro do miolo: repete a rolagem certa depois dele.
  if (document.readyState !== 'complete') addEventListener('load', () => setTimeout(() => objAtual === obj && rolarPara(alvoId, obj), 0), { once: true });
  if (obj.vista.tipo !== 'tela' || mobile.matches) h2?.focus({ preventScroll: true });
  else document.getElementById('vertice-leiame-titulo')?.focus({ preventScroll: true });
  if (comAnimacao) {
    // O painel entra com opacidade 0 → 1 e deslocamento de 16 px em --dur-reveal (160 ms).
    if (mobile.matches && !jaAberto) void folha(true);
    else {
      const ms = 160;
      void moldura.animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: ms, easing: css('--ease-out') }).finished;
      void fade(barra, 0, 1, ms);
    }
  }
}

async function mostrar(obj: ObjCfg, alvoId: string, animar: boolean, viajando = false) {
  const minha = ++rodada;
  const comAnimacao = animar && !reduz.matches;
  const cena = modoQuarto() ? cenaAtual() : null;
  if (viajando && comAnimacao) await fade(moldura, 1, 0, 120);
  if (minha !== rodada) return;
  if (movidas.length) devolver();
  objAtual = obj;
  definirEstado('aproximando');
  interagiu();
  if (viajando) dialog.dataset.fase = 'trocando';
  const abrir = () => {
    if (minha === rodada) abrirVista(obj, alvoId, comAnimacao);
  };
  // Com a cena: a câmera voa até o objeto e a vista abre aos 75% do voo. Sem ela (carregando, falha), abre na hora.
  if (cena) await cena.irPara(obj.id as never, { animar: comAnimacao, em75: abrir });
  else abrir();
}

async function fechar(animar: boolean) {
  if (estado === 'repouso') return;
  const minha = ++rodada;
  const comAnimacao = animar && !reduz.matches;
  definirEstado('afastando');
  if (dialog.open) {
    if (comAnimacao) {
      if (mobile.matches) await folha(false);
      else await fade(moldura, 1, 0, 120);
    }
    dialog.close();
  }
  devolver();
  dialog.removeAttribute('data-fase');
  await tour.retomar(comAnimacao);
  if (minha !== rodada) return;
  objAtual = null;
  definirEstado('repouso');
  origem?.focus({ preventScroll: true });
}

/** Fecha na hora, sem animação nem mudança de histórico (troca de modo). */
export function fecharSemAnimar() {
  rodada++;
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
  if (!hist.pedirVoltar()) void fechar(true);
}

function irPara(obj: ObjCfg, alvoId: string) {
  if (estado !== 'aberto') return;
  hist.substituir(alvoId);
  origem = linkDe(obj);
  void mostrar(obj, alvoId, true, true);
}

const semHover = matchMedia('(hover: none)');

/** Sem hover (toque): o 1º toque num objeto mostra o rótulo e a luz; o 2º abre. Devolve true se o toque foi só o 1º. */
function primeiroToque(a: HTMLAnchorElement, e: MouseEvent) {
  const toque = !e.isTrusted || e.detail > 0; // Enter/Espaço no teclado (detail 0 e confiável) abre direto
  if (!semHover.matches || !toque || !a.classList.contains('objeto') || a.hasAttribute('data-hover')) return false;
  for (const m of document.querySelectorAll('a.objeto[data-hover]')) m.removeAttribute('data-hover');
  a.setAttribute('data-hover', '');
  cenaAtual()?.destacar(a.dataset.objeto as never);
  setTimeout(() => {
    if (!a.hasAttribute('data-hover')) return;
    a.removeAttribute('data-hover');
    cenaAtual()?.destacar(null);
  }, 4000);
  return true;
}

export function iniciarVista() {
  // Marcadores, nichos e botões "Abrir capítulo": abrem a vista (ou ignoram durante o zoom).
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-objeto]');
    if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!modoQuarto()) return;
    e.preventDefault();
    const obj = cfg.objetos.find((o) => o.id === a.dataset.objeto);
    if (!obj || estado !== 'repouso') return;
    if (primeiroToque(a, e)) return;
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
  // A cena recalcula a câmera no próprio resize e avisa: a moldura acompanha a janela projetada.
  const reposicionar = () => {
    if (objAtual && estado === 'aberto') geometria(objAtual);
  };
  addEventListener('resize', () => requestAnimationFrame(reposicionar));
  // Link direto (/#exp-kpmg): a vista já abriu sem esperar o 3D; quando a cena fica pronta, a câmera corta para o foco.
  aoMudarCena(() => {
    const cena = cenaAtual();
    if (!cena) return;
    cena.aoRedimensionar(reposicionar);
    if (objAtual && estado !== 'repouso') {
      void cena.irPara(objAtual.id as never, { animar: false });
      reposicionar();
    }
  });
}

/** A vista está aberta (ou abrindo) agora? Usado pela carga da cena para decidir entre chegada e corte. */
export const objAbertoAgora = () => objAtual !== null;
