/**
 * Tipos e listas fechadas do quarto 3D (docs/design.md 13.12).
 * Módulo puro: usado pela config, pela validação, pelos schemas de texto e pelos testes.
 * Todas as posições são em METROS no espaço da cena (eixo y para cima, origem no canto interno do piso).
 */

export type V3 = [number, number, number];
export type Caixa = { min: V3; max: V3 };

export const TIPOS_VISTA_DENTRO = ['tela', 'cortica', 'estante'] as const;
export const TIPOS_VISTA_PAINEL = ['porta-retrato', 'caderno', 'caixa', 'tecido', 'carta'] as const;
export type TipoVista = (typeof TIPOS_VISTA_DENTRO)[number] | (typeof TIPOS_VISTA_PAINEL)[number];

/** Objetos clicáveis. Cada id também é a chave em textos.<lang>.json > quarto.objetos. */
export const IDS_OBJETOS = ['monitor', 'porta-retrato', 'mural', 'caderno', 'caixa', 'estante', 'lenco', 'envelope'] as const;
export type IdObjeto = (typeof IDS_OBJETOS)[number];

export type Capitulo = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface ObjetoQuarto {
  id: IdObjeto;
  capitulo: Capitulo;
  /** id do HTML aberto pelo objeto: 'experiencia', 'sobre'… (também é a chave de tour.<id>.resumo). */
  destino: string;
  /** Seções movidas para a vista; o porta-retrato abre ['ficha', 'sobre']. */
  secoes: string[];
  /** AABB em metros (alvo de clique, contorno e enquadramento). */
  caixa: Caixa;
  /** Câmera do objeto: alvo (lookAt), azimute a partir de +z (positivo para +x) e elevação, em graus. A distância é calculada. */
  foco: { alvo: V3; az: number; el: number; margem?: number };
  /** Só nas vistas "dentro" (01, 03, 06): retângulo plano (em z) que a moldura HTML cobre. */
  janela?: Caixa;
  /** Moldura alvo da vista "dentro" (em vw, px, dvh). */
  preencher?: { lVw: number; lMax: number; aVh: number; aMenos: number; aMax: number };
  vista: { tipo: TipoVista; lado?: 'esquerda' | 'direita' };
  /** Passo do tour pela rolagem: lado do cartão (o objeto fica no lado oposto). */
  tour: { lado: 'esquerda' | 'direita' };
  /** Marcador numerado: âncora 3D (m) onde fica o centro do círculo. É o link visível do objeto. */
  marcador: V3;
}

export type AnotacaoQuarto =
  | { id: 'comece'; relativoA: IdObjeto; dx: number; dy: number; rot: number; larguraMax: number }
  | { id: 'role'; tela: { x: string; base: number }; rot: number; larguraMax: number };

export interface ConfigQuarto {
  limites: Caixa;
  geral: { alvo: V3; az: number; el: number; margem: number; fov: number; retrato: { alvo: V3; az: number; el: number; margem: number; caixa: Caixa } };
  paredeNome: { ancora: V3; pxPorMetro: number };
  objetos: ObjetoQuarto[];
  anotacoes: AnotacaoQuarto[];
}
