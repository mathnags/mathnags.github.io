/** Props comuns a todo desenho do quarto: ele desenha só em coordenadas locais (0…l, 0…a). */
export interface PropsDesenho {
  l: number;
  a: number;
  /** 'ladrilho' = versão em escala de ladrilho do mobile (design 4.3). */
  contexto?: 'quarto' | 'ladrilho';
  /** Só os Estojos usam: nomes das lombadas (alem.games.lista + lombadaExtra). */
  lombadas?: string[];
}
