/**
 * Carregamento sob demanda da cena 3D (design 13.10). O `three` só entra por `import('../cena/index')`, que é o ÚNICO caminho:
 * depois do `load`, em requestIdleCallback (timeout 2000 ms; sem suporte, setTimeout 200 ms), no modo quarto. Enquanto carrega,
 * a página já está pronta em HTML (nome plano, HUD, intro SQL como tela de carregamento ou a pílula de status). Falhas
 * mostram o cartão de erro, sem troca automática de modo. No celular o 3D também carrega sozinho, no nível leve.
 */
import { canvas, cfg, html, mobile, modoQuarto, palco, reduz } from './ctx';
import { retomarIntro, terminarIntro, vigiarEspera } from './intro';
import { alternarModo, cairNoRecrutador } from './modo';
import { cenaAtual, definirCena } from './ponte';
import { passoAtual } from './tour';
import { objAbertoAgora } from './vista';

type Estado = 'ocioso' | 'carregando' | 'pronta' | 'erro';
let estado: Estado = 'ocioso';
/** O <canvas> atual: depois de uma falha de contexto WebGL ele é trocado por um novo, porque o antigo não aceita outro contexto. */
let canvasAtual = canvas;
let tentativas = 0;
const pilula = () => palco.querySelector<HTMLElement>('.carregando');
const cartaoErro = () => palco.querySelector<HTMLElement>('.erro-cena');

function definir(e: Estado) {
  estado = e;
  html.dataset.cena = e;
  const p = pilula();
  const txt = p?.querySelector<HTMLElement>('.carregando-txt');
  // O texto entra só quando o carregamento começa: a região role="status" anuncia a mudança.
  if (txt) txt.textContent = e === 'carregando' ? (p?.dataset.texto ?? '') : '';
  const c = cartaoErro();
  if (c) c.hidden = e !== 'erro';
}

const postitsDoPalco = () => [...palco.querySelectorAll<HTMLAnchorElement>('a.objeto')];

/** Anotações: o texto, os traços da seta e o que a config diz (deslocamento, largura máxima). */
function anotacoesDoPalco() {
  return cfg.anotacoes.map((a, i) => {
    const el = palco.querySelector<HTMLElement>(`.anot[data-anot="${a.id}"]`)!;
    const tracos = [...palco.querySelectorAll<SVGPathElement>(`.setas path[data-seta="${i}"]`)];
    return a.id === 'comece'
      ? { el, tracos, tipo: 'comece' as const, dx: a.dx, dy: a.dy, larguraMax: a.larguraMax, relativoA: a.relativoA }
      : { el, tracos, tipo: 'role' as const, larguraMax: a.larguraMax };
  });
}

type CenaCarregada = NonNullable<ReturnType<typeof cenaAtual>>;

/** O destaque da cena segue o foco e o hover do post-it (e o hover na cena marca data-hover no link, em aoHover). */
function ligarLinks(cena: CenaCarregada) {
  for (const a of postitsDoPalco()) {
    const id = a.dataset.objeto as Parameters<CenaCarregada['destacar']>[0];
    const ligar = () => cena.destacar(id);
    const desligar = () => cena.destacar(null);
    a.addEventListener('mouseenter', ligar);
    a.addEventListener('mouseleave', desligar);
    a.addEventListener('focus', ligar);
    a.addEventListener('blur', desligar);
  }
}

/** Executa fn quando a intro (se estiver rodando) terminar. */
function aposIntro(fn: () => void) {
  if (!('intro' in html.dataset)) return fn();
  const obs = new MutationObserver(() => {
    if ('intro' in html.dataset) return;
    obs.disconnect();
    fn();
  });
  obs.observe(html, { attributes: true, attributeFilter: ['data-intro'] });
}

function falhar() {
  definirCena(null);
  definir('erro');
  terminarIntro();
}

export async function carregarCena(): Promise<void> {
  if (estado === 'carregando' || estado === 'pronta') return;
  if (!modoQuarto()) return;
  definir('carregando');
  vigiarEspera();
  if (tentativas++ > 0) {
    const novo = canvasAtual.cloneNode(false) as HTMLCanvasElement;
    novo.removeAttribute('data-visivel');
    novo.style.cursor = '';
    canvasAtual.replaceWith(novo);
    canvasAtual = novo;
  }
  let criada: NonNullable<ReturnType<typeof cenaAtual>> | null = null;
  try {
    const mod = await import('../cena/index');
    const nivel = mod.escolherNivel(mobile.matches);
    const cena = await mod.iniciar({
      cfg,
      palco,
      canvas: canvasAtual,
      bloco: palco.querySelector<HTMLElement>('.parede-bloco'),
      postits: postitsDoPalco(),
      anotacoes: anotacoesDoPalco(),
      nivel,
      reduz: () => reduz.matches,
      aoHover: (id) => {
        for (const a of postitsDoPalco()) a.toggleAttribute('data-hover', a.dataset.objeto === id);
      },
      aoClicar: (id) => postitsDoPalco().find((a) => a.dataset.objeto === id)?.click(),
      aoFalha: (motivo) => {
        if (motivo === 'lento') cairNoRecrutador(document.getElementById('status-modo')?.dataset.semWebgl ?? '');
        else {
          criada?.destruir();
          falhar();
        }
      },
    });
    criada = cena;
    if (!modoQuarto()) {
      // O visitante trocou de modo enquanto a cena montava: fica guardada e pausada para o retorno.
      cena.pausar();
      estado = 'ocioso';
      definirCena(cena);
      return;
    }
    ligarLinks(cena);
    definirCena(cena);
    definir('pronta');
    retomarIntro();
    // Chegada só na visão geral, sem vista aberta nem passo do tour; senão, a câmera já cortou para o foco certo.
    // Se a intro ainda está na tela, a chegada espera o fim dela: o visitante vê o voo, não um quarto já parado atrás da intro.
    aposIntro(() => cena.mostrar(passoAtual() === 0 && !objAbertoAgora()));
  } catch (e) {
    if (e instanceof Error && e.message === 'sem-webgl') cairNoRecrutador(document.getElementById('status-modo')?.dataset.semWebgl ?? '');
    else falhar();
  }
}

export function pausarCena() {
  cenaAtual()?.pausar();
}

/** Volta ao modo quarto: retoma a cena já criada ou começa o carregamento. */
export function retomarCena() {
  const c = cenaAtual();
  if (c) {
    definir('pronta');
    c.retomar();
  } else void carregarCena();
}

export function iniciarCarga() {
  palco.querySelector('[data-cena-tentar]')?.addEventListener('click', () => {
    estado = 'ocioso';
    void carregarCena();
  });
  palco.querySelector('[data-cena-recrutador]')?.addEventListener('click', () => alternarModo());

  const agendar = () => {
    const iniciar = () => {
      if (modoQuarto()) void carregarCena();
    };
    if ('requestIdleCallback' in window) requestIdleCallback(iniciar, { timeout: 2000 });
    else setTimeout(iniciar, 200);
  };
  if (document.readyState === 'complete') agendar();
  else addEventListener('load', agendar, { once: true });
}
