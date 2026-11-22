# Crítica Impeccable — portfólio (quarto 3D + vistas + modo recrutador)

> ⚠️ DEGRADED: single-context (delegated read-only run). Avaliação A (revisão de design) e B (detector + shots) feitas no mesmo contexto; sem overlay ao vivo; sem snapshot persistido. Questions skipped: delegated run.

Data: 2026-11-21 · Alvo: `src/` + http://localhost:4321 (pt) · Modos: Experience (quarto), Read (vistas/recrutador)
Evidências: shots em `scratchpad/shots/` (1440×900, 1366×657 dia/noite/hover, 390×844). WebGL renderizou no Chrome headless (quarto dia e noite visíveis); no shot direto a 1440 o carregador SQL ainda cobria a cena.

## Pontuação (Nielsen, 0–4)

| # | Heurística | Nota | Nota curta |
|---|---|---|---|
| 1 | Visibilidade do estado | 3 | Hover com rótulo e luz; progresso do tour existe, mas some atrás do cartão no celular |
| 2 | Correspondência com o mundo real | 4 | Metáfora do quarto coerente (mural = experiência, caderno = projetos, envelope = contato) |
| 3 | Controle e liberdade | 3 | "Voltar ao quarto", anterior/próximo e "Pular" presentes |
| 4 | Consistência e padrões | 2 | Cada vista tem moldura própria (bom), mas cabeçalho/rodapé mudam de densidade e há rótulos numerados em mono |
| 5 | Prevenção de erros | n/a | Sem formulários |
| 6 | Reconhecer em vez de lembrar | 3 | Rótulo só no hover; no toque não há rótulo prévio |
| 7 | Flexibilidade e eficiência | 4 | Modo recrutador + tour + navegação direta por hash |
| 8 | Estética e minimalismo | 3 | Quarto forte; vistas de leitura com áreas vazias e corte de conteúdo |
| 9 | Recuperação de erros | 3 | Há fallback sem WebGL |
| 10 | Ajuda e documentação | 3 | "comece aqui" e "role para um tour" orientam bem |
| | **Total** | **31/36** | Bom; os problemas estão nas vistas de leitura e no celular |

Especificidade do design: **alta** — o quarto (Vértice no monitor, mural de cortiça, estante, envelope na porta) é dele e não serviria para outro produto. É o principal ativo.
Carga cognitiva: 2 falhas (cabeçalhos de vista com 4–5 elementos competindo; mural em grade densa) — moderada.

Pontos fortes: (1) modo noite com luminária e varal de luzes é o pico emocional; (2) "comece aqui" com seta manuscrita resolve a descoberta; (3) modo recrutador garante leitura em 30 s.

## Melhorias priorizadas

### P0
1. **Conteúdo cortado no mural (Experiência)** — 1440×900 os cartões de Salesforce e Cushman & Wakefield são cortados pela moldura sem sinal de rolagem; no 390×844 o cartão da KPMG é cortado no meio do 1º bullet. Evidência: `shots/experienciax/1440x900.png`, `390x844.png`. Proposta: indicar a rolagem (sombra/fade na borda inferior da `.vista-miolo` + barra de rolagem temada) ou, no desktop, deixar a moldura crescer até `100dvh - cabeçalho` e no celular empilhar cartões com altura natural. Esforço: S.
2. **Elemento do tour vazando por cima da vista de Contato** — pílula "3D…" com barra de progresso aparece sobre o canto do envelope (≈x775,y770) e a barra de ícones inferior fica cortada na borda (y≈890) em todas as vistas. Evidência: `shots/contatox/1440x900.png`, `experienciax/1440x900.png`. Proposta: ocultar o HUD do tour e a dock inferior quando `#vista` estiver aberta (`inert` + `hidden`), ou subir o z-index da vista. Esforço: S.
3. **Celular: nome sobreposto pela barra de progresso e quarto minúsculo** — no 390×844 a barra laranja do tour atravessa "Nagano", e o quarto ocupa ~25% da tela com ~400px de vazio. Evidência: `shots/x/390x844.png`. Proposta: mover a barra de progresso para fora do cartão do nome; enquadrar a câmera geral no retrato com `margem`/`fov` próprios (`src/config/quarto.ts` → `geral`) para o quarto preencher a largura. Esforço: M.

### P1
4. **Contato: envelope com ~60% de área vazia** — depois da assinatura "Matheus" sobra um bloco bege de ~500px. Evidência: `shots/contatox/1440x900.png`. Proposta: altura do envelope pelo conteúdo (`block-size: auto`, centralizado), ou usar o espaço para o resumo "o que procuro" já existente em `perfil.json`. Esforço: S.
5. **Rótulos numerados em mono acima do título ("03 · O mural")** — kicker + número de seção é um padrão a evitar; repete-se em todas as vistas e nos botões "← 02 Sobre mim". Evidência: cabeçalho em `experienciax/1440x900.png`. Proposta: título sozinho ("Experiência"), e nos botões só o nome do destino; o número já vive no marcador do quarto. Esforço: S.
6. **Hierarquia do mural invertida** — cargo (Audit Associate) e datas vêm antes da empresa; a empresa (KPMG) aparece só na 3ª linha. Recrutador escaneia por empresa. Evidência: `experienciax/1440x900.png`. Proposta: Empresa → cargos com datas → área/local → bullets. Esforço: S.
7. **Carregador SQL bloqueando a primeira impressão** — a 1440 o terminal ainda cobre a cena quando a página já é interativa; o nome no fundo fica ilegível atrás. Evidência: `shots/x/1440x900.png`. Proposta: limitar a ~1,2 s e não exibir em visitas repetidas (sessionStorage, com try/catch) e com `prefers-reduced-motion`. Esforço: S.
8. **Rótulo de hover pequeno demais e só em hover** — "Projeto Vértice" ≈12px; no toque não há equivalente. Evidência: `1366-dia-hover-monitor.png`. Proposta: rótulo ≥14px; em `(hover: none)` mostrar o rótulo do objeto em foco no primeiro toque (segundo toque abre). Esforço: M.
9. **Post-it "Fale comigo!" ilegível no quarto** — texto ≈8px na parede (1366). Evidência: `1366-noite-repouso.png`. Proposta: aumentar a textura do post-it ou reforçar o CTA no HUD (já existe no celular). Esforço: S.

### P2
10. **Faixas de borda grossas nas molduras (caixa/tecido)** — detector aponta `border-accent-on-rounded` em `src/styles/vistas.css:298`, `:320`, `:328`. São intencionais (tampa da caixa, lenço), mas o canto arredondado da moldura briga com a faixa reta. Proposta: zerar `border-radius` no topo dessas molduras ou desenhar a tampa como elemento separado. Esforço: S.
11. **Linhas viúvas nos cartões do tour** — "evolução.", "LangChain.", "LinkedIn." sozinhos na última linha (detector, 390×844, `li.passo:nth-of-type(6/7/9) .cartao-texto`). Proposta: `text-wrap: pretty` em `.cartao-texto`. Esforço: S.
12. **Superfícies do navegador sem tema** — barra de rolagem padrão visível na direita (1366) e no miolo das vistas; seleção de texto padrão. Proposta: `scrollbar-color` e `::selection` a partir dos tokens em `src/styles/tokens.css`. Esforço: S.
13. **Interruptor de luz pouco legível como controle** — quadrado branco sem ícone ao lado do texto; no celular só o quadrado, sem rótulo visível. Evidência: `x/390x844.png`. Proposta: ícone de lâmpada/interruptor desenhado em SVG e `aria-label` mantido; manter rótulo visível ≥ 768px. Esforço: S.

## Notas da execução
- Detector: `detect --json src` → 3 avisos (vistas.css); `detect --json http://localhost:4321/ --viewport 390x844` → 3 advisories (stragglers). Vazio ≠ limpo: o detector não julga layout.
- Não capturados individualmente nesta rodada: vistas #sobre, #habilidades, #formacao, #alem, modo recrutador aberto e /en/. A crítica dessas vem da leitura de `src/styles/vistas.css`; vale um shot antes de implementar.
- Nenhum código alterado; servidor de desenvolvimento não foi parado.

## Complemento (2ª rodada)

Shots em `scratchpad/c2/` (1440×900 e 390×844): vistas #sobre, #habilidades, #formacao, #alem; modo recrutador (`?modo=recrutador`, viewport e página inteira); /en/ (quarto, #experiencia, #habilidades, recrutador). Detector em `/en/?modo=recrutador` a 390×844: 12 linhas com palavra sozinha no fim ("Code.", "LangChain", "2027", "including:"…).
**Limitação:** só o tema escuro foi capturado. O tema vem de `localStorage`/prefers-color-scheme (`src/layouts/BaseLayout.astro:54-57`) e o `shot` não alterna isso; o tema claro das vistas e do recrutador **não foi verificado**.

### Mudanças de prioridade
- **#2 (HUD do tour e dock vazando) continua P0 e ficou mais grave:** aparece em todas as vistas (pílula "Monta…"/"3D…" e dock cortada) **e também no modo recrutador**, onde a dock cobre texto (`c2/rec/1440x900.png`, `c2/enrec/1440x900.png`).
- **#11 (palavras sozinhas no fim da linha) sobe para P1:** em inglês aparecem 12 casos.
- **#1 (conteúdo cortado sem rolagem visível)** se repete em Sobre, Além, Formação e Habilidades: a correção precisa ser na `.vista-miolo` compartilhada, não só no mural.

### P0
14. **A vista Sobre abre rolada no meio do texto** — o topo mostra a metade de uma frase ("…com Claude Code.") e o nome e o início do resumo ficam escondidos. Evidência: `c2/sobre/1440x900.png`. Proposta: zerar `scrollTop` da `.vista-miolo` ao abrir (provável restauração de foco/âncora rolando o contêiner; usar `focus({preventScroll:true})`). Esforço: S.

### P1
15. **Fatos repetidos na ficha (Sobre e recrutador)** — "Inglês avançado" aparece em Idiomas e de novo na lista ◆; "Pós Tech" em Estudando e em ◆; Status repete o "Aberto a oportunidades" do Contato. São seis linhas para três fatos, o que pesa no escaneamento de 30 s. Evidência: `c2/rec/390x844.png`, `c2/sobre/1440x900.png`. Proposta: manter só a tabela (Local, Idiomas, Estudando, Status) e tirar a lista ◆, ou o contrário. Esforço: S.
16. **Cabeçalho do recrutador muda de forma conforme o idioma** — em PT a nav fica numa 2ª linha à esquerda com o idioma e a luz à direita; em EN a nav sobe para a 1ª linha e idioma e luz descem sozinhos. No celular, PT/EN e o interruptor quebram para uma 2ª linha sem rótulo. Evidência: `c2/rec/1440x900.png` × `c2/enrec/1440x900.png`, `c2/rec/390x844.png`. Proposta: grade fixa do cabeçalho (marca e controles na linha 1, nav na linha 2 em qualquer idioma); no celular, levar idioma e luz para dentro do Menu. Esforço: M.
17. **Barra lateral de destaque nos cartões da Formação** — faixa verde à esquerda em cartão arredondado (padrão a evitar). Evidência: `c2/form/390x844.png`. Proposta: borda completa ou fundo tingido por área. Esforço: S.
18. **Além do trabalho: cartões de mesma altura com vazio** — o card Escotismo tem cerca de 300px vazios ao lado de Games; o Vôlei fica cortado embaixo. Evidência: `c2/alem/1440x900.png`. Proposta: `align-items: start` (ou layout em coluna/masonry), com o Vôlei ao lado do Escotismo. Esforço: S.
19. **Quarto no celular em EN aparece com paredes recortadas** — paredes e teto aparecem cortados e o quarto, pequeno no topo (pode ser frame da animação de entrada ou clipping do plano próximo). Evidência: `c2/en/390x844.png`. Proposta: verificar `near`/margem da câmera geral no retrato junto com o item 3. Esforço: M.

### P2
20. **Habilidades: o painel não usa a altura toda e a legenda flutua** — o quadrado verde "= usado em contexto real" é solto; a caixa começa colada no topo à direita. Evidência: `c2/hab/1440x900.png`. Proposta: legenda inline com o próprio chip de exemplo ("Excel | KPMG = usado em contexto real"). Esforço: S.
21. **Kicker mono "Em transição para IA" / "Moving into AI" acima do resumo** — reforça o item 5. Proposta: trazer a frase para dentro do parágrafo do resumo. Esforço: S.
22. **Link de pular "Ir para Certificações" com estilo de botão laranja** na Formação, no celular — é o primeiro elemento e compete com o título. Evidência: `c2/form/390x844.png`. Proposta: estilo discreto ou visível só no foco. Esforço: S.

Textos em EN: não houve estouro horizontal nas telas capturadas; os títulos longos ("06 Education and certifications") cabem a 1440. O problema em EN é a quebra ruim (itens 11 e 16).
