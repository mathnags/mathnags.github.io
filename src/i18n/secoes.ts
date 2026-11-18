/**
 * Ordem e ids estáveis das seções (docs/design.md 4.0 e 10.1), iguais em pt e en.
 * O id é estrutura, não texto: o rótulo visível vem de textos.<lang>.json.
 * Sem imports de valor do Astro: este módulo também é usado pela validação do quarto e pelos testes.
 */
import type { Textos } from '../schemas/conteudo';
import type { Capitulo } from '../config/tipos';

type DefinicaoSecao = {
  id: string;
  /** null = resumo (fora dos capítulos). */
  capitulo: Capitulo | null;
  /** Chave de nível superior em textos.<lang>.json com o conteúdo principal da seção. */
  chaveTextos: keyof Textos;
  /** Chave em textos.<lang>.json > nav para o menu do modo recrutador (null = fora do menu). */
  chaveNav: keyof Textos['nav'] | null;
};

export const SECOES = [
  { id: 'ficha', capitulo: null, chaveTextos: 'hero', chaveNav: null },
  { id: 'vertice', capitulo: 1, chaveTextos: 'vertice', chaveNav: 'vertice' },
  { id: 'sobre', capitulo: 2, chaveTextos: 'sobre', chaveNav: 'sobre' },
  { id: 'experiencia', capitulo: 3, chaveTextos: 'experiencia', chaveNav: 'experiencia' },
  { id: 'projetos', capitulo: 4, chaveTextos: 'projetos', chaveNav: 'projetos' },
  { id: 'habilidades', capitulo: 5, chaveTextos: 'habilidades', chaveNav: 'habilidades' },
  { id: 'formacao', capitulo: 6, chaveTextos: 'formacao', chaveNav: 'formacao' },
  { id: 'alem', capitulo: 7, chaveTextos: 'alem', chaveNav: 'alem' },
  { id: 'contato', capitulo: 8, chaveTextos: 'contato', chaveNav: 'contato' },
] as const satisfies readonly DefinicaoSecao[];

export type IdSecao = (typeof SECOES)[number]['id'];

export const IDS_SECOES: readonly string[] = SECOES.map((s) => s.id);

/** ids estruturais fora das seções (design 4.0). */
export const ID_QUARTO = 'quarto';
export const ID_VISTA = 'vista';
export const ID_CONTEUDO = 'conteudo';
export const ID_CONFIG_QUARTO = 'quarto-config';

/** "01"…"08" para etiquetas e rótulo duplo. */
export function numeroDoCapitulo(capitulo: Capitulo): string {
  return String(capitulo).padStart(2, '0');
}

/*
 * Âncoras internas (design 10.1). Em experiencia.itens e projetos.itens o "id" do conteúdo JÁ é o id
 * do HTML ("exp-kpmg", "projeto-stocksage"); o schema exige esses prefixos. As demais são fixas.
 */
export const ancoraProjeto = (slug: string): string => `projeto-${slug}`;
export const ANCORA_FORMACAO_IA = 'formacao-ia';
export const ANCORA_CERTIFICACOES = 'certificacoes';
export const ANCORA_ESCOTISMO = 'alem-escotismo';
export const ANCORA_VOLEI = 'alem-volei';
export const ANCORA_GAMES = 'alem-games';
