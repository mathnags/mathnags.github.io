/**
 * Botão de modo (design 5.2): alterna data-modo sem recarregar, salva em localStorage.modo, mantém o #hash,
 * move o foco e anuncia o novo modo (textos em data-* do #status-modo, vindos do conteúdo).
 * Também é o ponto de fallback: sem WebGL2 ou com a cena lenta demais, a página cai no modo recrutador (13.10).
 */
import { pausarCena, retomarCena } from './carga';
import { guardar, html, modoQuarto } from './ctx';
import * as hist from './historico';
import { desmontarSO } from './tour';
import { fecharSemAnimar, sincronizar } from './vista';

const status = () => document.getElementById('status-modo');
const botao = () => document.querySelector<HTMLAnchorElement>('[data-modo-botao]');

function anunciar(texto: string) {
  const el = status();
  if (!el) return;
  el.textContent = '';
  requestAnimationFrame(() => {
    el.textContent = texto;
  });
}

function ajustarLink() {
  botao()?.setAttribute('href', modoQuarto() ? '?modo=recrutador' : '?modo=quarto');
}

function sairParaRecrutador() {
  fecharSemAnimar();
  desmontarSO();
  pausarCena();
  delete html.dataset.modo;
  delete html.dataset.intro;
  delete html.dataset.introEspera;
}

/** Fallback automático (sem WebGL2, quadros lentos demais): modo recrutador sem gravar a escolha e com o aviso lido. */
export function cairNoRecrutador(textoAviso: string) {
  if (!modoQuarto()) return;
  sairParaRecrutador();
  ajustarLink();
  anunciar(textoAviso);
  hist.dono(hist.idDoHash())?.el.scrollIntoView({ block: 'start' });
}

/** Alterna entre os dois modos (botão do HUD e botão "Modo recrutador" do cartão de erro). */
export function alternarModo() {
  const novo = modoQuarto() ? 'recrutador' : 'quarto';
  if (novo === 'recrutador') sairParaRecrutador();
  else {
    html.dataset.modo = 'quarto';
    retomarCena();
  }
  guardar('modo', novo);

  const url = new URL(location.href);
  url.searchParams.delete('modo');
  history.replaceState(history.state, '', url.pathname + url.search + url.hash);
  ajustarLink();
  anunciar(status()?.dataset[novo] ?? '');

  const alvo = hist.dono(hist.idDoHash());
  if (novo === 'recrutador') {
    const titulo = alvo?.sec ? alvo.sec.querySelector<HTMLElement>('h1, h2') : document.getElementById('nome');
    if (titulo) {
      titulo.tabIndex = -1;
      titulo.focus();
    }
    alvo?.el.scrollIntoView({ block: 'start' });
  } else {
    sincronizar(false);
  }
}

export function iniciarModo() {
  const b = botao();
  if (!b) return;

  const pedido = new URLSearchParams(location.search).get('modo');
  if (pedido === 'recrutador' || pedido === 'quarto') guardar('modo', pedido);
  ajustarLink();

  b.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    alternarModo();
  });

  // Sem WebGL2 o <head> já entrou no modo recrutador: avisa, depois do load, na região role="status".
  if ('semWebgl' in html.dataset) {
    const avisar = () => anunciar(status()?.dataset.semWebgl ?? '');
    if (document.readyState === 'complete') avisar();
    else addEventListener('load', avisar, { once: true });
  }
}
