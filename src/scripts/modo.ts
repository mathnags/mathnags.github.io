/**
 * Botão de modo (design 5.2): alterna data-modo sem recarregar, salva em localStorage.modo, mantém o #hash,
 * move o foco e anuncia o novo modo (textos em data-* do #status-modo, vindos do conteúdo).
 */
import { guardar, html, modoQuarto } from './ctx';
import * as hist from './historico';
import { desmontarSO } from './tour';
import { fecharSemAnimar, sincronizar } from './vista';

export function iniciarModo() {
  const botao = document.querySelector<HTMLAnchorElement>('[data-modo-botao]');
  const status = document.getElementById('status-modo');
  if (!botao) return;

  const params = new URLSearchParams(location.search);
  const pedido = params.get('modo');
  if (pedido === 'recrutador' || pedido === 'quarto') guardar('modo', pedido);

  const ajustarLink = () => botao.setAttribute('href', modoQuarto() ? '?modo=recrutador' : '?modo=quarto');
  ajustarLink();

  botao.addEventListener('click', (e) => {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    const novo = modoQuarto() ? 'recrutador' : 'quarto';
    if (novo === 'recrutador') {
      fecharSemAnimar();
      desmontarSO();
      delete html.dataset.modo;
      delete html.dataset.intro;
    } else {
      html.dataset.modo = 'quarto';
    }
    guardar('modo', novo);

    const url = new URL(location.href);
    url.searchParams.delete('modo');
    history.replaceState(history.state, '', url.pathname + url.search + url.hash);
    ajustarLink();

    if (status) {
      status.textContent = '';
      requestAnimationFrame(() => {
        status.textContent = status.dataset[novo] ?? '';
      });
    }

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
  });
}
