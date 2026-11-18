/**
 * ÚNICA fonte de posição, destino e vista dos objetos do quarto (docs/design.md 4.2 e 9.2).
 * Mover, trocar ou remover um objeto é uma edição aqui; os componentes desenham só em coordenadas locais.
 *
 * - Unidades: viewBox 1600×1000.
 * - Textos de cada objeto: textos.<lang>.json > quarto.objetos.<id> (tema, comum, legenda).
 * - A config é validada ao ser importada (validarQuarto): um valor inválido derruba a build.
 * - O JS do cliente não tem coordenadas fixas: ele lê configCliente(), serializada no HTML
 *   em <script type="application/json" id="quarto-config">.
 */
import type { ConfigQuarto, ObjetoQuarto, Rect } from './tipos';
import { validarQuarto } from './validar-quarto';

/** A estante e os quadros usam o mesmo enquadramento (os quadros rolam até #certificacoes). */
const VISTA_ESTANTE: ObjetoQuarto['vista'] = {
  tipo: 'estante',
  camera: { x: 1008, y: 545, l: 592, a: 370 },
  janela: { x: 1212, y: 575, l: 216, a: 310 },
};

export const quarto: ConfigQuarto = validarQuarto({
  viewBox: { l: 1600, a: 1000 },
  palcoMinimoPx: 728,
  varal: { y: 75, de: 20, ate: 1580 },
  fundo: { piso: 760, porta: { x: 1450, y: 150, l: 150, a: 610 } },
  objetos: [
    {
      id: 'monitor', componente: 'Monitor', papel: 'principal', capitulo: 1, ordem: 1,
      destino: 'vertice', secao: 'vertice',
      marcador: { x: 60, y: 400, dir: 'direita' },
      caixa: { x: 110, y: 330, l: 280, a: 250 }, lampada: { x: 250 },
      vista: { tipo: 'tela', camera: { x: 70, y: 330, l: 360, a: 225 }, janela: { x: 124, y: 342, l: 252, a: 158 } },
      mobile: { ladrilho: 1, desenhos: ['Monitor'] },
    },
    {
      id: 'porta-retrato', componente: 'PortaRetrato', papel: 'principal', capitulo: 2, ordem: 2,
      destino: 'sobre', secao: 'sobre',
      marcador: { x: 475, y: 395, dir: 'baixo' },
      caixa: { x: 430, y: 480, l: 90, a: 120 }, clique: { x: 425, y: 475, l: 100, a: 125 }, lampada: { x: 475 },
      vista: { tipo: 'porta-retrato', camera: { x: 395, y: 430, l: 320, a: 200 } },
      mobile: { ladrilho: 2, desenhos: ['PortaRetrato'] },
    },
    {
      id: 'mural', componente: 'Mural', papel: 'principal', capitulo: 3, ordem: 3,
      destino: 'experiencia', secao: 'experiencia',
      marcador: { x: 1100, y: 345, dir: 'esquerda' },
      caixa: { x: 830, y: 150, l: 240, a: 210 }, lampada: { x: 905 },
      vista: { tipo: 'cortica', camera: { x: 766, y: 140, l: 368, a: 230 }, janela: { x: 842, y: 162, l: 216, a: 186 } },
      mobile: { ladrilho: 3, desenhos: ['Mural'] },
    },
    {
      id: 'caderno', componente: 'Caderno', papel: 'principal', capitulo: 4, ordem: 4,
      destino: 'projetos', secao: 'projetos',
      marcador: { x: 920, y: 520, dir: 'baixo' },
      caixa: { x: 845, y: 600, l: 150, a: 40 }, clique: { x: 845, y: 580, l: 150, a: 100 }, lampada: { x: 985 },
      vista: { tipo: 'caderno', camera: { x: 840, y: 520, l: 320, a: 200 } },
      mobile: { ladrilho: 4, desenhos: ['Caderno'] },
    },
    {
      id: 'caixa', componente: 'Caixa', papel: 'principal', capitulo: 5, ordem: 5,
      destino: 'habilidades', secao: 'habilidades',
      marcador: { x: 1095, y: 715, dir: 'baixo' },
      caixa: { x: 1010, y: 800, l: 170, a: 100 }, lampada: { x: 1095 },
      vista: { tipo: 'caixa', camera: { x: 980, y: 760, l: 320, a: 200 } },
      mobile: { ladrilho: 5, desenhos: ['Caixa'] },
    },
    {
      id: 'estante', componente: 'Estante', papel: 'principal', capitulo: 6, ordem: 6,
      destino: 'formacao', secao: 'formacao',
      marcador: { x: 1270, y: 490, dir: 'baixo' },
      caixa: { x: 1200, y: 560, l: 240, a: 340 }, etiqueta: { x: 1440, y: 535 }, lampada: { x: 1320 },
      vista: VISTA_ESTANTE,
      mobile: { ladrilho: 6, desenhos: ['Estante', 'Quadros'] },
    },
    {
      id: 'quadros', componente: 'Quadros', papel: 'secundario', capitulo: 6, ordem: 7,
      destino: 'certificacoes', secao: 'formacao',
      caixa: { x: 1210, y: 250, l: 220, a: 190 }, etiqueta: { x: 1430, y: 222 },
      vista: VISTA_ESTANTE,
      mobile: { ladrilho: null, desenhos: ['Quadros'] },
    },
    {
      id: 'lenco', componente: 'Lenco', papel: 'principal', capitulo: 7, ordem: 8,
      destino: 'alem', secao: 'alem',
      marcador: { x: 1515, y: 190, dir: 'baixo' },
      caixa: { x: 1475, y: 280, l: 90, a: 120 }, clique: { x: 1465, y: 275, l: 100, a: 130 }, lampada: { x: 1490 },
      vista: { tipo: 'tecido', camera: { x: 1280, y: 230, l: 320, a: 200 }, lado: 'esquerda' },
      mobile: { ladrilho: 7, desenhos: ['Lenco', 'Bola', 'Headset'] },
    },
    {
      id: 'bola', componente: 'Bola', papel: 'secundario', capitulo: 7, ordem: 9,
      destino: 'alem-volei', secao: 'alem',
      caixa: { x: 1450, y: 850, l: 140, a: 100 },
      vista: { tipo: 'tecido', camera: { x: 1280, y: 790, l: 320, a: 200 }, lado: 'esquerda' },
      mobile: { ladrilho: null, desenhos: ['Bola'] },
    },
    {
      id: 'headset', componente: 'Headset', papel: 'secundario', capitulo: 7, ordem: 10,
      destino: 'alem-games', secao: 'alem',
      caixa: { x: 30, y: 480, l: 80, a: 120 }, clique: { x: 10, y: 470, l: 100, a: 140 },
      vista: { tipo: 'tecido', camera: { x: 20, y: 440, l: 320, a: 200 } },
      mobile: { ladrilho: null, desenhos: ['Headset'] },
    },
    {
      id: 'estojos', componente: 'Estojos', papel: 'secundario', capitulo: 7, ordem: 11,
      destino: 'alem-games', secao: 'alem',
      caixa: { x: 70, y: 180, l: 260, a: 130 },
      vista: { tipo: 'tecido', camera: { x: 40, y: 150, l: 320, a: 200 } },
      mobile: { ladrilho: null, desenhos: ['Estojos'] },
    },
    {
      id: 'envelope', componente: 'Envelope', papel: 'principal', capitulo: 8, ordem: 12,
      destino: 'contato', secao: 'contato',
      marcador: { x: 1520, y: 480, dir: 'baixo' },
      caixa: { x: 1470, y: 560, l: 100, a: 80 }, clique: { x: 1465, y: 550, l: 110, a: 100 }, etiqueta: { x: 1570, y: 668 }, lampada: { x: 1550 },
      vista: { tipo: 'carta', camera: { x: 1280, y: 500, l: 320, a: 200 }, lado: 'esquerda' },
      mobile: { ladrilho: 8, desenhos: ['Envelope'] },
    },
  ],
  // A ordem desta lista é a ordem de desenho (de trás para a frente).
  decoracao: [
    { id: 'janela', componente: 'Janela', caixa: { x: 590, y: 140, l: 200, a: 380 }, noite: true },
    { id: 'poster', componente: 'Poster', caixa: { x: 400, y: 110, l: 100, a: 220 } },
    { id: 'luminaria', componente: 'Luminaria', caixa: { x: 1100, y: 0, l: 80, a: 110 }, noite: true },
    { id: 'interruptor', componente: 'Interruptor', caixa: { x: 1440, y: 480, l: 16, a: 28 }, noite: true },
    { id: 'tapete', componente: 'Tapete', caixa: { x: 300, y: 900, l: 500, a: 60 } },
    { id: 'cadeira', componente: 'Cadeira', caixa: { x: 200, y: 640, l: 160, a: 260 } },
    { id: 'mesa', componente: 'Mesa', caixa: { x: 40, y: 580, l: 520, a: 320 } },
    { id: 'mesinha', componente: 'Mesinha', caixa: { x: 830, y: 640, l: 180, a: 260 } },
    { id: 'vaso', componente: 'Vaso', caixa: { x: 600, y: 790, l: 80, a: 110 } },
    { id: 'mouse', componente: 'MouseMousepad', caixa: { x: 300, y: 585, l: 110, a: 20 } },
  ],
} satisfies ConfigQuarto);

/** Objetos na ordem de Tab (= ordem dos capítulos). */
export const objetosEmOrdem = [...quarto.objetos].sort((a, b) => a.ordem - b.ordem);

/** Retângulo clicável efetivo. */
export const cliqueDe = (o: ObjetoQuarto): Rect => o.clique ?? o.caixa;

/** Subconjunto serializado no HTML para o JS do cliente (≤ 3 KB): sem nada que o cliente não use. */
export function configCliente() {
  return {
    viewBox: quarto.viewBox,
    objetos: objetosEmOrdem.map((o) => ({
      id: o.id,
      capitulo: o.capitulo,
      papel: o.papel,
      destino: o.destino,
      secao: o.secao,
      vista: o.vista,
    })),
  };
}
