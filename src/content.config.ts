import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { projetoSchema } from './schemas/conteudo';

/**
 * Coleção "projetos": um arquivo .md por projeto em content/projetos/.
 * Arquivos que começam com "_" (ex.: _ordem.json, _rascunho.md) ficam de fora.
 * O corpo Markdown (estudo de caso) NÃO é renderizado nesta versão do site; só o frontmatter.
 */
const projetos = defineCollection({
  loader: glob({ base: './content/projetos', pattern: ['*.md', '!_*.md'] }),
  schema: projetoSchema,
});

export const collections = { projetos };
