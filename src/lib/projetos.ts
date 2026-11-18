/**
 * Junta content/projetos/*.md (metadados) com os textos do idioma pedido.
 *
 * Regras (docs/arquitetura.md, seção 4.3):
 * - Ordem: content/projetos/_ordem.json > ordem. Projetos fora da lista vão para o fim, por título.
 * - Destaque: campo "destaque" do frontmatter. É o conteúdo do monitor (01) e usa textos.<lang>.json > vertice.
 * - Card do caderno (04): texto do frontmatter "textos.<lang>" ou, na falta dele,
 *   textos.<lang>.json > projetos.itens[id = "projeto-" + slug]. Sem nenhum dos dois, a build falha.
 * - Stack, período e links sempre vêm do frontmatter.
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import ordemJson from '../../content/projetos/_ordem.json';
import { ordemSchema } from '../schemas/conteudo';
import type { Idioma } from '../i18n/idiomas';
import { getTextos } from './textos';
import { ehUrlExterna } from './url';
import { ancoraProjeto } from '../i18n/secoes';

type EntradaProjeto = CollectionEntry<'projetos'>;
type DadosProjeto = EntradaProjeto['data'];

export interface TextoProjeto {
  resumo: string;
  papel: string;
}

export interface Projeto {
  slug: string;
  /** id do card no HTML: "projeto-" + slug. */
  ancora: string;
  titulo: string;
  destaque: boolean;
  categoria: DadosProjeto['categoria'];
  stack: string[];
  /** "" quando não há período confirmado. */
  periodo: string;
  demoUrl: string | null;
  repoUrl: string | null;
  repositorioPrivado: boolean;
  /** null no projeto em destaque: o monitor usa textos.<lang>.json > vertice. */
  texto: TextoProjeto | null;
}

const ordem = ordemSchema.parse(ordemJson);

function posicao(slug: string): number {
  const i = ordem.ordem.indexOf(slug);
  return i === -1 ? Number.POSITIVE_INFINITY : i;
}

function ordenar(entradas: EntradaProjeto[]): EntradaProjeto[] {
  return [...entradas].sort(
    (a, b) => posicao(a.data.slug) - posicao(b.data.slug) || a.data.titulo.localeCompare(b.data.titulo, 'pt-BR'),
  );
}

function textoDoCard(dados: DadosProjeto, lang: Idioma): TextoProjeto {
  const doFrontmatter = dados.textos?.[lang];
  if (doFrontmatter) return doFrontmatter;

  const item = getTextos(lang).projetos.itens.find((i) => i.id === ancoraProjeto(dados.slug));
  if (item) return { resumo: item.resumo, papel: item.papel };

  throw new Error(
    `Projeto "${dados.slug}" sem texto em "${lang}". Adicione "textos.${lang}" no frontmatter de ` +
      `content/projetos/${dados.slug}.md ou um item com id "${ancoraProjeto(dados.slug)}" em content/textos.${lang}.json > projetos.itens.`,
  );
}

function montar(entrada: EntradaProjeto, lang: Idioma): Projeto {
  const d = entrada.data;
  const repoUrl = ehUrlExterna(d.links.repo) ? d.links.repo : null;
  return {
    slug: d.slug,
    ancora: ancoraProjeto(d.slug),
    titulo: d.titulo,
    destaque: d.destaque,
    categoria: d.categoria,
    stack: d.stack,
    periodo: d.periodo,
    demoUrl: d.links.demo || null,
    repoUrl,
    // Explícito no frontmatter ou, no formato antigo, um rótulo em links.repo ("Repositório privado").
    repositorioPrivado: d.repositorioPrivado ?? (repoUrl === null && d.links.repo.trim() !== ''),
    texto: d.destaque ? null : textoDoCard(d, lang),
  };
}

export async function getProjetos(lang: Idioma): Promise<{ destaque: Projeto | null; outros: Projeto[] }> {
  const entradas = ordenar(await getCollection('projetos'));
  const destaques = entradas.filter((e) => e.data.destaque);

  if (destaques.length > 1) {
    throw new Error(
      `Só um projeto pode ter "destaque: true" (o monitor usa textos.<lang>.json > vertice). ` +
        `Encontrados: ${destaques.map((e) => e.data.slug).join(', ')}.`,
    );
  }

  return {
    destaque: destaques[0] ? montar(destaques[0], lang) : null,
    outros: entradas.filter((e) => !e.data.destaque).map((e) => montar(e, lang)),
  };
}
