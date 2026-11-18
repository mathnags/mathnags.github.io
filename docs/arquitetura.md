# Arquitetura: portfólio de Matheus Maki Nagano (design "O quarto")

Fase 4, revisão 2 · Entradas: `CLAUDE.md`, `docs/estrategia.md`, `docs/design.md` (versão "O quarto", em especial §4.0, §5.6, §9.2, §9.4 e §10), `content/textos.{pt,en}.json`, `content/projetos/*.md`, `content/projetos/_ordem.json` e `content/perfil.json`.
Data: 2026-11-17. Esta revisão **substitui** a arquitetura do "caderno de campo": a trajetória na hero, a captura do Vértice e as chaves `ui`/`trajetoria`/`hero.ficha` propostas antes foram removidas.

> **Estado (2026-11-18):** com Node v26.13.1 e npm 11.20, `npm install`, `npm test` (18/18), `npm run lint` (0 erros) e `npm run build` passam. O schema está alinhado aos `textos.*.json` entregues pelo redator.

---

## 0. Decisões em uma tabela

| Tema | Decisão | Custo de reverter |
|---|---|---|
| Gerador | **Astro 7** estático, TypeScript estrito, componentes `.astro` sem runtime de framework | Alto |
| Modo base | **Modo recrutador é o HTML/CSS base.** O quarto é uma camada ativada por `<html data-modo="quarto">`, definida por um script no `<head>` | Alto |
| Quarto | **Um componente `.astro` por objeto e por decoração**, desenhando só em coordenadas locais; **uma config única** (`src/config/quarto.ts`) com posição, destino e vista, **validada na build** | Alto |
| Vista | **Um único `<dialog id="vista">`**. A seção é movida para dentro e devolvida ao fechar. Cada vista tem um `#id` e entra no histórico (`pushState`/`replaceState`/`popstate`) | Médio |
| Conteúdo | `content/` na raiz. JSON de textos importado e validado com Zod; projetos numa *content collection* (`glob`) | Alto |
| Validação | Schemas Zod em `src/schemas/conteudo.ts`; regras do quarto em `src/config/validar-quarto.ts`; conferência de âncoras no HTML gerado (`integrations/verificar-ancoras.mjs`) | Baixo |
| i18n | i18n nativo do Astro: `/` (pt-BR) e `/en/`. Uma página-modelo, duas rotas | Alto |
| Estilo | CSS puro com os tokens do design (`tokens.css`), `<style>` com escopo e *container queries*. Sem Tailwind | Médio |
| Fontes | **Fonts API do Astro** (Fontsource): baixadas na build e servidas pelo próprio site | Baixo |
| Imagens | **Nenhuma imagem raster** (design §9.4). Tudo é SVG inline | Baixo |
| JS | Script inline no `<head>` ≤ 1 KB + `src/scripts/quarto.ts` (módulo) ≤ 10 KB gzip. Sem bibliotecas | Médio |
| Hospedagem | GitHub Pages via GitHub Actions (fase 7) | Baixo |

---

## 1. Stack

| Pacote | Versão (faixa) | Papel |
|---|---|---|
| `astro` | `^7.4.12` | Gerador estático, i18n, content collections, fontes |
| `@astrojs/sitemap` | `^3.7.5` | `sitemap-index.xml` com `hreflang` |
| `typescript` | `~6.0.3` | **Fixado em 6.0.x**: `@astrojs/check` aceita `^5 \|\| ^6` e `typescript-eslint` exige `<6.1.0`. O TypeScript 7 (o `latest` do npm) quebraria os dois |
| `@astrojs/check` | `^0.9.12` | Tipos em `.astro` |
| `@types/node` | `^26.6.6` | Tipos do Node em `astro.config.mjs`, na integração e nos testes |
| `eslint` + `typescript-eslint` + `eslint-plugin-astro` | `^10.15` / `^8.73` / `^3.2.1` | Lint |
| `vitest` | `^5.1.0` | Testes de contrato (conteúdo e config do quarto) |

**Node:** `>=22.23.4` (exigido pelo Astro 7). Recomendado: **Node 26** (LTS; `.nvmrc`), a versão instalada.

**Por que Astro.** Ele gera HTML estático sem JS por padrão. Isso importa aqui porque **todo o conteúdo precisa estar no HTML** (SEO, leitor de tela, modo recrutador sem JS) e o quarto é só uma camada. Componentes `.astro` renderizam o SVG de cada objeto na build, sem enviar nada ao cliente. O Astro já traz i18n, validação Zod, fontes auto-hospedadas e scripts empacotados como módulo, sem dependências extras.

**Por que `.astro` (e não `.tsx`) nos objetos** (o design deixou a extensão para o arquiteto): os desenhos são estáticos. Com JSX/Preact, entraria um runtime e haveria hidratação sem necessidade. A interatividade (câmera, histórico, teclado) é um único script que lê a config serializada.

## 2. Alternativas descartadas

| Alternativa | Motivo |
|---|---|
| **Canvas / WebGL / bibliotecas de animação (GSAP etc.)** | O design exige objetos como `<a>` reais, texto HTML legível e orçamento de 10 KB de JS. A câmera é só um `viewBox` interpolado por 400 ms |
| **Componentes de framework (React/Preact/Svelte) para o quarto** | Runtime + hidratação para desenhos estáticos. Estoura o orçamento de JS e piora TBT/INP |
| **Um SVG único exportado de ferramenta de desenho** | Impede "um componente por objeto" e a edição por config. Mover um objeto exigiria redesenhar o arquivo |
| **Modo quarto como padrão no HTML (e recrutador via JS)** | Sem JS, quem buscasse ou imprimisse veria um quarto quebrado. Pelo design (§1.4), o modo base precisa ser o recrutador |
| **Uma página por vista (`/vertice/`, `/en/vertice/`)** | Duplicaria o conteúdo e quebraria o "tudo no HTML desde o carregamento". O `#id` + histórico entrega links diretos sem páginas extras |
| **Next.js, Eleventy, Hugo, SvelteKit** | Mesmos motivos da revisão 1: runtime desnecessário (Next/SvelteKit) ou falta de validação de schema e de fontes integradas (11ty/Hugo) |
| **Tailwind** | Os tokens já são variáveis CSS, e as 8 molduras de vista são CSS temático com *container queries*. Classes utilitárias não ajudam nisso e somam uma dependência |
| **Vercel / Netlify** | Gratuitos, mas o orquestrador definiu o GitHub Pages. A saída é estática, então trocar de hospedagem não muda código |

---

## 3. Árvore de pastas

```
/
├─ astro.config.mjs            site/base (env), i18n, fontes, sitemap, verificarAncoras()
├─ integrations/
│  └─ verificar-ancoras.mjs    pós-build: destinos do quarto existem no HTML pt/en; sem ids duplicados
├─ tsconfig.json  eslint.config.js  vitest.config.ts  package.json  .nvmrc  .gitignore
├─ content/                    FONTE ÚNICA DO TEXTO
│  ├─ perfil.json              fatos (não é lido pelo site; só por testes e revisores)
│  ├─ textos.pt.json  textos.en.json
│  ├─ fonte/                   materiais brutos (nunca publicados)
│  └─ projetos/  _ordem.json  <slug>.md
├─ public/favicon.svg
├─ src/
│  ├─ config/
│  │  ├─ tipos.ts              Rect, TipoVista, IDS_OBJETOS, nomes de componentes, ObjetoQuarto
│  │  ├─ quarto.ts             ÚNICA fonte de posição/destino/vista (valores do design §4.2)
│  │  └─ validar-quarto.ts     regras do §9.2; roda ao importar quarto.ts (build) e nos testes
│  ├─ schemas/conteudo.ts      CONTRATO: textos (§10.2), frontmatter de projeto, _ordem, perfil
│  ├─ content.config.ts        coleção "projetos"
│  ├─ lib/  textos.ts  projetos.ts  url.ts
│  ├─ i18n/ idiomas.ts  secoes.ts  (ids estáveis, capítulos, âncoras, prateleiras)
│  ├─ layouts/BaseLayout.astro <head>: script de início, SEO, hreflang, fontes
│  ├─ components/
│  │  ├─ PaginaInicial.astro   página única (lang)
│  │  ├─ quarto/
│  │  │  ├─ props.ts           PropsDesenho { l, a, contexto }
│  │  │  ├─ registro.ts        nome da config → componente (checado pelo tipo)
│  │  │  ├─ objetos/           Monitor, PortaRetrato, Mural, Caderno, Caixa, Estante, Quadros,
│  │  │  │                     Lenco, Bola, Headset, Estojos, Envelope   (placeholders hoje)
│  │  │  ├─ decoracao/         Janela, Poster, Vaso, MouseMousepad, Mesa, Mesinha, Cadeira,
│  │  │  │                     Tapete, Luminaria, Interruptor, Varal     (placeholders hoje)
│  │  │  ├─ Quarto.astro       (fase 5) palco: <svg viewBox> + <ol> de <a class="objeto">
│  │  │  ├─ Legenda.astro      (fase 5)
│  │  │  └─ Vista.astro        (fase 5) <dialog id="vista"> + barra + molduras por data-vista
│  │  ├─ ui/                   (fase 5) DualLabel, BotaoModo, Interruptor (tema), SeletorIdioma,
│  │  │                        BotaoCTA, Selo, Chip, Icone
│  │  └─ secoes/               (fase 5) Topo, Resumo, Vertice, Sobre, Experiencia (+ExperienceItem),
│  │                           Projetos, Habilidades, Formacao (+BookItem), Alem, Contato, Rodape
│  ├─ scripts/                 (fase 5) quarto.ts (entrada) + modo, camera, vista, historico,
│  │                           teclado, lidos, legenda, tema, idioma
│  ├─ styles/  tokens.css  global.css  (fase 5: vistas.css com as 8 molduras)
│  └─ pages/  index.astro  en/index.astro  robots.txt.ts  (fase 5: 404.astro)
├─ tests/conteudo.test.ts
└─ docs/
```

---

## 4. Contrato entre `content/` e os componentes

### 4.1 Regra de ouro

**Nenhum texto visível ou lido por leitor de tela é escrito em componente**: `aria-label`, `sr-only`, rótulos, anúncios de `role="status"` e o 404 também vêm do conteúdo. São estrutura e podem ficar no código: ids, números de capítulo (`01`), coordenadas (só em `src/config/quarto.ts`), SVGs decorativos e as siglas `PT`/`EN`. Se faltar uma chave, **não crie texto de reserva**: reporte e marque a tarefa como bloqueada.

### 4.2 Textos (`content/textos.<lang>.json`)

- Lidos **somente** por `getTextos(lang)` (`src/lib/textos.ts`), que valida com `textosSchema` na build. Um JSON fora do contrato **derruba a build** e lista os campos.
- O schema é **estrito**: uma chave desconhecida também derruba a build. Se o redator criar uma chave nova, ela entra no schema primeiro (um único arquivo).
- Textos não aceitam marcadores `[A CONFIRMAR`, `[PENDENTE` nem `CONFIRMAR:`.
- `pt` e `en` precisam ter a mesma estrutura, os mesmos tamanhos de lista e os mesmos `id`s na mesma ordem (teste).

**Estrutura validada** (a entregue pelo redator para o design "O quarto"; detalhes campo a campo em `src/schemas/conteudo.ts`):

| Caminho | Uso |
|---|---|
| `meta` | `<title>`, description e `lang` |
| `topo` | botão de modo, "pular", `luz.*` (interruptor), `menu`, `idioma.{rotulo, pt, en}` (seletor) |
| `status.modoAtivado` | anúncio `role="status"` |
| `nav` | menu do modo recrutador (uma chave por capítulo) |
| `selos` | dicionário de selos. Campos `status` do conteúdo (`formacao.*.status`, `alem.escotismo.status`) guardam **a chave** do selo (`emAndamento`, `concluido`, `atual`) ou `""` |
| `resumo`, `hero` | `#ficha`: `hero.dados[]` (a `<dl>`), `hero.provas[]` e CTAs |
| `quarto` | `titulo`, `ajuda`, `dica`, legendas, `estado`, `objetos.<obj>.{tema, comum, legenda}`, com `<obj>` = **exatamente** os 12 ids de `IDS_OBJETOS`. O rótulo duplo (`DualLabel`) das seções sai daqui |
| `vista` | barra da vista e atalhos |
| `vertice` | monitor: `navegador`, `ctaSiteReal` + `siteUrl`, listas, `proximoPasso*`, `origem*` |
| `sobre` | `p1`, `p2`, `p3` |
| `experiencia.itens[]` | `id` **já é o id do HTML** (`exp-kpmg`, `exp-salesforce`, `exp-cushman`; o schema exige o prefixo `exp-`); `cargos[].inicio/fim` em AAAA-MM para `<time datetime>` |
| `projetos.itens[]` | `id` = `projeto-<slug>` (o schema exige o prefixo), com o `.md` correspondente |
| `habilidades` | `grupos[].itens[].{nome, detalhe, contextoReal}`, `legendaContextoReal`, `rotuloContextoReal` (sr-only), `comoTrabalho` |
| `formacao` | as três prateleiras já separadas: `ia[]` (`#formacao-ia`), `concluida[]` e `certificacoes[]` (`#certificacoes`, com grupos), mais `prateleiras.*` e `idiomas` |
| `alem` | `escotismo` (`#alem-escotismo`), `games` (`#alem-games`, `lista` + `lombadaExtra` = lombadas dos estojos) e `volei` (`#alem-volei`) |
| `contato`, `rodape` | carta (`convite`, `assinatura`) e rodapé (`copyright`) |

Vôlei, a lista de jogos e o Homem-Aranha constam em `perfil.json > hobbies`, então o pré-requisito factual do design §10.2 está cumprido.

**Mapa seção → conteúdo** (`src/i18n/secoes.ts`):

| Seção (id) | Cap. | Chave | Âncoras internas |
|---|---|---|---|
| `ficha` | — | `hero` + `resumo` | — |
| `vertice` | 01 | `vertice` (+ frontmatter de `vertice.md`) | — |
| `sobre` | 02 | `sobre` | — |
| `experiencia` | 03 | `experiencia` | `itens[].id` |
| `projetos` | 04 | `projetos` + `.md` | `itens[].id` (`projeto-<slug>`) |
| `habilidades` | 05 | `habilidades` | — |
| `formacao` | 06 | `formacao` | `formacao-ia`, `certificacoes` |
| `alem` | 07 | `alem` | `alem-escotismo`, `alem-games`, `alem-volei` |
| `contato` | 08 | `contato` | — |

Estrutura fixa: `quarto` (nav do palco), `vista` (dialog), `conteudo` (main), `quarto-config` (JSON). O teste confere que todos os ids do design §10.1 e todos os destinos da config são gerados pelo conteúdo.

**Lacunas restantes.** O design ainda usa quatro textos que não têm chave no conteúdo. Eles ficam opcionais no schema, em `ui.*`, e as tarefas que dependem deles estão marcadas como bloqueadas:

| Chave | Uso |
|---|---|
| `ui.setaPara` | `sr-only` da seta em "Dados → IA" ("para" / "to") |
| `ui.linkExterno` | `sr-only` do ↗ em links externos |
| `ui.selosStatus` | `aria-label` da lista de selos ("Status") |
| `ui.erro404` (`titulo`, `texto`, `voltar`) | página 404 |

### 4.3 Projetos (`content/projetos/*.md` + `_ordem.json`)

- Coleção `projetos` (`glob`, padrão `['*.md', '!_*.md']`), frontmatter validado por `projetoSchema`. **O corpo Markdown não é renderizado.**
- `getProjetos(lang)` devolve `{ destaque, outros }`. O destaque (`destaque: true`, no máximo 1) é o conteúdo do monitor e usa `textos.vertice`. Os outros são os cards do caderno, cada um com `ancora = projeto-<slug>`.
- Texto do card: frontmatter `textos.<lang>` (`resumo`, `papel`) ou, se ausente, `projetos.itens[id = "projeto-" + slug]`. Sem nenhum dos dois, a build falha. Os selos do card vêm de `selos.projetoAcademico`/`selos.emGrupo`.
- Stack, período, link e repositório vêm do frontmatter. `periodo` com `[A CONFIRMAR]` vira `""`. O frontmatter não tem campo de imagem (não há raster no site).
- **Adicionar um projeto:** criar `content/projetos/<slug>.md` com `textos.pt` e `textos.en` no frontmatter e, opcionalmente, pôr o slug em `_ordem.json`. Nenhum código muda: o caderno é uma lista, não um objeto do quarto.

### 4.4 `perfil.json` e privacidade

O `perfil.json` **nunca é importado pelo site** (teste). Ele é validado em teste: estrutura e `fonte` em toda entrada. Os `textos.*.json` não podem conter e-mail nem telefone (teste).

---

## 5. O quarto: config, componentes, modos, vista e histórico

### 5.1 Config única (`src/config/quarto.ts`)

- Segue o formato do design §9.2, com os valores da tabela §4.2 já transcritos para os 12 objetos e as 10 decorações, e `palcoMinimoPx: 728`.
- O campo `textos` do design foi omitido, porque é derivado: o prefixo das chaves é sempre `quarto.objetos.<id>`.
- A estante e os quadros compartilham o enquadramento (`VISTA_ESTANTE`).
- Exporta `quarto`, `objetosEmOrdem`, `cliqueDe(o)` e `configCliente()`, o subconjunto serializado no HTML (≤ 3 KB, testado).

### 5.2 Validação na build (três camadas)

| Camada | Quando | O que verifica |
|---|---|---|
| `validar-quarto.ts` | Ao importar `quarto.ts` (toda build e todo teste) | Os 12 objetos presentes e sem repetição; `ordem` única, contínua e acompanhando `capitulo`; 1 principal com lâmpada por capítulo; capítulo = capítulo da `secao` (`SECOES`); câmera 16:10 (±0,01) dentro do viewBox; `janela` presente só nas vistas "dentro" e contida na câmera; cliques dentro do viewBox, ≥ 97×97 unidades (44 px no palco de 728 px) e sem sobreposição; ladrilho = capítulo nos principais e `null` nos secundários; componentes conhecidos |
| `textosSchema` | Build e teste | Todas as chaves `quarto.objetos.<id>` em pt e en, mais as da §10.2 |
| `verificar-ancoras.mjs` | Fim da build | No HTML gerado de `/` e `/en/`: todo `destino` e toda `secao` da config existem como `id`, e não há ids duplicados. Enquanto a página não tiver o `#quarto-config` (esqueleto), apenas avisa |
| `tests/conteudo.test.ts` | `npm test` | Os ids do design §10.1 e os destinos da config são gerados a partir do conteúdo; negativos da validação |

### 5.3 Um componente por objeto

- `components/quarto/objetos/<Nome>.astro` e `decoracao/<Nome>.astro` recebem `PropsDesenho { l, a, contexto }` e desenham **só** em coordenadas locais `0…l × 0…a`, com `fill: var(--room-*)`. Não posicionam a si mesmos nem sabem o próprio destino.
- `Quarto.astro` percorre a config. Para cada item, posiciona o desenho com `<svg x y width height viewBox="0 0 l a">` dentro do `<svg viewBox="0 0 1600 1000" aria-hidden="true">` e cria o `<a class="objeto" href="#destino" style="--x;--y;--w;--h">` correspondente na `<ol>` (design 5.3).
- `registro.ts` liga o nome da config ao componente. O `satisfies Record<ComponenteObjeto, …>` faz o `astro check` falhar se faltar algum.
- O ladrilho do mobile reusa os mesmos componentes com `contexto="ladrilho"` (`mobile.desenhos`).
- **Trocar ou remover um objeto:** edite `IDS_OBJETOS`/`COMPONENTES_*` em `tipos.ts` e a entrada em `quarto.ts`, e ajuste `quarto.objetos` nos JSON. O validador e o schema apontam o que faltar.

### 5.4 Modos: recrutador é a base

- **Script no `<head>`** (`BaseLayout.astro`, inline, antes de qualquer CSS, ≤ 1 KB): adiciona `.js`, aplica `localStorage.tema` em `data-theme` e define `data-modo="quarto"`, **exceto** com `?modo=recrutador` ou `localStorage.modo === 'recrutador'`. Assim o layout não pisca e não há CLS.
- **Sem JS**, `data-modo` não existe e a página é o modo recrutador. Buscadores, impressão e leitores sem JS recebem isso.
- **CSS:** o estilo base é o do modo recrutador. Tudo do quarto fica sob `html[data-modo='quarto']` e dentro de `@media screen`, então a impressão sai sempre no modo recrutador. Classes utilitárias: `.so-quarto`, `.so-recrutador` e `.so-js` (já em `global.css`).
- O botão de modo é `<a href="?modo=recrutador">`. Funciona sem JS (recarrega) e, com JS, troca `data-modo` sem recarregar, salva em `localStorage` e faz `replaceState` mantendo o `#hash` (design 5.2).
- O `canonical` não leva `?modo` nem hash.

### 5.5 Vista: `<dialog id="vista">`, `#id` e histórico

- Há um único `<dialog id="vista">` no fim do `<body>`. Ao abrir, o JS **move** a `<section>` para dentro do dialog e a devolve ao fechar. Os ids nunca se duplicam (a integração confere).
- `data-vista` = `vista.tipo` do objeto escolhe a moldura (8 molduras em `styles/vistas.css`).
- **Histórico** (design 5.6), centralizado em `scripts/historico.ts`:

| Ação | API |
|---|---|
| Abrir a partir do quarto | `history.pushState({ vista: id }, '', '#' + destino)` |
| Anterior/próximo, link interno entre vistas | `replaceState` |
| Fechar (Esc, "Voltar") | `history.back()` se a vista foi aberta por `pushState`; senão, `replaceState` sem hash |
| `popstate` | Fecha a vista ou abre a do `#id`, sem animação |
| Carregamento com `#id` | Abre já aproximado, sem animação, e rola até o alvo |

- O dono de um `#id` qualquer (ex.: `#exp-kpmg`) é a `<section>` ancestral do elemento: `document.getElementById(id).closest('main > section')`. Não precisa de tabela no código.
- A câmera interpola o `viewBox` entre `0 0 1600 1000` e `vista.camera` (lidos de `#quarto-config`) em `requestAnimationFrame`, só durante o zoom (400 ms / 320 ms). Com `prefers-reduced-motion`, é corte direto. O fallback com `transform` está descrito no design §4.4.
- Sem JS, ou antes de o módulo carregar, `section:target` aparece como painel simples só com CSS (regra já em `global.css`).

### 5.6 JS

| Arquivo | Conteúdo | Orçamento |
|---|---|---|
| Inline no `<head>` | tema, `.js`, modo | ≤ 1 KB (já escrito) |
| `src/scripts/quarto.ts` + módulos | modo, câmera, vista/dialog, histórico, teclado (setas, Home/End), lidos (`sessionStorage`), legenda, interruptor de tema, idioma (preserva `#hash` e modo) | ≤ 10 KB gzip, `type="module"` |

Os módulos não têm coordenadas: tudo vem do `#quarto-config`. O handler de clique só agenda o zoom (INP ≤ 200 ms).

---

## 6. i18n

- `i18n.locales = ['pt', 'en']`, `defaultLocale = 'pt'`, `prefixDefaultLocale = false`: `/` = pt-BR e `/en/` = inglês, sem redirecionamento automático.
- `PaginaInicial.astro` recebe `lang`, e as duas rotas só passam o idioma. Assim, as seções são as mesmas nos dois idiomas, por construção.
- `CONFIG_IDIOMA` gera `<html lang>`, `hreflang` e `og:locale`. Canonical e `hreflang` (`pt-BR`, `en`, `x-default`) estão no `BaseLayout`, e o sitemap tem as alternâncias.
- Links entre idiomas usam `getRelativeLocaleUrl(lang)`. O seletor é composto de dois `<a>` (funciona sem JS). Com JS, ele acrescenta o `#hash` atual ao `href`, para que uma vista aberta em pt reabra em en já aproximada (design 5.8). O modo vem do `localStorage`.

## 7. Fontes

- Fonts API do Astro com `fontProviders.fontsource()`: Atkinson Hyperlegible Next → `--font-text` (400–700), Bricolage Grotesque → `--font-display` (600–800) e Atkinson Hyperlegible Mono → `--font-mono` (400–500). As fontes são variáveis, com um arquivo cada.
- Elas são baixadas **na build** e servidas pelo site em woff2 com `swap`. Fallbacks com métricas ajustadas são gerados automaticamente (CLS). **Dois `preload`**: texto e títulos (design §2.2).
- Subset **`latin`**, que cobre o português e o inglês. O design cita `latin` + `latin-ext`, mas o `latin-ext` não traz nenhum caractere usado nos textos e custaria requisições do orçamento de ≤ 7. As setas → e ↗ são SVG.
- Plano B sem rede na build: pacotes `@fontsource-variable/*` com `fontProviders.npm({ remote: false })`.

## 8. Imagens e SVG

- Não há imagens raster (o print do Vértice saiu; o monitor mostra um "site" em HTML). O único arquivo estático é o `favicon.svg`.
- O SVG do quarto é **inline** e é pintado com variáveis CSS, então a troca de tema não baixa nada. Orçamento: ≤ 45 KB bruto / 11 KB gzip e ≤ 400 elementos, com coordenadas inteiras e sem `<filter>`, gradientes ou contornos (design §9.1). Rode SVGO à mão no desenho antes de colar (não é dependência do projeto).

## 9. Orçamento e desempenho (design §9.4)

HTML ≤ 55 KB gzip por idioma · CSS ≤ 20 KB gzip · JS: 1 KB inline + 10 KB gzip · fontes ≤ 110 KB · ≤ 7 requisições (HTML, CSS, JS, 3 fontes, favicon) · LCP ≤ 2,0 s (texto do resumo) · TBT ≤ 100 ms · CLS ≤ 0,02 · INP ≤ 200 ms.
Configurações que servem a isso: `compressHTML: true` (o Astro 7 usaria `'jsx'` e colaria palavras entre elementos inline), `aspect-ratio: 16/10` no palco, nenhum `opacity: 0` inicial no CSS e o `<dialog>` no *top layer*. **O compilador Rust do Astro 7 não corrige HTML inválido**: tags fechadas, nada de `<div>` em `<p>`.

## 10. SEO e acessibilidade (base)

O `BaseLayout` traz `lang`, `title`, `description`, canonical sem `?modo`, `hreflang`, Open Graph básico, `color-scheme`, favicon e sitemap. `robots.txt` é gerado. Os objetos são `<a href>` rastreáveis. Ficam para a fase 5: "Pular para o conteúdo" (2º focável), botão de modo como 1º focável, `h1` no resumo, `h2` com `DualLabel`, `section` com `aria-labelledby` e `forced-colors`.

## 11. Deploy (GitHub Pages)

- Saída estática em `dist/` (`build.format: 'directory'`, `trailingSlash: 'always'`). `SITE_URL` (padrão `https://mathnags.github.io`) e `BASE_PATH` (padrão `/`) vêm do ambiente.
- **Decisão pendente (Matheus/devops):** `/` e `/en/` na raiz exigem o repositório `mathnags.github.io` (recomendado) ou domínio próprio. Com outro nome de repositório, basta `BASE_PATH=/<repo>`, porque links internos usam `comBase()`/`getRelativeLocaleUrl()`.
- O workflow (fase 7) roda `npm ci`, `npm run lint`, `npm test` e `npm run build`, nessa ordem, e publica com `actions/deploy-pages`.

## 12. Scripts e verificação

| Script | Comando |
|---|---|
| `dev` | `astro dev` |
| `build` | `astro build` (valida textos, projetos, config do quarto e âncoras) |
| `preview` | `astro preview` |
| `check` | `astro check` |
| `lint` | `astro check && eslint .` |
| `test` | `vitest run` |
| `verify` | `lint` + `test` + `build` |

**Quando o Node existir** (PowerShell, na raiz):

```powershell
node -v            # >= 22.23.4 (instalado: 26.13.1)
npm.cmd install    # no PowerShell, npm.cmd evita a política de execução de scripts
npm run test       # contrato do conteúdo + config do quarto
npm run lint       # astro check + eslint
npm run build      # dist/index.html, dist/en/index.html, sitemap-index.xml, robots.txt
npm run preview    # http://localhost:4321/ e /en/
```

A primeira build precisa de internet (fontes). Até a T11, a build avisa "sem #quarto-config" (esperado no esqueleto).

## 13. Riscos

| Risco | Mitigação |
|---|---|
| `npm install` com ERESOLVE | A causa era `@types/node@^24.22.1` (versão inexistente), e não o vitest: vitest 5.1 aceita o vite 8 do Astro 7. Corrigido para `^26.6.6`. Sem `--force` nem `--legacy-peer-deps` |
| Chaves de texto mudarem em paralelo | O schema é estrito e fica num só arquivo, e a mensagem de erro lista o campo. Alinhar com o redator antes da fase 5 |
| Zoom pesado em celular médio | Medir (design §10.3). Há fallback com `transform` e o mesmo enquadramento |
| Astro 7 recente (Vite 8, compilador Rust) | Versões com `^` na major e `package-lock.json` versionado |

## 14. Registro de decisões

1. **Recrutador como base, quarto como camada.** O conteúdo fica completo e acessível sem JS, e o quarto não pode quebrar SEO, impressão nem leitor de tela.
2. **Config única validada ao importar.** Geometria errada (alvo pequeno, sobreposição, câmera fora de 16:10) é bug de acessibilidade e precisa falhar na build, não no navegador.
3. **Verificação de âncoras no HTML gerado.** Só o HTML final prova que `destino` existe nos dois idiomas. As funções de âncora compartilhadas (`secoes.ts`) fazem o teste antecipar o problema.
4. **Seção movida para o dialog (não clonada).** Mantém ids únicos e o histórico com `#id` real.
5. **Desenhos em `.astro`.** Zero JS por objeto e custo de render só na build.
6. **`perfil.json` fora do site, schemas sem imports virtuais e uma página-modelo para os dois idiomas** (mantidos da revisão 1).
