/**
 * Contrato entre content/ e o código.
 *
 * - textosSchema   -> content/textos.pt.json e content/textos.en.json (tudo que aparece na tela)
 * - projetoSchema  -> frontmatter de content/projetos/*.md (content collection "projetos")
 * - ordemSchema    -> content/projetos/_ordem.json
 * - perfilSchema   -> content/perfil.json (só validado em teste; NUNCA importado pelas páginas)
 *
 * Este arquivo só pode importar "astro/zod" e módulos puros de src/config, para que os testes em Node
 * consigam usá-lo. Nada de astro:content, astro:i18n ou astro:assets aqui.
 */
import { z } from 'astro/zod';
import { IDS_OBJETOS } from '../config/tipos';

/** Marcadores deixados por redator/curador para fatos não confirmados. Nunca podem chegar à tela. */
export const REGEX_PENDENTE = /\[A CONFIRMAR|\[PENDENTE|CONFIRMAR:/;

const MSG_PENDENTE = 'Texto com marcador de pendência ([A CONFIRMAR]/[PENDENTE]). Confirme o fato ou remova o campo.';

/** Texto que vai para a tela: obrigatório, sem marcador de pendência. */
const texto = z
  .string()
  .trim()
  .min(1)
  .refine((s) => !REGEX_PENDENTE.test(s), MSG_PENDENTE);

/** Texto que pode ser vazio ("" = não exibir). */
const textoOpcional = z.string().refine((s) => !REGEX_PENDENTE.test(s), MSG_PENDENTE);

/** Identificador estável usado em âncoras (#exp-kpmg, #projeto-stocksage) e em chaves de ligação. */
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use minúsculas, números e hífen (ex.: "cushman").');

const urlHttp = z.url({ protocol: /^https?$/ });

/* ------------------------------------------------------------------ */
/* textos.<lang>.json                                                  */
/* Chaves já existentes + chaves novas de docs/design.md §10.2.        */
/* ------------------------------------------------------------------ */

/** quarto.objetos.<obj>: rótulo temático, nome comum e legenda (a legenda não cita nomes de jogos). */
const textoObjetoSchema = z.strictObject({ tema: texto, comum: texto, legenda: texto });

/** Chaves do dicionário "selos". Campos "status" do conteúdo apontam para uma delas (ou ""). */
export const CHAVES_SELO = [
  'emDesenvolvimento',
  'emAndamento',
  'atual',
  'repositorioPrivado',
  'projetoAcademico',
  'emGrupo',
  'concluido',
] as const;
const status = z.union([z.literal(''), z.enum(CHAVES_SELO)]);

/** Âncora com prefixo obrigatório (o id do conteúdo JÁ é o id do HTML: "exp-kpmg", "projeto-stocksage"). */
const ancora = (prefixo: string) =>
  id.refine((s) => s.startsWith(`${prefixo}-`), `O id precisa começar com "${prefixo}-" (é o id do HTML).`);

/**
 * Textos que o design usa e que ainda não têm chave no conteúdo. Opcionais: o componente que precisar
 * de um deles fica bloqueado até o redator preenchê-lo (docs/arquitetura.md 4.2). Nunca crie texto de reserva no código.
 */
const uiSchema = z.strictObject({
  setaPara: texto.optional(),
  linkExterno: texto.optional(),
  selosStatus: texto.optional(),
  erro404: z.strictObject({ titulo: texto, texto: texto, voltar: texto }).optional(),
});

const livroSchema = z.strictObject({
  nome: texto,
  /** Tradução do nome, quando o original estiver em outro idioma ("" = não exibir). */
  traducao: textoOpcional,
  emissor: texto,
  periodo: textoOpcional,
  status,
});

export const textosSchema = z.strictObject({
  meta: z.strictObject({
    lang: z.enum(['pt-BR', 'en']),
    title: texto,
    description: texto,
  }),

  /* Cabeçalho, anúncios e navegação */
  topo: z.strictObject({
    modoRecrutador: texto,
    explorarQuarto: texto,
    pularConteudo: texto,
    luz: z.strictObject({ apagar: texto, acender: texto, rotuloAcessivel: texto }),
    /** Botão do menu mobile do modo recrutador. */
    menu: texto,
    /** Seletor de idioma: aria-label da nav e nomes por extenso de cada link. */
    idioma: z.strictObject({ rotulo: texto, pt: texto, en: texto }),
  }),
  status: z.strictObject({
    modoAtivado: z.strictObject({ recrutador: texto, quarto: texto }),
  }),
  /** Menu do modo recrutador: uma chave por seção com capítulo (ver SECOES.chaveNav). */
  nav: z.strictObject({
    vertice: texto,
    sobre: texto,
    experiencia: texto,
    projetos: texto,
    habilidades: texto,
    formacao: texto,
    alem: texto,
    contato: texto,
  }),
  /** Dicionário de selos (design 5.11). */
  selos: z.strictObject({
    emDesenvolvimento: texto,
    emAndamento: texto,
    atual: texto,
    repositorioPrivado: texto,
    projetoAcademico: texto,
    emGrupo: texto,
    concluido: texto,
  }),

  /* #ficha */
  resumo: z.strictObject({ titulo: texto, transicao: texto }),
  hero: z.strictObject({
    nome: texto,
    rotulo: texto,
    frase: texto,
    /** <dl> do resumo: local, idiomas, estudando, status. */
    dados: z.array(z.strictObject({ id, rotulo: texto, valor: texto })).min(1),
    /** As 3 provas. */
    provas: z.array(texto).min(1),
    cta: texto,
    ctaSecundario: texto,
  }),

  /* Quarto e vistas */
  quarto: z.strictObject({
    titulo: texto,
    ajuda: texto,
    dica: z.strictObject({ ponteiro: texto, toque: texto }),
    legendaTeclas: texto,
    legendaPonteiro: texto,
    estado: z.strictObject({ lido: texto, proximo: texto }),
    /** Exatamente um item por objeto de src/config/tipos.ts > IDS_OBJETOS. Também dá o rótulo duplo das seções. */
    objetos: z.record(z.enum(IDS_OBJETOS), textoObjetoSchema),
  }),
  vista: z.strictObject({
    voltar: texto,
    anterior: texto,
    proximo: texto,
    atalho: z.strictObject({ certificacoes: texto, volei: texto, games: texto }),
  }),

  /* 01 · Monitor (#vertice) */
  vertice: z.strictObject({
    nome: texto,
    resumo: texto,
    periodo: texto,
    navegador: z.strictObject({ endereco: texto, nota: texto }),
    ctaSiteReal: texto,
    siteUrl: urlHttp,
    ctaLinkedin: texto,
    comoFoiConstruidoTitulo: texto,
    comoFoiConstruido: z.array(texto).min(1),
    oQueFazTitulo: texto,
    oQueFaz: z.array(texto).min(1),
    stackTitulo: texto,
    /** Redundante com o frontmatter de content/projetos/vertice.md, que é a fonte da stack exibida. */
    stack: z.array(texto).optional(),
    proximoPassoRotulo: texto,
    proximoPasso: textoOpcional,
    origemRotulo: texto,
    origem: texto,
    /** Texto do link para #alem-games. */
    origemLink: texto,
  }),

  /* 02 · Porta-retrato (#sobre) */
  sobre: z.strictObject({ p1: texto, p2: texto, p3: texto }),

  /* 03 · Mural (#experiencia) */
  experiencia: z.strictObject({
    rotuloAprendizado: texto,
    itens: z
      .array(
        z.strictObject({
          id: ancora('exp'),
          empresa: texto,
          local: texto,
          area: texto,
          cargos: z
            .array(
              z.strictObject({
                titulo: texto,
                /** AAAA-MM, para <time datetime>. */
                inicio: z.string().regex(/^\d{4}-\d{2}$/),
                fim: z.union([z.string().regex(/^\d{4}-\d{2}$/), z.literal('')]),
                periodo: texto,
              }),
            )
            .min(1),
          bullets: z.array(texto),
          aprendizado: textoOpcional,
        }),
      )
      .min(1),
  }),

  /* 04 · Caderno (#projetos) */
  projetos: z.strictObject({
    rotuloPapel: texto,
    itens: z.array(
      z.strictObject({
        /** "projeto-" + slug de content/projetos/<slug>.md. */
        id: ancora('projeto'),
        nome: texto,
        resumo: texto,
        papel: textoOpcional,
        /** Redundante com o frontmatter do .md, que é a fonte da stack exibida. */
        stack: z.array(texto).optional(),
      }),
    ),
  }),

  /* 05 · Caixa de ferramentas (#habilidades) */
  habilidades: z.strictObject({
    nota: textoOpcional,
    legendaContextoReal: texto,
    /** Prefixo sr-only do 2º segmento do chip. */
    rotuloContextoReal: texto,
    grupos: z
      .array(
        z.strictObject({
          id,
          nome: texto,
          itens: z.array(z.strictObject({ nome: texto, detalhe: textoOpcional, contextoReal: textoOpcional })).min(1),
        }),
      )
      .min(1),
    comoTrabalho: z.strictObject({
      titulo: texto,
      itens: z.array(z.strictObject({ nome: texto, evidencia: textoOpcional })).min(1),
    }),
  }),

  /* 06 · Estante (#formacao, #formacao-ia, #certificacoes) */
  formacao: z.strictObject({
    prateleiras: z.strictObject({ ia: texto, concluida: texto, certificacoes: texto }),
    ia: z.array(livroSchema).min(1),
    concluida: z.array(livroSchema).min(1),
    certificacoes: z.array(z.strictObject({ id, nome: texto, itens: z.array(livroSchema).min(1) })).min(1),
    idiomasTitulo: texto,
    idiomas: z.array(z.strictObject({ idioma: texto, nivel: texto })),
  }),

  /* 07 · Lenço (#alem, #alem-escotismo, #alem-games, #alem-volei) */
  alem: z.strictObject({
    escotismo: z.strictObject({ titulo: texto, cargo: texto, periodo: texto, status, texto: texto }),
    games: z.strictObject({
      tema: texto,
      titulo: texto,
      texto: texto,
      /** Nomes dos jogos; também vão para as lombadas dos estojos, junto com lombadaExtra. */
      lista: z.array(texto).min(1),
      lombadaExtra: texto,
      filmes: texto,
      origemVertice: texto,
      /** Texto do link para #vertice. */
      linkVertice: texto,
    }),
    volei: z.strictObject({ tema: texto, titulo: texto, texto: texto }),
  }),

  /* 08 · Envelope (#contato) */
  contato: z.strictObject({
    convite: texto,
    texto: texto,
    status: texto,
    cta: texto,
    linkedinUrl: urlHttp,
    assinatura: texto,
  }),
  rodape: z.strictObject({
    copyright: texto,
    githubLabel: texto,
    githubUrl: urlHttp,
  }),

  ui: uiSchema.optional(),
});

export type Textos = z.output<typeof textosSchema>;

/* ------------------------------------------------------------------ */
/* content/projetos/*.md (frontmatter)                                 */
/* ------------------------------------------------------------------ */

/** Texto do card do caderno (o selo vem de "selos"; o título é o "titulo" do frontmatter). */
const textoProjetoSchema = z.strictObject({
  resumo: texto,
  papel: textoOpcional.default(''),
});

/** Categorias aceitas. Para criar outra, acrescente aqui (é a única mudança de código). */
export const CATEGORIAS_PROJETO = ['full-stack', 'academico', 'dados-bi', 'ia'] as const;

/** O site não usa imagens raster (design 9.4): não há campo de capa. */
export const projetoSchema = z.strictObject({
  titulo: texto,
  /** Igual ao nome do arquivo, sem ".md". Âncora do card: "projeto-" + slug. */
  slug: id,
  /** true = conteúdo do monitor (hoje só o Vértice). Fonte da verdade; _ordem.json.destaque é verificado em teste. */
  destaque: z.boolean().default(false),
  categoria: z.enum(CATEGORIAS_PROJETO),
  stack: z.array(texto).default([]),
  links: z
    .strictObject({
      /** URL pública do repositório, "" (sem repositório) ou um rótulo legado como "Repositório privado". */
      repo: z.string().default(''),
      demo: z.union([urlHttp, z.literal('')]).default(''),
    })
    .default({ repo: '', demo: '' }),
  /** Se ainda contiver "[A CONFIRMAR]", vira "" e não é exibido. */
  periodo: z
    .string()
    .default('')
    .transform((s) => (REGEX_PENDENTE.test(s) ? '' : s.trim())),
  repositorioPrivado: z.boolean().optional(),
  /**
   * Textos do card no caderno, nos dois idiomas. Com isto, um projeto novo precisa só do .md.
   * Se ausente, o texto vem de textos.<lang>.json > projetos.itens[id = "projeto-" + slug].
   */
  textos: z.strictObject({ pt: textoProjetoSchema, en: textoProjetoSchema }).optional(),
});

/* ------------------------------------------------------------------ */
/* content/projetos/_ordem.json                                        */
/* ------------------------------------------------------------------ */

export const ordemSchema = z.strictObject({
  ordem: z.array(id),
  destaque: z.array(id),
  observacoes: z.string().optional(),
});

export type OrdemProjetos = z.output<typeof ordemSchema>;

/* ------------------------------------------------------------------ */
/* content/perfil.json (fonte dos fatos; usado só por testes)          */
/* ------------------------------------------------------------------ */

const naoVazio = z.string().trim().min(1);
/** Regra do projeto: todo fato tem fonte. */
const fonte = naoVazio;
const anoMes = z.string().regex(/^\d{4}-\d{2}$/, 'Use AAAA-MM.');

export const perfilSchema = z.looseObject({
  identidade: z.looseObject({
    nome: naoVazio,
    titulo: naoVazio,
    cidade: naoVazio,
    links: z.looseObject({
      github: z.string(),
      linkedin: z.string(),
      email: z.string(),
    }),
    fonte,
  }),
  experiencias: z
    .array(
      z.looseObject({
        empresa: naoVazio,
        cargo: naoVazio,
        inicio: anoMes,
        fim: z.union([anoMes, z.literal('atual'), z.literal('')]),
        responsabilidades: z.array(z.string()),
        ferramentas: z.array(z.string()),
        natureza: z.string().optional(),
        fonte,
      }),
    )
    .min(1),
  formacao: z.array(
    z.looseObject({
      instituicao: naoVazio,
      curso: naoVazio,
      conclusao: z.string(),
      status: z.string(),
      fonte,
    }),
  ),
  certificacoes: z.array(
    z.looseObject({
      nome: naoVazio,
      emissor: naoVazio,
      ano: z.string(),
      fonte,
    }),
  ),
  habilidades: z.looseObject({
    tecnicas: z.array(
      z.looseObject({
        nome: naoVazio,
        nivel: z.enum(['basico', 'intermediario', 'avancado']),
        fonte,
      }),
    ),
    comportamentais: z.array(z.looseObject({ nome: naoVazio, fonte })),
    observacao: z.string().optional(),
  }),
  projetos: z.array(
    z.looseObject({
      nome: naoVazio,
      resumo: z.string(),
      stack: z.array(z.string()),
      links: z.record(z.string(), z.string()),
      fonte,
    }),
  ),
  hobbies: z.array(
    z.looseObject({
      nome: naoVazio,
      detalhe: z.string(),
      status: z.string().optional(),
      fonte,
    }),
  ),
  voluntariado: z.array(
    z.looseObject({
      organizacao: naoVazio,
      papel: naoVazio,
      detalhe: z.string(),
      fonte,
    }),
  ),
  idiomas: z.array(z.looseObject({ idioma: naoVazio, nivel: naoVazio, fonte })),
});

export type Perfil = z.output<typeof perfilSchema>;
