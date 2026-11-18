/**
 * Entrada do JS do site (módulo, sem bibliotecas). Cada parte é uma ilha pequena:
 * modo, tema (e imagem dia/noite), idioma, menu, e a camada do quarto (lidos, teclado, câmera, vista, tour e SO).
 * Nenhuma coordenada nem texto fixo: tudo vem de #quarto-config e dos atributos do HTML.
 */
import { html } from './ctx';
import { iniciarAnotacoes } from './anotacoes';
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

// Calibração visual (só em desenvolvimento): ?calibrar=1 desenha cliques, post-its e a parede do nome sobre a imagem.
if (import.meta.env.DEV && new URLSearchParams(location.search).has('calibrar')) html.dataset.calibrar = '';

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
// Link direto (/#exp-kpmg): abre a vista já aproximada, sem animação.
sincronizar(false);
