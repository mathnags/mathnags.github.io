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

---

# Reauditoria 2 (revisão 5: marcadores, intro SQL, pílula, nome grande, profundidade)

Build refeito; `astro preview` na porta 4350 (encerrado ao final). Chrome headless, localStorage limpo (intro ativa em 1280x800), Lighthouse, axe e Puppeteer.

| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|
| `/` | mobile / desktop | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1,1 s / 0,3 s | 50 / 0 ms | 0 / 0 |
| `/en/` | mobile / desktop | 100 / 100 | 100 / 100 | 100 / 100 | 100 / 100 | 1,1 s / 0,3 s | 40 / 0 ms | 0 / 0 |

Peso: 129 KiB. HTML 17,3 KB gz; CSS 10,6 KB gz (2 arquivos); JS 5,0 KB gz. Orçamentos cumpridos.

## Verificações pedidas

| Item | Resultado |
|---|---|
| LCP e CLS com a intro ativa (1280x800, storage limpo) | LCP é o `p.frase` do resumo (0,1 a 0,4 s no Chrome local); CLS 0 em pt e en. A intro não vira LCP. Recarregar não repete (chave gravada no início) |
| Teclado: Pular | Tab durante a intro: Modo recrutador, Pular conteúdo, PT, EN, luz, CTA, **Pular**, pílula. "Pular" tem 71x44 px, anel de foco 3 px, Enter encerra e leva o foco ao 1º objeto |
| Teclado: Esc / clique | Esc e clique no palco encerram a intro em < 300 ms (overlay `display:none`) |
| Pílula | 8 itens de 44x44 px, altura 52 px, fica abaixo do palco (não cobre a cena). Com a vista aberta vai para o `<dialog>`; item ativo tem `aria-current` e fundo `--text` |
| Reduced motion | Sem intro (overlay não exibido, nada gravado no storage), 0 animações em execução, marcadores com `animation: none` (estáticos), objetos visíveis |
| Contraste | Intro (claro/escuro): texto 17,93/13,63; comentário e "executando" 7,62/6,84; resultado 6,35/7,70; botão Pular 17,93/13,63. Pílula: item ativo 17,93/13,63; número `--text-muted` sobre `--surface` (design 7,62/6,84). Marcadores: anel e preenchimento `--accent` e contorno `--text`, valores conferidos no navegador (anel `#B8400F` / `#FF8A4C`; contorno `#15171C` / `#ECE8DF`), todos >= 3:1 sobre parede conforme 11.1. axe sem violações de contraste em pt/en, claro/escuro, repouso e vista |
| 360 px | Sem overflow horizontal; sem intro, sem pílula visível (nichos 158x179 px), marcadores 24 px estáticos, h1 de 32,6 px na 1ª tela. **Problema Q2 abaixo** |

## Problemas novos

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| Q1 | Interação / A11y | `[data-intro-overlay]`, `.intro-cartao`, `.intro-pular` | Quando a intro termina sozinha (2,5 s, sem Pular/Esc/clique), o overlay **não é desativado**: o cartão fica com `opacity:0` mas continua `visibility:visible` e `pointer-events:auto`; `data-intro` permanece no `<html>`. Medido com `elementFromPoint` após 4,5 s: **12 de 12 objetos bloqueados** (monitor, mural, estojos, caixa etc.). O 1º clique do visitante é engolido como "pular" (o objeto não abre), e o botão "Pular" invisível continua na ordem de Tab (foco sobre elemento invisível, WCAG 2.4.7/2.4.11). Só ocorre na 1ª visita em desktop, por isso o Lighthouse não pega | A animação final deve levar o **overlay** (não só o cartão) a `visibility:hidden; pointer-events:none` em 2,5 s (design 11.2 já diz isso), e o JS deve remover `data-intro` no `animationend`. Teste: após 3 s, `elementFromPoint` sobre cada objeto devolve o próprio objeto | **Alta** (1ª impressão; clique perdido) |
| Q2 | Responsivo | Rodapé fixo da vista em 360 px (`Anterior / 03 · Experiência ▾ / Próximo`) | Os três botões somam mais que 360 px: o "Próximo" fica cortado na borda direita ("04 Ou…") e o botão central quebra em 2 linhas. Piora o item M1 anterior | `flex: 1 1 0; min-width: 0` nos três, rótulos curtos no mobile (só `← 02`, `03 ▾`, `04 →` com texto `sr-only`) | Média-alta |
| A5 (aberto) | A11y | `.vista-miolo` | `landmark-unique` continua (região com o mesmo nome da `<section>` interna) | Ver reauditoria anterior | Baixa |

Os demais itens abertos (P2, D2) seguem de severidade baixa.

## Veredito: **REPROVADO**

Notas Lighthouse 100 e contraste, teclado e reduced motion conforme o design, mas o Q1 (overlay da intro bloqueia todos os objetos após terminar sozinho) é um defeito de interação na 1ª visita que precisa ser corrigido, junto com o Q2 (botão cortado a 360 px). Após corrigi-los, repetir `elementFromPoint` pós-intro e a captura a 360 px; se passarem, o veredito passa a APROVADO.

---

# Reauditoria 3 (correções de Q1, Q2 e A5)

Build refeito; preview na porta 4360 (encerrado ao final).

| Id | Resultado |
|---|---|
| Q1 | Corrigido. Após 4 s sem interação (intro terminada sozinha), `elementFromPoint` nos 12 objetos devolve o próprio objeto em pt e en (0 bloqueados); o overlay fica `display:none`, `data-intro` removido, "Pular" fora da ordem de Tab (sequência: modo, pular conteúdo, PT, EN, luz, CTA, objetos...). O 1º clique abre a vista (mural) |
| Q2 | Corrigido. Rodapé da vista em 360 e 320 px: 4 botões de 44 px de altura, todos dentro da tela (360: último termina em x=348; 320: em x=308), rótulos curtos (`← 02`, `03 ↓`, `04 →`), sem overflow horizontal |
| A5 | Corrigido. axe (wcag2a/aa, 2.1, 2.2 AA, best-practice) sem nenhuma violação na vista do mural em pt e en. Observação baixa: o `.vista-miolo` tem `tabindex="0"` sem `role`/nome próprio; o nome vem da `<section aria-labelledby>` interna e o axe aceita, mas um leitor de tela anuncia o foco no contêiner sem rótulo. Opcional: `role="region"` + `aria-label` no contêiner e remover o nome da seção interna |
| Lighthouse | 100/100/100/100 em `/` e `/en/`, mobile e desktop. LCP 1,1 s mobile e 0,3 s desktop, TBT <= 40 ms, CLS 0. Sem regressão |

## Veredito final: **APROVADO**

Sem problema crítico ou alto; Lighthouse 100 nas 4 categorias, AA sem falhas no axe, orçamento cumprido. Pendências baixas: P2 (CSS bloqueante, já sem alerta no Lighthouse), D2 (etiqueta truncada) e a observação do `.vista-miolo` acima.


---

# Reauditoria 4 (revisão 6: quarto em tela cheia com imagem raster, tour pela rolagem, SO no monitor, post-its e anotações)

Build refeito; `astro preview` na porta 4370 (encerrado ao final). Chrome headless, Lighthouse, axe-core e Puppeteer. Para o LCP com a imagem, medi também com `localStorage` limpo (intro ativa), 4G simulado e CPU 4x.

## Notas Lighthouse

| Página | Dispositivo | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | 100 | 100 | 100 | 100 | 1,1 s | 10 ms | 0 | 260 KiB |
| `/` | desktop | 100 | 100 | 100 | 100 | 0,3 s | 0 | 0 | 225 KiB |
| `/en/` | mobile | 100 | 100 | 100 | 100 | 1,1 s | 0 | 0 | 260 KiB |
| `/en/` | desktop | 100 | 100 | 100 | 100 | 0,3 s | 0 | 0 | 226 KiB |

Auditoria reprovada que não pontua (regressão, ver R6-1): `label-content-name-mismatch` no desktop (interruptor).

## LCP, CLS e orçamento de imagens

| Cenário (intro ativa, storage limpo, 4G + CPU 4x) | LCP | CLS |
|---|---|---|
| 1280x800 dia | texto da parede 1,04 s; imagem `dia-1920.avif` 1,6 s | 0,0001 |
| 1280x800 noite | 0,9 s; imagem 1,2 s | 0,0001 |
| 1920x1080 `/en/` | 0,9 s; imagem 1,6 s | 0,0001 |
| 360x740 dia / noite | 0,84 s; herói `heroi-*-480.avif` 0,88 s | 0 |

Dentro de LCP <= 2,0 s no desktop e <= 2,5 s no mobile, CLS <= 0,02. A imagem tem `fetchpriority="high"`, preload por tema e proporção, e LQIP inline.

| Recurso | Orçamento (12.2, 12.9, 12.13.8) | Medido | Resultado |
|---|---|---|---|
| AVIF dia 1280 / 1920 / 2560 | <= 100 / 180 / 290 KB | 58 / 109 / 195 KB | ok |
| AVIF noite 1280 / 1920 / 2560 | idem | 45 / 75 / 109 KB | ok |
| WebP dia 1920 / 2560 | ~ +45% | 119 / 186 KB | ok |
| Herói mobile AVIF 720w (dia / noite) | <= 85 KB | 49 / 34 KB (1080w: 85 / 54 KB) | ok |
| Nichos 480w AVIF | <= 12 KB (design 12.3) | 5 a 15 KB (caderno, caixa, estante, monitor e porta-retrato no dia passam de 12 KB) | acima do alvo, sem efeito prático (lazy) |
| 3840w | previsto em 12.2 | não gerado (máximo 2560w) | aceitável |
| HTML gz | <= 45 KB | 15,6 / 15,9 KB | ok |
| CSS gz (2 arquivos) | <= 24 KB | 11,1 KB | ok |
| JS do módulo gz | <= 13 KB | 6,1 KB | ok |
| Script inline do `<head>` | <= 1,2 KB | 1,15 KB | ok, no limite |
| Fontes (1º carregamento, latin) | <= 130 KB | cerca de 98 KB; 2 preloads (o design pede 1) | ok |

## Verificações pedidas

| Item | Resultado |
|---|---|
| Tab | Ordem: Modo recrutador, Pular, PT, EN, interruptor, post-it "Fale comigo", objetos 01..08 (um `<a>` por objeto, nome acessível "01 · O monitor, Projeto Vértice"), depois os 8 "Abrir capítulo" dos cartões. Foco visível em todos (anel de 3 px; duplo na arte). Sem erros no console |
| Setas | Direita/esquerda/baixo/cima movem entre objetos; Home/End vão ao 01/08 |
| Enter, Esc (nível 1) | Enter abre a vista com o foco no `h2`; Esc fecha, devolve o foco ao objeto e limpa o hash |
| Esc em dois níveis | No SO do monitor: abrir um arquivo, Esc 1 fecha a janela e devolve o foco ao ícone, Esc 2 sai do monitor. Funciona. No tour, sem vista aberta, Esc volta ao passo 0. **Falha pontual: R6-2** |
| Tour sem prender a rolagem | Rolagem nativa por roda (9 passos, câmera muda por passo: 1,5x a 1,8x e 3x no fim), Home, End e PageDown funcionam; nenhum `preventDefault` em wheel/touchmove/keydown; "Sair do tour" e "Ir para o monitor" funcionam; objetos continuam clicáveis durante o tour e o "Abrir capítulo" abre a vista sem perder a posição (y=2400) |
| Reduced motion | Intro não aparece nem grava storage; 0 animações em execução; câmera do tour e do zoom corta direto (transição de 1e-5 s); anotações visíveis e estáticas. Sem reduced motion, nenhum laço infinito rodando após 6 s |
| Contraste (axe, 48 estados: pt/en x dia/noite x repouso, tour passo 3, fim do tour/SO, 8 vistas) | **0 violações**, incluindo `color-contrast` |
| Nome na parede e anotações | `-webkit-text-stroke` de 6 px com `paint-order: stroke` e halo `#FFFFFF` (dia) / `#12141A` (noite) ao redor do texto `#15171C` / `#ECE8DF`: 17,93 / 15,06:1 contra o halo. Sem o halo, o texto sobre a imagem daria 12,1:1 (dia) e 4,9:1 (noite) no nome, e abaixo de 3:1 em partes das anotações: o halo é necessário e está presente |
| Post-its | Fundo `#FFF1B8` / `#E8D98F`; texto `#15171C` 15,82 / 12,60:1; número `#4F545C` 6,72 / 5,35:1 |
| HUD | Fundo `rgba(255,255,255,.82)` / `rgba(18,20,26,.88)` com blur, como o design (pior caso 11,7 / 10,8:1). Botão de modo e PT/EN ativo em fundo sólido: 17,9 / 13,6:1 |
| 360 px | Sem overflow. Herói recortado com cartão translúcido (nome 32 px, Dados → IA, post-it "Fale comigo!", "Explorar o quarto"). 8 nichos em 1 coluna (313 px de largura, imagem lazy com `alt=""`, resumo, ação). Vista em tela cheia e SO em grade de 2 colunas com alvos >= 96 px; botões da barra com 44 px. axe ok no herói, nos nichos e no SO |
| Modo recrutador (`?modo=recrutador`) | pt e en, 1280 e 360: 9 seções visíveis, sem quarto nem tour, "Explorar o quarto" é o 1º focável, menu e LinkedIn visíveis, sem overflow, axe sem violações |
| Sem JS | 9 seções visíveis e legíveis em 1280 e 360, botões `so-js` ocultos, menu e rodapé visíveis, sem overflow |
| Outros tamanhos | 768x1024 (retrato), 360 e 320: estratégia mobile. 1024x768, 1280x800, 1440x900 e 1920x1080: 8 objetos visíveis, todos >= 44 px, nenhum fora da tela. 2560x1080: ver R6-3 |

## Problemas

Formato: id | categoria | onde | problema | correção sugerida | severidade.

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| R6-1 | A11y (WCAG 2.5.3, Nível A), regressão | `button.interruptor` (HUD direito) | `aria-label="Luz apagada"` não contém o texto visível "Apagar a luz" / "Acender a luz". Lighthouse `label-content-name-mismatch` no desktop. O texto visível muda com o estado e o `aria-label` não acompanha | Remover o `aria-label` fixo e usar o texto visível como nome (sem `aria-pressed`), ou manter `aria-pressed` com um nome estável contido no texto visível | Média |
| R6-2 | Teclado | Tour e vistas, depois de passar pelo fim do tour | Depois de chegar ao passo 9 (SO embutido) e usar "Sair do tour", a próxima vista aberta precisa de **2 Esc** para fechar (o 1º é consumido como "fechar janela do SO"). Um Esc solto no tour também falhou uma vez em sair do tour. Reprodução: rolar até o fim, Sair do tour, rolar até o passo 3, Abrir capítulo, Esc (nada), Esc (fecha) | Zerar o estado "janela do SO aberta" ao sair do tour e ao fechar a vista; só interceptar o `cancel` do `<dialog>` se houver janela do SO realmente visível | Média |
| R6-3 | Responsivo | 2560x1080 (21:9) | Com a imagem em cover, a parede do nome e o post-it "Fale comigo!" são cortados em cima (nome em y = -122 px): em tela ultralarga, o nome e o LinkedIn somem da 1ª tela | Ancorar o bloco do nome ao viewport quando a proporção passa de cerca de 2:1, ou limitar o cover a 2:1 com faixas laterais | Média |
| R6-4 | Legibilidade | Post-its no desktop (1280) | O nome do post-it fica com cerca de 12 px (no mobile está maior). O design pedia a fonte manuscrita a 22 px; com `font-display: optional` e sem preload, a Patrick Hand tende a não aparecer na 1ª visita e o texto cai para a fonte do sistema | Tamanho mínimo >= 14 px no desktop e preload da fonte manuscrita (ou `swap`) | Baixa-média |
| R6-5 | Performance | Modo recrutador e sem JS | A imagem da cena (74 KB AVIF no desktop, 21 KB o herói no mobile) é baixada mesmo oculta. Sem JS no desktop: 9 imagens (cena + 8 nichos), cerca de 160 KB desperdiçados | Nichos lazy também sem JS, não aplicar o preload da imagem no modo recrutador, ocultar a `<picture>` do palco quando o quarto não é exibido | Baixa |
| R6-6 | Tour (UX) | Passo 9 | O quadro do SO cobre parte de "Ir para o monitor" e "Sair do tour" (texto cortado à esquerda) | `z-index` maior nos botões ou margem para o trilho e os botões | Baixa |
| R6-7 | Tour (UX) | Passo 0 | `.trilho` e `.tour-acoes` ficam visíveis (opacity 1) já no passo 0, e o design pede só nos passos 1 a 9 | Ocultá-los até o passo 1 | Baixa |
| R6-8 | Fontes | `<head>` | 2 `preload` de fonte (o design 12.9 pede 1: Atkinson 400) | Remover o preload do Bricolage | Baixa |

Itens anteriores (A5, `.vista-miolo`, P2, D2) não reapareceram: axe sem violações em todas as vistas.

## Veredito: **APROVADO COM RESSALVAS**

Lighthouse 100 nas 4 categorias em `/` e `/en/`, mobile e desktop; LCP, CLS e orçamento de imagens dentro do design; axe sem violações em 48 estados; teclado, reduced motion, 360 px, modo recrutador e sem JS corretos. Sem problema crítico. Corrigir antes da publicação final: R6-1 (regressão de WCAG 2.5.3, Nível A), R6-2 (Esc engolido) e R6-3 (nome cortado em tela 21:9). Os demais são de severidade baixa.



---

# Reauditoria 5 (revisão 7: quarto 3D em Three.js)

Build refeito (`npm run build`, 3 páginas, 8 objetos verificados por idioma); `astro preview` na porta 4380 (encerrado ao final). Chrome 157 `--headless=new` com **GPU real** (ANGLE D3D11, RTX 4060; confirmado por `UNMASKED_RENDERER`), Lighthouse 13 (Node API), axe-core e Puppeteer. `npm test` (29 ok), `npm run lint` (0 erros) e `scripts/medir-cena.mjs` (todos "ok") passam. Nenhum código do projeto foi alterado.

## 1. Notas Lighthouse

Mobile emulado (4x CPU, 4G simulado) e desktop. Cada combinação com GPU foi rodada duas vezes (a nota varia entre execuções): valores "execução 1 / execução 2".

| Página | Dispositivo | GPU | Desempenho | A11y | Boas práticas | SEO | LCP | TBT | CLS | Peso |
|---|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | sim | **91 / 91** | 100 | 100 | 100 | 1,0 s | 380 / 380 ms | 0,032 | 309 KiB |
| `/en/` | mobile | sim | 94 / 96 | 100 | 100 | 100 | 1,0 s | 280 / 240 ms | 0,012 / 0,032 | 309 KiB |
| `/` | desktop | sim | 93 / 96 | 100 | 100 | 100 | 0,9 s | 150 / 90 ms | 0 | 309 KiB |
| `/en/` | desktop | sim | 93 / 96 | 100 | 100 | 100 | 0,9 s | 170 / 100 ms | 0 | 309 KiB |
| `/` | mobile | não (fallback) | 100 | 100 | 100 | 100 | 0,9 s | 70 ms | 0 | 129 KiB |
| `/en/` | mobile | não (fallback) | 100 | 100 | 100 | 100 | 0,9 s | 70 ms | 0 | 129 KiB |
| `/` | desktop | não (fallback) | 96 | 100 | 100 | 100 | 1,0 s | 90 ms | 0 | 129 KiB |
| `/en/` | desktop | não (fallback) | 95 | 100 | 100 | 100 | 1,1 s | 100 ms | 0 | 129 KiB |

Sem erros ou avisos no console, nem exceções, em desktop e 360 px, claro e escuro, pt e en. Todas as notas >= 90, **mas a margem do desempenho mobile com 3D é de 1 ponto** (91), por causa do TBT.

## 2. Desempenho e TBT

- **Tarefas longas (mobile, 4x CPU, com 3D):** `cena.*.js` com 254 ms (avaliação do módulo, ~2,7 s), 195 ms (montagem) e 58 ms; script da página 69 a 78 ms; tarefas sem atribuição de 65 a 66 ms. Sem GPU (fallback) o TBT cai para 70 ms.
- **Teste de WebGL2 no `<head>` (~190 ms):** isolado e a quente custa ~9 ms; os ~180 ms (183 ms em t=35 ms com 4x CPU) são o **1º contexto GL da página**, que sobe o processo de GPU, bloqueando antes da 1ª pintura. O contexto de teste é descartado (`loseContext`) e a cena cria outro, então a inicialização é paga duas vezes.
- **Chunk (~126 ms de parse):** `cena.*.js` tem 619 KB bruto / 159 KB gzip; o Lighthouse aponta 59 KB (37%) de JS não usado. Carrega no idle, mas cai dentro da janela do TBT (até ~3 s).
- **CLS (mobile):** 0,012 a 0,032, causado por `div.parede-bloco` (nome na parede) deslocando duas vezes quando a cena fica pronta. Abaixo de 0,1, mas é o único CLS não nulo.
- **Orçamento (`medir-cena.mjs`):** HTML 14,0 KB gz (<= 45), script do head 0,69 KB gz (<= 1,5), módulo principal 7,1 KB gz (<= 14), CSS 11,4 KB gz (<= 24), `og.png` ok. Fontes: 176 KB somando todos os subsets (o script só informa; o carregado na 1ª visita não foi remedido). O chunk da cena (159 KB gz) fica fora do caminho crítico, mas pesa no total (309 KiB).

## 3. Acessibilidade, teclado e responsivo

- **axe (wcag2a/aa, 2.1, 2.2 AA, best-practice):** zero violações em 1280x800 e 360x740, pt e en, claro e escuro (repouso); nas 8 vistas (desktop, escuro; Vértice também no claro); no tour a 360 px; na vista a 360 px; e no fallback sem GPU a 360 px.
- **Teclado:** Tab: Modo recrutador, Pular, PT, EN, interruptor (`aria-pressed`), CTA LinkedIn, os 8 objetos (01 a 08) e **depois mais 8 links repetidos** (post-its, mesmos destinos). Anel de foco de 3 px em todos. Clique/Enter abre a vista com foco no título (`h2`); Esc devolve o foco ao objeto de origem (no monitor, o 1º Esc sai do SO e o 2º volta ao quarto, conforme 12.13.1). Com movimento reduzido a vista abre sem espera.
- **360 px:** `scrollWidth == clientWidth` (360) em repouso, após rolar o tour e com a vista aberta; também no fallback sem 3D. Em 1280 o `scrollWidth` é 1265 (barra de rolagem), sem overflow.
- **Sem GPU:** `sessionStorage.semWebgl=1`, modo recrutador entra antes da pintura, sem erros.
- **forced-colors:** botões, vistas e controles legíveis; a camada de texto sobre a cena não (F1).

## 4. Problemas (categoria | onde | problema | correção sugerida | severidade)

Críticos: nenhum.

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| T1 | Desempenho (TBT) | `cena.*.js`, teste WebGL2 em `BaseLayout.astro` | TBT 240 a 380 ms no mobile emulado com GPU; `/` fica em 91 (margem de 1 ponto, oscila de 91 a 96). Causas: avaliação e montagem do chunk (254 + 195 ms) e 1º contexto GL no head (~180 ms) | Fatiar a avaliação (`scheduler.yield`/`setTimeout` entre grupos de objetos e texturas; `compileAsync` depois da 1ª pintura); reduzir o chunk (imports mínimos de `three`, `unused-javascript` 59 KB); no head, trocar o teste por heurística barata ou adiar o teste real para o módulo da cena, mantendo o fallback pós-pintura | **Alta** (risco de cair abaixo de 90 em hardware mais lento) | **Correção (dev-frontend):** mobile com GPU medido agora em 100 (TBT 40 a 80 ms) em 5 de 6 rodadas (uma `/en/` 92 por pico de TBT 360 ms); mesma causa e mesma correção de P1 |
| T2 | Desempenho (CLS) | `.parede-bloco` (nome na parede), mobile | CLS 0,012 a 0,032: o bloco desloca quando a cena fica pronta (`data-cena="pronta"`) | Reservar altura e posição no estado pré-cena, ou aplicar a mudança com `transform` | Média |
| F1 | A11y (forced-colors, WCAG 1.4.3) | `.parede-nome`, anotações "comece aqui" e "role para um tour", post-its | Em `forced-colors: active` o texto com contorno/sombra grossa fica **ilegível** (letras borradas e sobrepostas, fundo `Canvas`) | Em `@media (forced-colors: active)`: `text-shadow: none; -webkit-text-stroke: 0; paint-order: normal` e texto em `CanvasText` sobre `Canvas` | Média |
| A6 | A11y / teclado | Ordem de Tab | 16 paradas para 8 destinos (objetos e post-its duplicados): dobra o custo para teclado e leitor de tela | Tirar o conjunto duplicado da ordem (`tabindex="-1"` e fora da árvore de acessibilidade) ou fundi-lo com `a.objeto` | Média |
| V1 | Visual / mobile | Vista do monitor (SO) a 360 px | Linha laranja (curva "Dados para IA") atravessa os ícones `origem.md` e `proximo-passo.md`; o ícone do site fica cortado pelo rodapé do SO (rolável). Não é o `.heroi-linha` (oculto com cena pronta); elemento não identificado | Isolar o desenho do fundo do SO (z-index/opacidade) e confirmar a origem | Baixa-média |
| A7 | A11y | Controles no mobile | 2 links de 40x44 px (abaixo de 44 px de largura; passa WCAG 2.5.8 AA, só foge da meta do design) | `min-width: 44px` | Baixa |
| P3 | Desempenho | `cena.*.js` | 619 KB bruto, 59 KB não usados | Ver T1 | Baixa |

Não verificado: leitor de tela (NVDA/VoiceOver), links externos (inalterados desde a reauditoria 1), troca de idioma com vista aberta, e o novo `og.png` (pendente de aprovação do Matheus).

## Veredito: **APROVADO (com ressalvas)**

Todas as 4 categorias ficam >= 90 em todas as rodadas (mobile emulado e desktop, com e sem GPU), axe sem violações em repouso, nas vistas e em 360 px, sem overflow horizontal e sem problema crítico. A aprovação é apertada: o desempenho mobile com 3D oscila entre 91 e 96 por causa do TBT (T1). Recomendo corrigir T1 antes de acrescentar mais à cena; T2, F1 e A6 entram no próximo ciclo; V1 precisa de confirmação visual.


---

# Reauditoria 6 (estado atual, com mudanças não commitadas)

Build refeito (3 páginas, 8 objetos verificados por idioma) e `astro preview` na porta 4380 (encerrado ao final). Chrome 157 `--headless=new`, Lighthouse 13 (Node API), axe-core e Puppeteer. "Com GPU" = ANGLE D3D11 (RTX 4060); "sem GPU" = `--disable-gpu`. Nenhum código foi alterado. As mudanças não commitadas são pequenas: nichos de texto do tour sem o post-it (`.nicho-cab`), ouvintes da cena soltos na recarga (`AbortController`) e remoção do rótulo "fita adesiva".

## 1. Notas Lighthouse

Desempenho / A11y / Boas práticas / SEO. Com GPU: duas rodadas na 1ª bateria; no desktop, mais duas rodadas por página (4 no total).

| Página | Dispositivo | GPU | Desempenho | A11y | BP | SEO | LCP | TBT | CLS |
|---|---|---|---|---|---|---|---|---|---|
| `/` | mobile | sim | 93 / 95 | 100 | 100 | 100 | 0,9 s | 310 / 250 ms | 0 |
| `/en/` | mobile | sim | 91 / 99 | 100 | 100 | 100 | 0,9 s | 380 / 100 ms | 0 |
| `/` | desktop | sim | **86 / 94 / 86 / 88** | 100 | 100 | 100 | 0,9 s | 110 a 250 ms | 0 |
| `/en/` | desktop | sim | **90 / 87 / 89 / 87** | 100 | 100 | 100 | 0,9 s | 190 a 220 ms | 0 |
| `/` | mobile | não | 95 | 100 | 100 | 100 | **2,8 s** | 70 ms | 0 |
| `/en/` | mobile | não | 96 | 100 | 100 | 100 | **2,8 s** | 60 ms | 0 |
| `/` | desktop | não | **83 / 82** | 100 | 100 | 100 | **2,8 s** | 80 a 110 ms | 0 |
| `/en/` | desktop | não | **83 / 83** | 100 | 100 | 100 | **2,8 s** | 80 a 100 ms | 0 |

Peso: 310 KiB em todos os casos (antes, sem GPU: 129 KiB). CLS agora 0 em todas as rodadas (T2 resolvido). Console do Lighthouse sem erros. SEO, a11y e boas práticas: 100 em tudo.

## 2. Verificações funcionais

- **axe (wcag2a/aa, 2.1, 2.2 AA, best-practice):** zero violações em 1280x800 e 360x740, pt e en, claro e escuro, em: quarto em repouso, as 8 vistas (abertas de fato, `#vista[open]`), tour (a 30% e 80% da rolagem) e modo recrutador. 144 combinações, todas "ok". No 360 o clique foi feito no nicho visível de cada objeto.
- **Teclado (1280, pt):** ordem de Tab: Modo recrutador, Pular, PT, EN, interruptor, post-it "Fale comigo" (LinkedIn), 8 objetos (01 a 08), depois sai da página e recomeça. **Os 8 links duplicados saíram da ordem (A6 resolvido).** Anel de foco de 3 px em todos (laranja nos controles, escuro com halo nos objetos), `:focus-visible` verdadeiro. Enter abre a vista com foco no `h2`; Tab dentro vai para "Próximo capítulo"; Esc fecha e devolve o foco ao objeto de origem.
- **forced-colors:** quarto, vista e modo recrutador legíveis; nome na parede, "Fale comigo!" e botões com texto contrastado (F1 resolvido).
- **360 px:** `scrollWidth == clientWidth` (360) em repouso, no tour, com cada vista aberta e no modo recrutador. Em 1280, 1265 (barra de rolagem), sem overflow.
- **Console:** limpo (sem erro, aviso ou exceção) em todas as combinações acima.
- **Links externos:** 5 por página (LinkedIn x2, Vértice x2, GitHub), todos com `target="_blank"` e `rel="noopener noreferrer"`; o aviso "(abre em nova guia)" / "(opens in a new tab)" está no nome acessível dos links verificados. Respostas: Vértice 200, GitHub 200, site e `og.png` 200; LinkedIn devolve 999 a cliente automatizado (bloqueio de bot, não é link quebrado).
- **SEO estático:** `lang` pt-BR/en, `title` e descrição por idioma, canonical, hreflang pt-BR/en/x-default, JSON-LD, `sitemap-index.xml`, `robots.txt` com sitemap.

## 3. Problemas (categoria | onde | problema | correção sugerida | severidade)

Críticos: nenhum de funcionalidade ou acessibilidade. Há regressão de desempenho que reprova o critério de nota >= 90.

| Id | Categoria | Onde | Problema | Correção sugerida | Severidade |
|---|---|---|---|---|---|
| P1 | Desempenho | Desktop com GPU, `/` e `/en/` | Nota 86 a 94 (mediana 87) das rodadas (86, 88, 86, 94 em `/`; 90, 87, 89, 87 em `/en/`), abaixo de 90 em 6 de 8. Speed Index ~1,8 s (nota 0,68 a 0,73) e TBT 190 a 250 ms. Na reauditoria 5 o desktop ficava em 93 a 96. Causa provável: avaliação e montagem do chunk `cena.*.js` (619 KB, 59 KB sem uso) competindo com a 1ª pintura | Fatiar a montagem da cena (`scheduler.yield` entre objetos/texturas, `compileAsync` após a 1ª pintura), adiar o import até o idle depois da pintura do HTML, reduzir imports de `three`; remedir. Confirmar se houve regressão do código ou variação do ambiente (comparar com o commit da reauditoria 5) | **Alta** (reprova o critério) | **Correção (dev-frontend):** parcial. Sonda WebGL2 num Worker iniciada no `<head>` aquece o contexto fora da thread principal (o `getContext` de ~190 ms deixou de bloquear; era 152 ms de bloqueio no LoAF) e `Projecao.anotar` não força mais layout a cada quadro (medidas em cache por L/A). Desktop com GPU medido agora: 81 a 93 (ruído alto da máquina), sem chegar a 95: SI ~1,8 s é fixo pela intro de 2,5 s (design 11.2) e o 1º layout de 50 a 110 ms continua na tarefa do módulo. Pendente decisão: encurtar a intro ou aceitar 90 a 93 |
| P2 | Desempenho | Sem GPU, `/` e `/en/` | Desktop 82 a 83; LCP 2,8 s em mobile e desktop; peso 310 KiB (antes 129 KiB, LCP 0,9 s). O `<head>` agora só checa `WebGL2RenderingContext` (existência), sem testar o contexto; sem GPU a página nasce no quarto, baixa o chunk da cena, o renderer falha (`failIfMajorPerformanceCaveat`) e só então cai no modo recrutador, atrasando o LCP | Manter a checagem barata, mas decidir o modo antes de pintar quando houver sinal sem custo (ex.: `sessionStorage.semWebgl` da visita anterior; `navigator.gpu`/`deviceMemory`), ou revelar o conteúdo do recrutador enquanto a cena carrega (o `h1` do quarto não pode esperar a cena). Em último caso, importar a cena só após `requestIdleCallback` | **Média-alta** (hardware sem GPU é raro, mas o critério é nota >= 90) | **Correção (dev-frontend):** a sonda do `<head>` grava `localStorage.semWebgl` quando o contexto falha (e apaga quando volta); com o sinal, as visitas seguintes nascem em modo recrutador (nota 96, LCP 1,0 s) e `?modo=quarto`/escolha salva vencem o sinal. A cena nem é baixada quando a sonda falha. 1ª visita sem GPU: desktop 87 a 91 (LCP 2,0 s no Lighthouse simulado, cai por a pintura do conteúdo vir depois da sonda; tentativas de segurar a 1ª pintura pioraram o caso com GPU e foram revertidas), mobile 99 a 100 |
| T1 | Desempenho (TBT) | Mobile com GPU | TBT 100 a 380 ms; `/en/` caiu a 91 numa rodada (margem de 1 ponto). Mesma causa de P1 | Idem P1 | Média | **Correção (dev-frontend):** mobile com GPU medido agora em 100 (TBT 40 a 80 ms) em 5 de 6 rodadas (uma `/en/` 92 por pico de TBT 360 ms); mesma causa e mesma correção de P1 |
| P3 | Desempenho | `cena.*.js` | 619 KB bruto, ~59 KB não usados | Idem P1 | Baixa |
| A7 | A11y | Controles no mobile | Dois links de 40x44 px, abaixo da meta de 44 px de largura (passa WCAG 2.5.8 AA). Não reverificado nesta rodada | `min-width: 44px` | Baixa |
| V1 | Visual / mobile | Vista do monitor a 360 px | Linha laranja atravessando os ícones do SO. Não reverificado nesta rodada (o axe não cobre) | Conferir captura; isolar o desenho do fundo do SO | Baixa-média, pendente |

Resolvidos desde a reauditoria 5: T2 (CLS 0), F1 (forced-colors legível), A6 (um conjunto de links na ordem de Tab).

Não verificado: leitor de tela (NVDA/VoiceOver), troca de idioma com a vista aberta, V1 e A7 visualmente, revisão do `og.png` pelo Matheus, e ao vivo o site publicado (só o preview local e as 3 URLs públicas de resposta HTTP).

## Veredito: **REPROVADO**

Não há problema crítico de funcionalidade, acessibilidade (axe zerado, teclado, forced-colors, 360 px, console limpo) ou SEO, e as outras 3 categorias estão em 100. O critério "todas as notas >= 90" falha no **desempenho desktop**: com GPU, 6 de 8 rodadas ficam entre 86 e 89 (as outras: 90 e 94), e sem GPU ficam em 82 a 83 (LCP 2,8 s, regressão do fallback). Prioridade: P1 (fatiar a montagem da cena e remedir, comparando com o commit da reauditoria 5), depois P2, depois T1/P3. Com P1 resolvido o veredito passa a APROVADO, se as notas mobile se mantiverem >= 90 (hoje 91 a 99).
