/**
 * Validação da config do quarto 3D (docs/design.md 13.12). Roda ao importar src/config/quarto.ts,
 * ou seja, em toda build, e também nos testes. Um erro aqui derruba a build.
 *
 * O que depende do HTML gerado (se "destino" e "secoes" existem como id nas páginas pt e en,
 * e se há ids duplicados) é verificado depois da build por integrations/verificar-ancoras.mjs.
 */
import { SECOES } from '../i18n/secoes';
import { IDS_OBJETOS, TIPOS_VISTA_DENTRO, type Caixa, type ConfigQuarto, type V3 } from './tipos';

const dentroDe = (c: Caixa, l: Caixa) => c.min.every((v, i) => v >= l.min[i] - 1e-9) && c.max.every((v, i) => v <= l.max[i] + 1e-9);
const pontoEm = (p: V3, c: Caixa) => p.every((v, i) => v >= c.min[i] - 1e-9 && v <= c.max[i] + 1e-9);
const cruza = (a: Caixa, b: Caixa) => [0, 1, 2].every((i) => a.min[i] < b.max[i] && b.min[i] < a.max[i]);
const distancia = (p: V3, c: Caixa) => Math.hypot(...p.map((v, i) => Math.max(0, c.min[i] - v, v - c.max[i])));
const caixaOk = (c: Caixa) => c.min.every((v, i) => v <= c.max[i]);

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

  for (const o of q.objetos) {
    const nome = `"${o.id}"`;

    // Seções e destino
    for (const s of o.secoes) if (!capituloDaSecao.has(s)) erros.push(`${nome}: seção "${s}" não existe em SECOES`);
    const principal = o.secoes[o.secoes.length - 1];
    if (principal !== o.destino) erros.push(`${nome}: o destino "${o.destino}" deve ser a última seção (${principal})`);
    if (capituloDaSecao.get(o.destino) !== o.capitulo) erros.push(`${nome}: capítulo ${o.capitulo} não é o da seção "${o.destino}"`);

    // Caixa e foco
    if (!caixaOk(o.caixa)) erros.push(`${nome}: caixa com min maior que max`);
    if (!dentroDe(o.caixa, q.limites)) erros.push(`${nome}: caixa fora dos limites do quarto`);
    if (!pontoEm(o.foco.alvo, o.caixa)) erros.push(`${nome}: foco.alvo fora da própria caixa`);
    const { az, el, margem = 0.35 } = o.foco;
    if (az < -60 || az > 60) erros.push(`${nome}: az ${az} fora de -60 a 60`);
    if (el < -10 || el > 70) erros.push(`${nome}: el ${el} fora de -10 a 70`);
    if (margem < 0.05 || margem > 0.5) erros.push(`${nome}: margem ${margem} fora de 0,05 a 0,5`);

    // Vistas "dentro": janela e preencher só e sempre nelas, de frente
    const dentro = (TIPOS_VISTA_DENTRO as readonly string[]).includes(o.vista.tipo);
    if (dentro && !o.janela) erros.push(`${nome}: vista "${o.vista.tipo}" exige janela`);
    if (dentro && !o.preencher) erros.push(`${nome}: vista "${o.vista.tipo}" exige preencher`);
    if (!dentro && (o.janela || o.preencher)) erros.push(`${nome}: painel "${o.vista.tipo}" não usa janela nem preencher`);
    if (dentro && (az !== 0 || el !== 0)) erros.push(`${nome}: vistas dentro precisam de az = el = 0`);
    if (o.janela) {
      if (!caixaOk(o.janela)) erros.push(`${nome}: janela com min maior que max`);
      if (o.janela.min[2] !== o.janela.max[2]) erros.push(`${nome}: janela precisa ser plana em z`);
      if (!dentroDe(o.janela, q.limites)) erros.push(`${nome}: janela fora dos limites do quarto`);
    }

    // Post-it
    if (distancia(o.postit.ancora, o.caixa) > 0.4) erros.push(`${nome}: âncora do post-it a mais de 0,4 m da caixa`);
    if (o.postit.rot < -6 || o.postit.rot > 6) erros.push(`${nome}: rot do post-it fora de -6 a 6`);
  }

  q.objetos.forEach((a, i) => {
    for (const b of q.objetos.slice(i + 1)) if (cruza(a.caixa, b.caixa)) erros.push(`caixas de "${a.id}" e "${b.id}" se cruzam`);
  });

  if (q.geral.fov <= 0 || q.geral.fov >= 90) erros.push('fov da visão geral inválido');
  if (!caixaOk(q.limites)) erros.push('limites do quarto inválidos');
  for (const an of q.anotacoes) {
    if (an.id === 'comece' && !ids.includes(an.relativoA)) erros.push(`anotação "comece" aponta para objeto inexistente "${an.relativoA}"`);
  }
  return erros;
}

export function validarQuarto<T extends ConfigQuarto>(q: T): T {
  const erros = errosDoQuarto(q);
  if (erros.length) throw new Error(`src/config/quarto.ts inválido:\n- ${erros.join('\n- ')}`);
  return q;
}
