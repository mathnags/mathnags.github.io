/**
 * Cena 3D do quarto (docs/design.md 13). ÚNICO ponto de entrada do `three`: o módulo principal só chega aqui por
 * `import('../cena/index')`, depois do `load` e no tempo ocioso. API: iniciar(opts) → Cena.
 *
 * Renderização sob demanda: não há laço contínuo. invalidar() pede um requestAnimationFrame só enquanto houver voo,
 * paralaxe amortecendo, transição de luz, desenho da linha do monitor ou mudança de destaque. Parado = 0 quadros por segundo.
 */
import { NeutralToneMapping, PCFShadowMap, PerspectiveCamera, SRGBColorSpace, Scene, Vector3, WebGLRenderer, Color, Mesh } from 'three';
import { CSS3DObject, CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import type { IdObjeto, V3 } from '../config/tipos';
import type { configCliente } from '../config/quarto';
import { compacto, type Rect } from './areas';
import { EASE_CHEGADA, EASE_VOO, Piloto, aplicarPose, bezier, direcao, type Pose } from './camera';
import { criarCasca } from './casca';
import { criarDecoracao } from './decoracao';
import { Escolha } from './escolha';
import { criarLuzes } from './luzes';
import { MonitorQuadros, pixelRatioDe, type Nivel } from './nivel';
import { criarCaderno } from './objetos/caderno';
import { criarCaixa } from './objetos/caixa';
import { criarEnvelope } from './objetos/envelope';
import { criarEstante } from './objetos/estante';
import { criarLenco } from './objetos/lenco';
import { criarMonitor } from './objetos/monitor';
import { criarMural } from './objetos/mural';
import { criarPortaRetrato } from './objetos/porta-retrato';
import type { Clicavel } from './objetos/base';
import { P } from './paleta';
import { geralDe, poseDe as poseDeCtx, type Ctx } from './poses';
import { Projecao, type AnotacaoProj, type MarcadorProj } from './projecao';
import { carregarFontes, criarTelaMonitor, texturaCaderno, texturaCeu, texturaLombadas, texturaPoster, texturaSombraContato } from './texturas';

export type CfgCliente = ReturnType<typeof configCliente>;
export type { Nivel } from './nivel';
export { escolherNivel } from './nivel';
export type { Rect } from './areas';

export interface OpcoesCena {
  cfg: CfgCliente;
  palco: HTMLElement;
  canvas: HTMLCanvasElement;
  /** .parede-bloco: nome, "Dados → IA" e o post-it "Fale comigo!". Vira um único CSS3DObject na parede do fundo. */
  bloco: HTMLElement | null;
  /** <a class="objeto"> (marcadores numerados), com data-objeto. */
  marcadores: HTMLElement[];
  anotacoes: AnotacaoProj[];
  nivel: Nivel;
  reduz: () => boolean;
  /** Hover do ponteiro sobre um objeto 3D (o link recebe data-hover). */
  aoHover: (id: IdObjeto | null) => void;
  /** Clique no objeto 3D = link.click(). */
  aoClicar: (id: IdObjeto) => void;
  /** Contexto perdido sem restauração em 2 s, ou quadros lentos demais mesmo depois das quedas. */
  aoFalha: (motivo: 'contexto' | 'lento') => void;
}

export interface OpcoesVoo {
  animar?: boolean;
  /** Chamado aos 75% do voo (ou na hora, se não houver animação): é quando a vista abre. */
  em75?: () => void;
}

export interface Cena {
  /** 'geral', o id de um objeto (pose da vista) ou o passo do tour (0 = geral, 1–8 = capítulos, 9 = vista do monitor). */
  irPara(alvo: 'geral' | IdObjeto | number, o?: OpcoesVoo): Promise<boolean>;
  /** Volta da vista à pose de origem (visão geral ou passo do tour), recalculada para a tela atual. */
  voltar(o?: { animar?: boolean }): Promise<boolean>;
  destacar(id: IdObjeto | null): void;
  /** Estado de leitura de cada objeto, que muda a luz de repouso: 'lido' (sem brilho) e 'proximo' (repouso mais forte e 1º no glint). */
  marcarEstados(e: Partial<Record<IdObjeto, 'lido' | 'proximo'>>): void;
  /** Retângulo (px, no palco) da janela de uma vista "dentro", já na pose final do voo. */
  retanguloJanela(id: IdObjeto): Rect | null;
  /** Mostra o canvas: com chegada (voo de 1200 ms a partir de longe) ou direto na pose atual. */
  mostrar(chegada: boolean): void;
  /** Avisa depois de recalcular câmera e projeções num redimensionamento (a moldura da vista acompanha). */
  aoRedimensionar(fn: () => void): void;
  pausar(): void;
  retomar(): void;
  destruir(): void;
  readonly nivel: Nivel;
}

const ceder = (): Promise<void> => {
  const s = (globalThis as { scheduler?: { yield?: () => Promise<void> } }).scheduler;
  return s?.yield ? s.yield() : new Promise((r) => setTimeout(r, 0));
};

/** Post-it da parede: tamanhos de fonte em px de parede (quarto.css) e piso de legibilidade em px de tela. */
const CTA_PX = 23;
const TITULO_PX = 34;
const PISO_CTA = 13.6; // 13 + folga: a parede em perspectiva encurta o texto na horizontal
const PISO_TITULO = 16.6;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const EASE_STD = bezier(0.4, 0, 0.2, 1);

export async function iniciar(o: OpcoesCena): Promise<Cena> {
  const { cfg, palco, canvas } = o;
  const html = document.documentElement;
  let leve = o.nivel === 'leve';
  let sombra = !leve;

  /* ---------- Renderizadores ---------- */
  // Sem GPU de verdade (renderizador por software), o contexto é recusado: iniciar() lança Error('sem-webgl') e carga.ts cai no modo recrutador.
  let renderer: WebGLRenderer;
  // O three loga console.error ao recusar o contexto; a queda para o modo recrutador é esperada, então o log é silenciado aqui.
  const erro = console.error;
  console.error = () => {};
  try {
    renderer = new WebGLRenderer({ canvas, antialias: !leve, alpha: true, powerPreference: leve ? 'low-power' : 'high-performance', failIfMajorPerformanceCaveat: true });
  } catch {
    throw new Error('sem-webgl');
  } finally {
    console.error = erro;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NeutralToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.setPixelRatio(pixelRatioDe(o.nivel));
  renderer.shadowMap.enabled = sombra;
  renderer.shadowMap.type = PCFShadowMap;
  renderer.shadowMap.autoUpdate = false;

  const dim = () => ({ L: palco.clientWidth, A: palco.clientHeight });
  let { L, A } = dim();
  if (!L || !A) ({ L, A } = { L: innerWidth, A: innerHeight });
  renderer.setSize(L, A, false);

  /* ---------- Texturas e montagem fatiada: casca → móveis → clicáveis → texturas (nenhuma tarefa > 50 ms) ---------- */
  await carregarFontes();
  // Uma textura por tarefa: cada desenho em canvas 2D fica bem abaixo de 50 ms.
  const fatiar = async <T>(f: () => T): Promise<T> => {
    const r = f();
    await ceder();
    return r;
  };
  const texCeuDia = await fatiar(() => texturaCeu(false));
  const texCeuNoite = await fatiar(() => texturaCeu(true));
  const tela = await fatiar(() => criarTelaMonitor(leve));
  const poster = await fatiar(texturaPoster);
  const lombadas = await fatiar(texturaLombadas);
  const sombraContato = await fatiar(texturaSombraContato);
  const paginas = await fatiar(texturaCaderno);
  const texturas = [texCeuDia, texCeuNoite, poster, lombadas, sombraContato, paginas, tela.textura];

  const cena = new Scene();
  cena.add(criarCasca(sombra));
  await ceder();
  const dec = criarDecoracao({ sombra, leve, ceuDia: texCeuDia, poster, lombadas, sombraContato });
  cena.add(dec.grupo);
  await ceder();

  const c = (id: IdObjeto) => cfg.objetos.find((x) => x.id === id)!.caixa;
  const clicaveis: Clicavel[] = [];
  for (const fazer of [
    () => criarMonitor(c('monitor'), sombra, tela),
    () => criarPortaRetrato(c('porta-retrato'), sombra),
    () => criarMural(c('mural'), sombra),
    () => criarCaderno(c('caderno'), sombra, paginas),
    () => criarCaixa(c('caixa'), sombra),
    () => criarEstante(c('estante'), sombra),
    () => criarLenco(c('lenco'), sombra),
    () => criarEnvelope(c('envelope'), sombra),
  ]) {
    clicaveis.push(fazer());
    await ceder();
  }
  for (const k of clicaveis) cena.add(k.grupo);
  const porIdClicavel = new Map(clicaveis.map((k) => [k.id, k]));
  const luzes = criarLuzes(cena, sombra);

  // Calibração (só no dev): alvos, focos, janelas e âncoras; não entra na build de produção.
  if (import.meta.env.DEV && html.dataset.calibrar && html.dataset.calibrar !== 'og') void import('./calibrar').then((m) => m.aplicarCalibracao(cena, cfg));

  const camera = new PerspectiveCamera(cfg.geral.fov, L / A, 0.05, 40);
  const objs = cfg.objetos;
  const porId = new Map(objs.map((x) => [x.id, x]));
  const escolha = new Escolha(objs.map((x) => ({ id: x.id, caixa: x.caixa })));

  /* ---------- Texto na cena: bloco do nome (CSS3D) e marcadores/anotações (projeção) ---------- */
  const projecao = new Projecao(
    o.marcadores.flatMap((el) => {
      const cfgObj = porId.get(el.dataset.objeto as IdObjeto);
      return cfgObj ? [{ el, ancora: cfgObj.marcador } satisfies MarcadorProj] : [];
    }),
    o.anotacoes,
  );

  const cena3d = new Scene();
  let css3d: CSS3DRenderer | null = null;
  let objBloco: CSS3DObject | null = null;
  let lugarBloco: { pai: Node; marca: Comment } | null = null;
  const blocoEm3d = (ligar: boolean) => {
    const b = o.bloco;
    if (!b) return;
    if (ligar && !objBloco) {
      if (!css3d) {
        css3d = new CSS3DRenderer();
        css3d.domElement.className = 'cena-css3d';
      }
      lugarBloco = { pai: b.parentNode!, marca: document.createComment('parede-bloco') };
      b.replaceWith(lugarBloco.marca);
      lugarBloco.marca.after(css3d.domElement);
      // Anexado ao host (e não solto) para poder medir; o renderizador o move para dentro da câmera CSS no 1º quadro.
      css3d.domElement.appendChild(b);
      b.classList.add('em-3d');
      b.style.pointerEvents = 'none';
      objBloco = new CSS3DObject(b);
      b.style.userSelect = 'text';
      b.removeAttribute('draggable');
      const [ax, ay, az] = cfg.paredeNome.ancora;
      const px = cfg.paredeNome.pxPorMetro;
      objBloco.scale.setScalar(1 / px);
      // O canto superior esquerdo do bloco fica na âncora; o centro do elemento é o ponto do objeto.
      objBloco.position.set(ax + b.offsetWidth / 2 / px, ay - b.offsetHeight / 2 / px, az);
      cena3d.add(objBloco);
      css3d.setSize(L, A);
    } else if (!ligar && objBloco && lugarBloco) {
      cena3d.remove(objBloco);
      objBloco = null;
      b.classList.remove('em-3d');
      b.style.transform = '';
      b.style.pointerEvents = '';
      lugarBloco.marca.replaceWith(b);
      css3d?.domElement.remove();
      lugarBloco = null;
    }
  };

  /* ---------- Poses ---------- */
  const piloto = new Piloto(camera, { pos: new Vector3(), alvo: new Vector3(), offX: 0, offY: 0 });
  piloto.vp = { L, A };
  let atual: Ctx = { k: 'geral' };
  let origem: Ctx = { k: 'geral' };

  const poseDe = (ctx: Ctx): Pose => poseDeCtx(cfg, ctx, L, A);

  /** Chegada: começa mais longe (× 1,25) e com o azimute + 8°, e voa até a visão geral. */
  function poseChegada(): Pose {
    const fim = poseDe({ k: 'geral' });
    const d = fim.pos.distanceTo(fim.alvo) * 1.25;
    return { ...fim, pos: fim.alvo.clone().addScaledVector(direcao(geralDe(cfg, L, A).az + 8, geralDe(cfg, L, A).el), d), alvo: fim.alvo.clone() };
  }

  /* ---------- Tema (dia = 0, noite = 1) ---------- */
  const sistemaEscuro = matchMedia('(prefers-color-scheme: dark)');
  const escuroAgora = () => (html.dataset.theme ? html.dataset.theme === 'dark' : sistemaEscuro.matches);
  let tAtual = escuroAgora() ? 1 : 0;
  let tAlvo = tAtual;
  let tInicio = 0;
  let tDe = tAtual;
  let escuroMapa: boolean | null = null;

  const aplicarTema = (t: number) => {
    luzes.aplicar(t);
    dec.lampada.color.set(P.lampadaApagada).lerp(new Color(P.lampadaAcesa), t);
    dec.feixe.visible = t < 0.5;
    dec.decalqueMat.opacity = lerp(0.35, 0.12, t);
    dec.decalqueMat.color.set(P.sol).lerp(new Color(P.luaSol), t);
    const noite = t >= 0.5;
    if (escuroMapa !== noite) {
      escuroMapa = noite;
      dec.ceu.map = noite ? texCeuNoite : texCeuDia;
      tela.desenhar(noite, linhaProgresso());
    }
  };

  /* ---------- Destaque (hover do ponteiro, foco do link) ---------- */
  const dv = new Map<IdObjeto, number>(clicaveis.map((k) => [k.id, 0]));
  let destaqueId: IdObjeto | null = null;
  let hoverRaio: IdObjeto | null = null;
  let emVista = false;
  let estados: Partial<Record<IdObjeto, 'lido' | 'proximo'>> = {};
  /** Glint guia: a cada 6 s uma rodada passa pelos não visitados (700 ms entre objetos); 3 rodadas ou até a 1ª interação. */
  let rodada = -1;
  let rodadaInicio = 0;
  let rodadasFeitas = 0;
  let glintTimer = 0;
  const lift = new Map<IdObjeto, number>(clicaveis.map((k) => [k.id, 0]));
  let pulsoId: IdObjeto | null = null;
  let pulsoInicio = 0;
  let linhaInicio = -1;
  let linhaFeita = false;
  const linhaProgresso = () => (linhaInicio < 0 ? 1 : Math.min(1, (performance.now() - linhaInicio) / 700));

  const pararGlint = () => {
    rodadasFeitas = 3;
    rodadaInicio = -1e9;
    clearTimeout(glintTimer);
  };
  const novaRodada = () => {
    if (rodadasFeitas >= 3 || destruida) return;
    rodadasFeitas++;
    rodadaInicio = performance.now();
    invalidar();
    glintTimer = window.setTimeout(novaRodada, 6000);
  };

  const definirDestaque = (id: IdObjeto | null) => {
    if (destaqueId === id) return;
    destaqueId = id;
    if (id) pararGlint();
    // 1º hover ou foco do monitor: a linha se desenha em 700 ms (nível completo e sem movimento reduzido).
    if (id === 'monitor' && !linhaFeita && !leve && !o.reduz()) {
      linhaFeita = true;
      linhaInicio = performance.now();
    }
    invalidar();
  };

  /* ---------- Paralaxe (só na visão geral, ponteiro fino, sem movimento reduzido) ---------- */
  const ponteiroFino = matchMedia('(hover: hover) and (pointer: fine)');
  let par = { az: 0, el: 0 };
  let parMeta = { az: 0, el: 0 };
  const GRAU = Math.PI / 180;
  let geralBase: { pos: Vector3; alvo: Vector3; offX: number; offY: number; d: number } | null = null;

  const paralaxeAtiva = () => ponteiroFino.matches && !o.reduz() && atual.k === 'geral' && !piloto.voando && !emVista;

  /* ---------- Laço sob demanda ---------- */
  let raf = 0;
  let ultimo = 0;
  let pausado = false;
  let destruida = false;
  let pronto = false;
  const monitor = new MonitorQuadros();

  function invalidar() {
    if (!raf && !pausado && !destruida && pronto) raf = requestAnimationFrame(quadro);
  }

  function renderizar() {
    if (!L || !A) return;
    renderer.render(cena, camera);
    if (objBloco && css3d) {
      // Piso de legibilidade do post-it: px de tela por px de parede = px/m na profundidade do bloco ÷ pxPorMetro. Abaixo do piso, amplia-se o post-it.
      const s = (A / (2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.distanceTo(objBloco.position))) / cfg.paredeNome.pxPorMetro;
      const f = Math.min(2.2, Math.max(1, PISO_CTA / (CTA_PX * s), PISO_TITULO / (TITULO_PX * s))).toFixed(2);
      if (objBloco.element.dataset.pf !== f) {
        objBloco.element.dataset.pf = f;
        objBloco.element.style.setProperty('--pf', f);
      }
      css3d.render(cena3d, camera);
    }
    projecao.atualizar(camera, L, A);
  }

  function quadro(agora: number) {
    raf = 0;
    if (pausado || destruida) return;
    const dt = ultimo ? Math.min((agora - ultimo) / 1000, 0.1) : 1 / 60;
    ultimo = agora;
    let ativo = false;

    // Voo
    if (piloto.voando) monitor.registrar(dt * 1000);
    if (piloto.quadro(agora)) ativo = true;

    // Transição de luz
    if (tAtual !== tAlvo) {
      const p = Math.min(1, (agora - tInicio) / 320);
      tAtual = tAlvo === tDe ? tAlvo : lerp(tDe, tAlvo, EASE_STD(p));
      if (p >= 1) tAtual = tAlvo;
      aplicarTema(tAtual);
      if (tAtual !== tAlvo) ativo = true;
    }

    // Luz dos objetos: repouso (creme leve), glint guia, hover/foco (emissive + subida de 3 cm) e pulso de chegada.
    const visaoGeral = atual.k === 'geral' && !emVista;
    const ordem = clicaveis.filter((x) => estados[x.id] !== 'lido');
    ordem.sort((x, y) => (estados[y.id] === 'proximo' ? 1 : 0) - (estados[x.id] === 'proximo' ? 1 : 0));
    for (const cl of clicaveis) {
      const meta = destaqueId === cl.id ? 1 : 0;
      let v = dv.get(cl.id)!;
      if (v !== meta) {
        v = meta > v ? Math.min(meta, v + dt / 0.12) : Math.max(meta, v - dt / 0.12);
        dv.set(cl.id, v);
        if (v !== meta) ativo = true;
      }
      // Subida: exponencial (~200 ms); com movimento reduzido não sobe, e na vista fica em 0 (a janela projetada pela moldura HTML é a da posição de repouso).
      let l = lift.get(cl.id)!;
      const lMeta = o.reduz() || emVista ? 0 : meta;
      if (l !== lMeta) {
        l += (lMeta - l) * (1 - Math.exp(-dt * 18));
        if (Math.abs(lMeta - l) < 0.003) l = lMeta;
        else ativo = true;
        lift.set(cl.id, l);
        cl.grupo.position.y = 0.03 * l;
      }
      let pulso = 0;
      if (pulsoId === cl.id) {
        const p = (agora - pulsoInicio) / 400;
        if (p < 1) {
          pulso = 0.15 * Math.sin(Math.PI * Math.max(0, p));
          ativo = true;
        } else pulsoId = null;
      }
      const est = estados[cl.id];
      // Repouso: só na visão geral e nos não visitados; na cena leve (celular) um pouco mais forte.
      let repouso = visaoGeral && est !== 'lido' ? (est === 'proximo' ? lerp(0.08, 0.06, tAtual) : lerp(0.05, 0.035, tAtual)) * (leve ? 1.5 : 1) : 0;
      if (visaoGeral && est !== 'lido' && !o.reduz() && rodadasFeitas > 0 && rodadasFeitas <= 3) {
        const p = (agora - rodadaInicio - ordem.indexOf(cl) * 700) / 600;
        if (p >= 0 && p < 1) repouso = Math.max(repouso, 0.2 * Math.sin(Math.PI * (1 - (1 - p) ** 3)));
        if (agora - rodadaInicio < ordem.length * 700 + 600) ativo = true;
      }
      const e = Math.max(lerp(repouso, 0.12, v), pulso);
      for (const m of cl.materiais) m.emissive.set(P.brilho).multiplyScalar(e);
      const op = 0.9 * v;
      (cl.contorno.material as { opacity: number }).opacity = op;
      cl.contorno.visible = op > 0.01;
    }

    // Desenho da linha do monitor (700 ms)
    if (linhaInicio >= 0 && linhaProgresso() < 1) {
      tela.desenhar(escuroMapa === true, linhaProgresso());
      ativo = true;
    } else if (linhaInicio >= 0) {
      tela.desenhar(escuroMapa === true, 1);
      linhaInicio = -1;
    }

    // Paralaxe: amortecimento exponencial, para quando |meta − atual| < 0,0005 rad.
    if (paralaxeAtiva() && geralBase) {
      const f = 1 - Math.exp(-5 * dt);
      par.az += (parMeta.az - par.az) * f;
      par.el += (parMeta.el - par.el) * f;
      const longe = Math.abs(parMeta.az - par.az) > 0.0005 || Math.abs(parMeta.el - par.el) > 0.0005;
      if (!longe) par = { ...parMeta };
      const dir = direcao(geralDe(cfg, L, A).az + par.az / GRAU, geralDe(cfg, L, A).el + par.el / GRAU);
      piloto.pose.pos.copy(geralBase.alvo).addScaledVector(dir, geralBase.d);
      piloto.aplicar();
      if (longe) ativo = true;
    }

    renderizar();
    if (ativo) raf = requestAnimationFrame(quadro);
    else ultimo = 0;
  }

  const refazerBase = () => {
    const p = poseDe({ k: 'geral' });
    geralBase = { ...p, d: p.pos.distanceTo(p.alvo) };
  };

  /* ---------- Voos ---------- */
  const mostraOcultaveis = (id: IdObjeto, oculta: boolean) => {
    const cl = porIdClicavel.get(id);
    // Na folha inferior do mobile não há moldura HTML sobre o objeto: ele fica inteiro na cena.
    if (cl) for (const x of cl.ocultaveis) x.visible = !(oculta && !compacto(L, A));
  };

  async function irPara(alvo: 'geral' | IdObjeto | number, opcoes: OpcoesVoo = {}): Promise<boolean> {
    // O passo 0 do tour É a visão geral.
    const ctx: Ctx = typeof alvo === 'number' ? (alvo <= 0 ? { k: 'geral' } : { k: 'tour', n: alvo }) : alvo === 'geral' ? { k: 'geral' } : { k: 'vista', id: alvo };
    // Com uma vista aberta, mudar de passo só atualiza a pose de volta.
    if (ctx.k !== 'vista' && atual.k === 'vista') {
      origem = ctx;
      return true;
    }
    if (ctx.k === 'vista') {
      if (atual.k !== 'vista') origem = atual;
      else mostraOcultaveis(atual.id, false);
      emVista = true;
      par = { az: 0, el: 0 };
      parMeta = { az: 0, el: 0 };
      definirDestaque(ctx.id);
    }
    atual = ctx;
    const pose = poseDe(ctx);
    const abrir = () => {
      if (ctx.k === 'vista') mostraOcultaveis(ctx.id, true);
      opcoes.em75?.();
    };
    if (opcoes.animar === false || o.reduz() || !pronto) {
      piloto.cortar(pose);
      abrir();
      if (ctx.k === 'geral') refazerBase();
      invalidar();
      return true;
    }
    monitor.iniciarVoo();
    const voo = piloto.voar(pose, 900, EASE_VOO, performance.now(), abrir);
    invalidar();
    const ok = await voo;
    if (ok) {
      if (ctx.k === 'vista') {
        pulsoId = ctx.id;
        pulsoInicio = performance.now();
      }
      if (ctx.k === 'geral') refazerBase();
      aplicarQueda();
      invalidar();
    }
    return ok;
  }

  async function voltar(opcoes: { animar?: boolean } = {}): Promise<boolean> {
    if (atual.k !== 'vista') return true;
    mostraOcultaveis(atual.id, false);
    const para = origem;
    atual = para;
    emVista = false;
    const pose = poseDe(para);
    if (opcoes.animar === false || o.reduz()) {
      piloto.cortar(pose);
      definirDestaque(null);
      refazerBase();
      invalidar();
      return true;
    }
    monitor.iniciarVoo();
    const voo = piloto.voar(pose, 700, EASE_VOO, performance.now());
    invalidar();
    const ok = await voo;
    if (ok) {
      definirDestaque(null);
      refazerBase();
      aplicarQueda();
      invalidar();
    }
    return ok;
  }

  function aplicarQueda() {
    const q = monitor.terminarVoo();
    if (q === 'pixel') {
      renderer.setPixelRatio(1);
      renderer.setSize(L, A, false);
    } else if (q === 'sombra' && sombra) {
      sombra = false;
      leve = true;
      renderer.shadowMap.enabled = false;
      luzes.sol.castShadow = false;
      dec.leveGrupo.visible = true;
      cena.traverse((n) => {
        const m = (n as Mesh).material;
        for (const x of Array.isArray(m) ? m : m ? [m] : []) x.needsUpdate = true;
      });
    } else if (q === 'lento') {
      o.aoFalha('lento');
    }
  }

  /* ---------- Tamanho ---------- */
  const ouvintesResize: (() => void)[] = [];
  const redimensionar = () => {
    const d = dim();
    if (!d.L || !d.A) return;
    L = d.L;
    A = d.A;
    renderer.setSize(L, A, false);
    camera.aspect = L / A;
    camera.updateProjectionMatrix();
    css3d?.setSize(L, A);
    piloto.vp = { L, A };
    blocoEm3d(!compacto(L, A));
    piloto.cortar(poseDe(atual));
    refazerBase();
    invalidar();
    for (const fn of ouvintesResize) fn();
  };
  const obs = new ResizeObserver(redimensionar);
  obs.observe(palco);

  /* ---------- Ponteiro: hover e clique no objeto 3D ---------- */
  let pendenteRaio = false;
  let ultimoPonteiro = { x: 0, y: 0 };
  const podeDestacar = () => !emVista && !piloto.voando;
  const aoMover = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    ultimoPonteiro = { x: e.clientX - r.left, y: e.clientY - r.top };
    if (e.pointerType === 'touch') return;
    if (ponteiroFino.matches && !o.reduz()) {
      const nx = ((e.clientX - (r.left + L / 2)) / (L / 2)) || 0;
      const ny = ((e.clientY - (r.top + A / 2)) / (A / 2)) || 0;
      parMeta = { az: Math.max(-1, Math.min(1, nx)) * 1.5 * GRAU, el: -Math.max(-1, Math.min(1, ny)) * 1.0 * GRAU };
      if (paralaxeAtiva()) invalidar();
    }
    if (pendenteRaio || !podeDestacar()) return;
    pendenteRaio = true;
    requestAnimationFrame(() => {
      pendenteRaio = false;
      const id = escolha.em(camera, ultimoPonteiro.x, ultimoPonteiro.y, L, A);
      if (id === hoverRaio) return;
      hoverRaio = id;
      canvas.style.cursor = id ? 'pointer' : '';
      o.aoHover(id);
      definirDestaque(id);
    });
  };
  const aoSair = () => {
    parMeta = { az: 0, el: 0 };
    if (paralaxeAtiva()) invalidar();
    if (hoverRaio) {
      hoverRaio = null;
      canvas.style.cursor = '';
      o.aoHover(null);
      definirDestaque(null);
    }
  };
  let toque: { x: number; y: number; t: number } | null = null;
  const aoBaixar = (e: PointerEvent) => {
    pararGlint();
    toque = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const aoLevantar = (e: PointerEvent) => {
    const t = toque;
    toque = null;
    if (!t || emVista || piloto.voando) return;
    if (Math.hypot(e.clientX - t.x, e.clientY - t.y) >= 6 || performance.now() - t.t >= 500) return;
    const r = canvas.getBoundingClientRect();
    const id = escolha.em(camera, e.clientX - r.left, e.clientY - r.top, L, A);
    if (id) o.aoClicar(id);
  };
  canvas.addEventListener('pointermove', aoMover);
  canvas.addEventListener('pointerleave', aoSair);
  canvas.addEventListener('pointerdown', aoBaixar);
  canvas.addEventListener('pointerup', aoLevantar);
  // O ponteiro fora do canvas (sobre um marcador, por exemplo) também leva a paralaxe de volta ao centro.
  document.addEventListener('mouseleave', aoSair);

  /* ---------- Tema pelo <html data-theme> e pelo sistema ---------- */
  const mudouTema = () => {
    const alvoT = escuroAgora() ? 1 : 0;
    if (alvoT === tAlvo) return;
    tAlvo = alvoT;
    if (o.reduz()) {
      tAtual = alvoT;
      aplicarTema(tAtual);
    } else {
      tDe = tAtual;
      tInicio = performance.now();
    }
    invalidar();
  };
  const obsTema = new MutationObserver(mudouTema);
  obsTema.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
  sistemaEscuro.addEventListener('change', mudouTema);

  /* ---------- Visibilidade e contexto WebGL ---------- */
  const aoVisibilidade = () => {
    if (document.hidden) {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ultimo = 0;
    } else invalidar();
  };
  document.addEventListener('visibilitychange', aoVisibilidade);
  let temporizadorContexto = 0;
  canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    temporizadorContexto = window.setTimeout(() => o.aoFalha('contexto'), 2000);
  });
  canvas.addEventListener('webglcontextrestored', () => {
    clearTimeout(temporizadorContexto);
    invalidar();
  });
  // Em bfcache (persisted) a página volta inteira: a cena só é destruída quando a página realmente sai.
  const aoSairDaPagina = (e: PageTransitionEvent) => {
    if (!e.persisted) destruir();
  };
  addEventListener('pagehide', aoSairDaPagina);

  /* ---------- Primeira montagem ---------- */
  aplicarTema(tAtual);
  await ceder();
  blocoEm3d(!compacto(L, A));
  piloto.cortar(poseChegada());
  await ceder();
  await renderer.compileAsync(cena, camera);
  // Envia cada textura à GPU numa tarefa própria: o 1º renderizar() não paga todos os uploads de uma vez.
  for (const t of texturas) {
    renderer.initTexture(t);
    await ceder();
  }
  if (sombra) renderer.shadowMap.needsUpdate = true;
  pronto = true;
  refazerBase();
  renderizar();

  function destruir() {
    if (destruida) return;
    destruida = true;
    cancelAnimationFrame(raf);
    clearTimeout(temporizadorContexto);
    clearTimeout(glintTimer);
    obs.disconnect();
    obsTema.disconnect();
    sistemaEscuro.removeEventListener('change', mudouTema);
    document.removeEventListener('visibilitychange', aoVisibilidade);
    document.removeEventListener('mouseleave', aoSair);
    removeEventListener('pagehide', aoSairDaPagina);
    canvas.removeEventListener('pointermove', aoMover);
    canvas.removeEventListener('pointerleave', aoSair);
    canvas.removeEventListener('pointerdown', aoBaixar);
    canvas.removeEventListener('pointerup', aoLevantar);
    piloto.cancelar();
    escolha.dispose();
    dec.dispose();
    cena.traverse((n) => {
      const m = n as Mesh;
      if (!m.isMesh) return;
      m.geometry.dispose();
      for (const x of Array.isArray(m.material) ? m.material : [m.material]) x.dispose();
    });
    for (const t of texturas) t.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return {
    nivel: o.nivel,
    irPara,
    voltar,
    marcarEstados(e) {
      estados = e;
      if (rodada < 0) {
        rodada = 0;
        glintTimer = window.setTimeout(novaRodada, 1800);
      }
      invalidar();
    },
    destacar(id) {
      if (emVista && id !== null) return;
      if (!podeDestacar() && id !== null) return;
      definirDestaque(id);
    },
    retanguloJanela(id) {
      const x = porId.get(id);
      if (!x?.janela) return null;
      const tmp = new PerspectiveCamera(cfg.geral.fov, L / A, 0.05, 40);
      aplicarPose(tmp, poseDe({ k: 'vista', id }), { L, A });
      const v = new Vector3();
      const { min, max } = x.janela;
      const xs: number[] = [];
      const ys: number[] = [];
      for (const px of [min[0], max[0]])
        for (const py of [min[1], max[1]]) {
          v.set(px, py, min[2]).project(tmp);
          xs.push((v.x * 0.5 + 0.5) * L);
          ys.push((-v.y * 0.5 + 0.5) * A);
        }
      const x0 = Math.min(...xs);
      const y0 = Math.min(...ys);
      return { x: x0, y: y0, l: Math.max(...xs) - x0, a: Math.max(...ys) - y0 };
    },
    mostrar(chegada) {
      canvas.dataset.visivel = '';
      if (chegada && !o.reduz() && atual.k === 'geral') {
        // Chegada: começa mais longe (× 1,25) e com o azimute + 8°, e voa até a visão geral em 1200 ms.
        piloto.cortar(poseChegada());
        monitor.iniciarVoo();
        void piloto.voar(poseDe({ k: 'geral' }), 1200, EASE_CHEGADA, performance.now()).then((ok) => {
          if (ok) refazerBase();
        });
      } else {
        piloto.cortar(poseDe(atual));
        refazerBase();
      }
      invalidar();
    },
    aoRedimensionar(fn) {
      ouvintesResize.push(fn);
    },
    pausar() {
      pausado = true;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      ultimo = 0;
    },
    retomar() {
      pausado = false;
      redimensionar();
    },
    destruir,
  };
}

/** Só para os tipos: V3 é usado por quem lê a config. */
export type { V3 };
