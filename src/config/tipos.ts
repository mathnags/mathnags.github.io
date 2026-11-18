/**
 * Tipos e listas fechadas do quarto (docs/design.md 12.6 e 12.13.7).
 * Módulo puro: usado pela config, pela validação, pelos schemas de texto e pelos testes.
 * Todas as posições são em % da imagem mestre 16:9 (0 a 100).
 */

/** Retângulo em % da imagem. l = largura, a = altura. */
export type Rect = { x: number; y: number; l: number; a: number };

export const TIPOS_VISTA_DENTRO = ['tela', 'cortica', 'estante'] as const;
export const TIPOS_VISTA_PAINEL = ['porta-retrato', 'caderno', 'caixa', 'tecido', 'carta'] as const;
export type TipoVista = (typeof TIPOS_VISTA_DENTRO)[number] | (typeof TIPOS_VISTA_PAINEL)[number];

/** Objetos clicáveis. Cada id também é a chave em textos.<lang>.json > quarto.objetos. */
export const IDS_OBJETOS = ['monitor', 'porta-retrato', 'mural', 'caderno', 'caixa', 'estante', 'lenco', 'envelope'] as const;
export type IdObjeto = (typeof IDS_OBJETOS)[number];

export type Capitulo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Câmera: centro (cx, cy) em % da imagem e escala. A translação é limitada às bordas da imagem. */
export type Camera = { cx: number; cy: number; escala: number };

export interface ObjetoQuarto {
  id: IdObjeto;
  capitulo: Capitulo;
  /** id do HTML aberto pelo objeto: 'experiencia', 'sobre'… (também é a chave de tour.<id>.resumo). */
  destino: string;
  /** Seções movidas para a vista; o porta-retrato abre ['ficha', 'sobre']. */
  secoes: string[];
  /** Área clicável sobre o objeto. */
  clique: Rect;
  /** Post-it colado no objeto: centro (x, y) em % e rotação em graus. É o rótulo visível do link. */
  postit: { x: number; y: number; rot: number };
  vista: {
    tipo: TipoVista;
    camera: Camera;
    /** Moldura do HTML; obrigatória nas vistas "dentro" (tela, cortica, estante). */
    janela?: Rect;
    /** Lado do painel estilizado (padrão: 'direita'). */
    lado?: 'esquerda' | 'direita';
  };
  /** Passo do tour pela rolagem: câmera e lado do cartão (oposto ao objeto). */
  tour: { camera: Camera; lado: 'esquerda' | 'direita' };
}

export interface AnotacaoQuarto {
  id: 'comece' | 'role';
  /** Âncora do texto em % e rotação. */
  x: number;
  y: number;
  rot: number;
  larguraMax: number;
  /** Seta à mão livre em %: de, para e curvatura (0 = reta). */
  seta: { de: [number, number]; para: [number, number]; curva: number };
  ate: 'primeira-interacao';
}

export interface ConfigQuarto {
  imagem: { l: number; a: number };
  /** Faixas reservadas aos HUDs: nenhum clique nem post-it entra nelas. */
  areasReservadas: { nome: string; area: Rect }[];
  /** Parede lisa reservada ao nome (HTML sobre a imagem) e âncora do post-it "Fale comigo!". */
  paredeNome: Rect;
  postitContato: { x: number; y: number; rot: number };
  objetos: ObjetoQuarto[];
  anotacoes: AnotacaoQuarto[];
}
