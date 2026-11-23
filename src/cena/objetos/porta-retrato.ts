/** 02 · Porta-retrato com silhueta genérica, sem rosto (docs/design.md 13.4). */
import { CircleGeometry, Matrix4, Quaternion, Euler, Shape, ShapeGeometry, Vector3 } from 'three';
import type { Caixa } from '../../config/tipos';
import { Box, Plane, RB } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

export function criarPortaRetrato(caixa: Caixa, sombra: boolean) {
  return montarClicavel('porta-retrato', caixa, sombra, (ctx) => {
    const { m } = ctx;
    // Sobre a cômoda (tampo y 0,70), de frente para +x (o quarto), girado 0,25 rad; rotation.x = −0.12 inclina para trás.
    const base = new Matrix4().compose(new Vector3(0.2, 0.84, 1.52), new Quaternion().setFromEuler(new Euler(-0.12, Math.PI / 2 - 0.25, 0, 'YXZ')), new Vector3(1, 1, 1));
    const l = ctx.lote.filho(base);
    l.add(RB(0.2, 0.25, 0.025, 0.006), m(P.madeira), [0, 0, 0]);
    l.add(Plane(0.15, 0.19), m(P.tecido), [0, 0, 0.0145]);
    // Silhueta genérica: cabeça (círculo) e ombros (semicírculo de raio 0,06).
    l.add(new CircleGeometry(0.03, 16), m(P.metal), [0, 0.035, 0.0155]);
    const ombros = new Shape();
    ombros.absarc(0, 0, 0.06, 0, Math.PI, false);
    ombros.closePath();
    l.add(new ShapeGeometry(ombros, 12), m(P.metal), [0, -0.075, 0.0155]);
    // Apoio traseiro
    l.add(Box(0.02, 0.2, 0.01), m(P.madeira), [0, -0.01, -0.035], [0.35, 0, 0]);
  });
}
