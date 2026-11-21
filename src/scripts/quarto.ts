/**
 * Entrada do JS do site (módulo, sem bibliotecas; o `three` NÃO entra aqui, só em ../cena/index via carga.ts). Cada parte é uma
 * ilha pequena: modo, tema, idioma, menu, e a camada do quarto (lidos, teclado, vista, tour e SO).
 * Nenhuma coordenada nem texto fixo: tudo vem de #quarto-config e dos atributos do HTML.
 */
import { html } from './ctx';
import { iniciarAnotacoes } from './anotacoes';
import { iniciarCarga } from './carga';
import { iniciarIdioma } from './idioma';
import { iniciarIntro } from './intro';
import { render } from './lidos';
import { iniciarMenu } from './menu';
import { iniciarModo } from './modo';
import { iniciarSO } from './so';
import { iniciarTeclado } from './teclado';
import { iniciarTema } from './tema';
import { iniciarTour } from './tour';
import { iniciarVista, sincronizar } from './vista';

// Calibração visual (só em desenvolvimento): ?calibrar=1 mostra alvos, focos, janelas e âncoras; ?calibrar=og enquadra a visão geral em 1200×630.
if (import.meta.env.DEV) {
  const c = new URLSearchParams(location.search).get('calibrar');
  if (c !== null) html.dataset.calibrar = c || '1';
}

iniciarTema();
iniciarIdioma();
iniciarMenu();
render();
iniciarAnotacoes();
iniciarIntro();
iniciarTeclado();
iniciarSO();
iniciarVista();
iniciarTour();
iniciarModo();
iniciarCarga();
// Link direto (/#exp-kpmg): abre a vista já na hora, sem esperar o 3D (a câmera corta quando a cena ficar pronta).
sincronizar(false);
