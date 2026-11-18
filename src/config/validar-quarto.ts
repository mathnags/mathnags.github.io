/**
 * Validação da config do quarto (docs/design.md 9.2). Roda ao importar src/config/quarto.ts,
 * ou seja, em toda build, e também nos testes. Um erro aqui derruba a build.
 *
 * O que depende do HTML gerado (se "destino" e "secao" existem como id nas páginas pt e en,
 * e se há ids duplicados) é verificado depois da build por integrations/verificar-ancoras.mjs.
 */
import { SECOES } from '../i18n/secoes';
import {
  COMPONENTES_DECORACAO,
  COMPONENTES_OBJETO,
  IDS_OBJETOS,
  TIPOS_VISTA_DENTRO,
  type ConfigQuarto,
  type Rect,
} from './tipos';

const PROPORCAO_CAMERA = 1.6;
const TOLERANCIA_PROPORCAO = 0.01;
const ALVO_MINIMO_PX = 44;
/** Faixa reservada ao nome grande (design 11.3): y < 50 e x < 1060. */
const FAIXA_NOME: Rect = { x: 0, y: 0, l: 1060, a: 50 };
/** Caixas conservadoras (unidades do viewBox): círculo + ponta e etiqueta só com o número (palco de 812 px). */
const MARCADOR_PX = 58;
const FLUTUA = 8;
const ETIQUETA_PRINCIPAL = 130;
const ETIQUETA_SEC = 110;

const dentroDe = (r: Rect, c: Rect) => r.x >= c.x && r.y >= c.y && r.x + r.l <= c.x + c.l && r.y + r.a <= c.y + c.a;
const sobrepoe = (a: Rect, b: Rect) => a.x < b.x + b.l && b.x < a.x + a.l && a.y < b.y + b.a && b.y < a.y + a.a;
const fmt = (r: Rect) => `{x:${r.x}, y:${r.y}, l:${r.l}, a:${r.a}}`;

export function errosDoQuarto(q: ConfigQuarto): string[] {
  const erros: string[] = [];
  const tela: Rect = { x: 0, y: 0, l: q.viewBox.l, a: q.viewBox.a };
  const minimoUnidades = Math.ceil((ALVO_MINIMO_PX * q.viewBox.l) / q.palcoMinimoPx);
  const capituloDaSecao = new Map<string, number | null>(SECOES.map((s) => [s.id, s.capitulo]));

  // O conjunto de objetos é a lista fechada IDS_OBJETOS, sem repetição.
  const ids = q.objetos.map((o) => o.id);
  for (const id of IDS_OBJETOS) if (!ids.includes(id)) erros.push(`objeto "${id}" ausente da config`);
  if (new Set(ids).size !== ids.length) erros.push('há objetos com id repetido');

  // Ordem única, contínua (1…N) e acompanhando o capítulo.
  const porOrdem = [...q.objetos].sort((a, b) => a.ordem - b.ordem);
  porOrdem.forEach((o, i) => {
    if (o.ordem !== i + 1) erros.push(`"${o.id}": ordem ${o.ordem}, esperado ${i + 1} (ordens únicas e contínuas)`);
    const anterior = porOrdem[i - 1];
    if (anterior && anterior.capitulo > o.capitulo) erros.push(`"${o.id}": ordem fora da sequência dos capítulos`);
  });

  // Exatamente um objeto principal por capítulo.
  for (let c = 1; c <= 8; c++) {
    const principais = q.objetos.filter((o) => o.capitulo === c && o.papel === 'principal');
    if (principais.length !== 1) erros.push(`capítulo ${c}: ${principais.length} objetos principais (esperado 1)`);
  }

  for (const o of q.objetos) {
    const nome = `"${o.id}"`;
    const clique = o.clique ?? o.caixa;

    if (!COMPONENTES_OBJETO.includes(o.componente)) erros.push(`${nome}: componente "${o.componente}" desconhecido`);
    if (o.papel === 'principal' && !o.lampada) erros.push(`${nome}: principal sem lâmpada`);
    if (o.papel === 'secundario' && o.lampada) erros.push(`${nome}: secundário não tem lâmpada`);
    if (o.lampada && (o.lampada.x < q.varal.de || o.lampada.x > q.varal.ate)) erros.push(`${nome}: lâmpada fora do varal`);

    if (!capituloDaSecao.has(o.secao)) erros.push(`${nome}: seção "${o.secao}" não existe em SECOES`);
    else if (capituloDaSecao.get(o.secao) !== o.capitulo) {
      erros.push(`${nome}: capítulo ${o.capitulo} não é o da seção "${o.secao}"`);
    }

    if (!dentroDe(o.caixa, tela)) erros.push(`${nome}: caixa ${fmt(o.caixa)} fora do viewBox`);
    if (!dentroDe(clique, tela)) erros.push(`${nome}: clique ${fmt(clique)} fora do viewBox`);
    if (clique.l < minimoUnidades || clique.a < minimoUnidades) {
      erros.push(
        `${nome}: clique ${clique.l}×${clique.a} menor que ${minimoUnidades}×${minimoUnidades} (44 px no palco de ${q.palcoMinimoPx} px)`,
      );
    }

    const { camera, janela, tipo } = o.vista;
    if (Math.abs(camera.l / camera.a - PROPORCAO_CAMERA) > TOLERANCIA_PROPORCAO) {
      erros.push(`${nome}: câmera ${fmt(camera)} não é 16:10`);
    }
    if (!dentroDe(camera, tela)) erros.push(`${nome}: câmera ${fmt(camera)} fora do viewBox`);
    const ehVistaDentro = (TIPOS_VISTA_DENTRO as readonly string[]).includes(tipo);
    if (ehVistaDentro && !janela) erros.push(`${nome}: vista "${tipo}" exige janela`);
    if (!ehVistaDentro && janela) erros.push(`${nome}: painel "${tipo}" não usa janela`);
    if (janela && !dentroDe(janela, camera)) erros.push(`${nome}: janela ${fmt(janela)} fora da câmera`);

    if (o.papel === 'secundario' && o.mobile.ladrilho !== null) erros.push(`${nome}: secundário não vira ladrilho`);
    if (o.papel === 'principal' && o.mobile.ladrilho !== o.capitulo) erros.push(`${nome}: ladrilho deve ser ${o.capitulo}`);
    for (const d of o.mobile.desenhos) {
      if (!COMPONENTES_OBJETO.includes(d)) erros.push(`${nome}: desenho "${d}" desconhecido`);
    }
  }

  // Nenhuma área de clique sobre outra.
  q.objetos.forEach((a, i) => {
    for (const b of q.objetos.slice(i + 1)) {
      if (sobrepoe(a.clique ?? a.caixa, b.clique ?? b.caixa)) erros.push(`cliques de "${a.id}" e "${b.id}" se sobrepõem`);
    }
  });

  // Lâmpadas-pino (design 11.1): dentro do viewBox, fora da faixa do nome, sem cobrir cliques, etiquetas ou outros marcadores.
  const caixaMarcador = (o: ConfigQuarto['objetos'][number]): Rect => {
    const mk = o.marcador!;
    return { x: mk.x - MARCADOR_PX / 2, y: mk.y - MARCADOR_PX / 2 - FLUTUA, l: MARCADOR_PX, a: MARCADOR_PX + 2 * FLUTUA };
  };
  const caixaEtiqueta = (o: ConfigQuarto['objetos'][number]): Rect => {
    const e = o.etiqueta ?? { x: o.caixa.x, y: o.caixa.y };
    const l = o.papel === 'principal' ? ETIQUETA_PRINCIPAL : ETIQUETA_SEC;
    const aDireita = o.caixa.x + o.caixa.l / 2 > q.viewBox.l * 0.8;
    const x = aDireita ? (o.etiqueta?.x ?? o.caixa.x + o.caixa.l) - l : e.x;
    return { x, y: e.y - 26, l, a: 52 };
  };
  const comMarcador = q.objetos.filter((o) => o.marcador);
  for (const o of q.objetos) {
    if (o.papel === 'principal' && !o.marcador) erros.push(`"${o.id}": principal sem marcador`);
    if (o.papel === 'secundario' && o.marcador) erros.push(`"${o.id}": só os principais têm marcador (1 por capítulo)`);
  }
  for (const o of comMarcador) {
    const m = caixaMarcador(o);
    const nome = `marcador de "${o.id}"`;
    if (!dentroDe(m, tela)) erros.push(`${nome}: fora do viewBox`);
    if (sobrepoe(m, FAIXA_NOME)) erros.push(`${nome}: invade a faixa do nome`);
    for (const b of q.objetos) {
      if (b.id !== o.id && sobrepoe(m, b.clique ?? b.caixa)) erros.push(`${nome}: cobre a área de clique de "${b.id}"`);
      if (sobrepoe(m, caixaEtiqueta(b))) erros.push(`${nome}: cobre a etiqueta de "${b.id}"`);
      if (b.marcador && b.id > o.id && sobrepoe(m, caixaMarcador(b))) erros.push(`${nome}: colide com o marcador de "${b.id}"`);
    }
  }

  for (const d of q.decoracao) {
    if (sobrepoe(d.caixa, FAIXA_NOME)) erros.push(`decoração "${d.id}": invade a faixa do nome`);
    if (!COMPONENTES_DECORACAO.includes(d.componente)) erros.push(`decoração "${d.id}": componente desconhecido`);
    if (!dentroDe(d.caixa, tela)) erros.push(`decoração "${d.id}": caixa fora do viewBox`);
  }

  return erros;
}

export function validarQuarto<T extends ConfigQuarto>(q: T): T {
  const erros = errosDoQuarto(q);
  if (erros.length) throw new Error(`src/config/quarto.ts inválido:\n- ${erros.join('\n- ')}`);
  return q;
}
