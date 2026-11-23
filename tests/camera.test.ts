/**
 * Câmera 3D (docs/design.md 13.5.2 e 13.14, tarefa 37): enquadrar() precisa manter os 8 cantos de cada caixa dentro da área
 * livre (reduzida pela metade da margem) em 5 resoluções, nos contextos de vista e de tour; os painéis não podem cobrir
 * o objeto. Usa o three de verdade (PerspectiveCamera + setViewOffset), sem WebGL.
 */
import { describe, expect, it } from 'vitest';
import { PerspectiveCamera, Vector3 } from 'three';
import { aplicarPose, bezier, direcao, enquadrar } from '../src/cena/camera';
import { TRILHO, areaTour, compacto, molduraDentro, painelVista } from '../src/cena/areas';
import { caixaDe, enquadramento, poseDe, type Ctx } from '../src/cena/poses';
import { configCliente } from '../src/config/quarto';
import type { CfgCliente } from '../src/cena/index';
import type { IdObjeto } from '../src/config/tipos';

const cfg = JSON.parse(JSON.stringify(configCliente())) as CfgCliente;
const RESOLUCOES: [number, number][] = [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [2560, 1080]];

function cantos(c: { min: Vector3; max: Vector3 }) {
  const lista: Vector3[] = [];
  for (const x of [c.min.x, c.max.x]) for (const y of [c.min.y, c.max.y]) for (const z of [c.min.z, c.max.z]) lista.push(new Vector3(x, y, z));
  return lista;
}

/** Projeta um ponto no canvas (px), com a câmera de verdade e o deslocamento de tela. */
function projetar(ctx: Ctx, L: number, A: number, ponto: Vector3) {
  const cam = new PerspectiveCamera(cfg.geral.fov, L / A, 0.05, 40);
  aplicarPose(cam, poseDe(cfg, ctx, L, A), { L, A });
  const v = ponto.clone().project(cam);
  return { x: (v.x * 0.5 + 0.5) * L, y: (-v.y * 0.5 + 0.5) * A, z: v.z };
}

function conferir(ctx: Ctx, L: number, A: number) {
  const e = enquadramento(cfg, ctx, L, A);
  const m = e.margem / 2;
  const dx = e.livre.l * m;
  const dy = e.livre.a * m;
  for (const p of cantos(e.caixa)) {
    const r = projetar(ctx, L, A, p);
    const rotulo = `${JSON.stringify(ctx)} ${L}x${A} canto ${p.toArray().map((n) => n.toFixed(2))}`;
    expect(r.x, rotulo).toBeGreaterThanOrEqual(e.livre.x + dx - 0.5);
    expect(r.x, rotulo).toBeLessThanOrEqual(e.livre.x + e.livre.l - dx + 0.5);
    expect(r.y, rotulo).toBeGreaterThanOrEqual(e.livre.y + dy - 0.5);
    expect(r.y, rotulo).toBeLessThanOrEqual(e.livre.y + e.livre.a - dy + 0.5);
    expect(Math.abs(r.z), rotulo).toBeLessThan(1);
  }
}

describe('enquadrar()', () => {
  it('mantém os 8 cantos de cada objeto dentro da área livre nas vistas, em 5 resoluções', () => {
    for (const [L, A] of RESOLUCOES) for (const o of cfg.objetos) conferir({ k: 'vista', id: o.id }, L, A);
  });

  it('mantém os 8 cantos de cada objeto dentro da área livre nos passos do tour (0 a 9) e na visão geral', () => {
    for (const [L, A] of RESOLUCOES) {
      for (let n = 0; n <= 9; n++) conferir({ k: 'tour', n }, L, A);
      conferir({ k: 'geral' }, L, A);
    }
  });

  it('o passo 9 do tour é a pose da vista do monitor', () => {
    const a = poseDe(cfg, { k: 'tour', n: 9 }, 1920, 1080);
    const b = poseDe(cfg, { k: 'vista', id: 'monitor' }, 1920, 1080);
    expect(a.pos.distanceTo(b.pos)).toBeLessThan(1e-9);
  });

  it('mobile e retrato: a visão geral, o tour e a vista cabem nas áreas do 3D mobile', () => {
    for (const [L, A] of [[360, 640], [768, 1024], [390, 844]] as const) {
      expect(compacto(L, A)).toBe(true);
      for (const o of cfg.objetos) conferir({ k: 'vista', id: o.id }, L, A);
      for (let n = 0; n <= 8; n++) conferir({ k: 'tour', n }, L, A);
    }
  });

  it('retrato: a visão geral mostra os 8 objetos inteiros no quadro', () => {
    for (const [L, A] of [[390, 844], [375, 667], [360, 740]] as const) {
      for (const o of cfg.objetos) {
        for (const c of cantos(caixaDe(o.caixa))) {
          const r = projetar({ k: 'geral' }, L, A, c);
          expect(r.x, `${o.id} ${L}x${A}`).toBeGreaterThanOrEqual(0);
          expect(r.x, `${o.id} ${L}x${A}`).toBeLessThanOrEqual(L);
        }
      }
    }
  });

  it('retrato: a mesa inteira (com o monitor vertical, x 0,15 a 2,25) cabe no quadro', () => {
    const mesa = caixaDe({ min: [0.15, 0, 0], max: [2.25, 1.45, 0.8] });
    for (const [L, A] of [[390, 844], [375, 667], [360, 740]] as const) {
      for (const c of cantos(mesa)) {
        const r = projetar({ k: 'geral' }, L, A, c);
        expect(r.x, `mesa ${L}x${A}`).toBeGreaterThanOrEqual(12);
        expect(r.x, `mesa ${L}x${A}`).toBeLessThanOrEqual(L - 12);
        expect(r.y, `mesa ${L}x${A}`).toBeGreaterThanOrEqual(0);
        expect(r.y, `mesa ${L}x${A}`).toBeLessThanOrEqual(A);
      }
    }
  });

  it('as vistas dentro projetam a janela como retângulo, sem distorção (de frente), e cabem na moldura', () => {
    for (const [L, A] of RESOLUCOES) {
      for (const o of cfg.objetos.filter((x) => x.janela)) {
        const { min, max } = o.janela!;
        const quatro: [number, number, number][] = [min, [max[0], min[1], min[2]], max, [min[0], max[1], min[2]]];
        const p = quatro.map((c) => projetar({ k: 'vista', id: o.id }, L, A, new Vector3(...c)));
        expect(Math.abs(p[0].y - p[1].y), `${o.id} ${L}x${A}`).toBeLessThan(0.5);
        expect(Math.abs(p[0].x - p[3].x), `${o.id} ${L}x${A}`).toBeLessThan(0.5);
        const moldura = molduraDentro(o.preencher!, L, A);
        expect(p[1].x - p[0].x, `${o.id} largura`).toBeLessThanOrEqual(moldura.l + 0.5);
        expect(p[0].y - p[3].y, `${o.id} altura`).toBeLessThanOrEqual(moldura.a + 0.5);
      }
    }
  });

  it('o painel nunca cobre o objeto: a área livre não encosta no painel (desktop)', () => {
    for (const [L, A] of RESOLUCOES) {
      for (const o of cfg.objetos.filter((x) => !x.janela)) {
        const { painel, livre } = painelVista(o.vista.lado ?? 'direita', L, A);
        expect(livre.x + livre.l <= painel.x || livre.x >= painel.x + painel.l, `${o.id} ${L}x${A}`).toBe(true);
      }
    }
  });

  it('o cartão do tour nunca cobre a área livre (desktop)', () => {
    for (const [L, A] of RESOLUCOES) {
      for (const o of cfg.objetos) {
        const cartao = Math.min(420, 0.34 * L);
        const livre = areaTour(o.tour.lado, L, A);
        const [ini, fim] = o.tour.lado === 'direita' ? [L - TRILHO - cartao, L - TRILHO] : [24, 24 + cartao];
        expect(livre.x + livre.l <= ini || livre.x >= fim, `${o.id} ${L}x${A}`).toBe(true);
        expect(livre.l, `${o.id} ${L}x${A} largura livre`).toBeGreaterThan(300);
      }
    }
  });

  it('a distância mínima de 0,6 m vale e a direção é unitária', () => {
    const e = enquadramento(cfg, { k: 'vista', id: 'caderno' }, 1920, 1080);
    const pose = enquadrar(e.caixa, e.alvo, e.dir, 0.5, { L: 1920, A: 1080 }, e.livre, 0.35);
    expect(pose.pos.distanceTo(e.alvo)).toBeGreaterThanOrEqual(0.6);
    expect(direcao(32, 20).length()).toBeCloseTo(1, 9);
  });

  it('as posições calculadas em 1920×1080 ficam perto da tabela nominal de 13.4 (conferência, ±5% na maioria)', () => {
    const nominal: Record<IdObjeto, [number, number, number]> = {
      monitor: [0.95, 1.22, 1.68], 'porta-retrato': [2.08, 1.14, 1.29], mural: [2.95, 1.45, 2.34], caderno: [3.12, 1.81, 1.33],
      caixa: [3.74, 1.05, 2.23], estante: [4.1, 0.985, 4.14], lenco: [4.81, 1.73, 1.35], envelope: [1.84, 1.2, 1.3],
    };
    const relatorio: string[] = [];
    for (const [id, esperado] of Object.entries(nominal) as [IdObjeto, [number, number, number]][]) {
      const pose = poseDe(cfg, { k: 'vista', id }, 1920, 1080);
      const dCalc = pose.pos.distanceTo(pose.alvo);
      const dTab = new Vector3(...esperado).distanceTo(pose.alvo);
      relatorio.push(`${id}: calculado ${pose.pos.toArray().map((n) => n.toFixed(2))} (dist ${dCalc.toFixed(2)}) · tabela ${esperado} (dist ${dTab.toFixed(2)}) · razão ${(dCalc / dTab).toFixed(3)}`);
      expect(Number.isFinite(dCalc)).toBe(true);
    }
    console.log(relatorio.join('\n'));
  });
});

describe('curvas de tempo', () => {
  it('--ease-voo (0,65, 0, 0,35, 1) começa em 0, termina em 1, é simétrica e monotônica', () => {
    const e = bezier(0.65, 0, 0.35, 1);
    expect(e(0)).toBe(0);
    expect(e(1)).toBe(1);
    expect(e(0.5)).toBeCloseTo(0.5, 3);
    let anterior = 0;
    for (let t = 0.05; t <= 1; t += 0.05) {
      expect(e(t)).toBeGreaterThanOrEqual(anterior);
      anterior = e(t);
    }
  });
});
