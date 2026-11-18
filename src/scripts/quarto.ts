/**
 * Entrada do JS do site (módulo, sem bibliotecas). Cada parte é uma ilha pequena:
 * modo, tema, idioma, menu, e a camada do quarto (lidos, legenda, teclado, câmera, vista e histórico).
 * Nenhuma coordenada nem texto fixo: tudo vem de #quarto-config e dos atributos do HTML.
 */
import { iniciarCapitulos } from './capitulos';
import { iniciarIdioma } from './idioma';
import { iniciarIntro } from './intro';
import { iniciarLegenda } from './legenda';
import { render } from './lidos';
import { iniciarMenu } from './menu';
import { iniciarModo } from './modo';
import { iniciarTeclado } from './teclado';
import { iniciarTema } from './tema';
import { iniciarVista, sincronizar } from './vista';

iniciarTema();
iniciarIdioma();
iniciarMenu();
render();
iniciarCapitulos();
iniciarIntro();
iniciarLegenda();
iniciarTeclado();
iniciarVista();
iniciarModo();
// Link direto (/#exp-kpmg): abre a vista já aproximada, sem animação.
sincronizar(false);
