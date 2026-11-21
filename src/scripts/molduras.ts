/**
 * Geometria (px, no palco) da moldura HTML de cada vista (docs/design.md 13.5.2 e 13.8.4).
 * - Painel (02, 04, 05, 07, 08): `min(56vw, 760px)` no lado da config, de y 64 a A − 8.
 * - Dentro (01, 03, 06): a moldura cobre a `janela` projetada pela cena, com o mínimo de legibilidade (560 × 360) e limitada à tela.
 * Sem a cena (carregando, falha ou modo recrutador), usa a moldura alvo da config (`preencher`) no lugar da projeção.
 */
import { BARRA, compacto, molduraDentro, painelVista } from '../cena/areas';
import { clamp, type ObjCfg, type Rect } from './ctx';
import { retanguloJanela } from './ponte';

const FOLGA = 8;

export function moldura(obj: ObjCfg, vw: number, vh: number): Rect {
  if (compacto(vw, vh)) return { x: 0, y: 0.3 * vh, l: vw, a: 0.7 * vh };
  if (!obj.preencher) return painelVista(obj.vista.lado ?? 'direita', vw, vh).painel;
  const j = retanguloJanela(obj.id) ?? molduraDentro(obj.preencher, vw, vh);
  const l = Math.min(vw - 2 * FOLGA, Math.max(j.l, Math.min(560, vw * 0.92)));
  const a = Math.min(vh - BARRA - 2 * FOLGA, Math.max(j.a, Math.min(360, vh * 0.8)));
  return {
    x: clamp(j.x - (l - j.l) / 2, FOLGA, vw - l - FOLGA),
    y: clamp(j.y - (a - j.a) / 2, BARRA + FOLGA, vh - a - FOLGA),
    l,
    a,
  };
}
