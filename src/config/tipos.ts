/**
 * Tipos e listas fechadas do quarto (docs/design.md 9.2).
 * Módulo puro: usado pela config, pela validação, pelos schemas de texto e pelos testes.
 */

/** Retângulo em unidades do viewBox 1600×1000. l = largura, a = altura. */
export type Rect = { x: number; y: number; l: number; a: number };

export const TIPOS_VISTA_DENTRO = ['tela', 'cortica', 'estante'] as const;
export const TIPOS_VISTA_PAINEL = ['porta-retrato', 'caderno', 'caixa', 'tecido', 'carta'] as const;
export type TipoVista = (typeof TIPOS_VISTA_DENTRO)[number] | (typeof TIPOS_VISTA_PAINEL)[number];

/** Objetos clicáveis. Cada id também é a chave em textos.<lang>.json > quarto.objetos. */
export const IDS_OBJETOS = [
  'monitor',
  'porta-retrato',
  'mural',
  'caderno',
  'caixa',
  'estante',
  'quadros',
  'lenco',
  'bola',
  'headset',
  'estojos',
  'envelope',
] as const;
export type IdObjeto = (typeof IDS_OBJETOS)[number];

/** Nome do componente em src/components/quarto/objetos/<Nome>.astro. */
export const COMPONENTES_OBJETO = [
  'Monitor',
  'PortaRetrato',
  'Mural',
  'Caderno',
  'Caixa',
  'Estante',
  'Quadros',
  'Lenco',
  'Bola',
  'Headset',
  'Estojos',
  'Envelope',
] as const;
export type ComponenteObjeto = (typeof COMPONENTES_OBJETO)[number];

/** Nome do componente em src/components/quarto/decoracao/<Nome>.astro (o Varal é desenhado à parte). */
export const COMPONENTES_DECORACAO = [
  'Janela',
  'Poster',
  'Vaso',
  'MouseMousepad',
  'Mesa',
  'Mesinha',
  'Cadeira',
  'Tapete',
  'Luminaria',
  'Interruptor',
] as const;
export type ComponenteDecoracao = (typeof COMPONENTES_DECORACAO)[number];

export type Capitulo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ObjetoQuarto {
  id: IdObjeto;
  componente: ComponenteObjeto;
  papel: 'principal' | 'secundario';
  capitulo: Capitulo;
  /** Posição no Tab entre todos os objetos (1…12). */
  ordem: number;
  /** id do HTML aberto pelo objeto: 'experiencia', 'certificacoes', 'alem-games'… */
  destino: string;
  /** Seção que contém o destino: 'formacao', 'alem'… */
  secao: string;
  caixa: Rect;
  /** Área clicável (padrão = caixa). */
  clique?: Rect;
  /** Padrão = canto superior esquerdo da caixa. */
  etiqueta?: { x: number; y: number };
  /** Só para 'principal'. */
  lampada?: { x: number };
  vista: {
    tipo: TipoVista;
    /** Enquadramento 16:10. */
    camera: Rect;
    /** Moldura do HTML; obrigatória nas vistas "dentro" (tela, cortica, estante). */
    janela?: Rect;
    /** Lado do painel estilizado (padrão: 'direita'). */
    lado?: 'esquerda' | 'direita';
  };
  /** ladrilho: posição na grade do mobile (1…8); null = não vira ladrilho (secundários). */
  mobile: { ladrilho: number | null; desenhos: ComponenteObjeto[] };
}

export interface DecoracaoQuarto {
  id: string;
  componente: ComponenteDecoracao;
  caixa: Rect;
  /** Muda com o tema (janela, luminária, interruptor). */
  noite?: boolean;
}

export interface ConfigQuarto {
  viewBox: { l: number; a: number };
  /** Largura do palco mais estreito com o quarto (px), usada para garantir alvos de 44 px. */
  palcoMinimoPx: number;
  varal: { y: number; de: number; ate: number };
  /** Cenário: y onde a parede acaba e o chão começa, e a porta (atrás do lenço e do envelope). */
  fundo: { piso: number; porta: Rect };
  objetos: ObjetoQuarto[];
  decoracao: DecoracaoQuarto[];
}
