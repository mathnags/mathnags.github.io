/**
 * ÚNICA fonte de posição, destino, câmera e vista dos objetos do quarto (docs/design.md 12.6, 12.13.7 e 9.2).
 * Mover, trocar ou remover um objeto é uma edição aqui.
 *
 * - Unidades: % da imagem mestre 16:9 (2560×1440). Calibradas sobre quarto-dia.jpeg; a da noite tem a mesma composição.
 * - Textos de cada objeto: textos.<lang>.json > quarto.objetos.<id> (tema, comum, legenda) e tour.<destino>.resumo.
 * - A config é validada ao ser importada (validarQuarto): um valor inválido derruba a build.
 * - O JS do cliente não tem coordenadas fixas: ele lê configCliente(), serializada no HTML em #quarto-config.
 * - Recortes do herói mobile e dos nichos (e o script das imagens) ficam em recortes.json.
 * - Calibração visual: abra a página em desenvolvimento com ?calibrar=1 para ver os retângulos sobre a imagem.
 */
import type { ConfigQuarto, ObjetoQuarto } from './tipos';
import { validarQuarto } from './validar-quarto';
import recortes from './recortes.json';

export const quarto: ConfigQuarto = validarQuarto({
  imagem: recortes.imagem,
  areasReservadas: [
    { nome: 'HUD esquerdo', area: { x: 0, y: 0, l: 22, a: 10 } },
    { nome: 'HUD direito', area: { x: 80, y: 0, l: 20, a: 12 } },
    { nome: 'trilho do tour', area: { x: 96, y: 25, l: 4, a: 50 } },
  ],
  paredeNome: { x: 26, y: 4, l: 34, a: 11 },
  postitContato: { x: 61, y: 5.5, rot: -5 },
  objetos: [
    {
      id: 'monitor', capitulo: 1, destino: 'vertice', secoes: ['vertice'],
      clique: { x: 10, y: 54, l: 11, a: 25 },
      postit: { x: 15.5, y: 49.5, rot: 4 },
      vista: { tipo: 'tela', camera: { cx: 16.7, cy: 62, escala: 3 }, janela: { x: 10.8, y: 55, l: 10, a: 20 } },
      tour: { camera: { cx: 31, cy: 62, escala: 1.6 }, lado: 'direita' },
    },
    {
      id: 'porta-retrato', capitulo: 2, destino: 'sobre', secoes: ['ficha', 'sobre'],
      clique: { x: 74, y: 60, l: 4.5, a: 10 },
      postit: { x: 81.5, y: 66.5, rot: -3 },
      vista: { tipo: 'porta-retrato', camera: { cx: 60.7, cy: 62, escala: 2 }, lado: 'esquerda' },
      tour: { camera: { cx: 72, cy: 62, escala: 1.8 }, lado: 'esquerda' },
    },
    {
      id: 'mural', capitulo: 3, destino: 'experiencia', secoes: ['experiencia'],
      clique: { x: 41, y: 31.5, l: 10.5, a: 19 },
      postit: { x: 46.25, y: 27.2, rot: 3 },
      vista: { tipo: 'cortica', camera: { cx: 46.3, cy: 41, escala: 1.8 }, janela: { x: 41.8, y: 32.5, l: 9, a: 17 } },
      tour: { camera: { cx: 58.8, cy: 41, escala: 1.6 }, lado: 'direita' },
    },
    {
      id: 'caderno', capitulo: 4, destino: 'projetos', secoes: ['projetos'],
      clique: { x: 69, y: 64.5, l: 5, a: 6 },
      postit: { x: 72.3, y: 74.8, rot: -2 },
      vista: { tipo: 'caderno', camera: { cx: 56, cy: 67.5, escala: 2 }, lado: 'esquerda' },
      tour: { camera: { cx: 72, cy: 67.5, escala: 1.8 }, lado: 'esquerda' },
    },
    {
      id: 'caixa', capitulo: 5, destino: 'habilidades', secoes: ['habilidades'],
      clique: { x: 41.5, y: 66, l: 7.5, a: 13.5 },
      postit: { x: 38.2, y: 72, rot: 2 },
      vista: { tipo: 'caixa', camera: { cx: 60.8, cy: 72, escala: 2 }, lado: 'direita' },
      tour: { camera: { cx: 56.4, cy: 72, escala: 1.8 }, lado: 'direita' },
    },
    {
      id: 'estante', capitulo: 6, destino: 'formacao', secoes: ['formacao'],
      clique: { x: 54.5, y: 27.5, l: 14.3, a: 51 },
      postit: { x: 61.6, y: 24.6, rot: -3 },
      vista: { tipo: 'estante', camera: { cx: 62, cy: 53, escala: 1.6 }, janela: { x: 55, y: 29, l: 13, a: 48 } },
      tour: { camera: { cx: 66.7, cy: 53, escala: 1.5 }, lado: 'direita' },
    },
    {
      id: 'lenco', capitulo: 7, destino: 'alem', secoes: ['alem'],
      clique: { x: 84, y: 32, l: 5, a: 30 },
      postit: { x: 88, y: 66.3, rot: -4 },
      vista: { tipo: 'tecido', camera: { cx: 72, cy: 47, escala: 2 }, lado: 'esquerda' },
      tour: { camera: { cx: 72, cy: 47, escala: 1.8 }, lado: 'esquerda' },
    },
    {
      id: 'envelope', capitulo: 8, destino: 'contato', secoes: ['contato'],
      clique: { x: 76, y: 40.5, l: 4.5, a: 13 },
      postit: { x: 78.25, y: 36.2, rot: 3 },
      vista: { tipo: 'carta', camera: { cx: 62.7, cy: 47, escala: 2 }, lado: 'esquerda' },
      tour: { camera: { cx: 72, cy: 47, escala: 1.8 }, lado: 'esquerda' },
    },
  ],
  anotacoes: [
    { id: 'comece', x: 6, y: 36, rot: -4, larguraMax: 9, seta: { de: [9.5, 40.5], para: [12.4, 44.5], curva: 0.3 }, ate: 'primeira-interacao' },
    { id: 'role', x: 40, y: 89, rot: 0, larguraMax: 24, seta: { de: [50, 92], para: [50, 97], curva: 0 }, ate: 'primeira-interacao' },
  ],
} satisfies ConfigQuarto);

/** Objetos na ordem de Tab (= ordem dos capítulos). */
export const objetosEmOrdem = [...quarto.objetos].sort((a, b) => a.capitulo - b.capitulo);

/** Subconjunto serializado no HTML para o JS do cliente: sem nada que o cliente não use. */
export function configCliente() {
  return {
    imagem: quarto.imagem,
    objetos: objetosEmOrdem.map((o: ObjetoQuarto) => ({
      id: o.id,
      capitulo: o.capitulo,
      destino: o.destino,
      secoes: o.secoes,
      vista: o.vista,
      tour: o.tour,
    })),
  };
}
