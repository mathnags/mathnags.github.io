/**
 * ÚNICA fonte de caixa, foco, janela, destino, vista e âncora do marcador numerado dos objetos do quarto 3D
 * (docs/design.md 13.4, 13.8.2, 13.12). Mover, trocar ou remover um objeto é uma edição aqui.
 *
 * - Unidades: metros no espaço da cena (eixo y para cima; origem no canto interno do piso entre a parede do fundo e a esquerda).
 * - Textos de cada objeto: textos.<lang>.json > quarto.objetos.<id> (tema, comum, legenda) e tour.<destino>.resumo.
 * - A config é validada ao ser importada (validarQuarto): um valor inválido derruba a build.
 * - O JS do cliente não tem coordenadas fixas de câmera: ele lê configCliente(), serializada no HTML em #quarto-config.
 *   A geometria (modelagem) de cada peça fica em src/cena/.
 * - Calibração visual: abra a página em desenvolvimento com ?calibrar=1 (alvos de clique, focos, janelas e âncoras).
 */
import type { ConfigQuarto, ObjetoQuarto } from './tipos';
import { validarQuarto } from './validar-quarto';

export const quarto: ConfigQuarto = validarQuarto({
  limites: { min: [-0.12, -0.12, -0.12], max: [5.6, 2.83, 3.6] },
  geral: { alvo: [2.8, 1.0, 1.4], az: 32, el: 20, margem: 0.05, fov: 30,
    // Retrato (compacto): enquadra só a faixa dos 8 objetos (sem as bordas da parede), mais de frente e de cima, para o quarto usar a largura toda.
    retrato: { alvo: [3.0, 0.95, 0.4], az: 10, el: 38, margem: 0.01, caixa: { min: [0.45, 0, 0], max: [5.6, 2.0, 0.9] } },
  },
  paredeNome: { ancora: [0.32, 2.5, 0.004], pxPorMetro: 200 },
  objetos: [
    {
      id: 'monitor', capitulo: 1, destino: 'vertice', secoes: ['vertice'],
      caixa: { min: [0.56, 0.76, 0.21], max: [1.34, 1.45, 0.39] },
      foco: { alvo: [0.95, 1.22, 0.32], az: 0, el: 0 },
      janela: { min: [0.58, 1.01, 0.318], max: [1.32, 1.43, 0.318] },
      preencher: { lVw: 0.92, lMax: 1100, aVh: 0.86, aMenos: 56, aMax: 700 },
      vista: { tipo: 'tela' },
      tour: { lado: 'direita' },
      marcador: [0.95, 1.105, 0.41],
    },
    {
      id: 'porta-retrato', capitulo: 2, destino: 'sobre', secoes: ['ficha', 'sobre'],
      caixa: { min: [1.66, 0.76, 0.22], max: [1.9, 1.03, 0.42] },
      foco: { alvo: [1.78, 0.89, 0.32], az: 17, el: 14 },
      vista: { tipo: 'porta-retrato', lado: 'esquerda' },
      tour: { lado: 'direita' },
      marcador: [1.78, 0.895, 0.44],
    },
    {
      id: 'mural', capitulo: 3, destino: 'experiencia', secoes: ['experiencia'],
      caixa: { min: [2.42, 1.03, 0.0], max: [3.48, 1.87, 0.06] },
      foco: { alvo: [2.95, 1.45, 0.03], az: 0, el: 0 },
      janela: { min: [2.45, 1.06, 0.03], max: [3.45, 1.84, 0.03] },
      preencher: { lVw: 0.86, lMax: 1040, aVh: 0.8, aMenos: 56, aMax: 680 },
      vista: { tipo: 'cortica' },
      tour: { lado: 'direita' },
      marcador: [2.95, 1.45, 0.08],
    },
    {
      id: 'caderno', capitulo: 4, destino: 'projetos', secoes: ['projetos'],
      caixa: { min: [2.53, 0.53, 0.17], max: [2.99, 0.57, 0.49] },
      foco: { alvo: [2.76, 0.55, 0.33], az: 20, el: 50 },
      vista: { tipo: 'caderno', lado: 'esquerda' },
      tour: { lado: 'direita' },
      marcador: [2.76, 0.55, 0.51],
    },
    {
      id: 'caixa', capitulo: 5, destino: 'habilidades', secoes: ['habilidades'],
      caixa: { min: [3.18, 0.0, 0.55], max: [3.66, 0.31, 0.85] },
      foco: { alvo: [3.42, 0.15, 0.7], az: 12, el: 30 },
      vista: { tipo: 'caixa', lado: 'direita' },
      tour: { lado: 'esquerda' },
      marcador: [3.42, 0.155, 0.87],
    },
    {
      id: 'estante', capitulo: 6, destino: 'formacao', secoes: ['formacao'],
      caixa: { min: [3.65, 0.0, 0.0], max: [4.55, 1.95, 0.34] },
      foco: { alvo: [4.1, 0.985, 0.34], az: 0, el: 0 },
      janela: { min: [3.68, 0.05, 0.34], max: [4.52, 1.92, 0.34] },
      preencher: { lVw: 0.92, lMax: 99999, aVh: 1, aMenos: 88, aMax: 99999 },
      vista: { tipo: 'estante' },
      tour: { lado: 'esquerda' },
      marcador: [4.1, 0.975, 0.36],
    },
    {
      id: 'lenco', capitulo: 7, destino: 'alem', secoes: ['alem'],
      caixa: { min: [5.15, 1.35, 0.035], max: [5.51, 1.82, 0.09] },
      foco: { alvo: [5.33, 1.585, 0.06], az: -22, el: 6 },
      vista: { tipo: 'tecido', lado: 'esquerda' },
      tour: { lado: 'esquerda' },
      marcador: [5.33, 1.585, 0.11],
    },
    {
      id: 'envelope', capitulo: 8, destino: 'contato', secoes: ['contato'],
      caixa: { min: [4.81, 1.01, 0.04], max: [5.09, 1.3, 0.09] },
      foco: { alvo: [4.95, 1.155, 0.065], az: -18, el: 6 },
      vista: { tipo: 'carta', lado: 'esquerda' },
      tour: { lado: 'esquerda' },
      marcador: [4.95, 1.155, 0.11],
    },
  ],
  anotacoes: [
    { id: 'comece', relativoA: 'monitor', dx: -180, dy: -90, rot: -4, larguraMax: 150 },
    { id: 'role', tela: { x: '50%', base: 96 }, rot: 0, larguraMax: 320 },
  ],
} satisfies ConfigQuarto);

/** Objetos na ordem de Tab (= ordem dos capítulos). */
export const objetosEmOrdem = [...quarto.objetos].sort((a, b) => a.capitulo - b.capitulo);

/** Subconjunto serializado no HTML para o JS do cliente: sem nada que o cliente não use. */
export function configCliente() {
  return {
    limites: quarto.limites,
    geral: quarto.geral,
    paredeNome: quarto.paredeNome,
    anotacoes: quarto.anotacoes,
    objetos: objetosEmOrdem.map((o: ObjetoQuarto) => ({
      id: o.id,
      capitulo: o.capitulo,
      destino: o.destino,
      secoes: o.secoes,
      caixa: o.caixa,
      foco: o.foco,
      janela: o.janela,
      preencher: o.preencher,
      vista: o.vista,
      tour: o.tour,
      marcador: o.marcador,
    })),
  };
}
