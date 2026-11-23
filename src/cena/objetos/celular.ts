/**
 * 08 · Celular genérico deitado na mesa, à direita do mousepad (docs/design.md 13.4): corpo preto arredondado, moldura fina,
 * tela de canvas com a mensagem "Fale comigo!" (texto do post-it de contato). Sem marca, logo nem número.
 * O id e o destino continuam "envelope"/"contato" (renomear atravessa tipos, CSS e vistas); só o objeto mudou.
 */
import { Euler, Matrix4, MeshLambertMaterial, Quaternion, Vector3, type Texture } from 'three';
import type { Caixa } from '../../config/tipos';
import { Plane, RB } from '../geo';
import { P } from '../paleta';
import { montarClicavel } from './base';

/** Tampo da mesa em y 0,76; mousepad termina em x 1,62; headset começa em z 0,33: o celular ocupa x 1,78–1,90, z 0,47–0,65. */
export function criarCelular(caixa: Caixa, sombra: boolean, tela: Texture) {
  return montarClicavel('envelope', caixa, sombra, (ctx) => {
    const { m, proprio } = ctx;
    // Girado 0,2 rad em y, com o topo da tela para a parede (-z), como quem acabou de pousar o aparelho.
    const base = new Matrix4().compose(new Vector3(1.84, 0.76, 0.56), new Quaternion().setFromEuler(new Euler(0, 0.2, 0, 'YXZ')), new Vector3(1, 1, 1));
    const l = ctx.lote.filho(base);
    l.add(RB(0.08, 0.009, 0.165, 0.012), m(P.preto), [0, 0.0045, 0]);
    // Botão lateral, e a tela (plano) logo acima do corpo, com brilho próprio para ficar legível à noite.
    l.add(RB(0.002, 0.004, 0.02, 0.001), m(P.grafite), [0.0405, 0.006, -0.03]);
    const face = proprio(new MeshLambertMaterial({ map: tela, emissive: 0xffffff, emissiveMap: tela, emissiveIntensity: 0.5 }));
    l.add(Plane(0.072, 0.157), face, [0, 0.0092, 0], [-Math.PI / 2, 0, 0]);
  });
}
