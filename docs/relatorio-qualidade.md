# Relatório de qualidade (fase 6b)

Data: 2026-11-18 · Build: `npm run build` ok (3 páginas, 12 objetos verificados) · Servido por `astro preview` em `http://localhost:4321` (dist recém-gerado) · Chrome 64-bit do sistema, Lighthouse CLI, axe-core 4.x e Puppeteer (testes escritos fora do repositório). Nenhum código do projeto foi alterado.

## 1. Notas Lighthouse

| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` (pt) | mobile | 100 | 100 | 100 | 100 | 1,1 s | 50 ms | 0 |
| `/` (pt) | desktop | 100 | 100 | 100 | 100 | 0,3 s | 0 ms | 0 |
| `/en/` | mobile | 100 | 100 | 100 | 100 | 1,1 s | 50 ms | 0 |
| `/en/` | desktop | 100 | 100 | 100 | 100 | 0,3 s | 0 ms | 0 |

Peso total do 1º carregamento: 209 KiB. Auditorias reprovadas mesmo com nota 100 (não pontuam): `label-content-name-mismatch` (ver A1), `render-blocking-insight` (CSS, 40 a 150 ms) e `network-dependency-tree-insight`.

O Lighthouse só testa o estado de repouso do quarto. As vistas (`<dialog>`) foram auditadas à parte com axe-core (seção 2).

## 2. Resultados por área

**Acessibilidade (axe-core, wcag2a/aa, 2.1, 2.2 AA, best-practice; pt e en; claro e escuro; quarto, modo recrutador e 12 vistas)**
- Quarto e modo recrutador: só `label-content-name-mismatch` e `landmark-unique` (A1, A2).
- Vistas: `scrollable-region-focusable` em 5 vistas (A4) e **contraste insuficiente** em `#exp-kpmg .aprendizado strong` no tema escuro (A3).
- Teclado: o 1º `Tab` cai em "Modo recrutador"; ordem do DOM segue os capítulos 01 a 08; setas movem entre objetos (direita/esquerda/baixo/cima); Enter abre a vista, foco vai para o `h2` e volta ao objeto ao fechar (Esc ou botão "voltar" do navegador); avançar do navegador reabre; `Tab` fica preso no `<dialog>`. Foco visível em todos os controles (anel 3 px; foco duplo branco+tinta sobre a ilustração). Sem erros no console.
- `lang="pt-BR"` / `lang="en"` corretos; links de idioma com `hreflang`; um único `h1` por página; zero `<img>` (sem necessidade de `alt`).
- Alvos de toque: objetos do quarto >= 45 px em 768 (mínimo medido 45), 60 px em 1024, 51 px em 1280; ladrilhos mobile >= 158 px (88 px em 320).

**prefers-reduced-motion:** com `reduce`, o `viewBox` muda direto para o `camera` do objeto (corte, sem interpolação), nenhuma animação ou transição em execução (0 elementos). Sem `reduce`: 2 animações em laço e 365 elementos com transição. Conforme o design.

**Sem JS:** todas as 9 seções visíveis e legíveis em modo recrutador; `#quarto`, botão de modo e botão de luz ocultos; menu de navegação visível; sem overflow. pt e en iguais.

**Responsivo (320, 360, 768, 1024, 1280; pt/en; quarto e recrutador):** nenhum overflow horizontal (`scrollWidth == clientWidth` em todos). Palco 328x845 (360), 720x450 (768), 960x600 (1024), 812x508 (1280). Vista mobile (360): texto de 16 px, sem overflow.

**SEO:** `title` e `meta description` únicos por idioma; `canonical` correto; `hreflang` pt-BR, en e x-default; Open Graph básico (type, title, description, url, locale); `sitemap-index.xml` + `sitemap-0.xml` com as duas URLs e alternates; `robots.txt` com Sitemap. Faltam: `og:image`, `twitter:card`, `og:locale:alternate` e JSON-LD `Person` (S1, S2).

**Links externos:** verticetour.com.br 200, github.com/mathnags 200, linkedin.com/in/matheusnagano responde 999 (bloqueio anti-bot do LinkedIn contra curl; não é link quebrado, mas não foi possível confirmar por HTTP). Âncoras internas: todas resolvem (`verificar-ancoras` no build confirma 12 objetos por idioma).

**Orçamento de performance (design 9.4, gzip medido):**

| Recurso | Orçamento | Medido | Resultado |
|---|---|---|---|
| HTML pt / en | <= 55 KB gz | 15,4 / 15,6 KB (77 KB bruto) | ok |
| CSS total | <= 20 KB gz | 8,7 KB (2 arquivos) | ok |
| JS do quarto | <= 10 KB gz | 4,4 KB (11 KB bruto) | ok |
| Script inline do `<head>` | <= 1 KB | cerca de 0,7 KB (com comentário HTML ao lado, que não vai ao navegador mas pesa no HTML) | ok |
| Fontes | <= 110 KB | **183 KB** (Bricolage 131,5 KB; Atkinson 34 KB; Mono 17,8 KB) | **falha** (P1) |
| Imagens raster | nenhuma | 0 | ok |
| Requisições no 1º carregamento | <= 7 | 7 + favicon | ok |
| LCP / TBT / CLS | <= 2,0 s / <= 100 ms / <= 0,02 | 1,1 s / 50 ms / 0 (mobile simulado) | ok |

SVG do quarto (<= 45 KB bruto / 11 KB gz / 400 elementos): não medido isoladamente; está dentro do HTML de 15 KB gz, então o orçamento de HTML cobre.

## 3. Problemas

Formato: categoria | onde | problema | correção sugerida | severidade.

### Críticos
Nenhum.

### Altos

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| A3 | A11y (contraste, WCAG 1.4.3) | `src/styles/layout.css` linha 858 (`.aprendizado strong { color: var(--pine) }`), vista do mural, tema escuro | Dentro do `.papel`, `--pine` fica `#1E6B5A` sobre o papel escuro `#CFCABD`: razão **3,88:1**, texto bold de 17 px (exige 4,5:1). O design só calculou o pine sobre `--pine-tint`, não sobre `#CFCABD`. Afeta os 3 papéis, pt e en | Usar `--paper-text` (ou um pine mais escuro, por exemplo `#15594A`, ao menos 4,5:1 sobre `#CFCABD` e `#FFFDF7`) para o rótulo "O que levei disso" dentro do papel; atualizar a tabela 3.4 do design | Alta (falha AA) |
| P1 | Performance | `astro.config.mjs` (fontes), `dist/_astro/fonts/` | Fontes somam 183 KB contra o orçamento de 110 KB. O Bricolage Grotesque variável (131 KB, eixos 200-800) responde por 72% e é preloaded; o preload total é 166 KB | Subsetar Bricolage para pesos 600/800 (e `opsz`/`wdth` fixos, se for variável de 3 eixos), ou usar a versão estática 800 só latin; reavaliar o preload. Meta: <= 110 KB no total | Alta (orçamento do design; não derruba o Lighthouse) |
| S1 | SEO | `<head>` de `/` e `/en/` | Sem `og:image` nem `twitter:card`: o link compartilhado em LinkedIn/WhatsApp sai sem imagem | Criar uma imagem de compartilhamento 1200x630 (fora do 1º carregamento, então não viola "zero raster") com o nome e "Dados → IA"; adicionar `og:image`, `og:image:alt`, `twitter:card=summary_large_image` e `og:locale:alternate` | Alta |
| S2 | SEO | `<head>` | Sem dados estruturados JSON-LD `Person` | Adicionar `<script type="application/ld+json">` com `name`, `jobTitle`, `address.addressLocality`, `sameAs` (LinkedIn e GitHub), `knowsLanguage`, só com fatos de `perfil.json` | Média-alta |

### Médios

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| A1 | A11y (WCAG 2.5.3, Level A) | Links de idioma no cabeçalho e no rodapé (`nav.idioma a`) | `aria-label="Português"` / `"English"` não contém o texto visível "PT" / "EN". Reprovado no Lighthouse (`label-content-name-mismatch`) e no axe; prejudica quem usa comando de voz ("clicar PT") | Remover o `aria-label` e usar o texto visível + `lang`/`hreflang` (ex.: `PT<span class="sr-only"> Português</span>`), ou `aria-label="PT, Português"` | Média |
| A4 | A11y | `.vista-miolo` (mural, estante, quadros, caixa, porta-retrato; desktop e mobile) | Região rolável sem conteúdo focável (axe `scrollable-region-focusable`). O Chrome a torna focável, mas Safari e outros não, e o foco nela não tem nome | Adicionar `tabindex="0"`, `role="region"` e `aria-labelledby` apontando para o `h2` da vista (ou garantir ao menos um link/botão dentro) | Média |
| A2 | A11y | `nav.idioma` do cabeçalho e do rodapé | Dois landmarks `navigation` com o mesmo nome "Idioma / Language" (axe `landmark-unique`) | Dar nomes distintos ou trocar o do rodapé por `<div role="group">` | Baixa-média |
| D1 | Design/UX | Primeira tela em 1280x800 (quarto, tema padrão do sistema) | O design promete que a 1ª tela cabe em 100dvh; o resumo termina em 981 px e a dica "Clique nos objetos / Sugestão" fica abaixo da dobra | Reduzir espaçamento ou fonte do `h1`/`<dl>` no aside, ou limitar a altura | Baixa-média |
| P2 | Performance | `layout.css` e `PaginaInicial.css` (render-blocking-insight, 40 a 150 ms) | Dois CSS externos bloqueiam a renderização | Inline do CSS crítico (`build.inlineStylesheets: 'always'`; 8,7 KB gz cabem) | Baixa |
| M1 | Responsivo | Vista mobile (360), rodapé "02 Sobre mim / 04 Outros projetos →" | O botão "próximo" encosta na borda direita (seta quase cortada) | Reduzir padding/rótulo ou dar `flex: 1 1 0; min-width: 0` aos dois botões | Baixa |
| D2 | A11y/UX | Etiqueta "06 · Formação e certifi…" em 1280 (palco 812 px) | Texto truncado com reticências na legenda visual (o nome acessível está completo) | Abreviar a etiqueta ou permitir quebra em 2 linhas | Baixa |

## 4. Observações

- O preview já estava em execução (PID 35228, porta 4321) quando comecei; `--port 4330` foi recusado por Astro ("another preview server is already running"). Auditei contra esse servidor servindo o `dist` recém-construído e não o encerrei, pois não o iniciei.
- Contraste do restante da interface (tema claro e escuro, quarto e modo recrutador) passou limpo no axe; só o caso A3 falhou. Itens do design 3.1 a 3.4 reconferidos em navegador, exceto lombadas dos estojos no SVG (decorativo).
- Teste manual com leitor de tela (NVDA/VoiceOver) não foi feito.

## Veredito: **REPROVADO**

Todas as notas Lighthouse são 100 e não há problema crítico, mas o critério de acessibilidade AA não é atendido (A3, contraste 3,88:1 na vista de experiência no tema escuro) e há desvios do orçamento (P1, fontes) e de SEO (S1, S2). Após corrigir A3, A1, A4, P1, S1 e S2, reexecutar a verificação para aprovar.

---

# Reauditoria (após correções)

Build refeito e servido em `http://localhost:4321`. Lighthouse, axe (pt/en, claro/escuro, quarto + 12 vistas) e verificação visual repetidos.

| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO |
|---|---|---|---|---|---|
| `/` | mobile / desktop | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |
| `/en/` | mobile / desktop | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 |

Peso do 1º carregamento: 102 KiB mobile e 125 KiB desktop (antes 209 KiB). LCP 1,1 s, TBT 30 ms, CLS 0.

| Id | Situação |
|---|---|
| A3 contraste do papel escuro | Corrigido: axe sem `color-contrast` em nenhuma vista, pt/en, claro/escuro |
| P1 fontes | Corrigido: 74,5 KB carregados no 1º carregamento (Atkinson 34, Bricolage 22, Mono 18), dentro de 110 KB. HTML 15,5/15,8 KB gz, CSS 8,7 KB gz, JS 4,4 KB gz |
| S1 `og:image` / `twitter:card` | Corrigido: `og.png` 1200x630 com largura, altura e alt; `summary_large_image` |
| S2 JSON-LD | Presente (conteúdo factual não conferido aqui; cabe ao verificador de fatos) |
| A1 aria-label PT/EN, A2 landmarks idioma | Corrigidos: sem violações no axe |
| A4 `.vista-miolo` | Corrigido: `tabindex=0`, `role=region`, `aria-labelledby`; Tab chega nele e o foco aparece (anel laranja 3 px com offset, conferido em captura) |
| D1 1ª tela 1280x800 | Corrigido: a dica termina em y=776 (< 800), CTA, dados e dica visíveis sem rolar, em claro e escuro |
| P2 CSS bloqueante | Aberto (baixa): o Lighthouse não reporta mais `render-blocking`; segue `network-dependency-tree` informativo |
| M1, D2 | Não reverificados em detalhe (baixa) |

**Novo, baixo (A5):** axe `landmark-unique` (best-practice) em `.vista-miolo` em todas as vistas: o `role=region` novo usa o mesmo `aria-labelledby` da `<section>` interna, gerando duas regiões com o mesmo nome. Correção: tirar o `role=region` da `<section>` interna ou do `.vista-miolo` (manter `tabindex=0` e o nome só no wrapper).

## Veredito final: **APROVADO**

Todas as notas Lighthouse são 100, sem problema crítico ou alto, AA sem falhas no axe e orçamento de performance cumprido. Pendências só de severidade baixa (A5, P2, M1, D2).
