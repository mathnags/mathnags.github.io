/**
 * Anotações à mão (design 12.13.5): aparecem no passo 0 depois da intro e somem depois da 1ª interação
 * (abrir um objeto ou iniciar o tour). A decisão fica em sessionStorage. Só a visibilidade é script; o resto é CSS.
 */
import { html } from './ctx';

const CHAVE = 'anotacoes-fim';

export function interagiu() {
  if ('anotFim' in html.dataset) return;
  html.dataset.anotFim = '';
  try {
    sessionStorage.setItem(CHAVE, '1');
  } catch {
    /* sem sessionStorage */
  }
}

export function iniciarAnotacoes() {
  try {
    if (sessionStorage.getItem(CHAVE)) html.dataset.anotFim = '';
  } catch {
    /* sem sessionStorage */
  }
}
