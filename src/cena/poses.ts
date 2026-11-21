/**
 * Poses da câmera por contexto (docs/design.md 13.4 e 13.5.2): visão geral, passos do tour e vistas. Puro (sem WebGL), por isso
 * testável no Vitest: enquadramento() diz qual caixa, alvo, direção, área livre e margem valem; poseDe() aplica enquadrar().
 */
import { Box3, Vector3 } from 'three';
import type { Caixa, IdObjeto } from '../config/tipos';
import type { CfgCliente } from './index';
import { areaGeral, areaTour, compacto, molduraDentro, painelVista, type Rect } from './areas';
import { direcao, enquadrar, type Pose } from './camera';

export type Ctx = { k: 'geral' } | { k: 'vista'; id: IdObjeto } | { k: 'tour'; n: number };

export const caixaDe = (c: Caixa) => new Box3(new Vector3(...c.min), new Vector3(...c.max));

export interface Enquadramento {
  caixa: Box3;
  alvo: Vector3;
  dir: Vector3;
  livre: Rect;
  margem: number;
}

export function enquadramento(cfg: CfgCliente, ctx: Ctx, L: number, A: number): Enquadramento {
  // O passo 9 do tour é a pose do 01 (SO embutido na tela do monitor).
  if (ctx.k === 'tour' && ctx.n >= 9) ctx = { k: 'vista', id: cfg.objetos[0].id };
  if (ctx.k === 'geral' || (ctx.k === 'tour' && ctx.n <= 0)) {
    return { caixa: caixaDe(cfg.limites), alvo: new Vector3(...cfg.geral.alvo), dir: direcao(cfg.geral.az, cfg.geral.el), livre: areaGeral(L, A), margem: cfg.geral.margem };
  }
  if (ctx.k === 'tour') {
    const x = cfg.objetos[ctx.n - 1];
    return { caixa: caixaDe(x.caixa), alvo: new Vector3(...x.foco.alvo), dir: direcao(x.foco.az, x.foco.el), livre: areaTour(x.tour.lado, L, A), margem: 0.3 };
  }
  const id = ctx.id;
  const x = cfg.objetos.find((o) => o.id === id)!;
  const alvo = new Vector3(...x.foco.alvo);
  const dir = direcao(x.foco.az, x.foco.el);
  // Vista "dentro": a janela (plana) preenche a moldura, sem margem. Nas demais, o objeto cabe ao lado do painel.
  if (x.janela && x.preencher && !compacto(L, A)) return { caixa: caixaDe(x.janela), alvo, dir, livre: molduraDentro(x.preencher, L, A), margem: 0 };
  return { caixa: caixaDe(x.caixa), alvo, dir, livre: painelVista(x.vista.lado ?? 'direita', L, A).livre, margem: x.foco.margem ?? 0.35 };
}

export function poseDe(cfg: CfgCliente, ctx: Ctx, L: number, A: number): Pose {
  const e = enquadramento(cfg, ctx, L, A);
  return enquadrar(e.caixa, e.alvo, e.dir, (cfg.geral.fov * Math.PI) / 180, { L, A }, e.livre, e.margem);
}
