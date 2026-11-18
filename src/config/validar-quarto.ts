/**
 * Validação da config do quarto (docs/design.md 12.6, 12.13.4 e 12.13.7). Roda ao importar src/config/quarto.ts,
 * ou seja, em toda build, e também nos testes. Um erro aqui derruba a build.
 *
 * O que depende do HTML gerado (se "destino" e "secoes" existem como id nas páginas pt e en,
 * e se há ids duplicados) é verificado depois da build por integrations/verificar-ancoras.mjs.
 */
import { SECOES } from '../i18n/secoes';
import { IDS_OBJETOS, TIPOS_VISTA_DENTRO, type ConfigQuarto, type Rect } from './tipos';

/** Área segura em 16:10 (12.2): cortam-se cerca de 5% de cada lado. */
export const AREA_SEGURA: Rect = { x: 6, y: 15, l: 88, a: 71 };
/** Mínimo do clique: ≥ 44 px na menor tela em tela cheia (12.6). */
const CLIQUE_MIN = { l: 3.3, a: 5.8 };
/** Post-it nominal em % da imagem (7vw = 89,6 px em 1280×720, o caso mais apertado com a imagem inteira). */
export const POSTIT = { l: 7, a: 12.5 };
/** Post-it "Fale comigo!" (âncora = canto superior esquerdo). */
export const POSTIT_CONTATO = { l: 8.5, a: 15 };
const ESCALA_MAX = 2;
const ESCALA_MAX_MONITOR = 3;

const dentroDe = (r: Rect, c: Rect) => r.x >= c.x && r.y >= c.y && r.x + r.l <= c.x + c.l && r.y + r.a <= c.y + c.a;
const sobrepoe = (a: Rect, b: Rect) => a.x < b.x + b.l && b.x < a.x + a.l && a.y < b.y + b.a && b.y < a.y + a.a;
const fmt = (r: Rect) => `{x:${r.x}, y:${r.y}, l:${r.l}, a:${r.a}}`;
const TELA: Rect = { x: 0, y: 0, l: 100, a: 100 };

export const caixaDoPostit = (p: { x: number; y: number }): Rect => ({ x: p.x - POSTIT.l / 2, y: p.y - POSTIT.a / 2, l: POSTIT.l, a: POSTIT.a });

export function errosDoQuarto(q: ConfigQuarto): string[] {
  const erros: string[] = [];
  const capituloDaSecao = new Map<string, number | null>(SECOES.map((s) => [s.id, s.capitulo]));

  const ids = q.objetos.map((o) => o.id);
  for (const id of IDS_OBJETOS) if (!ids.includes(id)) erros.push(`objeto "${id}" ausente da config`);
  if (q.objetos.length !== 8) erros.push(`${q.objetos.length} objetos (esperado 8)`);
  if (new Set(ids).size !== ids.length) erros.push('há objetos com id repetido');
  const capitulos = q.objetos.map((o) => o.capitulo).sort();
  if (capitulos.join() !== '1,2,3,4,5,6,7,8') erros.push('os capítulos precisam ser 1 a 8, sem repetição');
  const destinos = q.objetos.map((o) => o.destino);
  if (new Set(destinos).size !== destinos.length) erros.push('há destinos repetidos');

  const reservadas = [...q.areasReservadas, { nome: 'nome na parede', area: q.paredeNome }];
  const contato = { x: q.postitContato.x, y: q.postitContato.y, ...POSTIT_CONTATO };

  for (const o of q.objetos) {
    const nome = `"${o.id}"`;
    const { clique } = o;

    // Seções e destino
    for (const s of o.secoes) if (!capituloDaSecao.has(s)) erros.push(`${nome}: seção "${s}" não existe em SECOES`);
    const principal = o.secoes[o.secoes.length - 1];
    if (principal !== o.destino) erros.push(`${nome}: o destino "${o.destino}" deve ser a última seção (${principal})`);
    if (capituloDaSecao.get(o.destino) !== o.capitulo) erros.push(`${nome}: capítulo ${o.capitulo} não é o da seção "${o.destino}"`);

    // Clique: área segura, fora das faixas reservadas, tamanho mínimo
    if (!dentroDe(clique, AREA_SEGURA)) erros.push(`${nome}: clique ${fmt(clique)} fora da área segura ${fmt(AREA_SEGURA)}`);
    for (const r of reservadas) if (sobrepoe(clique, r.area)) erros.push(`${nome}: clique invade "${r.nome}"`);
    if (clique.l < CLIQUE_MIN.l || clique.a < CLIQUE_MIN.a) erros.push(`${nome}: clique ${clique.l}×${clique.a} menor que ${CLIQUE_MIN.l}×${CLIQUE_MIN.a}`);

    // Post-it: dentro da imagem, fora do nome, dos HUDs, do post-it de contato e de outros objetos
    const p = caixaDoPostit(o.postit);
    if (!dentroDe(p, TELA)) erros.push(`${nome}: post-it fora da imagem`);
    if (!dentroDe(p, { ...AREA_SEGURA, y: 12, a: 74 })) erros.push(`${nome}: post-it fora da área segura`);
    for (const r of reservadas) if (sobrepoe(p, r.area)) erros.push(`${nome}: post-it cobre "${r.nome}"`);
    if (sobrepoe(p, contato)) erros.push(`${nome}: post-it cobre o "Fale comigo!"`);
    for (const b of q.objetos) if (b.id !== o.id && sobrepoe(p, b.clique)) erros.push(`${nome}: post-it cobre a área de clique de "${b.id}"`);

    // Câmeras
    const limite = o.vista.tipo === 'tela' ? ESCALA_MAX_MONITOR : ESCALA_MAX;
    for (const [rotulo, c, lim] of [['vista', o.vista.camera, limite], ['tour', o.tour.camera, limite]] as const) {
      if (c.escala < 1 || c.escala > lim) erros.push(`${nome}: escala da câmera de ${rotulo} (${c.escala}) fora de 1 a ${lim}`);
      if (c.cx < 0 || c.cx > 100 || c.cy < 0 || c.cy > 100) erros.push(`${nome}: câmera de ${rotulo} fora da imagem`);
    }
    const ehDentro = (TIPOS_VISTA_DENTRO as readonly string[]).includes(o.vista.tipo);
    if (ehDentro && !o.vista.janela) erros.push(`${nome}: vista "${o.vista.tipo}" exige janela`);
    if (!ehDentro && o.vista.janela) erros.push(`${nome}: painel "${o.vista.tipo}" não usa janela`);
    if (o.vista.janela && !dentroDe(o.vista.janela, TELA)) erros.push(`${nome}: janela fora da imagem`);
  }

  q.objetos.forEach((a, i) => {
    for (const b of q.objetos.slice(i + 1)) {
      if (sobrepoe(a.clique, b.clique)) erros.push(`cliques de "${a.id}" e "${b.id}" se sobrepõem`);
      if (sobrepoe(caixaDoPostit(a.postit), caixaDoPostit(b.postit))) erros.push(`post-its de "${a.id}" e "${b.id}" se sobrepõem`);
    }
  });

  // Nome, post-it de contato e HUDs
  if (!dentroDe(q.paredeNome, TELA)) erros.push('parede do nome fora da imagem');
  if (!dentroDe(contato, TELA)) erros.push('post-it "Fale comigo!" fora da imagem');
  for (const r of q.areasReservadas) if (sobrepoe(contato, r.area)) erros.push(`post-it "Fale comigo!" cobre "${r.nome}"`);

  for (const an of q.anotacoes) {
    if (an.x < 0 || an.x + an.larguraMax > 100 || an.y < 0 || an.y > 100) erros.push(`anotação "${an.id}" fora da imagem`);
    for (const o of q.objetos) {
      const r: Rect = { x: an.x, y: an.y - 4, l: an.larguraMax, a: 6 };
      if (sobrepoe(r, o.clique) && an.id === 'role') erros.push(`anotação "${an.id}" cobre o clique de "${o.id}"`);
    }
  }
  return erros;
}

export function validarQuarto<T extends ConfigQuarto>(q: T): T {
  const erros = errosDoQuarto(q);
  if (erros.length) throw new Error(`src/config/quarto.ts inválido:\n- ${erros.join('\n- ')}`);
  return q;
}
