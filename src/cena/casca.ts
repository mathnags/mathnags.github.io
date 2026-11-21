/**
 * Casca da maquete (docs/design.md 13.2): laje, piso, parede do fundo, parede esquerda com o vão da janela, tampas do
 * corte e rodapé. Não há teto, parede direita nem parede da frente (corte de maquete). Medidas em metros.
 */
import { Group } from 'three';
import { Box, estoque } from './geo';
import { Lote } from './lote';
import { P } from './paleta';

export function criarCasca(sombra: boolean): Group {
  const m = estoque();
  const lote = new Lote();
  const parede = m.get(P.parede);
  const sombraParede = m.get(P.paredeSombra);

  lote.add(Box(5.72, 0.12, 3.72), m.get(P.madeiraEscura), [2.74, -0.06, 1.74]);
  lote.add(Box(5.6, 0.004, 3.6), m.get(P.piso), [2.8, 0.002, 1.8]);
  lote.add(Box(5.72, 2.8, 0.12), parede, [2.74, 1.4, -0.06]);

  // Parede esquerda (x −0,12 a 0) menos o vão z 1,35–2,45 × y 1,00–2,10.
  lote.add(Box(0.12, 1.0, 3.6), parede, [-0.06, 0.5, 1.8]);
  lote.add(Box(0.12, 0.7, 3.6), parede, [-0.06, 2.45, 1.8]);
  lote.add(Box(0.12, 1.1, 1.35), parede, [-0.06, 1.55, 0.675]);
  lote.add(Box(0.12, 1.1, 1.15), parede, [-0.06, 1.55, 3.025]);

  // Tampas do corte.
  lote.add(Box(5.72, 0.03, 0.12), sombraParede, [2.74, 2.815, -0.06]);
  lote.add(Box(0.12, 0.03, 3.6), sombraParede, [-0.06, 2.815, 1.8]);
  lote.add(Box(0.12, 2.8, 0.03), sombraParede, [-0.06, 1.4, 3.615]);

  // Rodapé ao longo das duas paredes, interrompido na porta (x 4,615–5,615).
  lote.add(Box(4.615, 0.08, 0.015), sombraParede, [2.3075, 0.04, 0.0075]);
  lote.add(Box(0.015, 0.08, 3.6), sombraParede, [0.0075, 0.04, 1.8]);

  const g = new Group();
  g.name = 'casca';
  g.add(...lote.malhas(sombra));
  return g;
}
