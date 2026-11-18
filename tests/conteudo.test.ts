/**
 * Testes de contrato do conteúdo. Rodam sem o Astro (Node + Vitest).
 * O frontmatter dos .md é validado pela própria build (content collection); aqui ficam
 * as regras que atravessam arquivos: pt x en, .md x _ordem.json x textos, privacidade, âncoras.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { z } from 'astro/zod';
import { REGEX_PENDENTE, ordemSchema, perfilSchema, textosSchema, type Textos } from '../src/schemas/conteudo';
import { CONFIG_IDIOMA, IDIOMAS, type Idioma } from '../src/i18n/idiomas';
import {
  ANCORA_CERTIFICACOES,
  ANCORA_ESCOTISMO,
  ANCORA_FORMACAO_IA,
  ANCORA_GAMES,
  ANCORA_VOLEI,
  IDS_SECOES,
  ID_QUARTO,
  ID_VISTA,
  ancoraProjeto,
} from '../src/i18n/secoes';
import { configCliente, quarto } from '../src/config/quarto';
import { errosDoQuarto } from '../src/config/validar-quarto';

/** docs/design.md 10.1: ids que precisam existir nos dois idiomas. */
const IDS_ESTAVEIS_DESIGN = [
  'ficha', 'quarto', 'vista', 'vertice', 'sobre', 'experiencia', 'exp-kpmg', 'exp-salesforce', 'exp-cushman',
  'projetos', 'projeto-stocksage', 'projeto-energigreen', 'habilidades', 'formacao', 'formacao-ia',
  'certificacoes', 'alem', 'alem-escotismo', 'alem-volei', 'alem-games', 'contato',
];

/**
 * ids que a página vai gerar a partir do conteúdo (as mesmas funções usadas pelos componentes).
 * A conferência definitiva, no HTML gerado, é feita por integrations/verificar-ancoras.mjs.
 */
function ancorasPrevistas(t: Textos): Set<string> {
  return new Set([
    ...IDS_SECOES,
    ID_QUARTO,
    ID_VISTA,
    ...t.experiencia.itens.map((i) => i.id),
    ...t.projetos.itens.map((i) => i.id),
    ANCORA_FORMACAO_IA,
    ANCORA_CERTIFICACOES,
    ANCORA_ESCOTISMO,
    ANCORA_VOLEI,
    ANCORA_GAMES,
  ]);
}

const RAIZ = fileURLToPath(new URL('..', import.meta.url));
const lerTexto = (rel: string) => readFileSync(join(RAIZ, rel), 'utf8');
const lerJson = (rel: string): unknown => JSON.parse(lerTexto(rel));

function validar<T extends z.ZodType>(schema: T, dados: unknown, arquivo: string): z.output<T> {
  const r = schema.safeParse(dados);
  if (!r.success) throw new Error(`${arquivo}:\n${z.prettifyError(r.error)}`);
  return r.data;
}

const textosBrutos: Record<Idioma, unknown> = {
  pt: lerJson('content/textos.pt.json'),
  en: lerJson('content/textos.en.json'),
};

/** Troca valores por tipos para comparar só a forma (chaves, tamanhos de lista). */
function forma(valor: unknown): unknown {
  if (Array.isArray(valor)) return valor.map(forma);
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(Object.entries(valor).map(([k, v]) => [k, forma(v)]));
  }
  return typeof valor;
}

/** Todos os valores de chaves "id", em ordem. */
function ids(valor: unknown, acc: string[] = []): string[] {
  if (Array.isArray(valor)) valor.forEach((v) => ids(v, acc));
  else if (valor && typeof valor === 'object') {
    for (const [k, v] of Object.entries(valor)) {
      if (k === 'id' && typeof v === 'string') acc.push(v);
      else ids(v, acc);
    }
  }
  return acc;
}

function strings(valor: unknown, acc: string[] = []): string[] {
  if (typeof valor === 'string') acc.push(valor);
  else if (Array.isArray(valor)) valor.forEach((v) => strings(v, acc));
  else if (valor && typeof valor === 'object') Object.values(valor).forEach((v) => strings(v, acc));
  return acc;
}

/** Arquivos .md de projeto (os que começam com "_" ficam fora da coleção). */
const arquivosProjeto = readdirSync(join(RAIZ, 'content/projetos')).filter((f) => f.endsWith('.md') && !f.startsWith('_'));

function frontmatter(arquivo: string): string {
  const m = lerTexto(`content/projetos/${arquivo}`).match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) throw new Error(`content/projetos/${arquivo}: frontmatter ausente`);
  return m[1];
}

describe('content/perfil.json', () => {
  it('segue o schema e todo fato tem fonte', () => {
    validar(perfilSchema, lerJson('content/perfil.json'), 'content/perfil.json');
  });
});

describe('content/textos.<lang>.json', () => {
  for (const lang of IDIOMAS) {
    it(`${lang}: segue o schema (sem marcadores de pendência) e meta.lang bate com a rota`, () => {
      const t: Textos = validar(textosSchema, textosBrutos[lang], `content/textos.${lang}.json`);
      expect(t.meta.lang).toBe(CONFIG_IDIOMA[lang].htmlLang);
    });
  }

  it('pt e en têm exatamente a mesma estrutura', () => {
    expect(forma(textosBrutos.en)).toEqual(forma(textosBrutos.pt));
  });

  it('pt e en usam os mesmos ids, na mesma ordem', () => {
    expect(ids(textosBrutos.en)).toEqual(ids(textosBrutos.pt));
  });

  it('não publicam e-mail nem telefone (regra de privacidade)', () => {
    for (const lang of IDIOMAS) {
      for (const s of strings(textosBrutos[lang])) {
        expect(s, `e-mail em textos.${lang}.json`).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.-]+/);
        expect(s, `telefone em textos.${lang}.json`).not.toMatch(/(?:\+?55\s?)?\(?\d{2}\)?\s?9?\d{4}[-\s]?\d{4}/);
      }
    }
  });

  it('geram todos os ids estáveis do design (10.1), e cada destino do quarto existe', () => {
    for (const lang of IDIOMAS) {
      const t = validar(textosSchema, textosBrutos[lang], `content/textos.${lang}.json`);
      const ancoras = ancorasPrevistas(t);
      for (const id of IDS_ESTAVEIS_DESIGN) expect(ancoras.has(id), `id "${id}" (${lang})`).toBe(true);
      for (const o of quarto.objetos) {
        expect(ancoras.has(o.destino), `destino "${o.destino}" do objeto "${o.id}" (${lang})`).toBe(true);
        for (const sec of o.secoes) expect(ancoras.has(sec), `seção "${sec}" do objeto "${o.id}" (${lang})`).toBe(true);
      }
    }
  });
});

describe('src/config/quarto.ts', () => {
  it('passa em todas as regras do design 9.2', () => {
    expect(errosDoQuarto(quarto)).toEqual([]);
  });

  it('a validação pega sobreposição de cliques, escala excessiva, clique fora da área segura e alvo pequeno', () => {
    const copia = structuredClone(quarto);
    const [primeiro, segundo] = copia.objetos;
    segundo.clique = { ...primeiro.clique };
    primeiro.vista.camera = { ...primeiro.vista.camera, escala: 5 };
    copia.objetos[2].clique = { x: 2, y: 20, l: 2, a: 2 };
    const erros = errosDoQuarto(copia).join(String.fromCharCode(10));
    expect(erros).toMatch(/se sobrepõem/);
    expect(erros).toMatch(/escala da câmera/);
    expect(erros).toMatch(/fora da área segura/);
    expect(erros).toMatch(/menor que/);
  });

  it('a validação pega post-it sobre o nome e sobre o clique de outro objeto', () => {
    const copia = structuredClone(quarto);
    copia.objetos[0].postit = { x: 40, y: 9, rot: 0 };
    copia.objetos[1].postit = { x: copia.objetos[2].clique.x + 2, y: copia.objetos[2].clique.y + 4, rot: 0 };
    const erros = errosDoQuarto(copia).join(String.fromCharCode(10));
    expect(erros).toMatch(/post-it cobre "nome na parede"/);
    expect(erros).toMatch(/post-it cobre a área de clique/);
  });

  it('a config serializada para o cliente cabe em 3 KB', () => {
    expect(JSON.stringify(configCliente()).length).toBeLessThanOrEqual(3 * 1024);
  });
});

describe('content/projetos', () => {
  const ordem = validar(ordemSchema, lerJson('content/projetos/_ordem.json'), 'content/projetos/_ordem.json');
  const slugs = arquivosProjeto.map((f) => f.replace(/\.md$/, ''));

  it('existe pelo menos um projeto', () => {
    expect(slugs.length).toBeGreaterThan(0);
  });

  it('o campo slug é igual ao nome do arquivo', () => {
    for (const arquivo of arquivosProjeto) {
      const slug = frontmatter(arquivo).match(/^slug:\s*["']?([^"'\r\n]+)["']?\s*$/m)?.[1];
      expect(slug, arquivo).toBe(arquivo.replace(/\.md$/, ''));
    }
  });

  it('_ordem.json só cita projetos que existem', () => {
    for (const slug of [...ordem.ordem, ...ordem.destaque]) {
      expect(slugs, `_ordem.json cita "${slug}"`).toContain(slug);
    }
  });

  it('_ordem.json > destaque coincide com "destaque: true" nos .md (no máximo um)', () => {
    const comDestaque = arquivosProjeto
      .filter((f) => /^destaque:\s*true\s*$/m.test(frontmatter(f)))
      .map((f) => f.replace(/\.md$/, ''));
    expect(comDestaque.length).toBeLessThanOrEqual(1);
    expect([...ordem.destaque].sort()).toEqual([...comDestaque].sort());
  });

  it('todo projeto do caderno tem texto nos dois idiomas (frontmatter "textos" ou projetos.itens)', () => {
    for (const arquivo of arquivosProjeto) {
      const fm = frontmatter(arquivo);
      if (/^destaque:\s*true\s*$/m.test(fm) || /^textos:/m.test(fm)) continue;
      const slug = arquivo.replace(/\.md$/, '');
      for (const lang of IDIOMAS) {
        const t = validar(textosSchema, textosBrutos[lang], `content/textos.${lang}.json`);
        expect(
          t.projetos.itens.map((i) => i.id),
          `${arquivo} sem texto em textos.${lang}.json > projetos.itens`,
        ).toContain(ancoraProjeto(slug));
      }
    }
  });

  it('projetos.itens não cita projeto sem .md', () => {
    for (const lang of IDIOMAS) {
      const t = validar(textosSchema, textosBrutos[lang], `content/textos.${lang}.json`);
      for (const item of t.projetos.itens) {
        expect(slugs.map(ancoraProjeto), `projetos.itens "${item.id}" (${lang})`).toContain(item.id);
      }
    }
  });
});

describe('código em src/', () => {
  function arquivos(dir: string): string[] {
    return readdirSync(dir).flatMap((nome) => {
      const caminho = join(dir, nome);
      return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
    });
  }

  it('nunca importa content/perfil.json (o site lê só textos e projetos)', () => {
    for (const arquivo of arquivos(join(RAIZ, 'src'))) {
      expect(readFileSync(arquivo, 'utf8'), arquivo).not.toMatch(/(?:from|import\()\s*['"][^'"]*perfil\.json['"]/);
    }
  });

  it('o marcador de pendência é reconhecido', () => {
    expect(REGEX_PENDENTE.test('[A CONFIRMAR]')).toBe(true);
    expect(REGEX_PENDENTE.test('2026 – atual')).toBe(false);
  });
});
