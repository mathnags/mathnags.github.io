/**
 * Decoração estática, não clicável (docs/design.md 13.3). Tudo é fundido por material (Lote) depois de posicionado.
 * Proibido na cena: logos, personagens, máscaras, rostos, armas, miras, símbolo da Umbrella, teia ou traje reconhecível,
 * padrões oficiais de bola. A teia do pôster é geométrica e original (texturas.ts).
 */
import {
  AdditiveBlending, BoxGeometry, BufferAttribute, BufferGeometry, CatmullRomCurve3, Color, DoubleSide, Group, InstancedMesh, Matrix4, Mesh,
  MeshBasicMaterial, MeshLambertMaterial, PlaneGeometry, Quaternion, ShaderMaterial, Sphere, Sprite, SpriteMaterial, Vector3, type Ray, type Texture,
} from 'three';
import type { V3 } from '../config/tipos';
import { Box, Circulo, Cone, Cyl, Esfera, Ico, Plane, RB, ROT_EIXO_X, ROT_EIXO_Z, Tor, Tube, entre, estoque, graus } from './geo';
import { Lote } from './lote';
import { P } from './paleta';
import { SOL } from './luzes';
import { horaSaoPaulo, rotuloHora } from './relogio';
import type { texturaRotulo } from './texturas';

export interface Decoracao {
  grupo: Group;
  /** Emissivo das lâmpadas do varal e da luminária: a cor vai de apagada a acesa com o tema. */
  lampada: MeshBasicMaterial;
  /** Céu da janela: o mapa troca com o tema. */
  ceu: MeshBasicMaterial;
  feixe: Mesh;
  /** Decalque de sol e sombras de contato: só aparecem sem sombras em tempo real (nível leve). */
  leveGrupo: Group;
  decalqueMat: MeshBasicMaterial;
  /** Texturas criadas aqui dentro (o dono as descarta). */
  texturasExtras: Texture[];
  /** Tema da cena: de noite, a chuva e as janelas da cidade aparecem (as janelas acendem aos poucos se animar). */
  definirNoite(noite: boolean, animar: boolean): void;
  /** Animações contínuas (vapor, cursor, chuva, janelas). mov = visão geral, sem movimento reduzido. true = precisa de mais quadros. */
  animar(agora: number, mov: boolean): boolean;
  /** Balanço da planta. true = ainda se mexendo. */
  balancar(agora: number): boolean;
  /** Raio do ponteiro (ou null): rótulo do relógio no hover e balanço da planta. true = algo mudou. */
  ponteiro(raio: Ray | null, agora: number, reduz: boolean): boolean;
  /** Ponteiros e rótulo do relógio de parede com a hora de São Paulo (chamar a cada minuto). */
  atualizarRelogio(): void;
  /** Nível leve: desliga vapor, cursor piscando, chuva e balanço. */
  modoLeve(): void;
  dispose(): void;
}

interface Opcoes {
  sombra: boolean;
  leve: boolean;
  ceuDia: Texture;
  poster: Texture;
  bola: Texture;
  lombadas: Texture;
  sombraContato: Texture;
  janelasCidade: Texture;
  fumaca: Texture;
  rotulo: ReturnType<typeof texturaRotulo>;
}

const VS = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
/** Janelas dos prédios: o canal vermelho da textura é o instante em que cada uma acende. */
const FS_JANELAS = `uniform sampler2D map; uniform float luz; varying vec2 vUv;
void main(){ vec4 s = texture2D(map, vUv); float on = smoothstep(s.r - 0.06, s.r, luz * 1.12 - 0.06);
  gl_FragColor = vec4(mix(vec3(1.0, 0.82, 0.48), vec3(0.96, 0.94, 0.82), fract(s.r * 7.3)), s.a * on); }`;
/** Chuva no vidro: gotas que escorrem em colunas (com rastro) e gotas paradas. */
const FS_CHUVA = `uniform float t; varying vec2 vUv;
float h(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float escorre(vec2 uv, float cols, float seed, float vel){
  float col = floor(uv.x * cols);
  float cx = (col + 0.2 + 0.6 * h(col * 3.7 + seed)) / cols;
  float y = 1.0 - fract(t * vel * (0.7 + 0.6 * h(col + seed)) + h(col * 1.9 + seed));
  vec2 d = vec2(uv.x - cx, uv.y - y);
  float gota = smoothstep(0.012, 0.004, length(d));
  float rastro = step(0.0, d.y) * smoothstep(0.0035, 0.0, abs(d.x)) * (1.0 - clamp(d.y / 0.2, 0.0, 1.0)) * 0.4;
  return max(gota, rastro);
}
void main(){
  float a = max(escorre(vUv, 9.0, 1.0, 0.09), escorre(vUv, 13.0, 7.0, 0.06));
  vec2 c = floor(vUv * 18.0); float r = h(c.x * 13.0 + c.y * 7.1);
  vec2 q = fract(vUv * 18.0) - vec2(0.3 + 0.4 * h(r * 5.0), 0.3 + 0.4 * h(r * 9.0));
  a = max(a, step(0.7, r) * smoothstep(0.13, 0.05, length(q)) * 0.7);
  gl_FragColor = vec4(0.82, 0.9, 1.0, a * 0.6);
}`;

/** Ponto onde o raio de luz que passa por "p" encontra o plano y. */
function projetarNoPlano(p: V3, y: number): V3 {
  const d = new Vector3(...SOL.alvo).sub(new Vector3(...SOL.pos));
  const t = (y - p[1]) / d.y;
  return [p[0] + d.x * t, y, p[2] + d.z * t];
}

/** Topo do tapete (0,013): a mancha de sol cai sobre ele. */
const Y_TAPETE = 0.0145;

export function criarDecoracao(o: Opcoes): Decoracao {
  const m = estoque();
  const lote = new Lote();
  const lampada = new MeshBasicMaterial({ color: P.lampadaApagada, toneMapped: false });
  const g = new Group();
  g.name = 'decoracao';

  /* ---------- Janela (parede esquerda) ---------- */
  const papel = m.get(P.papel);
  const metal = m.get(P.metal);
  const madeira = m.get(P.madeira);
  lote.add(Box(0.12, 0.05, 1.2), papel, [-0.06, 2.125, 1.9]);
  lote.add(Box(0.12, 0.05, 1.2), papel, [-0.06, 0.975, 1.9]);
  lote.add(Box(0.12, 1.2, 0.05), papel, [-0.06, 1.55, 1.325]);
  lote.add(Box(0.12, 1.2, 0.05), papel, [-0.06, 1.55, 2.475]);
  lote.add(Box(0.12, 1.1, 0.03), papel, [-0.06, 1.55, 1.9]);
  lote.add(Box(0.18, 0.03, 1.24), papel, [0.03, 0.985, 1.9]);

  const ceu = new MeshBasicMaterial({ map: o.ceuDia, toneMapped: false });
  // Céu e cidade: só aparecem pelo vão. O plano do design (3,2 × 2,4 m em x −0,9) ficava aparente fora da parede, flutuando à
  // esquerda da maquete; este, de 2,0 × 1,5 m logo atrás do vão (x −0,45), é visto só pela janela (13.3, ajuste).
  const planoCeu = new Mesh(Plane(2.0, 1.5), ceu);
  planoCeu.rotation.y = Math.PI / 2;
  planoCeu.position.set(-0.45, 1.55, 1.9);
  g.add(planoCeu);
  const cidadeMat = new ShaderMaterial({ uniforms: { map: { value: o.janelasCidade }, luz: { value: 1 } }, vertexShader: VS, fragmentShader: FS_JANELAS, transparent: true, depthWrite: false });
  const planoLuzes = new Mesh(Plane(2.0, 1.5), cidadeMat);
  planoLuzes.rotation.y = Math.PI / 2;
  planoLuzes.position.set(-0.446, 1.55, 1.9);
  planoLuzes.visible = false;
  g.add(planoLuzes);
  // Vidro com chuva: dentro da espessura da parede, só no vão (1,1 × 1,1 m); só de noite.
  const chuvaMat = new ShaderMaterial({ uniforms: { t: { value: 0 } }, vertexShader: VS, fragmentShader: FS_CHUVA, transparent: true, depthWrite: false });
  const chuva = new Mesh(Plane(1.1, 1.1), chuvaMat);
  chuva.rotation.y = Math.PI / 2;
  chuva.position.set(-0.02, 1.55, 1.9);
  chuva.visible = false;
  g.add(chuva);

  // Cortina: 8 segmentos, deslocada em x por 0,03·sin(u·3π); varão ao longo de z.
  const cortina = new PlaneGeometry(0.28, 1.5, 8, 1);
  const pos = cortina.attributes.position as BufferAttribute;
  for (let i = 0; i < pos.count; i++) pos.setZ(i, 0.03 * Math.sin(((pos.getX(i) + 0.14) / 0.28) * 3 * Math.PI));
  cortina.computeVertexNormals();
  lote.add(cortina, m.get(P.tecido, { side: DoubleSide }), [0.06, 1.5, 1.22], [0, Math.PI / 2, 0]);
  lote.add(Cyl(0.012, 0.012, 1.6, 8), metal, [0.06, 2.25, 1.9], ROT_EIXO_Z);

  /* ---------- Pôster (aceno original, sem figura) ---------- */
  lote.add(RB(0.01, 0.82, 0.6, 0.004), papel, [0.006, 1.58, 3.05]);
  const poster = new Mesh(Plane(0.6, 0.82), new MeshLambertMaterial({ map: o.poster }));
  poster.rotation.y = Math.PI / 2;
  poster.position.set(0.0115, 1.58, 3.05);
  g.add(poster);

  /* ---------- Prateleira de estojos (aceno aos games) ---------- */
  lote.add(Box(0.22, 0.025, 0.6), madeira, [0.11, 1.55, 0.55]);
  lote.add(Box(0.02, 0.1, 0.02), metal, [0.02, 1.49, 0.35]);
  lote.add(Box(0.02, 0.1, 0.02), metal, [0.02, 1.49, 0.75]);
  // 8 estojos em pé, lombadas viradas para +x, com o atlas de lombadas (uma faixa de UV por estojo; cinco com nome).
  const matLombada = new MeshLambertMaterial({ map: o.lombadas, emissive: 0xffffff, emissiveMap: o.lombadas, emissiveIntensity: 0.4 });
  const NE = 8;
  for (let i = 0; i < NE; i++) {
    const z = 0.28 + i * 0.025;
    lote.add(Box(0.135, 0.19, 0.014), i % 2 === 0 ? papel : metal, [0.11, 1.6575, z]);
    const lombada = Plane(0.014, 0.19);
    const uv = lombada.attributes.uv as BufferAttribute;
    for (let k = 0; k < uv.count; k++) uv.setX(k, (i + uv.getX(k)) / NE);
    lote.add(lombada, matLombada, [0.1785, 1.6575, z], [0, Math.PI / 2, 0]);
  }
  // Controle genérico deitado na prateleira (forma própria, sem marca): corpo, empunhaduras, direcional, dois analógicos e 4 botões.
  const yc = 1.5625;
  lote.add(RB(0.07, 0.024, 0.15, 0.01), papel, [0.11, yc + 0.012, 0.7]);
  for (const dz of [-0.06, 0.06]) lote.add(Cyl(0.022, 0.02, 0.05, 10), papel, [0.11, yc + 0.025, 0.7 + dz]);
  for (const z of [0.675, 0.725]) lote.add(Cyl(0.009, 0.009, 0.012, 8), metal, [0.09, yc + 0.03, z]);
  lote.add(Box(0.022, 0.004, 0.007), papel, [0.13, yc + 0.026, 0.655]);
  lote.add(Box(0.007, 0.004, 0.022), papel, [0.13, yc + 0.026, 0.655]);
  for (const [x, z, cor] of [[0.141, 0.745, P.coral], [0.119, 0.745, P.azul], [0.13, 0.756, P.tachinha], [0.13, 0.734, P.ervaVerde]] as const) lote.add(Esfera(0.006, 6, 4), m.get(cor), [x, yc + 0.027, z]);

  /* ---------- Mesa, gaveteiro e o que fica sobre ela ---------- */
  lote.add(RB(2.0, 0.04, 0.76, 0.012), madeira, [1.25, 0.74, 0.42]);
  lote.add(Box(0.04, 0.72, 0.04), metal, [0.29, 0.36, 0.1]);
  lote.add(Box(0.04, 0.72, 0.04), metal, [0.29, 0.36, 0.74]);
  lote.add(RB(0.4, 0.7, 0.62, 0.01), madeira, [2.02, 0.35, 0.4]);
  lote.add(Box(0.36, 0.004, 0.005), m.get(P.madeiraEscura), [2.02, 0.36, 0.712]);
  lote.add(Box(0.36, 0.004, 0.005), m.get(P.madeiraEscura), [2.02, 0.03, 0.712]);
  lote.add(Box(0.1, 0.015, 0.015), metal, [2.02, 0.55, 0.72]);
  lote.add(Box(0.1, 0.015, 0.015), metal, [2.02, 0.2, 0.72]);
  lote.add(RB(0.46, 0.022, 0.15, 0.006), m.get(P.superficie2), [0.95, 0.771, 0.58]);
  lote.add(Box(0.32, 0.004, 0.24), m.get(P.coral), [1.46, 0.762, 0.56]);
  lote.add(Esfera(0.03, 10, 8), metal, [1.48, 0.775, 0.56], [0, 0, 0], [1, 0.5, 1.5]);
  lote.add(Cyl(0.04, 0.04, 0.09, 12), papel, [1.5, 0.805, 0.24]);
  lote.add(Tor(0.025, 0.007, 6, 12, Math.PI), papel, [1.54, 0.805, 0.24], [0, 0, -Math.PI / 2]);

  // Headset no suporte (genérico, sem marca)
  lote.add(Cyl(0.06, 0.06, 0.012, 12), metal, [2.08, 0.766, 0.22]);
  lote.add(Cyl(0.008, 0.008, 0.26, 6), metal, [2.08, 0.89, 0.22]);
  lote.add(Tor(0.085, 0.012, 6, 16, Math.PI), metal, [2.08, 0.97, 0.22]);
  lote.add(Cyl(0.04, 0.04, 0.03, 12), metal, [2.165, 0.97, 0.22], ROT_EIXO_X);
  lote.add(Cyl(0.04, 0.04, 0.03, 12), metal, [1.995, 0.97, 0.22], ROT_EIXO_X);

  // Luminária (fonte de luz da noite)
  lote.add(Cyl(0.07, 0.07, 0.02, 16), metal, [0.42, 0.77, 0.24]);
  const bracos: [V3, V3][] = [[[0.42, 0.78, 0.24], [0.4, 1.1, 0.26]], [[0.4, 1.1, 0.26], [0.58, 1.18, 0.42]]];
  for (const [a, b] of bracos) {
    const s = entre(a, b);
    lote.add(Cyl(0.012, 0.012, s.comprimento, 8), metal, s.centro, s.q);
  }
  const cupula = new Vector3(1.15, 0.76, 0.52).sub(new Vector3(0.6, 1.14, 0.44)).normalize();
  lote.add(Cone(0.075, 0.12, 12, true), metal, [0.6, 1.14, 0.44], new Quaternion().setFromUnitVectors(new Vector3(0, -1, 0), cupula));
  const bulbo = new Mesh(Esfera(0.025, 8, 6), lampada);
  bulbo.position.set(0.6, 1.14, 0.44).addScaledVector(cupula, -0.02);
  g.add(bulbo);

  // Cadeira (grupo em (1.05, 0, 1.30), rotation.y = −0.35)
  const baseCadeira = new Matrix4().compose(new Vector3(1.05, 0, 1.3), new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), -0.35), new Vector3(1, 1, 1));
  const cad = new Lote(baseCadeira);
  cad.add(RB(0.46, 0.07, 0.44, 0.02), metal, [0, 0.46, 0]);
  cad.add(RB(0.44, 0.48, 0.06, 0.02), metal, [0, 0.75, 0.19]);
  cad.add(Cyl(0.025, 0.025, 0.36, 8), metal, [0, 0.28, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i * 2 * Math.PI) / 5;
    cad.add(Box(0.28, 0.025, 0.04), metal, [Math.cos(a) * 0.12, 0.08, -Math.sin(a) * 0.12], [0, a, 0]);
    cad.add(Esfera(0.022, 6, 4), metal, [Math.cos(a) * 0.26, 0.03, -Math.sin(a) * 0.26]);
  }
  g.add(...cad.malhas(o.sombra));

  /* ---------- Tapete, mesinha, vaso ---------- */
  lote.add(RB(2.0, 0.012, 1.3, 0.004), m.get(P.tecido), [1.75, 0.006, 1.65]);
  lote.add(Box(1.8, 0.013, 1.1), m.get(P.paredeSombra), [1.75, 0.0065, 1.65]);
  lote.add(RB(0.7, 0.03, 0.45, 0.01), madeira, [2.85, 0.515, 0.305]);
  for (const [x, z] of [[2.54, 0.12], [3.16, 0.12], [2.54, 0.49], [3.16, 0.49]]) lote.add(Cyl(0.018, 0.018, 0.5, 8), m.get(P.madeiraEscura), [x, 0.25, z]);

  lote.add(Cyl(0.06, 0.045, 0.1, 12), m.get(P.paredeSombra), [3.08, 0.58, 0.2]);
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    const h = 0.1 + (i % 3) * 0.02;
    lote.add(Cone(0.02, h, 6), m.get(i % 2 === 0 ? P.ervaVerde : P.ervaVermelha), [3.08 + Math.cos(a) * 0.02, 0.63 + h / 2, 0.2 + Math.sin(a) * 0.02], [graus(15) * Math.sin(a), 0, -graus(15) * Math.cos(a)]);
  }

  /* ---------- Porta (recebe o 07 e o 08) ---------- */
  lote.add(RB(0.85, 2.05, 0.04, 0.01), madeira, [5.1, 1.025, 0.02]);
  lote.add(Box(0.06, 2.1, 0.03), m.get(P.madeiraEscura), [4.645, 1.05, 0.015]);
  lote.add(Box(0.06, 2.1, 0.03), m.get(P.madeiraEscura), [5.555, 1.05, 0.015]);
  lote.add(Box(0.97, 0.06, 0.03), m.get(P.madeiraEscura), [5.1, 2.08, 0.015]);
  lote.add(Esfera(0.028, 10, 8), metal, [4.76, 0.95, 0.07]);
  lote.add(Box(0.02, 0.08, 0.01), metal, [5.52, 0.35, 0.045]);
  lote.add(Box(0.02, 0.08, 0.01), metal, [5.52, 1.7, 0.045]);

  /* ---------- Bola e joelheiras de vôlei (genéricas) e planta de chão ---------- */
  // Gomos azul, branco e amarelo pintados por textura (texturaBola), sem marca.
  const bola = new Mesh(Esfera(0.105, 24, 16), new MeshLambertMaterial({ map: o.bola }));
  bola.position.set(4.98, 0.105, 0.78);
  bola.rotation.set(0.5, 0.7, 0.2);
  bola.castShadow = o.sombra;
  g.add(bola);
  // Joelheiras deitadas (corpo escuro, listra coral) e garrafinha em pé.
  for (const [x, z] of [[5.24, 0.7], [5.3, 0.82]]) {
    lote.add(Cyl(0.05, 0.05, 0.09, 12), metal, [x, 0.05, z], ROT_EIXO_X);
    lote.add(Tor(0.0515, 0.006, 6, 16), m.get(P.coral), [x, 0.05, z], [0, Math.PI / 2, 0]);
  }
  lote.add(Cyl(0.032, 0.032, 0.2, 12), m.get(P.azul), [5.42, 0.1, 0.5]);
  lote.add(Cyl(0.0335, 0.0335, 0.05, 12), papel, [5.42, 0.09, 0.5]);
  lote.add(Cyl(0.02, 0.02, 0.035, 10), papel, [5.42, 0.2175, 0.5]);

  lote.add(Cyl(0.14, 0.11, 0.3, 12), m.get(P.paredeSombra), [0.3, 0.15, 3.25]);
  // Folhas e hastes ficam num grupo à parte (pivô na borda do vaso) para balançar com o ponteiro.
  const lotePlanta = new Lote(new Matrix4().makeTranslation(-0.3, -0.3, -3.25));
  const folhas: V3[] = [[0.08, 0.55, 0.05], [-0.07, 0.65, 0.07], [0.02, 0.75, -0.09], [-0.05, 0.85, -0.04]];
  for (const [dx, y, dz] of folhas) lotePlanta.add(Ico(0.16, 0), m.get(P.ervaVerde), [0.3 + dx, y, 3.25 + dz]);
  const hastes: [number, number, number, number][] = [[0.03, 0.02, 0.25, -0.2], [-0.04, 0.03, -0.2, 0.25], [0.0, -0.05, 0.2, 0.1]];
  for (const [dx, dz, rx, rz] of hastes) lotePlanta.add(Cone(0.06, 0.45, 5), m.get(P.ervaVerde), [0.3 + dx, 0.7, 3.25 + dz], [rx, 0, rz]);

  g.add(...lote.malhas(o.sombra));
  const planta = new Group();
  planta.position.set(0.3, 0.3, 3.25);
  planta.add(...lotePlanta.malhas(o.sombra));
  g.add(planta);

  /* ---------- Varal de luzinhas: fio + 24 lâmpadas em InstancedMesh, por comprimento de arco ---------- */
  const pontos: V3[] = [[0.15, 2.7, 0.03], [1.0, 2.62, 0.05], [1.9, 2.7, 0.03], [2.8, 2.62, 0.05], [3.7, 2.7, 0.03], [4.6, 2.62, 0.05], [5.5, 2.7, 0.03]];
  const curva = new CatmullRomCurve3(pontos.map((p) => new Vector3(...p)));
  g.add(new Mesh(Tube(curva, 64, 0.004), metal));
  const lampadas = new InstancedMesh(Esfera(0.022, 8, 6), lampada, 24);
  const eixo = new Matrix4();
  for (let i = 0; i < 24; i++) {
    const p = curva.getPointAt((i + 0.5) / 24);
    lampadas.setMatrixAt(i, eixo.makeTranslation(p.x, p.y - 0.03, p.z));
  }
  g.add(lampadas);

  /* ---------- Feixe de sol: tronco aberto do vão da janela até a mancha no piso (só de dia) ---------- */
  const janela: V3[] = [[0, 1.0, 1.35], [0, 1.0, 2.45], [0, 2.1, 2.45], [0, 2.1, 1.35]];
  const mancha = janela.map((p) => projetarNoPlano(p, Y_TAPETE));
  const feixeGeo = new BufferGeometry();
  feixeGeo.setAttribute('position', new BufferAttribute(new Float32Array([...janela, ...mancha].flat()), 3));
  const cor = new Color(P.sol);
  const alfa = [0.1, 0.1, 0.1, 0.1, 0, 0, 0, 0];
  feixeGeo.setAttribute('color', new BufferAttribute(new Float32Array(alfa.flatMap((a) => [cor.r, cor.g, cor.b, a])), 4));
  feixeGeo.setIndex([0, 1, 5, 0, 5, 4, 1, 2, 6, 1, 6, 5, 2, 3, 7, 2, 7, 6, 3, 0, 4, 3, 4, 7]);
  const feixe = new Mesh(feixeGeo, new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, blending: AdditiveBlending, side: DoubleSide, toneMapped: false }));
  g.add(feixe);

  /* ---------- Relógio de parede (hora de São Paulo): sobre a parede do fundo, acima da porta, entre o varal e o batente ---------- */
  const RELOGIO: V3 = [5.1, 2.36, 0];
  const lr = new Lote();
  lr.add(Cyl(0.15, 0.15, 0.03, 28), metal, [RELOGIO[0], RELOGIO[1], 0.015], ROT_EIXO_Z);
  lr.add(Cyl(0.132, 0.132, 0.032, 28), papel, [RELOGIO[0], RELOGIO[1], 0.015], ROT_EIXO_Z);
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    const forte = i % 3 === 0;
    lr.add(Box(forte ? 0.012 : 0.007, forte ? 0.03 : 0.02, 0.004), metal, [RELOGIO[0] + Math.sin(a) * 0.105, RELOGIO[1] + Math.cos(a) * 0.105, 0.033], [0, 0, -a]);
  }
  g.add(...lr.malhas(false));
  const ponteiro = (comp: number, larg: number, z: number, cor: number) => {
    const geo = new BoxGeometry(larg, comp, 0.004).translate(0, comp / 2 - 0.01, 0);
    const mesh = new Mesh(geo, m.get(cor));
    mesh.position.set(RELOGIO[0], RELOGIO[1], z);
    g.add(mesh);
    return mesh;
  };
  const maoHora = ponteiro(0.075, 0.012, 0.036, P.metal);
  const maoMinuto = ponteiro(0.105, 0.008, 0.0405, P.metal);
  const pino = new Mesh(Cyl(0.011, 0.011, 0.006, 10), m.get(P.coral));
  pino.rotation.x = Math.PI / 2;
  pino.position.set(RELOGIO[0], RELOGIO[1], 0.044);
  g.add(pino);
  // Tamanho fixo na tela (sizeAttenuation off) para o rótulo continuar legível em janelas pequenas.
  const rotuloMat = new SpriteMaterial({ map: o.rotulo.textura, transparent: true, depthWrite: false, depthTest: false, sizeAttenuation: false });
  const rotulo = new Sprite(rotuloMat);
  rotulo.scale.set(0.088, 0.022, 1);
  rotulo.position.set(RELOGIO[0], 2.08, 0.06);
  rotulo.visible = false;
  rotulo.renderOrder = 10;
  g.add(rotulo);
  const esferaRelogio = new Sphere(new Vector3(RELOGIO[0], RELOGIO[1], 0.03), 0.16);
  const ingles = document.documentElement.lang.startsWith('en');
  const atualizarRelogio = () => {
    const { h, m: min } = horaSaoPaulo(new Date());
    maoMinuto.rotation.z = -min * graus(6);
    maoHora.rotation.z = -((h % 12) * 30 + min / 2) * (Math.PI / 180);
    o.rotulo.desenhar(rotuloHora(h, ingles));
  };
  atualizarRelogio();

  /* ---------- Vapor da caneca, cursor do monitor, chuva e janelas da cidade (só na visão geral; leve desliga) ---------- */
  const VAPOR: V3 = [1.5, 0.87, 0.24];
  const vapor = Array.from({ length: 4 }, () => {
    const s = new Sprite(new SpriteMaterial({ map: o.fumaca, transparent: true, depthWrite: false, opacity: 0, color: 0xb4bec4 }));
    s.position.set(...VAPOR);
    g.add(s);
    return s;
  });
  const passoVapor = (s: number) =>
    vapor.forEach((v, i) => {
      const p = (s / 2.6 + i / vapor.length) % 1;
      v.position.set(VAPOR[0] + 0.015 * Math.sin(p * 6.3 + i * 1.7), VAPOR[1] + p * 0.22, VAPOR[2]);
      v.scale.setScalar(0.04 + 0.07 * p);
      v.material.opacity = 0.5 * Math.sin(Math.PI * p);
    });
  passoVapor(0.8);
  // Cursor: barra à direita do "IA" da tela (posição em px da textura 1024×576 → plano 0,74 × 0,42 m do monitor).
  const cursorMat = new MeshBasicMaterial({ color: 0xb8400f, toneMapped: false });
  const cursor = new Mesh(Plane(0.0087, 0.0204), cursorMat);
  cursor.position.set(0.95 + (958 / 1024 - 0.5) * 0.74, 1.22 + (0.5 - 135 / 576) * 0.42, 0.3195);
  g.add(cursor);

  let desligado = o.leve;
  let noiteAgora = false;
  let luz = 1;
  let luzInicio = 0;
  let movAntes = false;
  const aplicarDesligado = () => {
    for (const v of vapor) v.visible = !desligado;
    chuva.visible = noiteAgora && !desligado;
    cursor.visible = true;
  };
  aplicarDesligado();
  const PLANTA = new Vector3(0.3, 0.7, 3.25);
  let balanco = { t0: 0, amp: 0 };
  let pertoPlanta = false;

  const balancar = (agora: number) => {
    if (!balanco.amp) return false;
    const s = (agora - balanco.t0) / 1000;
    const a = balanco.amp * Math.exp(-2.8 * s);
    if (a < 0.002) {
      balanco.amp = 0;
      planta.rotation.set(0, 0, 0);
    } else planta.rotation.set(a * 0.6 * Math.sin(s * 9 + 1), 0, a * Math.sin(s * 11));
    return true;
  };

  /* ---------- Nível leve: decalque de sol e sombras de contato (sem sombras em tempo real) ---------- */
  const leveGrupo = new Group();
  leveGrupo.visible = o.leve;
  g.add(leveGrupo);
  const decalqueMat = new MeshBasicMaterial({ color: P.sol, transparent: true, opacity: 0.35, depthWrite: false, toneMapped: false, side: DoubleSide });
  {
    const geo = new BufferGeometry();
    const quad = mancha.flatMap((p) => [p[0], Y_TAPETE + 0.001, p[2]]);
    geo.setAttribute('position', new BufferAttribute(new Float32Array(quad), 3));
    geo.setIndex([0, 1, 2, 0, 2, 3]);
    leveGrupo.add(new Mesh(geo, decalqueMat));

    const matSombra = new MeshBasicMaterial({ map: o.sombraContato, transparent: true, depthWrite: false, toneMapped: false });
    const sombras: [number, number, number, number, number][] = [
      [1.05, 1.3, 0.38, 0.38, Y_TAPETE], [2.85, 0.31, 0.5, 0.36, 0.005], [3.42, 0.7, 0.34, 0.2, 0.005], [4.98, 0.78, 0.16, 0.16, 0.005], [5.42, 0.5, 0.05, 0.05, 0.005], [0.3, 3.25, 0.22, 0.22, 0.005],
    ];
    for (const [x, z, rx, rz, y] of sombras) {
      const s = new Mesh(Circulo(1, 24), matSombra);
      s.rotation.x = -Math.PI / 2;
      s.scale.set(rx, rz, 1);
      s.position.set(x, y, z);
      leveGrupo.add(s);
    }
  }

  return {
    grupo: g,
    lampada,
    ceu,
    feixe,
    leveGrupo,
    decalqueMat,
    texturasExtras: [o.janelasCidade, o.fumaca, o.rotulo.textura],
    atualizarRelogio,
    balancar,
    modoLeve() {
      desligado = true;
      aplicarDesligado();
    },
    definirNoite(noite, animar) {
      noiteAgora = noite;
      planoLuzes.visible = noite;
      luz = noite && animar ? 0 : 1;
      luzInicio = performance.now();
      cidadeMat.uniforms.luz.value = luz;
      cursorMat.color.set(noite ? 0xff8a4c : 0xb8400f);
      for (const v of vapor) v.material.color.set(noite ? 0xffffff : 0xb4bec4);
      aplicarDesligado();
    },
    animar(agora, mov) {
      let ativo = false;
      if (noiteAgora && luz < 1) {
        luz = mov ? Math.min(1, (agora - luzInicio) / 4000) : 1;
        cidadeMat.uniforms.luz.value = luz;
        ativo = luz < 1;
      }
      if (mov && !desligado) {
        ativo = true;
        passoVapor(agora / 1000);
        cursor.visible = Math.floor(agora / 530) % 2 === 0;
        if (noiteAgora) chuvaMat.uniforms.t.value = agora / 1000;
      } else if (movAntes) {
        passoVapor(0.8);
        cursor.visible = true;
      }
      movAntes = mov && !desligado;
      return ativo;
    },
    ponteiro(raio, agora, reduz) {
      const sobre = !!raio && raio.intersectsSphere(esferaRelogio);
      const perto = !!raio && !desligado && !reduz && raio.distanceToPoint(PLANTA) < 0.32;
      if (perto && !pertoPlanta) balanco = { t0: agora, amp: 0.09 };
      const mudou = sobre !== rotulo.visible || (perto && !pertoPlanta);
      rotulo.visible = sobre;
      pertoPlanta = perto;
      return mudou;
    },
    dispose() {
      g.traverse((n) => {
        if (n instanceof Mesh) {
          n.geometry.dispose();
          for (const mm of Array.isArray(n.material) ? n.material : [n.material]) mm.dispose();
        }
      });
      for (const v of vapor) v.material.dispose();
      rotuloMat.dispose();
    },
  };
}
