/**
 * Base dos 8 clicáveis (docs/design.md 13.4): cada um é um Group com materiais PRÓPRIOS (para o destaque não vazar para
 * outros objetos), malhas fundidas por material, um "casco invertido" de contorno e a caixa usada para enquadrar e clicar.
 */
import { BackSide, Box3, BufferGeometry, Group, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Vector3, type Object3D } from 'three';
import type { Caixa, IdObjeto } from '../../config/tipos';
import { mat } from '../geo';
import { Lote } from '../lote';
import { P } from '../paleta';

export interface Clicavel {
  id: IdObjeto;
  grupo: Group;
  /** Materiais com luz do objeto: a emissão do destaque vai de 0 a 0,08 (dia) ou 0,12 (noite). */
  materiais: MeshLambertMaterial[];
  contorno: Mesh;
  /** Somem (visible = false) enquanto a vista "dentro" do objeto está aberta. */
  ocultaveis: Object3D[];
  caixa: Box3;
  /** Objeto específico do clicável (ex.: a tela do monitor). */
  tela?: import('../texturas').TelaMonitor;
}

export interface Ctx {
  /** Partes permanentes, fundidas por material. */
  lote: Lote;
  /** Partes que somem na vista "dentro" (papéis do mural), fundidas por material. */
  oculto: Lote;
  /** Material próprio do objeto, por cor. */
  m(cor: number, extra?: ConstructorParameters<typeof MeshLambertMaterial>[0]): MeshLambertMaterial;
  /** Malha avulsa (InstancedMesh, tela). Fica fora do contorno. */
  avulso(obj: Object3D, oculta?: boolean): void;
  /** Material avulso próprio (com mapa), contado entre os que recebem emissão. */
  proprio(m: MeshLambertMaterial): MeshLambertMaterial;
}

export function montarClicavel(id: IdObjeto, caixa: Caixa, sombra: boolean, construir: (c: Ctx) => void): Clicavel {
  const mats = new Map<string, MeshLambertMaterial>();
  const avulsos: { obj: Object3D; oculta: boolean }[] = [];
  const lote = new Lote();
  const oculto = new Lote();
  const proprios: MeshLambertMaterial[] = [];

  construir({
    lote,
    oculto,
    m(cor, extra = {}) {
      const chave = `${cor}|${JSON.stringify(extra)}`;
      let x = mats.get(chave);
      if (!x) mats.set(chave, (x = mat(cor, extra)));
      return x;
    },
    avulso: (obj, oculta = false) => avulsos.push({ obj, oculta }),
    proprio: (x) => {
      proprios.push(x);
      return x;
    },
  });

  const grupo = new Group();
  grupo.name = id;
  const ocultaveis: Object3D[] = [];
  grupo.add(...lote.malhas(sombra));
  for (const mesh of oculto.malhas(sombra)) {
    grupo.add(mesh);
    ocultaveis.push(mesh);
  }
  for (const { obj, oculta } of avulsos) {
    grupo.add(obj);
    if (oculta) ocultaveis.push(obj);
  }

  // Contorno: casco invertido da geometria permanente, escalado por eixo em (s + 0,024)/s em torno do centro da caixa.
  const box = new Box3(new Vector3(...caixa.min), new Vector3(...caixa.max));
  const centro = box.getCenter(new Vector3());
  const tam = box.getSize(new Vector3());
  const geo: BufferGeometry = lote.geometriaUnica();
  geo.applyMatrix4(new Matrix4().makeTranslation(-centro.x, -centro.y, -centro.z));
  const contorno = new Mesh(geo, new MeshBasicMaterial({ color: P.contornoDia, side: BackSide, toneMapped: false }));
  contorno.position.copy(centro);
  contorno.scale.set(...(['x', 'y', 'z'] as const).map((k) => (Math.max(tam[k], 0.01) + 0.024) / Math.max(tam[k], 0.01)) as [number, number, number]);
  contorno.visible = false;
  grupo.add(contorno);

  return { id, grupo, materiais: [...mats.values(), ...proprios], contorno, ocultaveis, caixa: box };
}
