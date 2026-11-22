# Design: portfólio de Matheus Maki Nagano, versão "O quarto" (ilustração flat explorável)

Fase 3c, 3ª versão (revisão 4) · Entradas: `content/fonte/decisao-gamificacao.md` (seções "Mudança de direção" e "Decisões do quarto"), `content/fonte/hobbies.md` (incluindo "acenos de fã"), `docs/estrategia.md` (§5, §6 e §8), `content/perfil.json`, `content/fonte/respostas-fase2.md`, `CLAUDE.md`.
Esta versão **substitui** o "caderno de campo" e a "Trilha do Vértice". Os textos dos wireframes são **ilustrativos**. O texto final vem de `content/textos.pt.json` / `content/textos.en.json` (chaves no formato `{secao.campo}`; as novas estão em 10.2).

### Decisões do Matheus que este documento cumpre

| Decisão | Onde está |
|---|---|
| Um quarto ilustrado em SVG flat, com objetos clicáveis; cada objeto é um capítulo | 1, 4.2 |
| Narrativa livre, com dica sutil de ordem | 1.3, 5.3, 6 |
| Abre na experiência interativa; o botão "Modo recrutador" fica visível e é o 1º elemento focável | 1.4, 5.2 |
| Níveis sem números inventados | 4.5 (Habilidades), 5.9 |
| Rótulo temático sempre com o nome comum ("O mural · Experiência") | 1.2, 5.1 |
| **Sobre = porta-retrato na mesa** (silhueta, sem foto real); a janela vira decoração e é o que muda no modo noite | 1.2, 4.2, 5.7 |
| **Zoom ao clicar**: a câmera aproxima animando o `viewBox` (~400 ms, ease-out); corte direto em reduced motion; volta com Esc, "Voltar" ou o voltar do navegador | 4.4, 5.6, 7, 8 |
| **Vistas "dentro do objeto" só no monitor, no mural e na estante**; os demais objetos abrem um painel estilizado | 4.4, 4.5 |
| O texto é sempre HTML real sobre a moldura do desenho, AA e legível em 360 px | 3.4, 4.4 |
| Cada objeto é um componente; posição, destino e vista ficam num único arquivo de configuração | 9.2 |
| Hobbies como "acenos de fã" | 4.2a, 9.1 |
| **Referência externa** (`docs/referencias/raomuhammadhamza.md`), usada como inspiração e não como cópia: marcadores flutuantes, intro temática, menu numerado em pílula com o nome grande sobre a cena, e 2D com profundidade | **11** (revisão 5) e ajustes em 4.1, 4.2, 5.3 e 9 |
| **Revisão 6:** quarto em tela cheia com HUD translúcido; arte em **imagem raster** com áreas clicáveis em HTML; **só 8 objetos clicáveis**; o resumo passa para o porta-retrato | **12**, que **prevalece** sobre as seções 4.1–4.3, 6, 9.1 (desenho SVG), 9.2 (unidades), 9.4, 11.1, 11.3, 11.4 e 11.5 onde houver conflito. Prompt da imagem em `docs/prompt-imagem-quarto.md` |
| **Revisão 6b/6c** (2ª e 3ª referências): monitor como "SO", tour guiado pela rolagem que termina no monitor, nome na parede, post-its como menu, anotações à mão, interruptor dia/noite e cena mais densa | **12.13**, que prevalece sobre 11.1, 11.4, 12.1 (HUD), 12.6 e 12.8 |
| **Revisão 7:** quarto **3D real em Three.js**, modelado em código (low-poly com cantos arredondados), voo de câmera que enquadra o objeto inteiro, luz do sol de dia e luminária à noite; sai a arte raster | **13**, que prevalece sobre 12.2–12.6, 12.9, 12.13.7, 12.13.8 e as tarefas 1, 6, 7, 8 e 11 de 12.11 |

A metáfora é a **embalagem**, não o conteúdo. Se um objeto exigir um fato que não está em `perfil.json`, o objeto sai. O Vértice nunca aparece como "concluído", "em produção", "no ar" ou "com usuários".

---

## 1. Conceito

### 1.1 A ideia

**"O quarto onde a linha muda de direção."** O site abre no quarto de trabalho do Matheus, desenhado em ilustração flat e visto de frente, como um diorama. Um **varal de luzinhas** atravessa a parede da esquerda para a direita, e cada capítulo tem uma etiqueta numerada. Clicar num objeto faz a **câmera se aproximar** dele. No monitor, no mural e na estante, o conteúdo aparece **dentro** do objeto: um site aberto na tela, papéis com tachinha, livros na prateleira. Nos outros objetos, aparece um painel com a cara do objeto. Na tela do monitor, em repouso, um gráfico de linha da carreira **dobra para cima em 2026**: é o Vértice. Apagar a luz é o tema escuro: a janela mostra a noite, e o quarto fica iluminado pelo monitor e pelas luzinhas dos capítulos já lidos.

Inspirações (sutis, sem nada literal):
- **Dados/BI:** o gráfico de linha no monitor; etiquetas em mono com número e nome.
- **Escotismo:** o lenço no gancho da porta (genérico, sem símbolo oficial).
- **Games, vôlei e Homem-Aranha, como "acenos de fã":** pôster vermelho e azul com teia geométrica, vaso com plantinhas verde e vermelha, lombadas com os nomes dos jogos na fonte do site, mousepad vermelho-coral, bola de vôlei, headset e controle genéricos. Logos, personagens, máscaras, arte oficial, armas e mira continuam proibidos (9.1).
- **IA:** está na direção da linha, não em ícones de robô ou cérebro.

### 1.2 Objetos, capítulos e vistas

| Cap. | Objeto (`id` na config) | Destino (`#id`) | Vista | Rótulo temático · comum (pt) | (en) |
|---|---|---|---|---|---|
| — | Cartão ao lado do quarto (não é objeto) | `ficha` | — | **Resumo** | **Summary** |
| **01** | Monitor (`monitor`) | `vertice` | **dentro**: site aberto na tela | **O monitor · Projeto Vértice** | **The monitor · Vértice project** |
| **02** | Porta-retrato na mesa (`porta-retrato`) | `sobre` | painel "porta-retrato" | **O porta-retrato · Sobre mim** | **The photo frame · About me** |
| **03** | Mural de cortiça (`mural`) | `experiencia` | **dentro**: papéis com tachinha | **O mural · Experiência** | **The corkboard · Experience** |
| **04** | Caderno (`caderno`) | `projetos` | painel "página de caderno" | **O caderno · Outros projetos** | **The notebook · Other projects** |
| **05** | Caixa de ferramentas (`caixa`) | `habilidades` | painel "bandeja da caixa" | **A caixa de ferramentas · Habilidades** | **The toolbox · Skills** |
| **06** | Estante (`estante`) | `formacao` | **dentro**: livros nas prateleiras | **A estante · Formação e certificações** | **The bookshelf · Education & certifications** |
| 06 | Quadros (`quadros`, secundário) | `certificacoes` | a mesma da estante, rolada até a prateleira de certificações | **Os quadros · Certificações** | **The frames · Certifications** |
| **07** | Lenço escoteiro (`lenco`) | `alem` | painel "tecido" | **O lenço · Além do trabalho** | **The neckerchief · Beyond work** |
| 07 | Bola e joelheiras de vôlei (`bola`, secundário) | `alem-volei` | painel "tecido", rolado | **A bola · Vôlei** | **The ball · Volleyball** |
| 07 | Headset (`headset`, secundário) | `alem-games` | painel "tecido", rolado | **O headset · Games e a origem do Vértice** | **The headset · Games and how Vértice began** |
| 07 | Estojos de jogos (`estojos`, secundário) | `alem-games` | painel "tecido", rolado | **Os estojos · Games e a origem do Vértice** | **The game cases · Games and how Vértice began** |
| **08** | Envelope na porta (`envelope`) | `contato` | painel "papel de carta" | **A correspondência · Contato** | **The mail · Contact** |

- **Decorativos (não clicáveis):** janela, pôster, vaso, mesa, mesinha, cadeira, tapete, luminária, interruptor, mouse e mousepad. A **janela** é o principal elemento do modo noite (5.7).
- **Secundários** abrem a vista do capítulo deles, já rolada até a própria âncora. Eles têm etiqueta com o número do capítulo, mas não lâmpada própria no varal. Com isso, continuam existindo 8 capítulos, que correspondem às 8 seções da estratégia, sem conteúdo duplicado.
- **Porta-retrato:** mostra uma **silhueta ilustrada genérica** (busto em uma cor, sem rosto), nunca foto. Se o Matheus enviar uma foto no futuro, ela só entra com aprovação dele e substitui a silhueta só na vista, não no quarto.

### 1.3 A ordem dos capítulos

A ordem é a do mapa de seções da estratégia (§5): **01 Vértice → 02 Sobre → 03 Experiência → 04 Projetos → 05 Habilidades → 06 Formação → 07 Além do trabalho → 08 Contato**. Ela começa pelo que ele está construindo agora e depois volta à origem. É a mesma ordem do DOM, do `Tab` e do modo recrutador.

A composição faz **a ordem correr da esquerda para a direita**: monitor e porta-retrato na mesa à esquerda, mural e caderno no centro, caixa e estante à direita, lenço e envelope na porta. A dica de ordem tem três camadas, todas sutis:
1. **Varal de luzinhas** da esquerda para a direita, com uma lâmpada sobre cada capítulo.
2. **Etiquetas numeradas** ("01 · Projeto Vértice") nos objetos.
3. **"Próximo sugerido":** a etiqueta do primeiro capítulo não lido ganha um ponto `--accent` e um anel que pulsa 2 vezes e para. No início, é o 01.

Nada fica bloqueado: qualquer objeto abre a qualquer momento.

### 1.4 Como o site abre

1. Um **script inline no `<head>`** (≤ 1 KB) roda antes da primeira pintura. Ele aplica o tema salvo, adiciona a classe `js` e define `<html data-modo="quarto">`, exceto quando há `?modo=recrutador` na URL ou o visitante escolheu o modo recrutador antes (`localStorage`). Assim, o layout não pisca e não há CLS.
2. **Sem JS**, o atributo não é definido e o site aparece no **modo recrutador**. É também o que buscadores, impressão e leitores de tela sem JS recebem.
3. O **1º elemento focável** é o botão de modo: "Modo recrutador" no quarto e "Explorar o quarto" no modo recrutador. Fica sempre à esquerda do cabeçalho e é visível em 360 px.
4. **Não há tela de abertura.** O resumo (nome, Dados → IA, status, provas e LinkedIn) aparece em texto já no 1º frame.
5. **Link direto** (`/#exp-kpmg`): o quarto abre **já aproximado** no mural (sem animação), rolado até o papel da KPMG.

---

## 2. Tokens

### 2.1 Cores

As **cores de interface** são as já verificadas nas versões anteriores. As novas são o **"papel"**, uma ilha clara usada dentro das vistas, verificada em 3.4, e as cores da ilustração e dos acenos, que são decorativas e nunca levam texto (exceto as lombadas; veja 3.4). O tema segue `prefers-color-scheme`, e a escolha manual tem prioridade (5.7).

**Interface e texto**

| Token | Claro (luz acesa) | Escuro (luz apagada) | Uso |
|---|---|---|---|
| `--bg` | `#F6F4EE` | `#12141A` | Fundo da página e do modo recrutador |
| `--surface` | `#FFFFFF` | `#1B1E26` | Cabeçalho, resumo, barra da vista, painéis, etiquetas, "site" no monitor |
| `--surface-2` | `#ECE8DD` | `#252933` | Legenda do quarto, chips, compartimentos da caixa |
| `--text` | `#15171C` | `#ECE8DF` | Texto principal, contorno das etiquetas, botão de modo |
| `--text-muted` | `#4F545C` | `#A3A6AE` | Rótulo temático, datas, número da etiqueta |
| `--accent` | `#B8400F` | `#FF8A4C` | CTA primário, links, "→ IA", linha do monitor após 2026, ponto "próximo sugerido" |
| `--accent-strong` | `#9A3409` | `#FFA470` | Hover/ativo do CTA |
| `--accent-tint` | `#F7E6DC` | `#3A2218` | Fundo do selo "Em transição para IA" |
| `--on-accent` | `#FFFFFF` | `#12141A` | Texto sobre `--accent` / `--accent-strong` |
| `--pine` | `#1E6B5A` | `#5CC2A4` | Estado: "Em desenvolvimento", "Em andamento", "Aberto a oportunidades", "usado em contexto real", ✓ de lido |
| `--pine-tint` | `#E2EEE9` | `#17312B` | Fundo dos selos de estado |
| `--border` | `#D6D2C6` | `#2E3240` | Divisórias decorativas |
| `--border-strong` | `#8A8476` | `#6B6F7A` | Contorno de controles secundários e chips |
| `--focus` | `#B8400F` | `#FF8A4C` | Anel de foco fora da ilustração |
| `--badge-progress-fg` | `#9A3409` | `#FF8A4C` | Texto do selo "Em transição para IA" |
| `--link` | = `--accent` | = `--accent` | Links de texto (redefinido dentro do papel) |

**Papel** (ilha clara: papéis do mural, lombadas dos livros, página do caderno, carta, cartão do porta-retrato). Dentro de `.papel`, os tokens de interface assumem os valores do **tema claro**, com estas trocas:

| Token | Luz acesa | Luz apagada | Uso |
|---|---|---|---|
| `--paper-bg` | `#FFFDF7` | `#CFCABD` (papel sob pouca luz) | Fundo do papel |
| `--paper-text` | `#15171C` | `#15171C` | Texto |
| `--paper-muted` | `#4F545C` | `#4F545C` | Datas, emissor, metadados (≥ 14 px) |
| `--link` (no papel) | `#8A2E07` | `#8A2E07` | Links no papel |
| `--accent` / `--on-accent` / `--focus` (no papel) | `#B8400F` / `#FFFFFF` / `#B8400F` | iguais | CTA e foco sobre o papel |

**Foco sobre a ilustração** (iguais nos dois temas; ver 3.3): `--ring-in: #FFFFFF` (2 px) e `--ring-out: #15171C` (3 px).

**Ilustração** (decorativa)

| Token | Dia | Noite | Onde |
|---|---|---|---|
| `--room-wall` | `#EFE9DC` | `#1E2230` | Parede |
| `--room-wall-shade` | `#E2DACA` | `#191C28` | Rodapé e sombras chapadas |
| `--room-floor` | `#C9B79A` | `#2A2622` | Chão |
| `--room-wood` | `#A9774E` | `#4E3A2B` | Mesa, estante, porta, moldura do porta-retrato |
| `--room-wood-dark` | `#7C5536` | `#3A2B20` | Bordas e sombras da madeira |
| `--room-metal` | `#2B2F38` | `#0E1015` | Monitor, luminária, headset, caixa, silhueta do porta-retrato |
| `--room-screen` | `#F2F6F4` | `#10241F` | Tela do monitor em repouso (à noite, é a fonte de luz) |
| `--room-cork` | `#C89B63` | `#5A4430` | Mural |
| `--room-paper` | `#FFFDF7` | `#CFCABD` | Papéis desenhados (= `--paper-bg`) |
| `--room-fabric` | `#6F8F86` | `#2E4640` | Cortina, tapete, lenço, fundo do porta-retrato |
| `--room-sky` | `#BFDDE8` | `#0B1430` | Céu da janela |
| `--room-city` | `#9FB3BF` | `#1A2440` | Prédios genéricos da janela |
| `--room-moon` | — | `#F2E8C9` | Lua (só à noite) |
| `--bulb-off` | `#D6D2C6` | `#3A3D48` | Lâmpada de capítulo não lido |
| `--bulb-on` | `#F2B84B` | `#FFD27A` | Lâmpada de capítulo lido; janelas acesas da cidade; tachinhas |
| `--glow` | — | `rgba(255,210,122,.18)` | Halo chapado (forma sólida, sem blur) |
| `--fan-red` / `--fan-blue` | `#C8352E` / `#2D4F8E` | `#7A2420` / `#1C2F57` | Pôster |
| `--fan-coral` | `#FF5F57` | `#9A3D38` | Mousepad |
| `--fan-herb-green` / `--fan-herb-red` | `#4F8A3C` / `#C2413A` | `#2F5426` / `#74271F` | Vaso |

Regras:
- **Uma cor de ação.** `--accent` aparece na ilustração **só** no trecho da linha do monitor depois de 2026 e no ponto "próximo sugerido". Não há gradiente, neon nem roxo de "IA genérica". As cores `--fan-*` são decorativas e nunca entram na interface.
- `--pine` indica estado, nunca ação. **Cor nunca é o único sinal:** todo selo tem texto, e toda etiqueta tem número e nome.

### 2.2 Tipografia

Três famílias gratuitas (SIL OFL), **auto-hospedadas** em woff2 (via `@fontsource` ou download do Google Fonts). Nenhuma requisição a terceiros.

| Papel | Fonte | Pesos | Uso |
|---|---|---|---|
| Títulos | **Bricolage Grotesque** (variável) | 600, 800 | Nome, h2, títulos das vistas, "Vértice" no site do monitor |
| Texto | **Atkinson Hyperlegible Next** | 400, 700 | Parágrafos, botões, papéis, livros |
| Rótulos e dados | **Atkinson Hyperlegible Mono** | 400, 500 | Etiquetas, datas, chips, selos, lombadas dos estojos, barra de endereço do monitor |

- Fallbacks: `ui-sans-serif, system-ui, "Segoe UI", Roboto, sans-serif` e `ui-monospace, "Cascadia Mono", Consolas, monospace`. Se a versão "Next" não estiver disponível no pacote, use **Atkinson Hyperlegible** (original).
- `font-display: swap` com `@font-face` de fallback ajustado (`size-adjust`, `ascent-override`). `preload` só de Atkinson 400 e Bricolage 800. Subsets `latin` + `latin-ext`, total ≤ 110 KB.
- **Setas:** `→` e `↗` podem faltar nos subsets. Use SVG inline com `aria-hidden` e texto oculto: `Dados <svg/><span class="sr-only">para</span> IA`.

| Token | Valor | Uso | Altura de linha | Fonte |
|---|---|---|---|---|
| `--fs-display` | `clamp(2rem, 1.5rem + 2.4vw, 3rem)` (32→48px) | Nome no resumo | 1.05 | Bricolage 800, `-0.02em` |
| `--fs-h2` | `clamp(1.5rem, 1.3rem + 1vw, 2.125rem)` (24→34px) | Título de seção e da vista | 1.15 | Bricolage 700 |
| `--fs-h3` | `clamp(1.125rem, 1.05rem + .4vw, 1.375rem)` (18→22px) | Empresa, título de card ou livro | 1.25 | Bricolage 600 |
| `--fs-lead` | `clamp(1.0625rem, 1rem + .3vw, 1.25rem)` (17→20px) | Frase do resumo, 1º parágrafo, legenda | 1.45 | Atkinson 400 |
| `--fs-body` | `clamp(1rem, .97rem + .15vw, 1.0625rem)` (16→17px) | Texto corrido, **mínimo dentro de qualquer vista** | 1.6 | Atkinson 400 |
| `--fs-small` | 14px | Rodapé, notas | 1.5 | Atkinson 400 |
| `--fs-label` | 13px | Etiquetas, chips, datas, selos | 1.4 | Mono 500, `.02em` |

**Regra das vistas:** o texto dentro de uma vista **nunca é escalado pelo zoom**. Ele é HTML em tamanho real, por cima do SVG (4.4). Assim, os 16 px continuam 16 px em qualquer enquadramento.

### 2.3 Espaçamento e grade (base 4 px)

`--space-1: 4px` · `--space-2: 8px` · `--space-3: 12px` · `--space-4: 16px` · `--space-5: 24px` · `--space-6: 32px` · `--space-7: 48px` · `--space-8: 64px` · `--space-9: 96px`

- Breakpoints (mobile-first, `min-width`): `md 768px` · `lg 1024px` · `xl 1280px`. Container de 1280 px (quarto) e de 1120 px (modo recrutador).
- As seções usam **container queries** (`container-type: inline-size`). O mesmo HTML se adapta à página do modo recrutador, à moldura de uma vista e à vista em tela cheia do mobile.
- Margem lateral: 16 px (base), 24 px (md) e 32 px (lg).

### 2.4 Raios

| Token | Valor | Uso |
|---|---|---|
| `--radius-xs` | 4px | Etiquetas, chips, selos, lombadas |
| `--radius-sm` | 8px | Botões, seletor de idioma, interruptor |
| `--radius-md` | 14px | Cards, resumo, painéis, nichos (mobile), moldura de vista |
| `--radius-full` | 999px | Pontos de status, lâmpadas, tachinhas |

A ilustração usa as mesmas curvas: cantos de 8 a 14 px nos móveis, sem contornos (flat puro).

### 2.5 Sombras (chapadas)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--shadow-1` | `0 2px 0 rgba(21,23,28,.08)` | `none` (usa `--border`) | Cards, etiquetas, papéis |
| `--shadow-2` | `0 6px 0 -2px rgba(21,23,28,.14)` | `0 0 0 1px var(--border-strong)` | Hover |
| `--shadow-panel` | `0 16px 40px -16px rgba(21,23,28,.35)` | `0 0 0 1px var(--border-strong)` | Painel estilizado, moldura da vista |

### 2.6 Animação

| Token | Valor | Uso |
|---|---|---|
| `--dur-1` | 120ms | Cor, contorno, hover de botão |
| `--dur-2` | 180ms | Objeto subindo no hover, disclosure |
| `--dur-zoom` | **400ms** | Câmera aproximando (interpolação do `viewBox`) |
| `--dur-zoom-out` | 320ms | Câmera voltando |
| `--dur-reveal` | 160ms | Moldura e conteúdo da vista aparecendo depois do zoom |
| `--dur-light` | 320ms | Acender ou apagar a luz |
| `--dur-draw` | 700ms | Linha do monitor se desenhando |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | **Zoom**, entradas |
| `--ease-std` | `cubic-bezier(0.4, 0, 0.2, 1)` | Estados, zoom de volta |
| Laços | anel "próximo sugerido": 1,2 s × 2 · ponto "Em desenvolvimento": 2 s × 2 | **Todo laço termina em ≤ 5 s** (WCAG 2.2.2) |

### 2.7 Bloco CSS de referência

```css
:root {
  --bg:#F6F4EE; --surface:#FFFFFF; --surface-2:#ECE8DD;
  --text:#15171C; --text-muted:#4F545C;
  --accent:#B8400F; --accent-strong:#9A3409; --accent-tint:#F7E6DC; --on-accent:#FFFFFF;
  --pine:#1E6B5A; --pine-tint:#E2EEE9;
  --border:#D6D2C6; --border-strong:#8A8476;
  --focus:#B8400F; --badge-progress-fg:#9A3409; --link:var(--accent);
  --ring-in:#FFFFFF; --ring-out:#15171C;
  --paper-bg:#FFFDF7;
  --room-wall:#EFE9DC; --room-wall-shade:#E2DACA; --room-floor:#C9B79A;
  --room-wood:#A9774E; --room-wood-dark:#7C5536; --room-metal:#2B2F38; --room-screen:#F2F6F4;
  --room-cork:#C89B63; --room-paper:#FFFDF7; --room-fabric:#6F8F86;
  --room-sky:#BFDDE8; --room-city:#9FB3BF; --room-moon:transparent;
  --bulb-off:#D6D2C6; --bulb-on:#F2B84B; --glow:transparent;
  --fan-red:#C8352E; --fan-blue:#2D4F8E; --fan-coral:#FF5F57; --fan-herb-green:#4F8A3C; --fan-herb-red:#C2413A;
  color-scheme: light;
}
:root[data-theme="dark"] {
  --bg:#12141A; --surface:#1B1E26; --surface-2:#252933;
  --text:#ECE8DF; --text-muted:#A3A6AE;
  --accent:#FF8A4C; --accent-strong:#FFA470; --accent-tint:#3A2218; --on-accent:#12141A;
  --pine:#5CC2A4; --pine-tint:#17312B;
  --border:#2E3240; --border-strong:#6B6F7A;
  --focus:#FF8A4C; --badge-progress-fg:#FF8A4C;
  --paper-bg:#CFCABD;
  --room-wall:#1E2230; --room-wall-shade:#191C28; --room-floor:#2A2622;
  --room-wood:#4E3A2B; --room-wood-dark:#3A2B20; --room-metal:#0E1015; --room-screen:#10241F;
  --room-cork:#5A4430; --room-paper:#CFCABD; --room-fabric:#2E4640;
  --room-sky:#0B1430; --room-city:#1A2440; --room-moon:#F2E8C9;
  --bulb-off:#3A3D48; --bulb-on:#FFD27A; --glow:rgba(255,210,122,.18);
  --fan-red:#7A2420; --fan-blue:#1C2F57; --fan-coral:#9A3D38; --fan-herb-green:#2F5426; --fan-herb-red:#74271F;
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { /* mesmos valores do bloco escuro */ } }

/* Ilha clara do papel: vale nos dois temas */
.papel {
  background: var(--paper-bg);
  --text:#15171C; --text-muted:#4F545C; --link:#8A2E07;
  --accent:#B8400F; --accent-strong:#9A3409; --on-accent:#FFFFFF; --focus:#B8400F;
  --pine:#1E6B5A; --pine-tint:#E2EEE9; --surface-2:#ECE8DD; --border-strong:#8A8476;
  color: var(--text);
}
```

O SVG do quarto fica **inline** e é pintado com `fill: var(--room-…)`. Acender ou apagar a luz troca tudo sem baixar nada.

---

## 3. Contraste (WCAG 2.2)

Razões calculadas pela fórmula de luminância relativa da WCAG (sRGB linearizado). Texto normal precisa de ≥ 4.5:1; componentes e foco, de ≥ 3:1. As linhas de interface repetem valores já verificados. As de papel e ilustração foram calculadas nesta revisão. **O `revisor-qualidade` deve reconferir no navegador.**

### 3.1 Luz acesa (claro)

| Texto / elemento | Fundo | Razão | Resultado |
|---|---|---|---|
| `--text` #15171C | `--bg` #F6F4EE / `--surface` #FFFFFF / `--surface-2` #ECE8DD | **16.30 / 17.93 / 14.65:1** | AAA |
| `--text` #15171C | `--accent-tint` #F7E6DC | **14.78:1** | AAA |
| `--surface` #FFFFFF (rótulo do botão de modo) | `--text` #15171C | **17.93:1** | AAA |
| `--text-muted` #4F545C | `--bg` / `--surface` / `--surface-2` | **6.93 / 7.62 / 6.23:1** | AA |
| `--accent` #B8400F (links) | `--bg` / `--surface` | **5.05 / 5.56:1** | AA |
| `--on-accent` #FFFFFF | `--accent` #B8400F / `--accent-strong` #9A3409 | **5.56 / 7.32:1** | AA / AAA |
| `--accent-strong` #9A3409 | `--accent-tint` (selo "Em transição para IA") | **6.03:1** | AA |
| `--pine` #1E6B5A | `--bg` / `--surface` / `--surface-2` | **5.78 / 6.35 / 5.19:1** | AA |
| `--pine` #1E6B5A | `--pine-tint` #E2EEE9 | **5.34:1** | AA |

### 3.2 Luz apagada (escuro)

| Texto / elemento | Fundo | Razão | Resultado |
|---|---|---|---|
| `--text` #ECE8DF | `--bg` #12141A / `--surface` #1B1E26 / `--surface-2` #252933 | **15.06 / 13.63 / 11.90:1** | AAA |
| `--surface` #1B1E26 (rótulo do botão de modo) | `--text` #ECE8DF | **13.63:1** | AAA |
| `--text-muted` #A3A6AE | `--bg` / `--surface` / `--surface-2` | **7.56 / 6.84 / 5.97:1** | AA+ |
| `--accent` #FF8A4C | `--bg` / `--surface` / `--surface-2` | **7.88 / 7.13 / 6.23:1** | AA+ |
| `--accent` #FF8A4C | `--accent-tint` #3A2218 | **6.32:1** | AA |
| `--on-accent` #12141A | `--accent` #FF8A4C / `--accent-strong` #FFA470 | **7.88 / 9.46:1** | AAA |
| `--pine` #5CC2A4 | `--bg` / `--surface` / `--surface-2` | **8.51 / 7.70 / 6.72:1** | AA+ |
| `--pine` #5CC2A4 | `--pine-tint` #17312B | **6.43:1** | AA |

### 3.3 Elementos não textuais (≥ 3:1)

| Elemento | Contra | Claro | Escuro |
|---|---|---|---|
| Anel `--focus` (fora da ilustração) | `--bg` / `--surface` | 5.05 / 5.56 | 7.88 / 7.13 |
| `--border-strong` (controles secundários, chips) | `--bg` / `--surface` | 3.38 / 3.72 | 3.66 / 3.32 |
| Contorno da etiqueta (1.5 px `--text`) | `--room-wall` #EFE9DC / #1E2230 | **14.82** | **12.95** |
| **Foco duplo na ilustração** (`--ring-in` #FFFFFF 2 px + `--ring-out` #15171C 3 px) | **qualquer cor** | ≥ 3:1 garantido | ≥ 3:1 garantido |

**Por que o foco duplo é garantido:** o branco tem ≥ 3:1 contra qualquer cor com luminância ≤ 0.30, e a tinta #15171C tem ≥ 3:1 contra qualquer cor com luminância ≥ 0.126. As duas faixas cobrem todo o intervalo de 0 a 1.

### 3.4 Papel e texto sobre a moldura das vistas

| Texto / elemento | Fundo | Luz acesa (`#FFFDF7`) | Luz apagada (`#CFCABD`) |
|---|---|---|---|
| `--paper-text` #15171C | `--paper-bg` | **17.63:1** AAA | **10.96:1** AAA |
| `--paper-muted` #4F545C (≥ 14 px) | `--paper-bg` | **7.49:1** AAA | **4.66:1** AA |
| `--link` no papel #8A2E07 | `--paper-bg` | **8.34:1** AAA | **5.19:1** AA |
| CTA no papel: #FFFFFF sobre #B8400F | — | **5.56:1** AA | **5.56:1** AA |
| Borda do CTA / anel de foco #B8400F | `--paper-bg` | **5.47:1** | **3.40:1** (≥ 3:1) |
| Lombadas dos estojos (no quarto): #15171C | `--room-paper` | **17.63:1** | **10.96:1** |

- **Todo texto de vista fica sobre `--surface` ou `--paper-bg`**, nunca direto sobre cortiça, madeira, tecido ou tela desenhada. A ilustração é a **moldura**, e o HTML é o miolo.
- **Proibido:** `--text-muted` sobre `*-tint`; `--accent` claro sobre `--accent-tint` (4.58:1, aprovado só por pouco); `--paper-muted` abaixo de 14 px na luz apagada; `--accent` (escuro) como texto sobre o papel; qualquer texto sobre `--border`, `--room-*` (exceto lombadas), `--bulb-*` ou `--fan-*`.

---

## 4. Layout

### 4.0 Estrutura do DOM (igual nos dois modos)

```
<header class="topo">  [Modo recrutador] ← 1º focável · nome · [PT|EN] · [luz]
<main id="conteudo">
  <h1>Matheus Maki Nagano     nome grande; no desktop do modo quarto fica sobre a cena (11.3)
  <section id="ficha">        Resumo (Hero), com h2 oculto "Resumo"
  <nav id="quarto">           palco: intro estática (11.2) + <svg viewBox> aria-hidden + <ol> de 12 links com marcadores (11.1)
  <nav id="capitulos">        pílula 01…08 (11.4; só no modo quarto)
  <section id="vertice">      01 · O monitor · Projeto Vértice
  <section id="sobre">        02 · O porta-retrato · Sobre mim
  <section id="experiencia">  03 · O mural · Experiência
  <section id="projetos">     04 · O caderno · Outros projetos
  <section id="habilidades">  05 · A caixa de ferramentas · Habilidades
  <section id="formacao">     06 · A estante · Formação (contém #formacao-ia e #certificacoes)
  <section id="alem">         07 · O lenço · Além do trabalho (contém #alem-escotismo, #alem-volei e #alem-games)
  <section id="contato">      08 · A correspondência · Contato
</main>
<footer>
<dialog id="vista">           vazio; o JS move a seção para cá ao abrir e a devolve ao fechar
```

- A **ordem do DOM é a ordem dos capítulos** e é a ordem de `Tab` nos dois modos.
- **Todo o conteúdo está no HTML desde o carregamento** (SEO, leitor de tela, Lighthouse). No modo quarto, as seções ficam com `display: none` até serem abertas.
- **Fallback antes do JS:** `html[data-modo="quarto"] main > section:target` aparece como painel fixo simples (sem zoom), só com CSS.

### 4.1 Primeira tela no modo quarto

**Desktop (≥ 1024).** Cabe em `100dvh` a partir de 1280×800.

```
┌ TOPO 64px ───────────────────────────────────────────────────────────────────────────┐
│ [≡ Modo recrutador]   Matheus Maki Nagano                    [PT|EN]  [◑ Apagar a luz]│
├ RESUMO (aside 360, xl 380) ──┬ PALCO 16:10 (o resto) ─────────────────────────────────┤
│ Dados → IA [Em transição]    │ ·─●──────●────────────────●──●────●──────●─────●─●─·  │ ← varal
│ Matheus Maki Nagano (48px)   │   01      02                03 04   05     06    07 08 │
│ {hero.frase}                 │  (quarto, ver 4.2)                                     │
│ ──────────────────────────── │                                                         │
│ local     São Paulo, SP      │                                                         │
│ idiomas   inglês avançado    │                                                         │
│ estudando Pós Tech IA, FIAP  │                                                         │
│           [Em andamento]     │                                                         │
│ status    ● aberto a oport.  ├─────────────────────────────────────────────────────────┤
│ ◆ Vértice: em desenvolvimento│ LEGENDA (--surface-2): 01 · O monitor · Projeto Vértice:│
│ [ Conversar no LinkedIn ↗ ]  │ o que estou construindo agora. Enter abre · ← → troca  │
│ Clique nos objetos.          │                                                         │
│ Sugestão: comece pelo 01.    │                                                         │
└──────────────────────────────┴─────────────────────────────────────────────────────────┘
```

**Tablet (768–1023).** O resumo vira uma faixa de 2 colunas acima do palco. O palco ocupa a largura toda (cerca de 728×455), e a legenda fica abaixo. A página rola.

**Mobile (< 768):** ver 4.3.

### 4.2 Composição do quarto (≥ 768)

`viewBox="0 0 1600 1000"`, vista frontal plana. Parede de y 0 a 760, chão de 760 a 1000 e móveis apoiados em y ≈ 900. **Todas as posições abaixo saem de `src/config/quarto.ts`** (9.2). Os valores são o ponto de partida.

```
 x→ 0         300        600        900        1200       1500 1600
 y  ┌──────────────────────────────────────────────────────────────┐
 70 │ ·───●─────────●──────────────────●──●─────●───────●──────●─●─│ varal
    │  ┌estojos──┐  ┌pôster┐  ┌JANELA─┐  ┌MURAL──┐       ┌QUADROS┐ ┌PORTA┐
    │  └─────────┘  │verm. │  │(deco; │  │▭ ▭ ▭  │       │▭ ▭ ▭  │ │lenço│07
    │  ┌MONITOR──┐  │+azul │  │noite) │  └───────┘       └───────┘ │     │
    │  │ ╱linha  │  └──────┘  └───────┘                  ┌ESTANTE┐ │ ✉   │08
    │ 🎧└───┬────┘ ▭mouse ▣retrato    ┌mesinha┐          │▤▤▤▤▤▤ │ │     │
600 │ ═════╧═══════════════╗          │caderno│          │▤▤▤▤▤▤ │ │     │
    │   MESA     cadeira   ║  vaso    └───────┘  [CAIXA]  │▤▤▤▤▤▤ │ │  ⚪ │ bola
900 └──────────────────────────────────────────────────────────────┘
```

| Objeto | Cap. | `caixa` (x, y, l, a) | `clique` | `camera` (16:10) | `janela` (moldura do HTML) | Vista |
|---|---|---|---|---|---|---|
| Monitor | 01 | 110, 330, 280, 250 | = caixa | 70, 330, 360, 225 | tela: 124, 342, 252, 158 | dentro · `tela` |
| Porta-retrato | 02 | 430, 480, 90, 120 | 425, 475, 100, 125 | 395, 430, 320, 200 | — | painel · `porta-retrato` |
| Mural | 03 | 830, 150, 240, 210 | = caixa | 766, 140, 368, 230 | cortiça: 842, 162, 216, 186 | dentro · `cortica` |
| Caderno | 04 | 845, 600, 150, 40 | 845, 580, 150, 100 | 840, 520, 320, 200 | — | painel · `caderno` |
| Caixa de ferramentas | 05 | 1010, 800, 170, 100 | = caixa | 980, 760, 320, 200 | — | painel · `caixa` |
| Estante | 06 | 1200, 560, 240, 340 | = caixa | 1008, 545, 592, 370 | prateleiras: 1212, 575, 216, 310 | dentro · `estante` |
| Quadros | 06 | 1210, 250, 220, 190 | = caixa | (usa a da estante) | — | → estante, `#certificacoes` |
| Lenço | 07 | 1475, 280, 90, 120 | 1465, 275, 100, 130 | 1280, 230, 320, 200 | — | painel · `tecido`, à esquerda |
| Bola + joelheiras | 07 | 1450, 850, 140, 100 | = caixa | 1280, 790, 320, 200 | — | painel · `tecido`, à esquerda, `#alem-volei` |
| Headset | 07 | 30, 480, 80, 120 | 10, 470, 100, 140 | 20, 440, 320, 200 | — | painel · `tecido`, `#alem-games` |
| Estojos (+ controle em cima) | 07 | 70, 180, 260, 130 | = caixa | 40, 150, 320, 200 | — | painel · `tecido`, `#alem-games` |
| Envelope | 08 | 1470, 560, 100, 80 | 1465, 550, 110, 100 | 1280, 500, 320, 200 | — | painel · `carta`, à esquerda |
| Janela (decorativa) | — | 590, 140, 200, 380 | — | — | — | — |
| Pôster (decorativo) | — | 400, 110, 100, 220 | — | — | — | — |
| Vaso (decorativo) | — | 600, 790, 80, 110 | — | — | — | — |
| Mouse + mousepad coral (decorativo) | — | 300, 585, 110, 20 | — | — | — | — |
| Mesa · mesinha · cadeira · tapete · luminária · interruptor | — | 40,600,520,300 · 830,640,180,260 · 200,640,160,260 · 300,900,500,60 · **1100,0,80,110** (saiu de x 760 para liberar a faixa do nome; ver 11.3) · 1440,480,16,28 | — | — | — | — |

- **Varal:** curva em `y ≈ 60–90` de x 20 a x 1580. Há **uma lâmpada por capítulo**, em x = 250 (01), 475 (02), 905 (03), 985 (04), 1095 (05), 1320 (06), 1490 (07) e 1550 (08). Um fio fino desce até cada etiqueta principal.
- **Etiquetas** (5.3) ficam no canto superior esquerdo da `caixa` de cada objeto clicável, inclusive dos secundários.
- **Áreas de clique:** cada objeto é um `<a>` HTML posicionado sobre o SVG por `left/top/width/height` em % do `viewBox`. O validador da config (9.2) garante **≥ 44×44 px no palco mais estreito (728 px)** e **nenhuma sobreposição**.
- **A janela é só decoração:** a cidade genérica e a cortina de dia; à noite, céu `--room-sky`, lua e janelinhas `--bulb-on`. É o elemento que mais muda com a luz (5.7).
- **Porta-retrato:** moldura `--room-wood` com fundo `--room-fabric` e busto em silhueta `--room-metal`, sem rosto, cabelo característico ou acessórios que imitem a aparência real do Matheus.
- O quarto não tem pan próprio. O zoom do navegador continua permitido. O **único** movimento de câmera é o zoom de objeto (4.4).
- **Legenda** (abaixo do palco): mostra o objeto em hover ou foco, ou então o próximo sugerido. É `aria-hidden`, porque a informação está no nome acessível de cada link.

#### 4.2a Objetos de hobby (acenos de fã; regras completas em 9.1)

| Objeto | Clicável? | Destino | Desenho |
|---|---|---|---|
| Bola de vôlei + joelheiras | **Sim** (uma área) | `#alem-volei` | Esfera com 3 faixas curvas de gomos em `--room-paper` e `--room-fabric`, sem o padrão amarelo/azul nem o de outra bola de marca. Joelheiras lisas `--room-metal` |
| Headset | **Sim** | `#alem-games` | Arco, 2 conchas e microfone genérico em `--room-metal`, num suporte; sem luzes RGB de marca |
| Estojos de jogos | **Sim** (a pilha toda) | `#alem-games` | Pilha **deitada** de 5 estojos com lombadas `--room-paper` e os **nomes dos jogos em Atkinson Mono 500**: VALORANT, Counter-Strike, Resident Evil 4, Call of Duty e Homem-Aranha (en: Spider-Man). Texto com 20 unidades de altura a partir de 1024 px; abaixo disso, a lombada fica lisa. Sem ícone, logo, fonte oficial ou cor-assinatura. Por cima da pilha há um **controle genérico** (forma de "osso" `--room-metal`, 2 analógicos e 4 pontos lisos da mesma cor; sem △○×□, letras A/B/X/Y ou formato de controle comercial) |
| Mouse + mousepad | Não | — | Mouse oval sobre um mousepad **`--fan-coral`** liso |
| Pôster | Não | — | Vermelho e azul com teia geométrica própria |
| Vaso | Não | — | Plantinhas `--fan-herb-green` e `--fan-herb-red` |

O Homem-Aranha (filmes e jogos) aparece no quarto só como o pôster abstrato e um nome de lombada. O texto fica em `#alem-games`.

### 4.3 Mobile (< 768): o quarto vira uma parede de nichos

Em tela estreita, a cena inteira ficaria pequena demais para tocar e ler. **Os objetos saem do quarto e ganham nichos**: uma grade de ladrilhos ilustrados, 2 por linha, na ordem dos capítulos (leitura em Z). Os desenhos são os mesmos componentes do quarto, em escala de ladrilho. O varal corre acima de cada linha, e a lâmpada acende quando o capítulo é lido.

```
360 × 640 (primeiro frame)
┌ TOPO 56px ─────────────────────────┐
│ [≡ Modo recrutador]   [PT|EN] [◑]  │
├ RESUMO ────────────────────────────┤
│ Dados → IA  [Em transição para IA] │
│ Matheus Maki Nagano  (32px)        │
│ {hero.frase}                       │
│ São Paulo · ● Aberto a oportunid.  │
│ ◆ Vértice: em desenvolvimento      │
│ ◆ Pós Tech IA (FIAP): em andamento │
│ ◆ Inglês avançado                  │
│ [ Conversar no LinkedIn ↗       ]  │
├ NICHOS ────────────────────────────┤
│ Toque num objeto. Sugestão: 01.    │
│  ●───────────────●                 │
│ ┌──────────────┐ ┌──────────────┐  │
│ │  [monitor]   │ │[porta-retrato]│ │  ilustração de 96px
│ │01 · ● próximo│ │02             │ │
│ │Projeto Vértice│ │Sobre mim     │ │  nome comum: Atkinson 700 16
│ │O monitor     │ │O porta-retrato│ │  temático: mono 13 --text-muted
│ └──────────────┘ └──────────────┘  │
│  03 mural · 04 caderno             │
│  05 caixa · 06 estante + quadros   │
│  07 lenço + bola + headset         │
│  08 envelope                       │
└────────────────────────────────────┘
```

- **Ladrilho:** `--surface`, `--radius-md`, `--shadow-1`, padding 12 px, largura `(100% − 12px) / 2` (cerca de 158 px em 360) e altura mínima de 168 px. Uma faixa de 8 px `--room-wood` sob cada linha faz a "prateleira".
- **Secundários** não viram ladrilhos (evita links duplicados). O 06 desenha a estante com um quadro em cima; o 07 desenha o lenço, a bola e o headset. Dentro da vista, há atalhos no topo: "Ir para Certificações", "Ir para Vôlei" e "Ir para Games".
- Abaixo de 340 px, com o celular deitado (`max-height: 499px`) ou com zoom alto (reflow a 320 px CSS): **1 ladrilho por linha**, horizontal (ilustração de 64 px à esquerda, textos à direita).
- **Mesmo HTML:** a `<ol>` de objetos é a do desktop. Os secundários ficam ocultos e o posicionamento absoluto vira grade.
- **Toque** num ladrilho abre a vista em tela cheia (4.4). Não há gestos.

### 4.4 Vistas: zoom, "dentro do objeto" e painel estilizado

#### Sequência (≥ 768)

1. **Clique, toque ou Enter** num objeto. O JS faz `pushState('#destino')` e marca o palco como `data-estado="aproximando"`. Novos cliques ficam ignorados até o fim.
2. **Zoom:** o `viewBox` do SVG é interpolado da vista inteira (`0 0 1600 1000`) até o `camera` do objeto em **400 ms** com `--ease-out` (`requestAnimationFrame`, só durante o zoom). As etiquetas e as áreas de clique somem com opacidade em 120 ms. Se a medição mostrar quadros acima de 16 ms em celular médio, a implementação pode trocar pela transformação `scale/translate` no `<svg>`, que tem o mesmo enquadramento e o mesmo tempo.
3. **Revelar:** o `<dialog id="vista">` abre (`showModal()`) **sobre o palco** (posição calculada pelo `getBoundingClientRect` do palco e recalculada no `resize`). A moldura e o conteúdo entram com opacidade em 160 ms. O foco vai para o `h2` da vista (`tabindex="-1"`).
4. **Voltar** (Esc, botão "← Voltar ao quarto" ou "voltar" do navegador): o conteúdo sai (120 ms), o `viewBox` volta à vista inteira (320 ms, `--ease-std`), as etiquetas reaparecem e o **foco volta ao objeto** que abriu a vista.
5. **Reduced motion:** **corte direto**. O `viewBox` muda num quadro, a vista aparece sem transição e a volta também é instantânea.

#### Barra da vista (todas as vistas)

```
┌ BARRA 56px (--surface a 94%, sobre o topo do palco) ──────────────────────────────┐
│ [← Voltar ao quarto]  03 · O mural                         [← 02 Sobre] [04 →]    │
│                       Experiência  (h2)                                            │
└────────────────────────────────────────────────────────────────────────────────────┘
```
- O `h2` traz o rótulo duplo (5.1). "Anterior/próximo" mostram número + nome comum; a câmera **viaja de um objeto ao outro** (400 ms) sem passar pela vista inteira.
- No mobile, a barra fica fixa no topo e "anterior/próximo" ficam num rodapé fixo.

#### Vista "dentro" (monitor, mural, estante)

A câmera enquadra o objeto, e o HTML ocupa a área `janela` do objeto, convertida para px. **Regra de legibilidade:** a moldura HTML tem no mínimo `min(560px, 92% do palco)` × `min(360px, 80% do palco)`. Se a `janela` desenhada for menor, a moldura cresce centralizada e passa a desenhar a própria borda em CSS no estilo do objeto (bisel da tela, borda de cortiça, laterais da estante), cobrindo o desenho. O texto nunca encolhe. O conteúdo rola **dentro** da moldura (`overscroll-behavior: contain`).

| Vista | Moldura | Miolo (HTML real) |
|---|---|---|
| `tela` (monitor) | Bisel `--room-metal` de 12 px e **barra de navegador genérica** (3 pontos + campo com o texto "verticetour.com.br" em mono; sem marca nem ícone de navegador real) | Um "site" do Vértice desenhado por nós, em `--surface`/`--bg` (ver 4.5). Nota fixa no rodapé: "Representação ilustrada. O site real está em verticetour.com.br" |
| `cortica` (mural) | Borda `--room-wood` de 10 px, fundo `--room-cork` (sem texto sobre ela) | **Papéis com tachinha** (5.12), um por experiência |
| `estante` | Laterais e tábuas `--room-wood` (tábuas de 10 px entre os grupos) | **Livros deitados** em pilhas (5.13), um por formação ou certificação |

#### Painel estilizado (os demais objetos)

A câmera enquadra o objeto num terço do palco (lado definido na config) e o painel ocupa os outros ~60%, com `--shadow-panel` e `--radius-md`.

| Tema | Objeto | Visual | Miolo |
|---|---|---|---|
| `porta-retrato` | Porta-retrato | Moldura `--room-wood` de 14 px; no topo, a silhueta do porta-retrato em 120 px (decorativa) | Papel (`.papel`) com os 3 parágrafos de Sobre |
| `caderno` | Caderno | Furos de espiral no topo (decorativos), linha de margem `--fan-red` de 2 px à esquerda e pauta `--border` a cada 28 px (`repeating-linear-gradient`, alinhada à altura de linha do texto) | Papel com os cards de projeto |
| `caixa` | Caixa de ferramentas | Faixa superior `--room-metal` de 16 px (alça desenhada, sem texto) e 3 **compartimentos** `--surface-2` separados por 2 px `--border-strong` | Grupos de habilidades com chips |
| `tecido` | Lenço, bola, headset, estojos | Faixa superior em `--room-fabric` com triângulo do lenço (decorativa) | Cards `--surface` de escotismo, games e vôlei |
| `carta` | Envelope | Aba de envelope em triângulo no topo (`--room-paper` com dobra `--room-wall-shade`) | Papel em formato de carta com o convite e o CTA |

#### Mobile (< 768)

Não há câmera. O ladrilho tocado **expande até a tela cheia** (FLIP: `transform` do retângulo do ladrilho até o da tela, 300 ms, `--ease-out`; corte direto em reduced motion). A vista em tela cheia tem a barra fixa no topo, a moldura reduzida a uma borda temática de 8 px nos 4 lados (bisel, cortiça, madeira, tecido, envelope), o miolo HTML em largura total menos 16 px e texto ≥ 16 px. A volta encolhe a vista de volta ao ladrilho, e o foco volta a ele.

### 4.5 Conteúdo de cada seção (igual no modo recrutador; o estilo muda com o contexto)

#### `ficha`: Resumo
Eyebrow "Dados → IA" (mono, `--accent`) + selo "Em transição para IA" · `h1` com o nome · `{hero.frase}` · `<dl>` (local, idiomas, estudando, status) · 3 provas · CTA "Conversar no LinkedIn" · dica `{quarto.dica.*}` (só no modo quarto). Nenhum número, nível ou barra.

#### `vertice`: 01 · O monitor · Projeto Vértice (vista `tela`)
```
┌ ● ● ●  [ verticetour.com.br                    ] ─────────────────────────────┐
│ Vértice  (Bricolage 800, 32px)        [● Em desenvolvimento] [🔒 Repositório privado]│
│ {vertice.resumo}                                                   2026 – atual   │
│ [ Ver o site real ↗ ]                                                             │
│ ── Como foi construído ─────────────────────────────────────────────────────────  │
│ ◆ Especificação ◆ Agentes por papel ◆ Testes (49 arquivos no backend)              │
│ ◆ CI + deploy (GitHub Actions · Render · Neon) ◆ Monitoramento por agentes, correção pelo Matheus │
│ O que faz (lista)              │ Stack (chips)                                     │
│ Próximo passo: integração com a API oficial da Riot Games [● Em andamento]         │
│ Origem: campeonatos entre amigos → "O headset · Games e a origem do Vértice"        │
│ [ Conversar no LinkedIn ↗ ]                                                       │
│ Representação ilustrada. O site real está em verticetour.com.br                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```
- O "site" usa os tokens de interface. **Não reproduz** a identidade visual real do Vértice nem nenhuma arte de VALORANT/Riot. A barra de endereço é `aria-hidden`; o link real é o CTA.
- **Sem captura de tela** (zero imagens raster no site). Proibido: "concluído", "em produção", "no ar" e números de uso.
- Em moldura < 640 px, tudo fica em uma coluna.

#### `sobre`: 02 · O porta-retrato · Sobre mim (painel `porta-retrato`)
3 parágrafos (`{sobre.p1..p3}`), o 1º em `--fs-lead`, no papel, com máximo de 60ch. Sem foto.

#### `experiencia`: 03 · O mural · Experiência (vista `cortica`)
- **Um papel por empresa**, em ordem reversa: KPMG, Salesforce, Cushman & Wakefield. Cada papel (`<li class="papel">`) tem `h3` com a empresa, cargo(s) com `<time datetime>`, bullets começando com verbo e "O que levei disso".
- **KPMG:** um papel com os dois cargos: Audit Associate (2024-10 → 2026-06) e Audit Trainee (2023-10 → 2024-10). O trabalho foi **auditoria de controles de TI**, nunca dados ou SQL.
- **Layout:** 1 coluna em moldura < 640 px e 2 colunas acima disso (KPMG ocupa as duas). Papéis com inclinação de ±0.6° (nenhuma em reduced motion) e tachinha `--bulb-on` de 12 px no topo.
- **Modo recrutador:** o mesmo `<ol>` vira a linha do tempo vertical (5.12).
- `id`s: `exp-kpmg`, `exp-salesforce`, `exp-cushman`. Empresas, cargos e datas exatamente como em `perfil.json`.

#### `projetos`: 04 · O caderno · Outros projetos (painel `caderno`)
Cards na página do caderno: selos `[Projeto acadêmico · FIAP]` `[Em grupo · MVP]` → `h3` → problema e solução → "Meu papel: ajudou a desenvolver o MVP" → chips (**o EnergíGreen fica sem chips**, porque a stack está em aberto). `id`s: `projeto-stocksage` e `projeto-energigreen`.

#### `habilidades`: 05 · A caixa de ferramentas · Habilidades (painel `caixa`)
```
Legenda: [SQL │ Cushman & Wakefield] = usado em contexto real
┌ Avançado ──────────────────────────────────────────────────────────┐
│ [Excel │ KPMG]  tabelas dinâmicas com bases grandes, PROCV, SOMASE │
└────────────────────────────────────────────────────────────────────┘
Básico, em evolução — 3 compartimentos:
 IA                   │ Dados & BI                    │ Desenvolvimento web
 [IA Generativa]      │ [SQL │ Cushman & Wakefield]   │ [Node.js · Express │ Vértice]
 [LangChain]          │ [Python · Pandas] [Power BI]  │ [React · Vite │ Vértice]
 [LangGraph · noções] │ [ETL · qualidade]             │ [PostgreSQL │ Vértice]
                      │ [Azure · Databricks]          │ [GitHub Actions │ Vértice]
                      │ [Hadoop · Spark · noções] [Airflow]
Como eu trabalho: Tradução negócio ↔ técnica (Salesforce) · Verificação (KPMG) · Liderança (Escotismo)
```
- **O nível é sempre texto**, escrito no cabeçalho de cada grupo. "Noções" só aparece onde `perfil.json` diz "noções". **Sem barras, estrelas, porcentagens ou pontos.**
- Compartimentos: 3 colunas com moldura ≥ 720 px, 2 com ≥ 480 px e 1 abaixo disso.

#### `formacao`: 06 · A estante · Formação e certificações (vista `estante`)
Três prateleiras de cima para baixo, cada uma com um `h3` numa plaquinha `--surface`:
1. **IA, em andamento** (`id="formacao-ia"`): Pós Tech IA para Devs · FIAP `[● Em andamento]` · início out/2026 · previsão ago/2027 (**sem porcentagem**), e os cursos de IA da Alura.
2. **Formação concluída:** Sistemas de Informação · Anhembi Morumbi · 2019–2025; Data Science · FIAP · 2025.
3. **Certificações** (`id="certificacoes"`, plaquinha "Os quadros · Certificações"): grupos Dados & BI, Salesforce e outros.

Abaixo das prateleiras: **Idiomas**: Inglês avançado · Japonês básico · Espanhol básico. Cada livro mostra o **nome exato** · emissor · ano (só se existir em `perfil.json`) (5.13).

#### `alem`: 07 · O lenço · Além do trabalho (painel `tecido`)
Cards `--surface`: 2 colunas com moldura ≥ 560 px, 1 abaixo disso:
- `id="alem-escotismo"` **Escotismo** · Chefe do ramo Castores/Filhotes · Grupo Coopercotia · desde ago/2019 `[● Atual]` · `{alem.escotismo}`.
- `id="alem-games"` (h3 "O headset e os estojos · Games e a origem do Vértice") · `{alem.games.texto}` · lista em texto `{alem.games.lista}` · `{alem.games.filmes}` (Homem-Aranha: filmes e jogos) · link "→ 01 · Projeto Vértice".
- `id="alem-volei"` (h3 "A bola · Vôlei") · `{alem.volei.texto}`.

Os nomes de jogos e personagens aparecem aqui como texto comum, sem logotipo, fonte oficial ou cor-assinatura. Na ilustração, só aparecem nas lombadas. Sem flor-de-lis ou símbolos escoteiros oficiais. Pôquer não entra.

#### `contato`: 08 · A correspondência · Contato (painel `carta`)
Papel de carta: `{contato.convite}` (h3, máx. 24ch) · `● Aberto a oportunidades` · **[ Conversar no LinkedIn ↗ ]** (texto literal) · link de texto "GitHub". Assinatura "Matheus" em Bricolage 600 (sem fonte cursiva de terceiros).

### 4.6 Modo recrutador

A mesma página em sequência: sem quarto, câmera, legenda nem etiquetas. Fundo `--bg`, container de 1120 px. Títulos só com o nome comum (5.1).

```
┌ TOPO ───────────────────────────────────────────────┐
│ [▦ Explorar o quarto]  Matheus Maki Nagano            │
│   Vértice · Sobre · Experiência · Projetos ·          │
│   Habilidades · Formação · Contato     [PT|EN] [◑]    │
├───────────────────────────────────────────────────────┤
│ Resumo · Projeto Vértice · Sobre mim · Experiência    │
│ (linha do tempo) · Outros projetos · Habilidades ·    │
│ Formação e certificações (lista) · Além do trabalho · │
│ Contato · Rodapé                                      │
└───────────────────────────────────────────────────────┘
```
- As molduras temáticas não aparecem. Papéis, livros e o "site" do monitor viram cards e listas simples, com o mesmo HTML e outro CSS.
- O espaço entre seções é `--space-8` (mobile) e `--space-9` (lg). No mobile, a nav fica num menu `<button aria-expanded>` (fecha com Esc, com clique num link ou devolvendo o foco).
- "Pular para o conteúdo" é o 2º elemento focável.
- `@media print` força este modo.

### 4.7 Rodapé

`--surface-2`: `© 2026 Matheus Maki Nagano` · "GitHub" em texto · `[PT|EN]`.

---

## 5. Componentes

**Regras comuns**
- **Foco visível em tudo:** `outline: 3px solid var(--focus); outline-offset: 3px` com `:focus-visible`. **Sobre a ilustração**, foco duplo: `outline: 3px solid var(--ring-out); outline-offset: 2px; box-shadow: 0 0 0 2px var(--ring-in)`. Nada de `outline: none` sem substituto, e o foco nunca é cortado por `overflow` ou `clip-path`.
- **Alvo mínimo** de 44×44 px, exceto links dentro de texto.
- **Links no texto:** `var(--link)`, sublinhado de 1 px com `text-underline-offset: 3px` (2 px no hover). Links externos levam ↗ em SVG e abrem **na mesma aba**.
- **Forced colors:** áreas de clique, etiquetas e molduras ganham `border: 2px solid CanvasText`. O SVG é decorativo.

### 5.1 Rótulo duplo (`DualLabel`)

```html
<h2 id="experiencia-titulo">
  <span class="cap" aria-hidden="true">03 · </span><span class="tema">O mural</span><span class="sep" aria-hidden="true"> · </span><span class="comum">Experiência</span>
</h2>
```
- **Modo quarto:** `.cap` + `.tema` numa linha acima (mono 13 `--text-muted`) e `.comum` como título (Bricolage). O leitor de tela lê "O mural Experiência".
- **Modo recrutador:** `.cap`, `.tema` e `.sep` ficam com `display: none`.
- O rótulo temático **nunca** aparece sem o nome comum (vista, etiqueta, ladrilho, legenda, nome acessível, barra da vista).

### 5.2 Botão de modo

| | Quarto: **"Modo recrutador"** | Recrutador: **"Explorar o quarto"** |
|---|---|---|
| Posição | 1º item do topo, **1º elemento focável** | mesmo lugar |
| Repouso | fundo `--text`, texto `--surface` (17.93 / 13.63:1), ícone ≡, `--radius-sm` | transparente, borda 1.5 px `--border-strong`, texto `--text`, ícone de casinha |
| Hover | fundo `--accent-strong`, texto `--on-accent` (7.32 / 9.46:1) | fundo `--surface-2`, borda `--text` |
| Foco / ativo | anel padrão / `translateY(1px)` | idem |

- `<a href="?modo=recrutador" class="btn-modo">`. Sem JS, recarrega no modo recrutador. Com JS, troca `data-modo` sem recarregar, salva em `localStorage`, faz `replaceState` mantendo o `#hash`, leva o foco ao `h2` da seção do hash (ou do resumo) e anuncia `{status.modoAtivado.*}` num `role="status"`. **Com uma vista aberta**, fecha a vista sem animação e rola até a mesma seção.
- "Explorar o quarto" só existe com `.js`. Altura de 44 px (48 px no mobile).

### 5.3 Objeto do quarto (`RoomObject`) e etiqueta

```html
<li><a class="objeto" href="#experiencia" data-objeto="mural" data-cap="03"
       style="--x:830;--y:150;--w:240;--h:210">
  <span class="etiqueta">
    <span class="num">03</span><span class="sep" aria-hidden="true"> · </span>
    <span class="tema sr-only">O mural, </span>
    <span class="comum">Experiência</span>
    <span class="sr-only estado"></span>   <!-- ", lido" / ", próximo sugerido" -->
  </span>
</a></li>
```
**Nome acessível:** "03 · O mural, Experiência" (+ estado). O desenho do objeto vem de `Mural` (9.2), dentro do SVG, com `aria-hidden`.

**Etiqueta:** cartãozinho `--surface`, borda 1.5 px `--text`, `--radius-xs`, mono 13, altura 28 px. Mostra "03 · Experiência" a partir de 1024 px e só "03" entre 768 e 1023.

| Estado | Objeto | Etiqueta |
|---|---|---|
| **Repouso** | normal | número + nome comum |
| **Hover** | sobe 4 px (`--dur-2`), ganha sombra chapada de 6 px e o contorno de destaque (forma duplicada em `--text`, 2 px, sem filtro). A legenda atualiza | fundo `--surface-2` |
| **Foco** | o realce do hover + **foco duplo** na área de clique | a mesma do hover |
| **Ativo** | `scale(.98)` e início do zoom | — |
| **Próximo sugerido** | marcador flutuante preenchido em `--accent` (11.1) | texto oculto "próximo sugerido" (o sinal visual fica no marcador) |
| **Lido** | a lâmpada do capítulo acende (`--bulb-on`; à noite, com `--glow`); o marcador vira ✓ (11.1) | texto oculto "lido" |
| **Aproximando / aberto** | etiquetas e áreas de clique ficam ocultas e com `inert` (o `<dialog>` modal já torna o resto inerte) | — |

- "Lido" fica em `sessionStorage` por capítulo: abrir os quadros conta como ler o 06. **Sem contador**, pontuação ou recompensa.
- Sem tooltip.

### 5.4 Ladrilho (mobile)

É o mesmo `<a class="objeto">`, restilizado: ilustração de 96 px (o componente do objeto em escala de ladrilho, com `aria-hidden`) → "01" + estado → nome comum (Atkinson 700 16) → rótulo temático (mono 13). Repouso: `--surface`, `--shadow-1`. Hover: `--shadow-2`. Foco: anel `--focus`. Pressionado: `scale(.98)` e expansão para a vista. Próximo sugerido e lido funcionam como em 5.3.

### 5.5 Legenda do quarto

Faixa abaixo do palco (≥ 768): `--surface-2`, `--radius-sm`, padding de 12×16. Mostra **"03 · O mural · Experiência"** (`--text` 700), depois `{quarto.objetos.<obj>.legenda}` e a dica em mono 13 `--text-muted` ("Enter abre · ← → troca de objeto"; com ponteiro, "Clique para aproximar"). Tem `aria-hidden`. Para leitores de tela, existe `<p class="sr-only">{quarto.ajuda}</p>` antes da lista.

### 5.6 Câmera e `<dialog>` da vista

- **Um único `<dialog id="vista">`**, aberto com `showModal()`: foco preso, Esc (evento `cancel`, interceptado para animar a saída) e fundo inerte. O `::backdrop` é **transparente** nas vistas "dentro" (o quarto aproximado é o fundo visual) e `rgba(18,20,26,.35)` nos painéis.
- A seção é **movida** para dentro do dialog e devolvida ao fechar, para que os `id`s nunca se dupliquem. O dialog recebe `data-vista="tela|cortica|estante|porta-retrato|caderno|caixa|tecido|carta"`, e o CSS aplica a moldura.
- **Foco:** ao abrir, vai para o `h2` (`tabindex="-1"`), e o leitor anuncia "O mural, Experiência". Ordem de `Tab` dentro: "Voltar ao quarto" → conteúdo → "anterior" → "próximo". Ao fechar, volta ao objeto de origem (ou ao objeto do capítulo atual, se houve navegação anterior/próximo).
- **Histórico e URLs:**

| Ação | Histórico | URL |
|---|---|---|
| Abrir a partir do quarto | `pushState` | `#vertice`, `#sobre`, `#experiencia`, `#projetos`, `#habilidades`, `#formacao`, `#certificacoes`, `#alem`, `#alem-volei`, `#alem-games`, `#contato` |
| Anterior/próximo ou link interno entre vistas (`#alem-games` dentro do Vértice) | `replaceState` | o novo `#id` |
| Fechar (Esc ou "Voltar") | `history.back()` se a vista foi aberta por `pushState`; senão, `replaceState` para a URL sem hash | sem hash |
| "Voltar" do navegador com vista aberta | `popstate` fecha (com animação) | sem hash |
| `popstate` ou carregamento com `#id` | — | abre a vista do capítulo dono do `#id`, **sem animação** no carregamento, e rola até o alvo |

  Como os movimentos entre vistas usam `replaceState`, o "voltar" do navegador sempre leva de volta ao quarto em um passo.
- **Âncoras internas** (`#exp-kpmg`, `#formacao-ia`, `#certificacoes`, `#alem-*`, `#projeto-*`) abrem a vista da seção que as contém e rolam até o alvo com `scrollIntoView({block:'start'})` (instantâneo em reduced motion). O alvo recebe o destaque de `:target` (5.12).

### 5.7 Interruptor de luz (tema)

- `<button type="button" aria-pressed>` com nome acessível **"Tema escuro"** e, a partir de lg, o texto visível **"Apagar a luz"** / **"Acender a luz"**. 44 px de altura, borda 1.5 px `--border-strong`, `--radius-sm`, ícone de interruptor de parede. O interruptor desenhado ao lado da porta acompanha o estado (decorativo).
- **Luz apagada = tema escuro inteiro.** No quarto: a parede e os móveis escurecem; a luminária apaga; **a janela** mostra o céu noturno, a lua e as janelinhas acesas (é a mudança mais visível); a tela do monitor vira a fonte de luz, com um cone chapado `--glow` sobre a mesa; as lâmpadas dos capítulos lidos brilham. Os papéis continuam claros (`--paper-bg` noturno), como papel sob pouca luz.
- Segue `prefers-color-scheme`. A escolha manual vai para `localStorage` e é aplicada pelo script do `<head>`. Sem JS, o botão fica oculto.
- Transição de `fill`/`color` em 320 ms só no `body`, no SVG e na vista. Hover `--surface-2`, foco padrão, ativo `translateY(1px)`.

### 5.8 Seletor de idioma (PT | EN)

Dois links (`/` e `/en/`) em `<nav aria-label="Idioma / Language">`, com `hreflang`, `lang` e `aria-label` por extenso. Segmentos de 44×44, borda 1 px `--border-strong`. **Ativo:** fundo `--text`, texto `--bg` (16.30 / 15.06:1), `aria-current="true"`. Hover `--surface-2`, foco padrão. Sem bandeiras. **Preserva o `#hash` e o modo:** uma vista aberta em pt reabre em en **já aproximada**, sem animação.

### 5.9 Chip de habilidade

Mono 13, altura 32 px, `--radius-xs`, fundo `--surface-2`, borda 1 px `--border-strong`. Variante de uso real: `[ SQL │ Cushman & Wakefield ]`, em que o 2º segmento é `--pine` sobre `--pine-tint`, com "usado em contexto real:" em `sr-only`. Não é interativo. O nível fica **no cabeçalho do grupo, em texto**.

### 5.10 Botão de CTA

| | Primário ("Conversar no LinkedIn") | Secundário ("Ver o site real") |
|---|---|---|
| Repouso | fundo `--accent`, texto `--on-accent` Atkinson 700 16 | transparente, borda 1.5 px `--border-strong`, texto `--text` |
| Hover | `--accent-strong`; ↗ desloca 2 px | borda `--text`, fundo `--surface-2` |
| Foco / ativo | anel padrão / `translateY(1px)` | idem |

Altura de 48 px no mobile e 44 px a partir de md, `--radius-sm`, sempre `<a>`, no máximo 1 primário por bloco. Sobre o papel, valem os tokens de `.papel` (3.4).

### 5.11 Selos

Mono 500 13px, altura 28 px, `--radius-xs`, em `<ul aria-label="Status">`.

| Selo (pt / en) | Fundo | Texto |
|---|---|---|
| **Em desenvolvimento** / *In development* (Vértice) | `--pine-tint` | `--pine`, ponto que pulsa 2× |
| **Em andamento** / *In progress* (Pós Tech, API da Riot); **Atual** / *Current* (Escotismo) | `--pine-tint` | `--pine` |
| **Em transição para IA** / *Moving into AI* | `--accent-tint` | `--badge-progress-fg` |
| **Repositório privado** / *Private repository* | `--surface-2` | `--text-muted`, cadeado SVG |
| **Projeto acadêmico · FIAP**, **Em grupo · MVP** | transparente, borda `--border-strong` | `--text-muted` |

### 5.12 Papel do mural / item da linha do tempo (`ExperienceItem`)

O mesmo `<li>` serve aos dois contextos:
- **Vista `cortica`:** `.papel`, padding 20 px, `--shadow-1`, tachinha `--bulb-on` de 12 px centrada no topo (decorativa), inclinação de ±0.6°. Mostra `h3` com a empresa, cargo(s) com período em mono, bullets e "O que levei disso" (prefixo → `--pine`).
- **Modo recrutador:** linha do tempo vertical com trilho de datas de 140 px (≥ 640) e nós em losango de 12 px; o mais recente preenchido com `--text`.
- **`:target`:** fundo `--surface-2` (ou um tom mais escuro do papel na cortiça) que some em 1,2 s. Fica fixo por 3 s em reduced motion.

### 5.13 Livro da estante (`BookItem`)

- **Vista `estante`:** `<li class="papel livro">` deitado, com largura de 100% da prateleira menos um deslocamento aleatório fixo de 0–16 px (alternando, para parecer uma pilha). Uma faixa decorativa de 8 px à esquerda, na cor do grupo (`--room-fabric` IA, `--room-wood` formação, `--fan-blue` certificações). O conteúdo é o **nome exato** (Atkinson 700 16, quebra livre), seguido de emissor · ano (mono 13 `--paper-muted`) e, se houver, do selo de estado. A espessura do livro é a altura do conteúdo (mínimo de 44 px). Não é interativo.
- **Modo recrutador:** lista simples por grupo.
- **A Pós Tech** fica no topo da 1ª prateleira, com o selo "Em andamento" e sem barra de progresso.

---

## 6. Elemento assinatura: a tela que dobra

**Em repouso, o monitor mostra a carreira como um gráfico de linha que dobra para cima em 2026.** Cinco pontos sobre uma linha horizontal (`--text-muted`) representam 2019, 2020, 2021, 2023 e 2026, os inícios confirmados em `perfil.json`. Em 2026, um losango `--accent` marca o Vértice, e a linha sobe na diagonal em `--accent` até um anel aberto, que é a direção IA.

- **Sem eixo Y e sem valores:** a dobra é direção, não métrica. A tela não tem texto.
- **No 1º hover ou foco** do monitor (e uma vez no carregamento, se não houver reduced motion), o trecho `--accent` se desenha em 700 ms. Não há loop.
- **Ao clicar**, a câmera mergulha nessa tela e o gráfico dá lugar ao "site" do Vértice. A assinatura vira a porta de entrada do capítulo 01.
- **Luz apagada:** a tela é a coisa mais clara do quarto, e o cone de luz na mesa a torna o centro da cena.
- **O varal reforça o motivo:** as lâmpadas que acendem da esquerda para a direita são uma "linha de progresso" **do visitante**, nunca uma métrica sobre o Matheus.
- É parte do componente `Monitor` (< 1 KB) e tem `aria-hidden`.

---

## 7. Interação

### 7.1 Teclado

| Tecla | Onde | Ação |
|---|---|---|
| `Tab` / `Shift+Tab` | página | botão de modo → idioma → luz → CTA do resumo → **objetos na ordem dos capítulos**: 01 monitor, 02 porta-retrato, 03 mural, 04 caderno, 05 caixa, 06 estante, 06 quadros, 07 lenço, 07 bola, 07 headset, 07 estojos, 08 envelope → **menu numerado 01…08** (11.4) → rodapé. Durante a intro, o botão "Pular" entra logo depois do CTA do resumo (11.2) |
| `→` `↓` / `←` `↑` | foco num objeto | próximo / anterior na mesma ordem (só move o foco) |
| `Home` / `End` | foco num objeto | primeiro / último |
| `Enter` · `Espaço` | foco num objeto | aproxima e abre |
| `Esc` | vista aberta | afasta e devolve o foco ao objeto |
| `Tab` | vista aberta | "Voltar ao quarto" → conteúdo → anterior → próximo (foco preso) |

- **Não há atalhos de tecla única** (WCAG 2.1.4). As setas só funcionam com foco num objeto e sem modificadores.
- Durante o zoom (≤ 400 ms), as teclas são ignoradas, exceto Esc, que inverte a animação.

### 7.2 Mouse e toque

- **Clique ou toque aproxima e abre.** Não há seleção em dois passos.
- No toque não há hover. O ladrilho já mostra número, nome comum e rótulo temático.
- Não há gestos próprios (arrastar, pinça, swipe). Para trocar de capítulo, use os botões da barra ou do rodapé da vista.

---

## 8. Movimento e `prefers-reduced-motion`

O movimento confirma uma ação ou explica uma direção. **Nada se move sozinho por mais de 5 s.** Fora o `viewBox` durante o zoom, só `transform`, `opacity` e `stroke-dashoffset` são animados.

| O quê | Padrão | Com `prefers-reduced-motion: reduce` |
|---|---|---|
| **Zoom da câmera** (`viewBox`) | 400 ms `--ease-out` na ida; 320 ms `--ease-std` na volta | **corte direto** |
| Viagem entre objetos (anterior/próximo) | 400 ms | corte direto |
| Conteúdo da vista | entra com opacidade em 160 ms após o zoom; sai em 120 ms | sem transição |
| Expansão do ladrilho (mobile) | FLIP de 300 ms | corte direto |
| Objeto em hover/foco | sobe 4 px, 180 ms | só o realce |
| Linha do monitor | desenha em 700 ms, 1× | já desenhada |
| Anel "próximo sugerido", ponto "Em desenvolvimento" | pulsam 2× e param | estáticos |
| **Marcadores flutuantes** (11.1) | flutuam 4 px em 1,6 s × 3 (≤ 5 s) ao carregar e a cada volta ao quarto; o "próximo" pulsa 2× | **estáticos**, sem flutuação nem pulso |
| **Intro** (11.2) | ≤ 2,5 s, uma vez por navegador | **não existe** |
| Pílula: item ativo | fundo desliza entre itens em 200 ms | troca instantânea |
| Luzes (LED, cones, brilho do monitor) | estáticas; só mudam com o tema (320 ms) | instantâneo |
| Papéis e livros inclinados ou deslocados | estáticos | sem inclinação |
| Acender / apagar a luz | 320 ms | instantâneo |
| `:target` | some em 1,2 s | fixo por 3 s |
| Rolagem até âncora | `smooth` | `auto` |

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important; animation-iteration-count: 1 !important;
    transition-duration: .01ms !important; scroll-behavior: auto !important;
  }
}
```
O JS lê `matchMedia('(prefers-reduced-motion: reduce)')` (e reage a mudanças) para pular a interpolação do `viewBox`, o FLIP e o desenho da linha.

---

## 9. Arte, componentes, técnica e performance

### 9.1 Arte: só original

- **Toda a ilustração é desenhada pelo time** em SVG flat: só preenchimentos, sem contornos, texturas ou gradientes, sombras como formas chapadas, coordenadas inteiras e paleta limitada a `--room-*`, `--bulb-*` e `--fan-*`.
- **Proibido em geral:** ilustrações, ícones ou pacotes de terceiros (inclusive gratuitos ou CC0); logos de KPMG, Salesforce, Cushman & Wakefield, FIAP, Alura, Anhembi Morumbi, LinkedIn ou GitHub (inclusive nos papéis, diplomas e livros); flor-de-lis e símbolos oficiais do escotismo; marcas em monitor, headset, mouse, teclado ou navegador; **foto ou retrato realista do Matheus** (o porta-retrato tem silhueta genérica); marcos reconhecíveis de São Paulo.

#### Hobbies: "acenos de fã" (decisão do Matheus, `content/fonte/hobbies.md`)

Um aceno é um **desenho original que lembra o hobby sem copiar nada oficial**.

**Permitido (e só isto):**

| Aceno | Hobby | Onde | Clicável? | Como desenhar |
|---|---|---|---|---|
| Pôster vermelho e azul com teia estilizada | Homem-Aranha (filmes e jogos) | Parede, entre os estojos e a janela | Não | Fundo dividido na diagonal em `--fan-red` e `--fan-blue`, moldura `--room-wood-dark`, teia **geométrica própria** num canto (5 raios + 3 arcos em `--room-paper`, no máximo 1/3 do pôster). Sem figura, aranha, olhos, máscara, título, letreiro ou composição de pôster oficial |
| Vaso com plantinhas verde e vermelha | Resident Evil 4 | Chão, sob a janela | Não | Vaso liso `--room-wood` com 2 ramos de folhas simples (`--fan-herb-green`, `--fan-herb-red`). Sem rótulo, moldura de "item", frasco ou spray |
| Lombadas com os nomes dos jogos | VALORANT, Counter-Strike, Resident Evil 4, Call of Duty, Homem-Aranha | Pilha deitada de estojos acima do monitor | **Sim** (estojos → `#alem-games`) | Lombadas `--room-paper` com o nome em **Atkinson Hyperlegible Mono 500**, `#15171C` (17.63 / 10.96:1); sem ícone, número estilizado, fonte oficial ou cor-assinatura. Texto decorativo (`aria-hidden`; os nomes estão no painel) |
| Mousepad vermelho-coral | VALORANT | Mesa, sob o mouse | Não | Retângulo `--fan-coral` liso, sem estampa nem "V" |
| Bola de vôlei | Vôlei | Chão, em frente à porta | **Sim** (→ `#alem-volei`) | Gomos genéricos, sem padrão de fabricante |

**Continua proibido (mesmo como aceno):**
- **Logos oficiais, inclusive redesenhados, simplificados ou "inspirados":** o "V" do VALORANT, os de Counter-Strike, Call of Duty, Resident Evil e Homem-Aranha, o emblema de aranha, logos de publishers e plataformas (Riot, Valve, Capcom, Activision, Marvel, Sony, consoles) e o **símbolo da Umbrella** em qualquer forma (octógono ou guarda-chuva vermelho e branco).
- **Personagens, máscaras e rostos:** agentes, operadores, a máscara ou os olhos do Homem-Aranha, balaclava com caveira, criaturas, silhuetas de personagens e poses características.
- **Arte, capturas e fontes oficiais:** cartazes, capas, *key art*, *screenshots*, mapas, ícones de habilidade ou item e tipografias dos jogos ou filmes. Isso inclui o "site" do monitor, que não usa arte do Vértice nem de jogos.
- **Armas e mira:** nenhuma arma de qualquer tipo (facas, rifles, pistolas, granadas, C4, spike, munição) e nenhuma mira, HUD, minimapa ou interface de jogo.
- **Uniformes e trajes:** inclusive o traje vermelho e azul em figura ou manequim. Vermelho e azul só no pôster abstrato.
- **Teste final:** o aceno pode lembrar o hobby, mas não pode **ser** o material oficial. Se puder ser confundido com produto, logo ou arte da marca, volta a ser genérico.

### 9.2 Componentes e arquivo de configuração

**Cada objeto é um componente separado**, que desenha só o próprio SVG em **coordenadas locais** (0…l, 0…a). A posição, o destino, a vista e os enquadramentos ficam **num único arquivo**, `src/config/quarto.ts`, para que mover, trocar ou remover um objeto seja uma edição de configuração.

```
src/
  config/quarto.ts                     ← única fonte de posição, destino e vista
  components/quarto/
    Quarto.(astro|tsx)                 ← palco: <svg viewBox> + <ol> de objetos, lê a config
    objetos/Monitor.*  PortaRetrato.*  Mural.*  Caderno.*  Caixa.*  Estante.*  Quadros.*
            Lenco.*  Bola.*  Headset.*  Estojos.*  Envelope.*
    decoracao/Janela.*  Poster.*  Vaso.*  Mesa.*  Mesinha.*  Cadeira.*  Tapete.*
              Luminaria.*  Interruptor.*  MouseMousepad.*  Varal.*
    vistas/Vista.*                     ← <dialog> + barra; escolhe a moldura por `vista.tipo`
  scripts/quarto.ts                    ← câmera, teclado, histórico, lidos, legenda, modo
```
A extensão fica a critério do `arquiteto` (ex.: `.astro`, sem runtime de framework).

**Formato da configuração:**

```ts
// src/config/quarto.ts
export type Rect = { x: number; y: number; l: number; a: number }; // unidades do viewBox 1600×1000

export type TipoVista =
  | 'tela' | 'cortica' | 'estante'                                   // "dentro" do objeto
  | 'porta-retrato' | 'caderno' | 'caixa' | 'tecido' | 'carta';      // painel estilizado

export interface ObjetoQuarto {
  id: string;                    // 'mural' — também é o data-objeto e o prefixo das chaves de texto
  componente: string;            // 'Mural' → components/quarto/objetos/Mural.*
  papel: 'principal' | 'secundario';
  capitulo: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  ordem: number;                 // posição no Tab dentro de todos os objetos (1…12)
  destino: string;               // id do HTML: 'experiencia', 'certificacoes', 'alem-games'…
  secao: string;                 // seção que contém o destino: 'formacao', 'alem'…
  caixa: Rect;                   // onde o desenho é posicionado
  clique?: Rect;                 // área clicável (padrão = caixa)
  etiqueta?: { x: number; y: number }; // padrão = canto superior esquerdo da caixa
  marcador: { x: number; y: number };  // âncora do marcador flutuante (centro da ponta), em parede ou chão livres (11.1)
  lampada?: { x: number };       // só para 'principal'
  vista: {
    tipo: TipoVista;
    camera: Rect;                // enquadramento 16:10 (l / a = 1.6)
    janela?: Rect;               // obrigatório se tipo ∈ tela|cortica|estante
    lado?: 'esquerda' | 'direita'; // lado do painel estilizado (padrão: 'direita')
  };
  mobile: { ladrilho: number | null; desenhos: string[] }; // null = não vira ladrilho (secundários)
  textos: string;                // prefixo das chaves: 'quarto.objetos.mural'
}

export interface DecoracaoQuarto {
  id: string; componente: string; caixa: Rect;
  noite?: boolean;               // muda com o tema (janela, luminária, interruptor)
}

export const quarto = {
  viewBox: { l: 1600, a: 1000 },
  varal: { y: 75, de: 20, ate: 1580 },
  objetos: [
    { id: 'monitor', componente: 'Monitor', papel: 'principal', capitulo: 1, ordem: 1,
      destino: 'vertice', secao: 'vertice',
      caixa: { x: 110, y: 330, l: 280, a: 250 }, lampada: { x: 250 },
      vista: { tipo: 'tela', camera: { x: 70, y: 330, l: 360, a: 225 },
               janela: { x: 124, y: 342, l: 252, a: 158 } },
      mobile: { ladrilho: 1, desenhos: ['Monitor'] }, textos: 'quarto.objetos.monitor' },
    // … demais objetos com os valores da tabela 4.2
  ] satisfies ObjetoQuarto[],
  decoracao: [ /* janela, pôster, vaso, mesa… (tabela 4.2) */ ] satisfies DecoracaoQuarto[],
} as const;
```

**Validação no build** (falha o build se algo quebrar):
- todo `destino` e toda `secao` existem como `id` no HTML, nos dois idiomas;
- `ordem` é única e segue `capitulo`; cada capítulo tem exatamente 1 `principal`, com `lampada`;
- toda `camera` tem proporção 1.6 (±0.01) e cabe no `viewBox`; toda `janela` fica dentro da `camera`;
- nenhum `clique` se sobrepõe a outro; todo `clique` mede ≥ 44×44 px no palco de 728 px (≥ 97×97 unidades);
- o retângulo de cada **marcador** (11.1, incluindo a amplitude da flutuação) não toca nenhuma etiqueta, nenhum `clique` de outro objeto, as `caixa`s dos objetos e da decoração, nem a **faixa do nome** (`y < 50` e `x < 1060`);
- `vista.tipo` ∈ {tela, cortica, estante} ⇒ `janela` presente; secundários têm `mobile.ladrilho = null`;
- todas as chaves de texto `textos.*` (10.2) existem em pt e en.

O JS do quarto **não tem coordenadas fixas no código**: ele lê a config, serializada no HTML como `<script type="application/json" id="quarto-config">` (≤ 3 KB).

### 9.3 Abordagem técnica

**DOM + SVG inline, sem canvas e sem bibliotecas de animação.** Os objetos são `<a>` reais. O SVG é só o desenho, pintado por variáveis CSS. A câmera é um único `viewBox` interpolado em `requestAnimationFrame` **apenas durante os 400 ms do zoom**, sem loop contínuo. Durante o zoom, desligue os efeitos de hover (`pointer-events: none` no palco) e use `will-change: transform` só no fallback com `transform`.

### 9.4 Orçamento de performance (Lighthouse ≥ 90 nas 4 categorias, mobile simulado)

| Recurso | Orçamento |
|---|---|
| HTML por idioma (todo o conteúdo + SVG inline + config + intro + menu) | ≤ 56 KB gzip |
| SVG do quarto (componentes + decoração + profundidade e luzes, após SVGO) | **≤ 11 KB gzip** (mantido), ≤ 48 KB bruto, ≤ 450 elementos |
| CSS total (8 molduras de vista, marcadores, intro, pílula) | ≤ 22 KB gzip |
| JS: script inline no `<head>` (tema, modo, decisão da intro) | ≤ 1,2 KB |
| JS: `quarto.ts` compilado (câmera, teclado, histórico, vistas, modo, marcadores, menu, intro) | ≤ 11 KB gzip, `type="module"` |
| Fontes | ≤ 110 KB, 2 `preload` |
| **Imagens raster** | **nenhuma** (a captura do Vértice saiu; o monitor mostra um "site" em HTML) |
| Requisições no 1º carregamento | ≤ 7, todas no mesmo domínio |
| **Metas** | LCP ≤ 2,0 s (o LCP é o **texto** do resumo) · TBT ≤ 100 ms · CLS ≤ 0,02 · **INP ≤ 200 ms** (o handler de clique só agenda o zoom; nada pesado no mesmo quadro) · zoom com quadros ≤ 16 ms em desktop e ≤ 33 ms em celular médio (senão, usar o fallback `transform`) |

- **CLS:** modo e tema decididos antes da pintura; `aspect-ratio: 16/10` no palco; ladrilhos com altura mínima; fontes com fallback ajustado. O dialog fica no *top layer* e não desloca o layout.
- **SEO e boas práticas:** `<html lang>`, `hreflang` pt/en, `canonical` sem `?modo` e sem hash, meta description, objetos como `<a href>` rastreáveis e nenhum erro no console.

---

## 10. Notas para o `redator`, o `arquiteto` e o `dev-frontend`

### 10.1 `id`s estáveis (iguais em pt/en)

`ficha`, `quarto`, `vista` (dialog), `vertice`, `sobre`, `experiencia`, `exp-kpmg`, `exp-salesforce`, `exp-cushman`, `projetos`, `projeto-stocksage`, `projeto-energigreen`, `habilidades`, `formacao`, `formacao-ia`, `certificacoes`, `alem`, `alem-escotismo`, `alem-volei`, `alem-games`, `contato`.

### 10.2 Chaves de texto novas (pt e en)

| Chave | Conteúdo | Exemplo pt (ilustrativo) |
|---|---|---|
| `topo.modoRecrutador` / `topo.explorarQuarto` / `topo.pularConteudo` | botão de modo e link de pular | "Modo recrutador" / "Explorar o quarto" / "Pular para o conteúdo" |
| `topo.luz.apagar` / `topo.luz.acender` / `topo.luz.rotuloAcessivel` | interruptor | "Apagar a luz" / "Acender a luz" / "Tema escuro" |
| `status.modoAtivado.recrutador` / `.quarto` | anúncio `role="status"` | "Modo recrutador ativado" |
| `resumo.transicao` | selo | "Em transição para IA" |
| `quarto.titulo` | rótulo do `<nav>` | "Quarto: escolha um objeto" |
| `quarto.ajuda` | instrução para leitor de tela | "8 capítulos em 12 objetos. Use Tab ou as setas para escolher, Enter para abrir e Esc para voltar." |
| `quarto.dica.ponteiro` / `quarto.dica.toque` | dica de ordem | "Clique nos objetos. Sugestão: comece pelo 01." / "Toque num objeto. Sugestão: comece pelo 01." |
| `quarto.legendaTeclas` / `quarto.legendaPonteiro` | dica da legenda | "Enter abre · ← → troca de objeto" / "Clique para aproximar" |
| `quarto.objetos.<obj>.tema` / `.comum` / `.legenda` | rótulos e legenda (a legenda **não cita nomes de jogos**) | "O porta-retrato" · "Sobre mim" · "Quem eu sou e de onde vim." |
| `quarto.estado.lido` / `quarto.estado.proximo` | texto oculto dos estados | "lido" / "próximo sugerido" |
| `vista.voltar` | botão da barra | "Voltar ao quarto" |
| `vista.anterior` / `vista.proximo` | navegação entre capítulos | "Capítulo anterior" / "Próximo capítulo" |
| `vista.atalho.certificacoes` / `.volei` / `.games` | atalhos no topo da vista (mobile) | "Ir para Certificações" / "Ir para Vôlei" / "Ir para Games" |
| `vertice.navegador.endereco` | texto da barra de endereço desenhada | "verticetour.com.br" |
| `vertice.navegador.nota` | nota da representação | "Representação ilustrada. O site real está em verticetour.com.br" |
| `vertice.ctaSiteReal` | CTA secundário | "Ver o site real" |
| `formacao.prateleiras.ia` / `.concluida` / `.certificacoes` | plaquinhas das prateleiras | "IA, em andamento" / "Formação concluída" / "Os quadros · Certificações" |
| `contato.assinatura` | assinatura da carta | "Matheus" |
| `habilidades.comoTrabalho.titulo` + `.itens[]` (nome + evidência) | competências | "Como eu trabalho" |
| `alem.volei.titulo` / `alem.volei.texto` | bloco `#alem-volei` | "Vôlei" / 1–2 frases |
| `alem.games.titulo` / `.texto` / `.lista[]` / `.filmes` / `.origemVertice` | bloco `#alem-games` | … / ["VALORANT", "Counter-Strike", "Resident Evil 4", "Call of Duty"] / "Também acompanho os filmes e jogos do Homem-Aranha." / "Foi daqui que nasceu o Vértice" |

- `<obj>` ∈ `monitor`, `porta-retrato`, `mural`, `caderno`, `caixa`, `estante`, `quadros`, `lenco`, `bola`, `headset`, `estojos`, `envelope`. As chaves da janela **saem** (agora ela é decorativa e não tem texto).
- Os nomes nas lombadas vêm de `alem.games.lista` mais "Homem-Aranha" / "Spider-Man" (`alem.games.lombadaExtra`), para que pt e en fiquem coerentes.
- **Pré-requisito factual:** vôlei, a lista de jogos e o Homem-Aranha estão hoje só em `content/fonte/hobbies.md`. O `pesquisador-perfil` precisa registrá-los em `perfil.json` antes de o redator escrevê-los. Até lá, `#alem-volei`, `alem.games.lista`, `alem.games.filmes` e o texto das lombadas não vão ao ar (as lombadas ficam lisas).

### 10.3 Testes

360, 768, 1024 e 1280 px; luz acesa e apagada; zoom do navegador em 200% e 400%; só teclado (Tab na ordem dos capítulos, Esc devolvendo o foco); NVDA + Firefox e VoiceOver + Safari com vista aberta; `forced-colors`; reduced motion (corte direto); JS desligado (abre no modo recrutador); `?modo=recrutador#exp-kpmg`; `/#certificacoes` (abre a estante já aproximada e rolada); voltar do navegador após abrir, navegar entre capítulos e voltar (deve cair no quarto em um passo); troca de idioma com vista aberta; e medição do zoom no painel Performance do DevTools com CPU 4× mais lenta. Os testes da revisão 5 estão em 11.7.

---

## 11. Revisão 5: elementos inspirados na referência externa

Fonte: `docs/referencias/raomuhammadhamza.md`. **Regra: inspirar-se, não copiar.** O site de referência é um quarto 3D noturno com intro de "treinando um modelo", marcadores em losango e menu em pílula. Daqui **não** entram: a cena, a composição, a paleta rosa-neon, os textos, o robô, a intro de treino de modelo ou curva de *loss*, o losango como marcador, o clima noturno como padrão e o 3D real. Entram as **ideias** de interação, redesenhadas com o nosso sistema: luzinhas, papel, `--accent`/`--pine` e SQL.

### 11.1 Marcadores flutuantes

**Forma própria: uma "lâmpada-pino".** É um círculo de 20 px com uma ponta de 6 px apontando para o objeto, o mesmo vocabulário das lâmpadas do varal. Não usamos losango (forma da referência) nem círculo com anel concêntrico (lembraria uma mira, proibida em 9.1).

| Estado (integrado a 5.3) | Visual | Movimento |
|---|---|---|
| **Não lido** | preenchimento `--surface`, anel 2 px `--accent`, ponto central de 6 px `--accent`, contorno externo de 1.5 px `--text` | flutua 4 px (`translateY`) em 1,6 s `ease-in-out`, **3 ciclos (4,8 s)** e para |
| **Próximo sugerido** (1 por vez) | preenchimento `--accent` e ponto central `--on-accent`, com 24 px de diâmetro | flutua como os outros e **pulsa 2×** (anel `--accent` que se expande 1 → 1.6 e some) |
| **Lido** | preenchimento `--pine-tint` com ✓ `--pine` de 10 px, sem ponto | **parado** |
| **Hover / foco no objeto** | `scale(1.15)`, preenchimento `--accent` (como o próximo) | — |
| **Secundários** (quadros, bola, headset, estojos) | mesmos estados, em 16 px | idem |
| **Zoom / vista aberta / intro** | ocultos (`opacity: 0`, 120 ms) | — |

- **Posição:** a âncora vem de `marcador` na config (9.2), sempre em **parede ou chão livres** acima ou ao lado do objeto, com a ponta voltada para ele. O validador garante que o marcador, incluindo os 4 px de flutuação, **não cobre arte, etiquetas, áreas de clique de outros objetos nem a faixa do nome**.
- **Marcação:** um `<span class="marcador" aria-hidden="true">` dentro do `<a class="objeto">`. Clicar no marcador abre o objeto. O estado já está no nome acessível (5.3), então o marcador não repete nada para leitores de tela.
- **Relação com a etiqueta e o varal:** o "próximo sugerido" passa a ser sinalizado **só pelo marcador** (o ponto da etiqueta sai). O ✓ de lido aparece no marcador e na lâmpada do varal.
- **WCAG 2.2.2:** a flutuação termina em ≤ 5 s e só recomeça quando o visitante volta ao quarto. Com **reduced motion**, os marcadores ficam **estáticos**.
- **Mobile (nichos):** o marcador fica no canto superior direito do ladrilho, estático, com os mesmos estados.
- **Contraste (≥ 3:1, não textual):** contorno `--text` contra `--room-wall` 14.82 / 12.95 e contra `--room-floor` (#C9B79A / #2A2622) 9.16 / 12.28; anel `--accent` contra `--room-wall` 4.60 / 6.78; ✓ `--pine` sobre `--pine-tint` 5.34 / 6.43; ponto `--on-accent` sobre `--accent` 5.56 / 7.88.

### 11.2 Intro temática: "query carregando o quarto"

**Tema próprio:** uma consulta SQL, a linguagem que o Matheus usou em contexto real (Cushman & Wakefield), "carrega" a trajetória e acende o quarto. Não há treino de modelo, *loss*, *epochs* nem robô.

```
┌ cartão --surface sobre o palco, mono 15px ───────────────────────────────┐
│ -- carregando o quarto de Matheus Maki Nagano                (--text-muted)│
│ SELECT ano, capitulo FROM trajetoria          (palavras-chave em --accent) │
│ WHERE cidade = 'São Paulo' AND ano BETWEEN 2019 AND 2026                   │
│ ORDER BY ano;                                                              │
│ [██████████░░░░░░] executando…        (trilho --surface-2, barra --accent) │
│ ✓ 8 capítulos · 2019 Sistemas de Informação → 2026 Vértice · Dados → IA    │ (--pine)
│                                                            [ Pular ]       │
└────────────────────────────────────────────────────────────────────────────┘
```

**Linha do tempo (2,5 s no total):**

| Tempo | O que acontece |
|---|---|
| 0–1,2 s | As 4 linhas da query aparecem uma a cada 300 ms (opacidade + `clip-path` de 120 ms; **sem digitação letra a letra**). O quarto aparece atrás, com a luz baixa (opacidade de 30%) |
| 1,2–1,8 s | A barra "executando…" se enche (600 ms). É progresso da consulta, não uma métrica sobre o Matheus |
| 1,8–2,1 s | A linha de resultado aparece em `--pine` |
| 2,1–2,5 s | O cartão some (400 ms), o quarto chega à opacidade total e as lâmpadas do varal **piscam uma vez da esquerda para a direita** antes de assumir o estado real (lidas acesas, não lidas apagadas). Os marcadores entram |

**Regras:**
- **Botão "Pular"** (`<button>`, secundário, 44 px, nome acessível "Pular introdução"). Esc e um clique em qualquer ponto do palco também pulam. Ao pular, o overlay some em 120 ms e o quarto fica no estado final.
- **Só na 1ª visita:** a chave `quarto-intro-vista` é gravada em `localStorage` **quando a intro começa**, então recarregar não repete.
- **Nunca aparece:** no modo recrutador; sem JS; com `prefers-reduced-motion: reduce`; com `#id` na URL (link direto); com `?modo=` na URL; com `navigator.connection.saveData`; abaixo de 768 px (não há palco); na impressão.
- **A decisão é do script inline do `<head>`**, antes da pintura: ele define `<html data-intro>`. O overlay é **HTML estático dentro do palco**, oculto por padrão e mostrado por CSS quando `data-intro` existe. Por isso não há CLS e não há dependência do módulo JS.
- **Não bloqueia o LCP nem o conteúdo:** o overlay cobre **só o palco**. O topo (com o botão "Modo recrutador" como 1º focável), o nome e o resumo ficam visíveis e clicáveis desde o 1º frame. O cartão é menor que o bloco do nome e da frase, então não vira o elemento de LCP.
- **Linha do tempo 100% em CSS** (`animation-delay`, terminando com `visibility: hidden` em 2,5 s). Se o JS atrasar ou falhar, a intro termina sozinha. O JS só trata "Pular", Esc, clique e `localStorage`.
- **Objetos ocultos durante a intro:** `html[data-intro] .objeto { visibility: hidden }` com uma animação discreta que os torna visíveis em 2,5 s. Assim eles não recebem foco nem clique por trás do overlay. A ordem de `Tab` durante a intro é: topo → resumo → "Pular" → menu.
- **Acessibilidade:** as linhas são `aria-hidden` (decorativas); só o botão é anunciado. Não há região viva.
- **Lastro factual:** São Paulo (cidade), 2019 (início de Sistemas de Informação), 2026 (Vértice), "Dados → IA" (posicionamento aprovado) e "8 capítulos" (estrutura do site). `trajetoria` é um nome de tabela ilustrativo, não um fato.
- **Contraste:** `--text` sobre `--surface` 17.93 / 13.63; palavras-chave `--accent` 5.56 / 7.13; comentário `--text-muted` 7.62 / 6.84; resultado `--pine` 6.35 / 7.70; barra `--accent` sobre `--surface-2` 4.54 / 6.23 (≥ 3:1).

### 11.3 Nome grande sobre a cena

- **Estrutura:** o `<h1>Matheus Maki Nagano</h1>` sai de dentro de `#ficha` e passa a ser o 1º filho de `<main>`. A seção `#ficha` ganha um `<h2 class="sr-only">{ficha.titulo}</h2>` ("Resumo"). No mobile, no tablet e no modo recrutador, o h1 continua visualmente no topo do resumo, como antes.
- **Desktop (≥ 1024, modo quarto):** a grade de `main` tem as áreas `"resumo nome" / "resumo palco" / "resumo barra"`. O h1 fica na área `nome`, alinhado à esquerda do palco, em Bricolage 800 com `font-size: clamp(2rem, 5.6cqi, 3rem)` (cerca de 34 px num palco de 600 px e 48 px num de 848 px). Ele **invade só a faixa livre de parede do topo do palco**, com `margin-bottom: -3.125cqi`, o equivalente a 50 unidades do `viewBox`.
- **Faixa do nome reservada:** `y < 50` e `x < 1060` no `viewBox`, sem varal (y 60–90) e sem luminária (movida para x 1100–1180; ver 4.2). O validador da config proíbe qualquer elemento nessa faixa.
- **1ª tela em 1280×800:** topo 64 + nome ≈ 35 (descontada a sobreposição) + palco 848×530 + barra 88 (legenda + pílula) + respiros 48 = **765 px** ≤ 800. Se a janela for mais baixa, o palco encolhe: `altura = min(largura / 1.6, 100dvh − 64 − 35 − 88 − 48)`.
- **1ª tela em 360:** **inalterada** (topo, nome de 32 px, frase, provas e CTA; os nichos começam logo abaixo).
- **Contraste:** o nome em `--text` sobre `--bg` (16.30 / 15.06) e, na faixa sobreposta, sobre `--room-wall` (14.82 / 12.95).

### 11.4 Menu numerado em pílula

```
≥ 1024, palco < 880 px (ex.: 1280×800)       palco ≥ 880 px (ex.: 1440+)
      ┌──────────────────────────────┐        ┌──────────────────────────────────────────────────────────────┐
      │ 01 02 03 04 05 06 07 08      │        │ 01 Vértice  02 Sobre  03 Experiência  04 Projetos  05 …  08 Contato │
      └──────────────────────────────┘        └──────────────────────────────────────────────────────────────┘
 legenda acima: "03 · O mural · Experiência: …"
```

- **Marcação:** `<nav id="capitulos" aria-label="{menu.rotulo}"><ol>` com 8 `<a href="#vertice">` contendo `<span class="num">01</span><span class="nome">Vértice</span>` (nome comum da seção). Quando o nome não aparece, ele fica em `sr-only`, e o nome acessível é sempre "01 Vértice".
- **Lugar:** na área `barra`, sob o palco e centralizado nele, com `position: sticky; bottom: 16px`. No desktop, como a página não rola, ela fica fixa na prática. No tablet, acompanha a rolagem enquanto o quarto está na tela. **Nunca fica sobre a cena** (não cobre arte nem marcadores). A legenda (5.5) passa a ser uma linha logo acima da pílula.
- **Visual:** `--surface`, borda 1.5 px `--text`, `--radius-full`, `--shadow-2`, altura de 52 px e itens com ≥ 44×44 px. Número em mono 13 `--text-muted` e nome em Atkinson 500 14 `--text`.

| Estado do item | Visual |
|---|---|
| Repouso | como acima |
| Hover / foco | fundo `--surface-2` / anel padrão (`outline-offset: 2px`) |
| **Ativo** (vista aberta naquele capítulo) | fundo `--text`, texto `--surface` (17.93 / 13.63), `aria-current="true"`; o fundo desliza entre itens em 200 ms (instantâneo em reduced motion) |
| Em foco no quarto (objeto em hover ou foco) | fundo `--surface-2` sincronizado |
| Lido | ✓ `--pine` de 10 px no canto do número |
| Próximo sugerido | ponto `--accent` de 6 px no canto do número |

- **Comportamento:** clicar abre a vista do capítulo (zoom a partir do quarto, com `pushState`). Com uma vista aberta, a pílula é **movida para o rodapé do `<dialog>`** (uma única instância, como as seções), e clicar em outro número faz a câmera viajar (`replaceState`). Os botões "anterior/próximo" da barra da vista continuam lá.
- **Convivência:** o botão de modo, o idioma e o tema ficam **no topo**, e a pílula fica **embaixo**, sem disputar espaço. Com uma vista aberta, o topo fica inerte (modal); para trocar idioma ou tema, o visitante fecha a vista. No modo recrutador, a pílula **não existe** (a nav do topo cumpre o papel). Sem JS, os links funcionam pelo fallback `:target`.
- **Mobile (< 768):** na página de nichos, a pílula **fica oculta**, porque a própria grade já é o menu numerado. Dentro de uma vista em tela cheia, o rodapé fixo vira `[←] [03 · Experiência ▾] [→]`, e o botão central abre uma lista (`popover`) com os 8 capítulos em linhas de 48 px, o ativo destacado e ✓ nos lidos.
- **Tablet (768–1023):** só os números; o nome do item em foco ou ativo aparece na legenda.

### 11.5 2D com profundidade (3/4 frontal)

**Decisão:** é uma **perspectiva 3/4 frontal** com ponto de fuga central em `(800, 420)` no `viewBox`. As **faces frontais continuam exatamente nas coordenadas da config** (4.2), e a profundidade vem de **faces extrudadas** (12 a 24 unidades), piso em trapézio e paredes laterais estreitas. Câmeras, cliques e vistas não mudam; só os desenhos mudam. Não há 3D real nem Three.js.

- **Faces:** objetos abaixo da linha do olhar (y 420) mostram o **topo**; acima dela, a **face de baixo**. À esquerda do centro aparece a face lateral **direita**; à direita, a **esquerda**. Cada face é um único `path` num tom próprio (topo mais claro, lateral mais escura).
- **Piso e paredes:** o piso vira um trapézio da base da parede (y 760) até a borda (y 1000), e as paredes laterais são faixas em ângulo nas bordas (x 0–40 e 1560–1600). O tapete vira um trapézio.
- **Luzes** (formas chapadas com opacidade; sem `filter`, sem `blur`, sem gradiente):

| Luz | Dia | Noite |
|---|---|---|
| **LED sob a mesa** | faixa apagada `--led-off` | faixa `--led` + halo trapezoidal no chão e na parede (`--led-halo`) |
| **Brilho do monitor** | — | cone `--glow` na mesa e reflexo retangular no topo do monitor |
| **Luminária de teto** | cone `--lamp-cone` sobre a caixa e a mesinha | apagada (sem cone) |
| **Janela** | faixa de luz `--window-light` no chão, em diagonal | luar fraco (mesma forma em `--glow` a 50%) |
| **Lâmpadas do varal** | — | halo `--glow` nas lidas |

- **Sombras chapadas:** as sombras de contato dos móveis e objetos no chão são paralelogramos em `--shadow-floor`, projetados para a direita e para baixo (luz do dia vinda da janela). À noite, a mesma forma fica mais escura e curta.
- **Tokens novos (decorativos):**

| Token | Dia | Noite |
|---|---|---|
| `--room-top` (topos de madeira) | `#C08E62` | `#5E4634` |
| `--room-side` (laterais de madeira) | `#8E6240` | `#3F2F23` |
| `--room-metal-top` | `#3A3F4A` | `#1A1D24` |
| `--room-sidewall` | `#E6DFD0` | `#1A1E2B` |
| `--shadow-floor` | `rgba(21,23,28,.12)` | `rgba(0,0,0,.35)` |
| `--led-off` / `--led` | `#D6D2C6` / — | — / `#5CC2A4` |
| `--led-halo` | `transparent` | `rgba(92,194,164,.22)` |
| `--lamp-cone` | `rgba(242,184,75,.12)` | `transparent` |
| `--window-light` | `rgba(255,253,247,.35)` | `rgba(255,210,122,.09)` |

  O LED usa o verde-água do sistema, não neon rosa: o clima segue claro por padrão e é calmo à noite.
- **Contraste AA mantido:** nenhum texto passa a ficar sobre luz ou sombra. Etiquetas, marcadores, nome e pílula têm fundo próprio ou ficam sobre parede lisa (valores em 11.1 e 11.3). O foco duplo continua garantido contra qualquer cor (3.3). Os halos não podem passar por baixo das etiquetas (o validador verifica as `caixa`s das luzes).
- **Orçamento: ≤ 11 KB gzip (mantido).** Técnicas: no máximo 3 `path`s por objeto (frente, topo e lateral); luzes e sombras como `path`s simples reaproveitados com `<use>`; SVGO com precisão 0; nenhum `filter`, máscara ou gradiente; limite de 450 elementos. O CI mede o tamanho gzip do SVG e falha acima de 11 KB.

**Objetos que precisam ser redesenhados:**

| Grupo | Componentes | O que muda |
|---|---|---|
| **Novos** | `Piso`, `ParedesLaterais`, `Luzes` (LED, cones, janela, monitor), `Sombras` | criados do zero |
| **Profundidade completa** (topo + lateral + sombra) | `Mesa` (com faixa de LED), `Mesinha`, `Estante` (prateleiras com fundo), `Caixa` (tampa em ângulo), `Cadeira`, `Monitor` (corpo, suporte e reflexo) | redesenho |
| **Espessura e sombra** | `Mural`, `Quadros`, `Janela` (peitoril e recuo), `Porta` (batente), `Pôster`, `PortaRetrato` (suporte em ângulo), `Caderno` (topo visível), `Estojos` (face de baixo, porque ficam acima da linha do olhar), `Vaso` (boca elíptica), `Tapete` (trapézio) | ajuste |
| **Só sombra de contato e sombreado** | `Bola` (crescente de sombra), `Headset`, `Lenco`, `Envelope`, `MouseMousepad`, `Luminaria` (agora em x 1100), `Interruptor`, `Varal` | ajuste mínimo |

### 11.6 Chaves de texto novas (pt e en)

| Chave | pt (ilustrativo) | en (ilustrativo) |
|---|---|---|
| `ficha.titulo` (h2 oculto) | "Resumo" | "Summary" |
| `intro.linhas[0]` | "-- carregando o quarto de Matheus Maki Nagano" | "-- loading Matheus Maki Nagano's room" |
| `intro.linhas[1]` | "SELECT ano, capitulo FROM trajetoria" | "SELECT year, chapter FROM journey" |
| `intro.linhas[2]` | "WHERE cidade = 'São Paulo' AND ano BETWEEN 2019 AND 2026" | "WHERE city = 'São Paulo' AND year BETWEEN 2019 AND 2026" |
| `intro.linhas[3]` | "ORDER BY ano;" | "ORDER BY year;" |
| `intro.executando` | "executando…" | "running…" |
| `intro.resultado` | "8 capítulos · 2019 Sistemas de Informação → 2026 Vértice · Dados → IA" | "8 chapters · 2019 Information Systems → 2026 Vértice · Data → AI" |
| `intro.pular` / `intro.pularRotulo` | "Pular" / "Pular introdução" | "Skip" / "Skip intro" |
| `menu.rotulo` | "Capítulos" | "Chapters" |
| `menu.itens.<id>` (8, nome comum) | "Vértice", "Sobre", "Experiência", "Projetos", "Habilidades", "Formação", "Além do trabalho", "Contato" | "Vértice", "About", "Experience", "Projects", "Skills", "Education", "Beyond work", "Contact" |
| `menu.todos` (mobile) | "Todos os capítulos" | "All chapters" |

- As palavras-chave SQL (`SELECT`, `FROM`, `WHERE`…) ficam iguais nos dois idiomas. Os marcadores não têm texto (o estado está em `quarto.estado.*`).
- Lastro de cada fato da intro: `perfil.json` (cidade, formação com início em 2019, Vértice em 2026) e o rótulo aprovado "Dados → IA". O `verificador-fatos` deve conferir `intro.resultado` nos dois idiomas.

### 11.7 Tarefas para o `dev-frontend` (sobre o site publicado)

1. **Config (`src/config/quarto.ts`):** adicionar `marcador` a cada objeto; mover a luminária para `1100, 0, 80, 110`; reservar a faixa do nome; estender o validador (marcadores sem colisão, faixa do nome livre, halos fora das etiquetas).
2. **Marcador:** criar `components/quarto/Marcador.*` com os estados de 11.1 e ligá-lo ao estado de lido/próximo que já existe em `sessionStorage`; remover o ponto de "próximo" da etiqueta; flutuação de 3 ciclos, reiniciada a cada volta ao quarto; estático com reduced motion e nos ladrilhos.
3. **Intro:** HTML estático no palco; linha do tempo só em CSS; condição no script do `<head>` (`data-intro`); JS para "Pular", Esc, clique e `localStorage` (`quarto-intro-vista`); objetos com `visibility: hidden` até o fim.
4. **Nome grande:** mover o `h1` para o início de `<main>`; adicionar o `h2` oculto em `#ficha`; criar as áreas de grade `nome/palco/barra`; aplicar `clamp(2rem, 5.6cqi, 3rem)` e a sobreposição de `-3.125cqi`; conferir a 1ª tela em 1280×800 e em 360.
5. **Pílula:** criar o componente `Capitulos.*` sticky na área `barra`; mover a pílula para o `<dialog>` quando a vista abre; implementar ativo, lido e próximo; nomes por container query (palco ≥ 880 px); no mobile, rodapé `[←][03 ▾][→]` com `popover`; ocultar no modo recrutador.
6. **SVG 3/4:** redesenhar conforme a tabela de 11.5; criar os tokens novos; medir o SVG em gzip no CI (≤ 11 KB) e o total de elementos (≤ 450).
7. **Textos:** carregar as chaves de 11.6 em pt e en.
8. **Verificação:**
   - Lighthouse ≥ 90 nas 4 categorias, com e sem intro (limpe o `localStorage`). O elemento de LCP continua sendo texto (nome ou frase), e o CLS fica ≤ 0,02 com a intro.
   - A intro **não** aparece: com reduced motion, em `/#vertice`, com `?modo=recrutador`, sem JS e na 2ª visita.
   - O "Modo recrutador" continua sendo o 1º `Tab` durante a intro.
   - Os marcadores param em ≤ 5 s e não cobrem arte nem etiquetas em 768, 1024, 1280 e 1440 px.
   - A pílula não cobre o palco.
   - Tudo funciona em `forced-colors`.

---

## 12. Revisão 6: quarto em tela cheia, arte raster e 8 objetos

Fonte: `content/fonte/decisao-gamificacao.md`, seção "Revisão 6". O Matheus achou o quarto pequeno, o SVG simplificado e com espaço vazio, e não gostou dos cliques repetidos levando ao mesmo lugar. **Esta seção prevalece** sobre as anteriores onde houver conflito.

### 12.0 O que muda e o que continua

| Sai | Entra |
|---|---|
| Card lateral (resumo) ao lado do palco | Quarto em **100dvh** com HUD translúcido; o resumo vai para o **porta-retrato** (12.7) |
| Cena desenhada em SVG (componentes de objeto, 11.5) | **Uma imagem raster** (dia + noite) com camada de `<a>` posicionados em % (12.2) |
| 12 objetos clicáveis (com secundários) | **8 objetos**, 1 por capítulo, sem destinos repetidos (12.6) |
| Etiquetas separadas e varal com lâmpadas por capítulo | **Pino numerado** (marcador + número) e pílula 01…08 (12.8) |
| Nome grande sobre a faixa da parede (11.3) | Nome no HUD (12.1) |
| Câmera por `viewBox` | Câmera por `transform` na caixa da imagem (12.5) |
| "Zero imagens raster" (9.4) | Orçamento de imagem com LCP ≤ 2,5 s no mobile (12.9) |

**Continua valendo:** modo recrutador (1º focável, fallback sem JS e SEO, `?modo=recrutador`, script no `<head>` sem CLS); vistas "dentro" (monitor, mural, estante) e painéis estilizados; `<dialog>` com `#id`, Esc e voltar do navegador (5.6); teclado (7.1); reduced motion (8); intro (11.2, com o ajuste de 12.8); tokens e contraste das vistas (3); `id`s estáveis; PT|EN; acenos de fã e proibições (9.1); arquivo de configuração único (9.2, com as unidades de 12.6).

### 12.1 Tela cheia e HUD

```
DESKTOP / TABLET DEITADO (largura ≥ 768 e proporção ≥ 1.3) — 100dvh, sem rolagem
┌──────────────────────────────────────────────────────────────────────────────────┐
│┌ HUD esquerdo ──────────────────────────────────────────┐  ┌ HUD direito ──────┐│ ← 16px das bordas
││[≡ Modo recrutador] │ Matheus Maki Nagano · Dados → IA │ [Conversar no LinkedIn ↗]││  [PT|EN] [◑]       ││
│└────────────────────────────────────────────────────────┘  └───────────────────┘│
│                                                                                  │
│        ②₀₁                   ⓪₃                       ⓪₆                ⓪₇        │ ← pinos numerados
│   (imagem do quarto em cover, 16:9, objetos dentro da área segura)               │
│              ⓪₂          ⓪₄        ⓪₅                              ⓪₈             │
│                                                                                  │
│                    ┌ pílula: 01 02 03 04 05 06 07 08 ┐                           │ ← 16px da base
└──────────────────────────────────────────────────────────────────────────────────┘
```

- **Dois HUDs flutuantes** (pílulas), não uma barra inteira, para deixar o centro do topo livre para a arte.
  - **Esquerdo, na ordem do DOM:** botão "Modo recrutador" (**1º focável**), `h1` com o nome (Bricolage 700, `clamp(1.25rem, 1rem + .8vw, 1.75rem)`), "Dados → IA" (Atkinson 500 15, seta em SVG) e o CTA "Conversar no LinkedIn".
  - **Direito:** PT|EN e o interruptor de tema.
  - Abaixo de 1280 px, o HUD esquerdo quebra em 2 linhas: botão + nome na 1ª, "Dados → IA" + LinkedIn na 2ª.
- **Fundo translúcido com contraste garantido sobre qualquer imagem:**

| Tema | Fundo do HUD | Pior caso por trás | Fundo efetivo | `--text` | `--text-muted` |
|---|---|---|---|---|---|
| Claro | `rgba(255,255,255,.82)` + `backdrop-filter: blur(10px) saturate(1.2)` | preto | ≈ `#D1D1D1` | **11.74:1** | **4.99:1** |
| Claro | idem | branco | `#FFFFFF` | 17.93:1 | 7.62:1 |
| Escuro | `rgba(18,20,26,.88)` + mesmo blur | branco | ≈ `#2E3036` | **10.79:1** | **5.42:1** |
| Escuro | idem | preto | ≈ `#101217` | ≥ 15:1 | ≥ 7:1 |

  O contraste vale com ou sem `backdrop-filter`, porque a conta usa só a opacidade. O blur apenas acalma a textura.
  - **Proibido no HUD:** texto em `--accent` (no pior caso claro daria 3.64:1). A seta de "Dados → IA" em `--accent` é um elemento gráfico (≥ 3:1).
  - O CTA do LinkedIn tem fundo sólido `--accent` com texto `--on-accent` (5.56 / 7.88). A borda dele contra o fundo efetivo dá ≥ 3.64:1.
  - Borda do HUD: 1 px `rgba(21,23,28,.12)` no claro e `rgba(236,232,223,.14)` no escuro. Raio `--radius-full`, sombra `--shadow-2`.
  - Em `forced-colors`, o fundo vira `Canvas` sólido com borda `CanvasText`.
- **Pílula 01…08** (11.4), com o mesmo fundo translúcido do HUD, centralizada a 16 px da base. Mostra os nomes a partir de 1280 px e só os números abaixo disso; o nome do item em hover ou foco aparece num balão acima da pílula.
- **Rodapé:** não aparece no modo quarto (não há rolagem). O link "GitHub" fica na vista de Contato. No modo recrutador, o rodapé continua igual.
- **Faixas reservadas na imagem:** topo (y 0–13%) para os HUDs e base (y 88–100%) para a pílula. Nenhum objeto clicável nem pino fica nelas (o validador confere).

### 12.2 Arte raster: imagem, caixa e área segura

- **Proporção mestre: 16:9**, exportada em **3840×2160** (mínimo aceito: 2560×1440), PNG sRGB. Ver `docs/prompt-imagem-quarto.md`.
- **Caixa da cena:** um contêiner 16:9 que **cobre** a tela: `width: max(100vw, 177.78dvh)`, `height: max(56.25vw, 100dvh)`, centralizado, com `overflow: hidden` no pai. A `<img>` e a camada de `<a>` ficam **dentro da mesma caixa**, então as posições em % continuam alinhadas em qualquer proporção.
- **Área segura:** em 16:10 (1280×800, 1440×900) cortam-se cerca de 5% de cada lado; em 21:9, cerca de 12% em cima e embaixo. Por isso, **todos os objetos clicáveis ficam em x 6–94% e y 15–86%**.
- **Fora do quarto em tela cheia:** retrato e telas estreitas (largura < 768 **ou** proporção < 1.3, como tablet em pé) usam a estratégia mobile (12.3).
- **Formatos e `srcset`** (gerados por script a partir da mestre; ver 12.11):

```html
<picture>
  <source type="image/avif" media="(prefers-color-scheme: dark)" srcset="/img/quarto/noite-1280.avif 1280w, …-1920.avif 1920w, …-2560.avif 2560w, …-3840.avif 3840w" sizes="(min-aspect-ratio: 16/9) 100vw, 178vh">
  <source type="image/webp" media="(prefers-color-scheme: dark)" srcset="/img/quarto/noite-….webp …" sizes="…">
  <source type="image/avif" srcset="/img/quarto/dia-1280.avif 1280w, … 3840w" sizes="(min-aspect-ratio: 16/9) 100vw, 178vh">
  <source type="image/webp" srcset="/img/quarto/dia-….webp …" sizes="…">
  <img src="/img/quarto/dia-1920.webp" width="3840" height="2160" alt="{quarto.imagemAlt}"
       fetchpriority="high" decoding="async">
</picture>
```

| Largura | AVIF (máx.) | WebP (máx.) |
|---|---|---|
| 1280w | 90 KB | 130 KB |
| 1920w | 160 KB | 230 KB |
| 2560w | 260 KB | 380 KB |
| 3840w | 450 KB | 650 KB |

- **Preload** no `<head>`: `<link rel="preload" as="image" imagesrcset="…avif…" imagesizes="…" type="image/avif" media="(min-width: 768px) and (min-aspect-ratio: 13/10)">`. O script de tema troca o preload para "noite" quando a escolha manual for escuro.
- **LQIP:** uma versão de 32×18 px em WebP (≤ 600 bytes) entra em linha como `background-image` da caixa, para a tela nunca ficar vazia. Ela não conta como LCP.
- **`alt`:** uma frase curta (`{quarto.imagemAlt}`). Os objetos são anunciados pelos links.
- **Assinatura (6):** a imagem pede **tela do monitor lisa e iluminada**. Por cima dela entra um **SVG de sobreposição** (≤ 1 KB, `aria-hidden`), posicionado em % sobre a tela, com a linha da carreira que dobra em 2026, em cores de tema. Ela continua nítida e se desenha no 1º hover ou foco.

### 12.3 Mobile e telas em retrato: recorte + nichos com recortes

Decisão: **não** pedir uma imagem vertical à parte (duplicaria o trabalho do Matheus e quebraria a correspondência entre as versões) e **não** usar panorama com rolagem lateral (pesado para o LCP). Tudo sai da mesma imagem mestre, com recortes feitos no build:

1. **Herói recortado (100svh):** recorte vertical 9:16 da imagem mestre, centrado na mesa, no monitor e no porta-retrato (`recorteMobile` na config; padrão x 10–42%). Por cima:
   - no topo, o HUD em uma linha: [≡ Modo recrutador] … [PT|EN] [◑];
   - na base, um cartão translúcido com o nome (Bricolage 700, 32 px), "Dados → IA", [Conversar no LinkedIn ↗] e o link "Explorar o quarto ↓" (âncora para os nichos).
   - O herói não tem áreas clicáveis (evita links duplicados com os nichos).
   - Arquivos: `heroi-{dia|noite}-{480,720,1080}.avif/webp` (9:16), com máximo de 45 / 80 / 140 KB em AVIF e `fetchpriority="high"`. Esse é o **LCP mobile**.
2. **Nichos (4.3):** os 8 ladrilhos mostram um **recorte quadrado de cada objeto**, gerado a partir do retângulo `clique` com 15% de margem: `obj-<id>-{dia|noite}-{240,480}.avif/webp`, ≤ 12 KB cada, `loading="lazy"`, `alt=""` (o texto do ladrilho nomeia o objeto). O número do capítulo fica num pino no canto do ladrilho.
3. **Vistas:** em tela cheia, como em 4.4 (sem câmera).

Primeiro frame em 360×640: o HUD com "Modo recrutador" e o cartão com nome, Dados → IA e LinkedIn ficam visíveis sobre o recorte, e os nichos começam logo abaixo da dobra.

### 12.4 Modo noite: segunda imagem com a mesma composição

- **Preferido:** `quarto-noite.png`, com **a mesma câmera e a mesma composição** (objetos a ±0,5% da versão de dia). Luz de teto apagada, varal de luzinhas aceso, LED sob a mesa, tela do monitor iluminada e lua na janela (ver o prompt).
- **Seleção sem JS:** `<source media="(prefers-color-scheme: dark)">` cobre o caso comum. **Escolha manual diferente do sistema:** o script do `<head>` grava `data-theme` e troca o preload, e o módulo troca o `srcset` da `<picture>`. Na troca pelo interruptor, a nova imagem carrega e entra com opacidade em 320 ms (instantâneo em reduced motion); até lá, a imagem atual continua na tela.
- **Só a imagem do tema ativo é baixada.** A outra é pré-carregada quando o ponteiro passa pelo interruptor (`fetchpriority="low"`).
- **Fallback, se a imagem noturna não existir ou não estiver alinhada:** `filter: brightness(.5) saturate(.75)` na `<img>` mais uma camada `rgba(11,20,48,.35)` e um brilho do monitor em CSS (`radial-gradient` sobre a área da tela). É aceitável, mas fica abaixo da segunda imagem.

### 12.5 Zoom por `transform`

- A **câmera** de cada objeto passa a ser `{ cx, cy, escala }` em % da imagem (12.6). O zoom aplica `transform: translate(…) scale(escala)` na **caixa da cena** (imagem + camada de links + pinos), com `transform-origin: 0 0`. A translação é calculada para centralizar `(cx, cy)` e **limitada para não mostrar fora da imagem**.
- **400 ms `--ease-out` na ida e 320 ms na volta; corte direto em reduced motion.** Só `transform`, composto na GPU, com `will-change: transform` apenas durante a animação.
- **Escala máxima de 2×.** Acima disso, a imagem de 1920w perde nitidez. Em telas ≥ 1440 px, o `srcset` já escolhe 2560w ou 3840w. Atrás da vista, aplica-se uma película `rgba(18,20,26,.25)`.
- Pinos, HUD e pílula somem (opacidade em 120 ms) durante o zoom. A pílula reaparece **dentro do `<dialog>`** (11.4).
- **Vistas "dentro" (monitor, mural, estante):** a moldura HTML é posicionada sobre a `janela` do objeto convertida para px depois do zoom, com o mínimo de 560×360 px (4.4). A borda temática (bisel, cortiça, madeira) é **desenhada em CSS**, então não depende da precisão da imagem. Painéis estilizados ficam no lado `lado` da config.
- Histórico, foco, Esc e voltar do navegador: **sem mudança** (5.6).

### 12.6 Só 8 objetos clicáveis (composição em % da imagem)

| Cap. | Objeto | Destino | Vista | `clique` (x, y, l, a em %) | Pino (x, y em %) | Câmera (cx, cy, escala) | `janela` (%) |
|---|---|---|---|---|---|---|---|
| 01 | Monitor (na mesa) | `vertice` | dentro · `tela` | 18, 34, 14, 18 | 25, 30 | 25, 45, 2 | tela: 19.5, 35.5, 11, 11.5 |
| 02 | Porta-retrato (na mesa) | `sobre` (com `ficha`, 12.7) | painel · `porta-retrato` | 33, 47, 5, 11 | 35.5, 43 | 42, 50, 2 | — |
| 03 | Mural de cortiça | `experiencia` | dentro · `cortica` | 40, 18, 14, 20 | 47, 16 | 47, 30, 1.8 | cortiça: 41, 19.5, 12, 17 |
| 04 | Caderno (na mesinha) | `projetos` | painel · `caderno` | 43, 58, 8, 6 | 47, 54 | 50, 60, 2 | — |
| 05 | Caixa de ferramentas (no chão) | `habilidades` | painel · `caixa` | 52, 70, 8, 10 | 56, 66 | 60, 70, 2 | — |
| 06 | Estante | `formacao` | dentro · `estante` | 62, 26, 14, 48 | 69, 22 | 69, 50, 1.6 | prateleiras: 63, 28, 12, 44 |
| 07 | Lenço escoteiro (gancho da porta) | `alem` | painel · `tecido`, à esquerda | 79, 34, 4, 10 | 81, 30 | 70, 42, 2 | — |
| 08 | Envelope / caixa de correio (porta) | `contato` | painel · `carta`, à esquerda | 84, 46, 6, 8 | 87, 42 | 75, 52, 2 | — |

- **Os valores são a composição-alvo** pedida no prompt. Quando a imagem chegar, o `dev-frontend` **calibra** `clique`, pino, câmera e `janela` sobre ela (uma página interna `/dev/quarto` com sobreposição dos retângulos ajuda) e grava os valores em `src/config/quarto.ts`.
- **Viram decoração (não clicáveis):** quadros/diplomas, headset, estojos de jogos, bola de vôlei, mousepad coral, pôster vermelho e azul, vaso com ervas, janela, porta, cadeira, tapete, luminária, varal de luzinhas e LED. Os blocos `#certificacoes`, `#alem-games` e `#alem-volei` **continuam existindo** dentro das vistas da estante e do lenço, com os atalhos no topo ("Ir para Certificações", "Ir para Games", "Ir para Vôlei").
- **Mudanças no formato da config (9.2):** `Rect` passa a ser em **% da imagem** (0–100); `caixa` e `etiqueta` saem (o pino é a etiqueta); `camera` vira `{ cx, cy, escala }`; entram `pino: { x, y }` e `recorteNicho?: Rect`; `papel` e `ordem` saem (8 objetos, ordem = capítulo); `secoes: string[]` substitui `secao` (o porta-retrato abre `['ficha', 'sobre']`). No nível do quarto, entram `imagem: { l: 3840, a: 2160 }`, `areaSegura` e `recorteMobile`.
- **Validador:**
  - 8 objetos com capítulos 1–8 únicos e destinos únicos;
  - `clique` e pino dentro da área segura e fora das faixas do HUD e da pílula;
  - nenhum `clique` sobreposto;
  - cada `clique` mede ≥ 3.3% × 5.8% da imagem, o que dá ≥ 44 px na menor tela em tela cheia (1024×768, caixa de 1365×768);
  - pinos (28 px + 4 px de flutuação) não cobrem outro `clique`.

### 12.7 Porta-retrato com o resumo (02 · Sobre)

- A vista do porta-retrato mostra, nesta ordem: **o resumo** (`#ficha`: `{hero.frase}`, `<dl>` com local, idiomas, estudando e status, as 3 provas e o CTA do LinkedIn) e **Sobre mim** (`#sobre`, 3 parágrafos). A moldura `porta-retrato` (4.4) fica com a faixa superior de madeira **sem silhueta**, porque a imagem raster já mostra o objeto.
- O `h2` da vista continua "O porta-retrato · Sobre mim". `#ficha` ganha um `h3` "Resumo" dentro da vista (no modo recrutador, ele é o herói, como antes).
- **Link direto:** `/#ficha` e `/#sobre` abrem a vista 02.
- **Modo recrutador: sem mudança.** O resumo continua sendo o primeiro bloco.

### 12.8 Pinos, ordem e intro (ajustes da 11.x)

- **Pino numerado** = marcador (11.1) + etiqueta. É a lâmpada-pino de 28 px com o **número do capítulo** dentro (mono 500 12 px):
  - não lido: fundo `--surface`, número `--text` (17.93 / 13.63), anel `--accent`;
  - próximo sugerido: fundo `--accent`, número `--on-accent` (5.56 / 7.88);
  - lido: fundo `--pine-tint`, ✓ `--pine` + número.
  - Contorno de 1.5 px `--text`. O contraste contra qualquer pixel da imagem é garantido pela lógica do foco duplo (3.3): preenchimento claro + contorno escuro no claro, e o inverso no escuro.
  - No hover ou foco, aparece ao lado do pino um balão translúcido (fundo do HUD) com "01 · O monitor · Projeto Vértice". Ele fica oculto em repouso, para não poluir a arte; os nomes estão sempre visíveis na pílula (≥ 1280) e nos nomes acessíveis.
  - A flutuação continua: 3 ciclos e para; estático em reduced motion.
- **Dica de ordem:** pinos numerados + pílula + o pino "próximo sugerido". O varal de luzinhas vira **só decoração** na imagem; as lâmpadas não acendem mais por capítulo.
- **Intro (11.2):** continua só com tela ≥ 768 e proporção ≥ 1.3, na 1ª visita. A cena fica escurecida por uma **película** sobre a imagem (`rgba(246,244,238,.7)` no claro, `rgba(18,20,26,.7)` no escuro) (não altere a opacidade da `<img>`, que é o candidato a LCP). O cartão SQL fica centralizado, e o HUD continua visível e usável por cima da película.
- **Ordem de `Tab`:** Modo recrutador → LinkedIn → PT|EN → tema → (Pular, se houver intro) → objetos 01…08 → pílula 01…08.

### 12.9 Orçamento de performance (substitui 9.4)

| Recurso | Orçamento |
|---|---|
| HTML por idioma (conteúdo + config + intro + pílula; **sem** o SVG da cena) | ≤ 45 KB gzip |
| SVG de sobreposição do monitor | ≤ 1 KB |
| CSS total | ≤ 22 KB gzip |
| JS (`<head>` + módulo) | ≤ 1,2 KB + ≤ 11 KB gzip |
| Fontes | ≤ 110 KB; **1 preload** (Atkinson 400), Bricolage com `swap` |
| Imagem da cena (desktop) | tabela de 12.2; a variante escolhida normalmente fica entre 160 e 260 KB em AVIF |
| Herói mobile | ≤ 80 KB AVIF (720w) |
| Nichos | 8 × ≤ 12 KB, lazy |
| **Metas** | **LCP ≤ 2,5 s no mobile** (Lighthouse, 4G simulado; o LCP é o herói recortado) e ≤ 2,0 s no desktop · TBT ≤ 100 ms · CLS ≤ 0,02 (caixa com `aspect-ratio` e `width`/`height` declarados) · INP ≤ 200 ms · zoom ≤ 16 ms por quadro no desktop |

### 12.10 Chaves de texto

**Novas:**

| Chave | pt (ilustrativo) | en (ilustrativo) |
|---|---|---|
| `quarto.imagemAlt` | "Ilustração do quarto de trabalho do Matheus, com oito objetos que abrem capítulos." | "Illustration of Matheus's workroom, with eight objects that open chapters." |
| `quarto.explorarAbaixo` (mobile) | "Explorar o quarto" | "Explore the room" |
| `quarto.pino.balao` (formato) | "{num} · {tema} · {comum}" | idem |
| `ficha.tituloNaVista` | "Resumo" | "Summary" |

**Saem:** `quarto.objetos.{quadros,headset,estojos,bola}.*` e as chaves da janela, se ainda existirem.

**Mudam:** `quarto.ajuda` passa a dizer "8 objetos" ("8 capítulos em 8 objetos. Use Tab ou as setas para escolher, Enter para abrir e Esc para voltar."). `quarto.legenda*` sai (o balão do pino a substitui).

**Mantidas:** `vista.atalho.certificacoes/.volei/.games`, `intro.*`, `menu.*`, `topo.*`.

### 12.11 Tarefas para o `dev-frontend`

> **Lista consolidada (revisões 6, 6b e 6c).** As tarefas 1, 2, 4, 6–8, 10 e 11 abaixo continuam valendo. **A 3, a 5, a 9 e a 12 foram atualizadas pela 12.13**: veja as tarefas 14–24 em 12.13.9, que prevalecem onde houver conflito (pílula, pinos, nome e LinkedIn no HUD e botão de tema saem).

1. **Pipeline de imagens:** criar `scripts/gerar-imagens.mjs` (sharp, devDependency gratuita), rodado localmente com `npm.cmd run imagens`.
   - Lê `content/fonte/arte/quarto-dia.png` e `quarto-noite.png` (**privados**, no `.gitignore`) e os recortes da config.
   - Gera em `public/img/quarto/`: cena AVIF/WebP em 1280–3840w; herói 9:16 em 480/720/1080; nichos quadrados em 240/480; LQIP de 32×18.
   - Falha se algum arquivo passar do orçamento.
   - **Só os derivados entram no Git.**
2. **Remover a cena SVG:** remover os componentes de objeto e decoração e os tokens `--room-*`, `--fan-*` e de luz (exceto onde as vistas usam). Manter o **SVG de sobreposição** do monitor.
3. **Layout em tela cheia:** caixa 16:9 em cover, HUDs translúcidos (12.1) com os valores de `rgba` exatos, pílula translúcida, sem aside e sem rodapé no modo quarto. A detecção de "tela cheia" é largura ≥ 768 e proporção ≥ 1.3.
4. **Config e validador:** migrar para % (12.6); 8 objetos; `secoes: ['ficha','sobre']` no porta-retrato; validador novo.
5. **Pinos numerados e balão** (12.8); remover etiquetas e o estado do varal.
6. **Zoom por `transform`** com limite de borda, escala ≤ 2 e película atrás da vista; vistas "dentro" com moldura em CSS.
7. **Tema:** `<picture>` com `media` para dia e noite + troca manual + preload certo + fallback por filtro.
8. **Mobile:** herói recortado com cartão translúcido + nichos com recortes + vistas em tela cheia.
9. **Intro:** película em vez de opacidade da imagem; condições de 12.8.
10. **Porta-retrato:** mover `#ficha` para a vista 02, com `h3` "Resumo"; `/#ficha` abre a vista 02.
11. **Calibração:** página `/dev/quarto` (excluída do build de produção) que desenha os `clique`, pinos, câmeras e `janela`s sobre a imagem, para ajustar os valores depois que a arte chegar.
12. **Textos:** chaves de 12.10 em pt e en.
13. **Verificação:**
    - Lighthouse ≥ 90 nas 4 categorias em mobile e desktop, com LCP mobile ≤ 2,5 s e CLS ≤ 0,02.
    - Contraste do HUD medido sobre a área mais clara e a mais escura da imagem, nos dois temas.
    - 1ª tela em 1280×800, 1440×900, 1920×1080 e 2560×1080 (21:9) com os 8 objetos visíveis.
    - 360×640 e tablet em pé usando a estratégia mobile.
    - `/#ficha`, `/#exp-kpmg` e `?modo=recrutador`; teclado, reduced motion e `forced-colors`.
    - Troca de tema com imagem noturna e com o fallback por filtro.

### 12.12 Riscos

- **Teste dos 30 segundos:** sobre a cena, ficam só o nome, "Dados → IA" e o LinkedIn. Status, Vértice e Pós Tech exigem um clique no porta-retrato ou no monitor, ou o modo recrutador. Mitigação: o botão "Modo recrutador" é o 1º elemento e o mais visível do HUD. Se o Matheus aceitar, recomendo acrescentar "· aberto a oportunidades" à linha "Dados → IA".
- **Qualidade e alinhamento da arte gerada por IA:** a posição dos objetos pode variar, e a versão noturna pode não coincidir. Mitigações: calibração (tarefa 11), checklist do prompt e fallback por filtro.
- **Direitos:** os termos de uso da ferramenta de imagem precisam permitir o uso no portfólio (aviso no prompt).
- **Peso:** a imagem passa a ser o LCP. O orçamento de 12.2 e 12.9 é obrigatório no CI.

### 12.13 Revisão 6b/6c: SO no monitor, tour pela rolagem, nome na parede, post-its e interruptor

Fontes: `docs/referencias/funnyworks-stubborn-room.md` e `docs/referencias/mbilalkhan.md`. **Regra: inspirar-se, não copiar.** Não entram o computador retrô, o mascote, a paleta, os textos e o tema espacial da 1ª referência, nem a paleta lilás, o sofá, a composição e o 3D da 2ª. Esta subseção **prevalece** sobre 11.1, 11.4, 12.1 (conteúdo do HUD), 12.6 (posições) e 12.8.

#### 12.13.0 Reconciliação: o que fica, o que sai e por quê

O feedback do Matheus foi **menos ruído e nada de repetição**. Com tour, post-its e anotações chegando, cada função passa a ter **um único elemento**:

| Função | Elemento que fica | O que foi **cortado** e por quê |
|---|---|---|
| Identidade | **Nome + "Dados → IA" pintados na parede** (HTML sobre a imagem) | Nome no HUD (12.1) e nome grande da 11.3: viraram o mesmo elemento na parede |
| Contato rápido | **Post-it "Fale comigo!"** colado na parede, ao lado do nome → LinkedIn | CTA do LinkedIn no HUD: era um segundo CTA na mesma tela |
| Rótulo + "dá para clicar" | **8 post-its**, um em cada objeto. O post-it **é** o link do objeto | **Pinos/marcadores numerados** (11.1, 12.8) e o balão do pino: três sinais para a mesma coisa. Os estados "próximo" e "lido" passam para o post-it |
| Navegação entre capítulos (quarto) | Post-its (clique livre) + **tour pela rolagem** | **Pílula numerada 01…08** (11.4, 12.1): repetia os post-its |
| Progresso | **Trilho do tour** (só durante o tour, não interativo) + "Sair do tour" e "Ir para o monitor" | Números clicáveis no trilho: seriam um terceiro caminho para os mesmos destinos |
| Guia | **2 anotações à mão** ("comece aqui" e "role para o tour") que **somem após a 1ª interação** | Anotações factuais sobre a estante e o lenço: o cartão do tour já mostra esses fatos |
| Tema | **Interruptor** no canto | Botão de tema anterior (5.7) |
| Controles | HUD só com "Modo recrutador", PT\|EN e interruptor | — |

**O que o visitante vê na 1ª tela (desktop), no total:** 2 HUDs pequenos nos cantos, o nome na parede com o post-it "Fale comigo!", 8 post-its e 2 anotações (que somem).

#### 12.13.1 Monitor como "SO"

**Recomendação: o SO é só o capítulo 01 (Vértice), e não a navegação principal.**
- **Por quê:**
  - Se as pastas fossem capítulos, cada capítulo teria dois caminhos (objeto e pasta), justamente a repetição que o Matheus rejeitou.
  - O Vértice é a prova principal (estratégia §4) e é o único conteúdo com "arquivos" naturais (como foi construído, stack, próximo passo).
  - O SO também é o **final do tour**: começar e terminar no que ele está construindo.
- **Alternativa não recomendada:** pôr `Projetos/` no SO e transformar o caderno em decoração. O resultado seriam 7 objetos clicáveis e o capítulo 04 escondido dentro de outro.

**Conteúdo** (a mesma `section#vertice`, reorganizada em "arquivos"; cada arquivo é um `<article>` com `id` próprio):

| Arquivo (pt / en) | `id` | Conteúdo |
|---|---|---|
| `LEIA-ME.txt` / `README.txt` (**aberto ao entrar**) | `vertice-leiame` | O que é, selos (Em desenvolvimento, Repositório privado), 2026 – atual, CTA "Ver o site real ↗" |
| `como-foi-construido/` / `how-it-was-built/` | `vertice-construcao` | Pipeline: especificação, agentes por papel, 49 arquivos de testes no backend, CI + deploy, monitoramento |
| `funcionalidades.md` / `features.md` | `vertice-funcionalidades` | O que faz |
| `stack.json` | `vertice-stack` | Chips de stack |
| `proximo-passo.md` / `next-step.md` | `vertice-proximo` | Integração com a API oficial da Riot Games `[● Em andamento]` |
| `origem.md` / `origin.md` | `vertice-origem` | Campeonatos entre amigos → link para `#alem-games` |
| `verticetour.com.br ↗` (atalho) | — | Link externo real |

**Visual próprio:**
- **Papel de parede:** a assinatura (6) em grande, com a linha da carreira que dobra em 2026 rumo a "IA", sobre `--bg` com uma grade de pontos discreta.
- **Ícones:** pastas flat em `--accent-tint` com aba e arquivos como folhas `--surface` com canto dobrado. O nome fica abaixo, em mono 13 `--text`.
- **Janela:** card `--surface` com `--radius-md`; barra de título `--surface-2` com o nome do arquivo em mono e um botão "×" à direita.
- **Barra de tarefas:** faixa `--surface-2` de 40 px na base, com o monograma "MMN" (não interativo), a aba da janela aberta e o selo "● Em desenvolvimento".
- **Sem** semáforos do macOS, menu Iniciar, chanfros de Windows 9x, tela de CRT, mascote ou fonte pixel. Monitor **moderno widescreen**, não retrô (o retrô é da referência).

**Teclado e acessibilidade:**
- Área de trabalho: `<div role="region" aria-label="{so.rotulo}">`. Os ícones são `<button aria-controls aria-expanded>` numa lista, todos na ordem do `Tab`; as setas movem entre os ícones.
- `Enter`/`Espaço` abre o arquivo: a janela aparece e o foco vai para o título dela (`h3`, `tabindex="-1"`).
- **Uma janela por vez**, sem arrastar nem redimensionar (não há interação que dependa de ponteiro).
- **Esc** fecha a janela e devolve o foco ao ícone. Um **segundo Esc** sai do monitor (fecha a vista com zoom de volta). O `cancel` do `<dialog>` é interceptado enquanto há janela aberta.
- O botão "×" tem nome acessível "Fechar {arquivo}".
- **Modo recrutador e sem JS:** os ícones somem, e os `<article>`s aparecem em sequência como subseções normais de "Projeto Vértice" (mesmo HTML).
- **Mobile:** o SO ocupa a tela cheia com ícones em grade de 3 colunas (alvos ≥ 72 px). Cada arquivo abre em tela cheia com "← Área de trabalho" no topo. A barra de tarefas fica fixa na base.

**Zoom no monitor:** é a **exceção de escala, até 3×**, só no monitor. A área de trabalho em HTML cobre a tela inteira do monitor, então a perda de nitidez do raster não aparece. A moldura do SO fica com `min(92vw, 1100px)` × `min(86dvh, 700px)`, e o bisel é desenhado em CSS.

#### 12.13.2 Tour guiado pela rolagem (unifica o "rolar para entrar")

**Modelo: *scrollytelling* por passos**, sem sequestrar a rolagem. O palco (a caixa da imagem) fica `position: sticky; top: 0; height: 100dvh`. Por cima dele, numa coluna, **cartões HTML reais rolam no fluxo normal da página**, um por passo, cada um com 100dvh de altura e conteúdo centralizado. Quando um cartão entra no centro da tela (`IntersectionObserver`, sem *listener* de `scroll`), a câmera vai para o objeto daquele passo.

| Passo | Câmera | Cartão (ao lado do objeto, no lado oposto) |
|---|---|---|
| 0 · visão geral | quarto inteiro | **nenhum**. Aparecem o nome na parede, os post-its e as 2 anotações |
| 1 · 01 | monitor, 1.6× | "01 de 08 · O monitor · Projeto Vértice" + `{tour.vertice.resumo}` + [Abrir capítulo] + "o tour termina aqui dentro" |
| 2–8 · 02…08 | objeto do capítulo, 1.6–2× | "0N de 08 · {tema} · {comum}" + `{tour.<id>.resumo}` (1–2 frases com lastro) + [Abrir capítulo] |
| 9 · fim | volta ao monitor, 3× | **o SO embutido na tela**, sem modal (12.13.1) |

- **Transição de câmera:** 500 ms `--ease-out` por passo (`transform`, 12.5). **Reduced motion:** corte direto em cada passo, e os cartões ficam como uma **lista** sem efeito.
- **Cartão:** `.papel`, `--radius-md`, `--shadow-panel`, largura `min(420px, 34vw)`, no lado oposto ao objeto (`tour.lado` na config). Título em Bricolage 700 e texto em Atkinson 17. [Abrir capítulo] abre a vista do capítulo (mesmo destino do post-it, mas **dentro do contexto do tour**; é o único interativo do cartão).
- **Snap:** `scroll-snap-type: y proximity` e `scroll-snap-align: center` nos cartões. **Nunca `mandatory`.**
- **Nunca prende:**
  - a rolagem é nativa, sem `preventDefault` em `wheel`, `touchmove` ou teclas;
  - `Home` e `End` funcionam;
  - **trilho do tour** fixo na borda direita (só nos passos 1–9), com 8 traços numerados + 1 ícone de monitor, preenchidos até o passo atual (`aria-hidden`; para leitores de tela, o progresso está no texto "0N de 08" de cada cartão);
  - abaixo do trilho, dois botões sempre visíveis: **"↑ Sair do tour"** (volta ao topo e ao passo 0, instantâneo) e **"⤓ Ir para o monitor"** (vai ao passo 9);
  - **Esc** durante o tour = "Sair do tour".
- **Clique livre:** em qualquer passo, os objetos visíveis continuam clicáveis e abrem suas vistas (modal). Ao fechar, a página volta ao passo em que estava.
- **Fim do tour (passo 9):**
  - A `section#vertice` é movida para dentro da tela do monitor, **sem `<dialog>`**: é conteúdo normal, alcançável por `Tab` em sequência. Rolar para cima sai, e não há foco preso.
  - Se o visitante clicar no monitor fora do tour, o SO abre no `<dialog>` (12.5/5.6). É a mesma interface, num único nó movido.
- **Teclado:** `Tab` passa pelos post-its e depois pelos botões [Abrir capítulo] dos cartões, na ordem dos passos. Focar um cartão rola até ele (comportamento nativo), e a câmera acompanha. `Espaço`/`PageDown` avançam os passos pela rolagem nativa.
- **URL:** o tour **não** altera o histórico (sem `pushState` por passo). As vistas abertas a partir dele seguem 5.6.
- **Intro:** rolar durante a intro equivale a "Pular".
- **Mobile e telas em retrato:** **não há câmera nem tour de rolagem**. O tour **vira a sequência vertical de nichos** (12.3), em **1 coluna**:
  - cada nicho é um recorte da imagem (4:3) com o post-it do capítulo, `{tour.<id>.resumo}` e a ação de toque para abrir;
  - a ordem é 01…08, e o 01 abre o SO em tela cheia;
  - o toque basta; a rolagem é só leitura.
- **Modo recrutador, sem JS e LCP:** sem tour. Os cartões não existem no modo recrutador (o conteúdo completo já está nas seções). O passo 0 é idêntico à 1ª tela, e a trilha de rolagem fica abaixo da dobra, sem imagens extras. O LCP não muda.

#### 12.13.3 Nome na parede

- `<h1>` com o nome e "Dados → IA" ficam como **texto HTML posicionado em % sobre uma área de parede lisa reservada** na imagem (`paredeNome` na config, alvo **x 26–60%, y 4–15%**), alinhados à esquerda.
  - Nome: Bricolage 800, `clamp(2rem, 3.4vw, 3.5rem)`.
  - "Dados → IA": Atkinson Hyperlegible Mono 500, 18 px, com a seta em SVG `--accent`.
  - Leve rotação de 0°, como pintado.
- **Contraste AA garantido com halo:** texto `--text` com um halo de 3 px na cor `--halo` (`#FFFFFF` no dia e `#12141A` à noite), via `paint-order: stroke fill` + `-webkit-text-stroke: 6px var(--halo)`, com *fallback* de 8 `text-shadow`s de 2 px.
  - O fundo imediato de cada letra é o halo, então o contraste fica em **17.93:1** no dia e **15.06:1** à noite, sobre qualquer imagem.
  - O prompt pede a parede lisa ali para o halo ficar discreto.
- **Post-it "Fale comigo!"** colado logo à direita do nome (âncora x ≈ 61%, y ≈ 6%, −5°): é o CTA do LinkedIn. O texto grande "Fale comigo!" fica na fonte manuscrita, e abaixo vem o texto literal "Conversar no LinkedIn ↗" em Atkinson 14 (regra do CTA literal, estratégia §8.1).
- **Durante o tour e a vista:** o nome sai junto com a câmera, porque está preso à caixa da imagem.
- **Mobile:** o nome e o post-it ficam sobre o herói recortado, no cartão translúcido da base (12.3).

#### 12.13.4 Post-its como menu e marcador

- **Cada objeto clicável tem um único `<a class="objeto">`**: a área de clique sobre o objeto **mais** o post-it colado nele, que é o rótulo visível do link (dentro do mesmo `<a>`). Isso dá 1 parada de `Tab` por objeto e nenhum destino repetido.
- **Post-it:** quadrado de `clamp(88px, 7vw, 120px)` com cantos retos e sombra chapada `--shadow-1`, rotação de −5° a +5° (config). Mostra:
  - o número em mono 12 `--text-muted`;
  - o **nome comum** na fonte manuscrita, 22 px, `--text`.
  - O rótulo temático entra no nome acessível ("01 · O monitor, Projeto Vértice") e no título da vista.
- **Cores** (ilha clara, como o papel):

| Token | Dia | Noite | Texto `#15171C` | Número `#4F545C` |
|---|---|---|---|---|
| `--postit` | `#FFF1B8` | `#E8D98F` | **15.82 / 12.60:1** | **6.72 / 5.35:1** |

- **Estados:**

| Estado | Post-it |
|---|---|
| Repouso | como acima |
| **Próximo sugerido** | uma **fita adesiva** `--accent` de 28×10 px no topo, e balanço de ±1.5° em 1,6 s × 3 (≤ 5 s); estático em reduced motion |
| **Lido** | ✓ `#1E6B5A` de 14 px no canto (≥ 3:1 nos dois tons) e texto oculto "lido" |
| Hover / foco | sobe 3 px, rotação vai a 0° e o objeto ganha o contorno de destaque. Foco: anel duplo (3.3) em volta do post-it |
| Durante tour (passo ≥ 1), zoom ou intro | ocultos (o cartão do tour nomeia o objeto) |

- **Posições** em `postit: { x, y, rot }` na config (12.13.7). O validador garante que o post-it não cobre outro objeto, o nome, o HUD ou outro post-it.
- **Mobile:** o rótulo de cada nicho é o mesmo post-it.

#### 12.13.5 Anotações à mão

- **Fonte manuscrita: Patrick Hand** (Google Fonts, SIL OFL), auto-hospedada, peso único, subset latin + latin-ext (≈ 20 KB), `font-display: optional` (sem a fonte, entra Atkinson em itálico).
- **Só 2 anotações**, ambas `aria-hidden` (a mesma instrução está em `{quarto.ajuda}`):

| `id` | Texto pt / en | Posição (âncora em %) | Seta |
|---|---|---|---|
| `comece` | "comece aqui" / "start here" | x 8, y 60 | curva até o post-it 01 |
| `role` | "role para um tour pelos 8 capítulos" / "scroll for a tour of the 8 chapters" | x 40, y 88 | reta, para baixo |

- **Visual:** 24 px, `--text`, com o mesmo **halo de 3 px** do nome (17.93 / 15.06:1 sobre qualquer imagem). As setas são SVG à mão-livre desenhadas por nós (`stroke` 2.5 px `--text` + halo de 3 px `--halo`), com ponta aberta.
- **Comportamento:** aparecem no passo 0 depois da intro, com a seta se desenhando em 500 ms (estáticas em reduced motion). **Somem depois da 1ª interação** (abrir um objeto ou iniciar o tour), com a decisão guardada em `sessionStorage`. Não aparecem abaixo de 1024 px nem no modo recrutador.
- **Configuráveis** em `anotacoes[]` na config: `id`, `x`, `y`, `rot`, `larguraMax`, `seta: { de: [x,y], para: [x,y], curva }` (em %) e `ate: 'primeira-interacao'`.
- **Lastro factual:** "8 capítulos" é a estrutura do site. As anotações não fazem afirmações sobre o Matheus.

#### 12.13.6 Interruptor dia/noite

- **Toggle em forma de interruptor de parede:** `<button type="button" class="interruptor" aria-pressed="false|true" aria-label="{topo.luz.rotuloAcessivel}">` ("Luz apagada"; `aria-pressed="true"` = escuro).
  - Espelho `--surface` de 44×64 px com borda 1.5 px `--border-strong` (3.72 / 3.32:1) e tecla `--text` que **desce** quando a luz apaga (160 ms; instantâneo em reduced motion).
  - A partir de lg, o texto visível ao lado é "Apagar a luz"/"Acender a luz".
  - Fica no **HUD direito**, depois do PT|EN.
- Substitui o botão de tema de 5.7. O comportamento (localStorage, script do `<head>`, troca de imagem dia/noite de 12.4) não muda.

#### 12.13.7 Composição atualizada (% da imagem; substitui a tabela de 12.6)

O monitor ficou **maior** (para o zoom 3× e o SO) e foi aberta uma área de parede para o nome.

| Cap. | Objeto | `clique` (x, y, l, a) | `postit` (x, y, rot) | `vista.camera` (cx, cy, esc.) | `tour.camera` / lado do cartão | `janela` |
|---|---|---|---|---|---|---|
| 01 | Monitor moderno widescreen | 16, 26, 22, 28 | 33, 49, 4° | 27, 39, **3** | 27, 40, 1.6 / direita | tela: 17.5, 28, 19, 21 |
| 02 | Porta-retrato | 39, 46, 5, 10 | 40, 57, −3° | 52, 51, 2 | 47, 51, 1.8 / direita | — |
| 03 | Mural de cortiça | 47, 16, 13, 20 | 56, 17, 3° | 53.5, 30, 1.8 | 53.5, 30, 1.6 / esquerda | cortiça: 48, 17.5, 11, 17 |
| 04 | Caderno na mesinha | 49, 58, 8, 6 | 50, 65, −2° | 60, 60, 2 | 55, 60, 1.8 / direita | — |
| 05 | Caixa de ferramentas | 57, 72, 8, 9 | 58, 79, 2° | 66, 72, 2 | 63, 70, 1.8 / esquerda | — |
| 06 | Estante | 63, 22, 13, 52 | 70, 23, −3° | 69.5, 48, 1.6 | 69.5, 48, 1.5 / esquerda | prateleiras: 64, 24, 11, 48 |
| 07 | Lenço (gancho da porta) | 80, 32, 4, 10 | 79.5, 44, −4° | 72, 40, 2 | 75, 40, 1.8 / esquerda | — |
| 08 | Envelope / caixa de correio | 85, 46, 6, 8 | 85, 55, 3° | 75, 52, 2 | 75, 52, 1.8 / esquerda | — |
| — | Parede do nome | 26, 4, 34, 11 (reservada) | "Fale comigo!": 61, 6, −5° | — | — | — |

Áreas reservadas (sem objetos importantes no prompt e checadas pelo validador):
- HUD esquerdo: x 0–22%, y 0–10%;
- HUD direito: x 80–100%, y 0–12%;
- parede do nome: x 26–60%, y 4–15%;
- anotação "role": x 36–64%, y 86–96%;
- trilho do tour: x 96–100%, y 25–75%.

Os valores são o alvo do prompt e serão **calibrados** quando a imagem chegar (tarefa 11).

#### 12.13.8 Orçamento (atualiza 12.2 e 12.9)

- **Imagem mais densa:** AVIF com no máximo 100 KB (1280w), 180 KB (1920w), 290 KB (2560w) e 500 KB (3840w); WebP com cerca de +45%. Herói mobile 720w ≤ 85 KB.
- **Fontes:** ≤ 130 KB (Patrick Hand entra com `optional`, sem preload).
- **JS do módulo:** ≤ 13 KB gzip (+ tour, SO e post-its; − pílula e pinos). O tour usa só `IntersectionObserver` e `transform`, sem *listener* de `scroll`.
- **CSS:** ≤ 24 KB gzip.
- Metas mantidas: LCP mobile ≤ 2,5 s, CLS ≤ 0,02, TBT ≤ 100 ms, INP ≤ 200 ms.

#### 12.13.9 Chaves de texto e tarefas novas

**Chaves novas (pt / en, ilustrativas):**

| Chave | pt | en |
|---|---|---|
| `parede.direcao` | "Dados → IA" | "Data → AI" |
| `postit.contato.titulo` / `.cta` | "Fale comigo!" / "Conversar no LinkedIn" | "Let's talk!" / "Let's talk on LinkedIn" |
| `anotacoes.comece` / `anotacoes.role` | "comece aqui" / "role para um tour pelos 8 capítulos" | "start here" / "scroll for a tour of the 8 chapters" |
| `tour.progresso` (formato) | "{n} de 08" | "{n} of 08" |
| `tour.abrir` | "Abrir capítulo" | "Open chapter" |
| `tour.sair` / `tour.irMonitor` | "Sair do tour" / "Ir para o monitor" | "Leave the tour" / "Go to the monitor" |
| `tour.<id>.resumo` (8) | 1–2 frases **com lastro em `perfil.json`**, ex.: Vértice: "Plataforma de campeonatos que estou construindo com agentes de IA. Em desenvolvimento." | idem |
| `tour.vertice.fim` | "O tour termina aqui dentro." | "The tour ends inside here." |
| `so.rotulo` | "Área de trabalho do Vértice" | "Vértice desktop" |
| `so.arquivos.{leiame,construcao,funcionalidades,stack,proximo,origem,site}` | "LEIA-ME.txt", "como-foi-construido/", "funcionalidades.md", "stack.json", "proximo-passo.md", "origem.md", "verticetour.com.br" | "README.txt", "how-it-was-built/", "features.md", "stack.json", "next-step.md", "origin.md", "verticetour.com.br" |
| `so.fechar` (formato) | "Fechar {arquivo}" | "Close {file}" |
| `so.voltarArea` (mobile) | "Área de trabalho" | "Desktop" |
| `topo.luz.apagar` / `.acender` / `.rotuloAcessivel` | "Apagar a luz" / "Acender a luz" / "Luz apagada" | "Turn off the light" / "Turn on the light" / "Light off" |

**Saem:** `menu.*` (pílula), `quarto.pino.balao`, `quarto.legenda*` e `topo.luz` antigos, se forem diferentes destes.

**Tarefas novas para o `dev-frontend` (prevalecem sobre as tarefas 3, 5, 9 e 12 de 12.11):**

14. **Remover** a pílula, os pinos, o balão do pino, o nome e o LinkedIn do HUD e o botão de tema antigo.
15. **HUD só de controles:** à esquerda, "Modo recrutador" (1º focável); à direita, PT|EN e o interruptor (12.13.6). Fundo translúcido de 12.1.
16. **Nome na parede + post-it "Fale comigo!"** (12.13.3), com halo e posições da config.
17. **Post-its como links dos objetos** (12.13.4), com os estados próximo e lido; incluir `--postit` nos tokens.
18. **Anotações** (12.13.5): componente `Anotacao` com seta gerada a partir de `{de, para, curva}`; Patrick Hand auto-hospedada; sumir na 1ª interação.
19. **Tour** (12.13.2):
    - palco sticky, cartões no fluxo, `IntersectionObserver` e câmera por `transform`;
    - snap `proximity`, trilho, "Sair do tour" e "Ir para o monitor", Esc;
    - passo 9 com o SO embutido, sem modal;
    - sem tour no modo recrutador e com largura < 768 ou proporção < 1.3; corte direto em reduced motion.
20. **SO** (12.13.1): `section#vertice` em arquivos (`<article>`s com `id`), ícones, janela única, barra de tarefas, Esc em dois níveis, modo recrutador linear, mobile em tela cheia; escala 3× só no monitor.
21. **Mobile:** nichos em 1 coluna, como tour (recorte 4:3, post-it, resumo e toque).
22. **Config e validador:** novos campos (`postit`, `tour`, `anotacoes`, `paredeNome`, áreas reservadas) e valores da 12.13.7.
23. **Textos:** chaves da 12.13.9 em pt e en; o `verificador-fatos` revisa `tour.*.resumo`.
24. **Verificação adicional:**
    - rolagem do início ao fim e de volta com mouse, trackpad, teclado (`Espaço`, `PageDown`, `Home`, `End`) e leitor de tela;
    - Esc e "Sair do tour" em qualquer passo;
    - clique em objeto no meio do tour;
    - reduced motion (cortes + lista);
    - nenhuma diferença de LCP e CLS no passo 0;
    - contraste do nome e das anotações medido sobre a área mais clara e a mais escura da parede, nos dois temas.

---

## 13. Revisão 7: quarto 3D (Three.js, modelado em código)

Feedback do Matheus: quer "mais 3D, conforme as referências"; a resolução da imagem não está boa; os zooms são sem graça e não enquadram o objeto inteiro. **Esta seção prevalece** sobre 12.2, 12.3, 12.4, 12.5, 12.6, 12.9, 12.13.7, 12.13.8 e as tarefas 1, 6, 7, 8 e 11 de 12.11 onde houver conflito.

**Continua valendo:** os 8 capítulos, objetos, destinos e `secoes` (12.6/`src/config/quarto.ts`); modo recrutador (1º focável, sem JS, SEO, `?modo=recrutador`); `<dialog>` com `#id`, Esc e voltar do navegador (5.6); SO no monitor com Esc em dois níveis (12.13.1); tour pela rolagem com cartões no fluxo, *snap* `proximity`, trilho, "Sair do tour" e "Ir para o monitor" (12.13.2); post-its como links e seus estados (12.13.4); anotações (12.13.5); interruptor (12.13.6); HUD só de controles (12.13.0); intro SQL (11.2, agora também como tela de carregamento, 13.10); tokens de interface e contraste (2, 3); acenos de fã e proibições (9.1 e `content/fonte/hobbies.md`).

**Regra das referências (inalterada):** inspirar-se, não copiar. Do mbilalkhan vem a ideia de quarto 3D com luz de sol, nome na parede e tour pela rolagem; do stubborn-room, o SO e as anotações; do raomuhammadhamza, o 3D em Three.js e os rótulos sobre os objetos. **Não** entram: paleta lilás, sofá, computador retrô, mascote, robô, rosa-neon, composição ou textos de qualquer um deles.

### 13.0 Conceito

**"A maquete do quarto."** O quarto vira uma **maquete low-poly** que flutua sobre o fundo da página: piso e duas paredes cortados como um modelo de arquitetura, com objetos de cantos arredondados nas cores chapadas da paleta. De dia, o sol entra pela janela e desenha um feixe e uma mancha de luz no tapete; à noite, a luminária da mesa, o monitor e o varal de luzinhas são as únicas fontes. **A câmera é a narradora:** ela voa em arco até cada objeto, enquadra o objeto inteiro com folga e abre o capítulo ao lado dele, ou dentro dele (monitor, mural e estante).

### 13.1 O que sai e o que entra

| Sai | Entra |
|---|---|
| Imagem raster dia/noite, `<picture>`, `srcset`, *preload* da imagem, LQIP, recortes do herói e dos nichos | Cena WebGL (`<canvas>`) construída em código, sem nenhum arquivo de imagem |
| `scripts/gerar-imagens.mjs`, `scripts/medir-imagens.mjs`, `npm run imagens`, `public/img/quarto/**`, `src/config/recortes.json`, `src/assets/lqip.json` | `scripts/medir-cena.mjs` (orçamento de JS, 13.10) |
| Câmera por `transform` na caixa 16:9 (`src/scripts/camera.ts`) e limite de escala 2×/3× | Câmera perspectiva com voo em arco e enquadramento calculado (13.5) |
| Áreas de clique em % (`clique`), `janela` em %, `vista.camera` e `tour.camera` em % | Caixas e âncoras em **metros** no espaço da cena (13.12) |
| Película escura atrás das vistas | Objeto iluminado e destacado ao lado do painel (sem película) |
| Fallback de noite por `filter` | Iluminação real de noite (13.7) |
| Herói recortado e nichos com recortes no mobile | Mobile em duas camadas: HTML leve por padrão + "Entrar no quarto em 3D" (13.9) |

- **Arte do Matheus** (`content/fonte/arte/*`): **não é usada** no site (os direitos da ferramenta não estão claros, e ela não corresponde à cena 3D). Fica só local e privada, como hoje.
- **`docs/prompt-imagem-quarto.md`:** vira histórico. Acrescente no topo: "Obsoleto desde a revisão 7 (design 13)".
- **`public/og.png`:** continua o atual. Depois que o Matheus aprovar o visual 3D, ele pode ser trocado por uma captura da visão geral (13.14, tarefa 37).

### 13.2 Sistema de coordenadas e casca da maquete

- **Unidades: metros.** Eixo `y` para cima. Origem no canto interno do piso entre a parede do fundo e a parede esquerda. `x` cresce para a direita (ao longo da parede do fundo), e `z` cresce para a frente (na direção do visitante).
- **Quarto:** `x` 0–5,6 · `z` 0–3,6 · pé-direito 2,8. Paredes com 0,12 de espessura, para fora (`x` < 0 e `z` < 0). **Não há** teto, parede direita nem parede da frente (corte de maquete).
- **Abreviações das primitivas:** `RB(l, a, p, r)` = `RoundedBoxGeometry(l, a, p, 2, r)` (addon); `Box(l, a, p)`; `Cyl(rTopo, rBase, a, seg)`; `Ico(r, det)` = `IcosahedronGeometry`; `Tor(r, tubo, segR, segT, arco)`; `Cone(r, a, seg)`; `Plane(l, a)`; `Ext(forma, prof)` = `ExtrudeGeometry` sem bisel; `Tube(curva, seg, r)`. Medidas sempre em metros e na ordem **largura (x) × altura (y) × profundidade (z)**, depois de aplicada a rotação indicada.
- **Cores:** paleta de 2.1. A cena usa **sempre os valores de dia como cor do material** (albedo), nos dois temas. A noite vem da luz (13.7), e só os materiais emissivos trocam de cor. Os valores ficam em `src/cena/paleta.ts`, copiados desta tabela: `--room-wall #EFE9DC`, `--room-wall-shade #E2DACA`, `--room-floor #C9B79A`, `--room-wood #A9774E`, `--room-wood-dark #7C5536`, `--room-metal #2B2F38`, `--room-cork #C89B63`, `--room-paper #FFFDF7`, `--room-fabric #6F8F86`, `--surface-2 #ECE8DD`, `--fan-red #C8352E`, `--fan-blue #2D4F8E`, `--fan-coral #FF5F57`, `--fan-herb-green #4F8A3C`, `--fan-herb-red #C2413A`. Os emissivos estão em 13.7.

| Peça da casca | Primitiva e posição | Cor |
|---|---|---|
| Laje do piso | `Box(5.72, 0.12, 3.72)`, centro (2.74, −0.06, 1.74) | `--room-wood-dark` (só as laterais aparecem) |
| Superfície do piso | `Box(5.6, 0.004, 3.6)`, centro (2.8, 0.002, 1.8) | `--room-floor` |
| Parede do fundo | `Box(5.72, 2.8, 0.12)`, centro (2.74, 1.4, −0.06) | `--room-wall` |
| Parede esquerda (com vão da janela) | 4 `Box` de 0,12 de espessura em `x` −0,12–0, cobrindo `z` 0–3,6 e `y` 0–2,8 **menos o vão** `z` 1,35–2,45 × `y` 1,00–2,10 | `--room-wall` |
| Tampas do corte | `Box` de 0,03 de altura no topo das duas paredes (`y` 2,80–2,83) e `Box(0.12, 2.8, 0.03)` na borda frontal da parede esquerda (`z` 3,6) | `--room-wall-shade` |
| Rodapé | `Box` de 0,08 de altura e 0,015 de profundidade ao longo das duas paredes; interrompido na porta (`x` 4,615–5,615) | `--room-wall-shade` |
| Palco (CSS, fora do WebGL) | O `<canvas>` é transparente (`alpha: true`). Atrás dele, `.palco` tem `background: radial-gradient(ellipse 70% 55% at 50% 62%, var(--surface-2), var(--bg))` | tokens de interface (mudam com o tema) |

### 13.3 Decoração (não clicável)

Tudo é **estático** e é **fundido por material** (`mergeGeometries`) depois de posicionado, para economizar *draw calls*.

| Objeto | Primitivas (posição = centro) | Cor |
|---|---|---|
| **Janela** (parede esquerda) | Batente: 4 `Box` de seção 0,05 × 0,12 ao redor do vão. Travessa vertical `Box(0.12, 1.10, 0.03)` em `z` 1,90. Peitoril `Box(0.18, 0.03, 1.24)` em (0.03, 0.985, 1.90) | `--room-paper` |
| Céu e cidade | `Plane(3.2, 2.4)` virado para +x em (−0.9, 1.6, 1.9). `MeshBasicMaterial`, `toneMapped: false`, `CanvasTexture` 512×384 (13.8.5) | dia/noite (13.7) |
| Cortina | `PlaneGeometry(0.28, 1.5, 8, 1)` com os vértices deslocados em `x` por `0.03·sin(u·3π)`, em `x` 0,06, `z` 1,08–1,36, `y` 0,75–2,25, `DoubleSide`; varão `Cyl(0.012, 0.012, 1.6, 8)` ao longo de `z` em `y` 2,25 | `--room-fabric`; varão `--room-metal` |
| **Pôster** (aceno ao Homem-Aranha: vermelho e azul com teia geométrica **original**) | `RB(0.01, 0.82, 0.60, 0.004)` na parede esquerda, centro (0.006, 1.58, 3.05), virado para +x; `CanvasTexture` 256×352 (13.8.5) | `--fan-red` / `--fan-blue` |
| Prateleira de estojos (aceno aos games) | Tábua `Box(0.22, 0.025, 0.60)` em (0.11, 1.55, 0.55) e 2 mãos-francesas `Box(0.02, 0.10, 0.02)`. Sobre ela, 5 estojos `Box(0.135, 0.19, 0.014)` em pé, lado a lado de `z` 0,30 a 0,40, com a lombada virada para +x | tábua `--room-wood`; mãos `--room-metal`; estojos alternando `--room-paper` e `--room-metal`; lombadas com textura (13.8.5) |
| **Mesa** | Tampo `RB(2.0, 0.04, 0.76, 0.012)` em (1.25, 0.74, 0.42) (`x` 0,25–2,25, `z` 0,04–0,80). Pés da esquerda: 2 `Box(0.04, 0.72, 0.04)` em (0.29, 0.36, 0.10) e (0.29, 0.36, 0.74) | tampo `--room-wood`; pés `--room-metal` |
| Gaveteiro | `RB(0.40, 0.70, 0.62, 0.01)` em (2.02, 0.35, 0.40); 2 frisos `Box(0.36, 0.004, 0.005)` em `y` 0,36 na frente (`z` 0,712); 2 puxadores `Box(0.10, 0.015, 0.015)` em `y` 0,55 e 0,20 | `--room-wood`; frisos `--room-wood-dark`; puxadores `--room-metal` |
| Teclado | `RB(0.46, 0.022, 0.15, 0.006)` em (0.95, 0.771, 0.58) | `--surface-2` |
| Mousepad e mouse | Mousepad `Box(0.32, 0.004, 0.24)` em (1.46, 0.762, 0.56); mouse `SphereGeometry(0.03, 10, 8)` escalado (1, 0.5, 1.5) em (1.48, 0.775, 0.56) | `--fan-coral`; mouse `--room-metal` |
| Caneca | `Cyl(0.04, 0.04, 0.09, 12)` em (1.50, 0.805, 0.24) + alça `Tor(0.025, 0.007, 6, 12, π)` | `--room-paper` |
| Headset no suporte | Base `Cyl(0.06, 0.06, 0.012, 12)` e haste `Cyl(0.008, 0.008, 0.26, 6)` em (2.08, 0.76…1.02, 0.22); arco `Tor(0.085, 0.012, 6, 16, π)` no topo; 2 conchas `Cyl(0.04, 0.04, 0.03, 12)` deitadas, em x 2,08 ± 0,085, `y` 0,97 | `--room-metal` (genérico, sem marca) |
| **Luminária** (fonte de luz da noite) | Base `Cyl(0.07, 0.07, 0.02, 16)` em (0.42, 0.77, 0.24); braço inferior `Cyl(0.012…)` de (0.42, 0.78, 0.24) a (0.40, 1.10, 0.26); braço superior de (0.40, 1.10, 0.26) a (0.58, 1.18, 0.42); cúpula `Cone(0.075, 0.12, 12)` aberta, em (0.60, 1.14, 0.44), apontando para (1.15, 0.76, 0.52); lâmpada `SphereGeometry(0.025, 8, 6)` dentro da cúpula | `--room-metal`; lâmpada emissiva (13.7) |
| **Cadeira** | Assento `RB(0.46, 0.07, 0.44, 0.02)` em `y` 0,46; encosto `RB(0.44, 0.48, 0.06, 0.02)` em `y` 0,51–0,99, no lado +z do assento; pistão `Cyl(0.025, 0.025, 0.36, 8)`; estrela com 5 `Box(0.28, 0.025, 0.04)` a cada 72°; 5 rodízios `SphereGeometry(0.022, 6, 4)`. Grupo em (1.05, 0, 1.30), `rotation.y = −0.35` | `--room-metal` |
| Tapete | `RB(2.0, 0.012, 1.3, 0.004)` em (1.75, 0.006, 1.65) + miolo `Box(1.8, 0.013, 1.1)` em (1.75, 0.0065, 1.65) | borda `--room-fabric`; miolo `--room-wall-shade` |
| Mesinha | Tampo `RB(0.70, 0.03, 0.45, 0.01)` em (2.85, 0.515, 0.305) (`x` 2,50–3,20, `z` 0,08–0,53); 4 pés `Cyl(0.018, 0.018, 0.50, 8)` a 0,04 dos cantos | `--room-wood`; pés `--room-wood-dark` |
| Vaso com ervas (aceno: verde e vermelho) | Vaso `Cyl(0.06, 0.045, 0.10, 12)` em (3.08, 0.58, 0.20); 6 `Cone(0.02, 0.10…0.14, 6)` agrupados e inclinados até ±15° | vaso `--room-wall-shade`; 3 `--fan-herb-green` e 3 `--fan-herb-red` |
| **Porta** (recebe o 07 e o 08) | Folha `RB(0.85, 2.05, 0.04, 0.01)` em (5.10, 1.025, 0.02) (`x` 4,675–5,525); batentes `Box(0.06, 2.10, 0.03)` em `x` 4,645 e 5,555 e travessa `Box(0.97, 0.06, 0.03)` em `y` 2,08; maçaneta `SphereGeometry(0.028, 10, 8)` em (4.76, 0.95, 0.07); 2 dobradiças `Box(0.02, 0.08, 0.01)` em `x` 5,52, `y` 0,35 e 1,70 | folha `--room-wood`; batentes `--room-wood-dark`; metais `--room-metal` |
| Bola e joelheiras de vôlei | Bola `Ico(0.105, 1)` com `flatShading: true` em (4.98, 0.105, 0.78); joelheiras: 2 `Cyl(0.05, 0.05, 0.09, 12)` deitadas em (5.24, 0.05, 0.70) e (5.30, 0.05, 0.82) | bola `--room-paper` (branca, genérica, **sem** o padrão azul e amarelo de marca); joelheiras `--room-metal` |
| Planta de chão | Vaso `Cyl(0.14, 0.11, 0.30, 12)` em (0.30, 0.15, 3.25); 4 `Ico(0.16, 0)` e 3 `Cone(0.06, 0.45, 5)` entre `y` 0,45 e 0,95 | vaso `--room-wall-shade`; folhas `--fan-herb-green` |
| **Varal de luzinhas** | Fio `Tube(CatmullRomCurve3, 64, 0.004)` pelos pontos (0.15, 2.70, 0.03), (1.0, 2.62, 0.05), (1.9, 2.70, 0.03), (2.8, 2.62, 0.05), (3.7, 2.70, 0.03), (4.6, 2.62, 0.05), (5.5, 2.70, 0.03); 24 lâmpadas `SphereGeometry(0.022, 8, 6)` em `InstancedMesh`, distribuídas por comprimento de arco, 0,03 abaixo do fio | fio `--room-metal`; lâmpadas emissivas (13.7) |
| Feixe de sol | Tronco de pirâmide aberto (4 faces) do vão da janela até a mancha no piso (13.7), `MeshBasicMaterial` com `vertexColors`, alfa 0,10 na janela → 0 no piso, `AdditiveBlending`, `depthWrite: false` | `#FFF1D6`; só de dia |

**Proibido na cena** (conferir no PR): logos (mesmo redesenhados), personagens, máscaras, rostos, armas, miras, símbolo da Umbrella, teia ou traje reconhecível, padrões oficiais de bola. A teia do pôster é **geométrica e original** (13.8.5).

### 13.4 Os 8 objetos clicáveis

Cada clicável é um `Group` com materiais **próprios** (clonados), para o destaque não vazar para outros objetos. Dentro do grupo, as malhas também são fundidas por material. A `caixa` é a AABB usada para **enquadrar** e como **alvo de clique** (13.6).

| Cap. | `id` → destino | Geometria (posição = centro) | Cor | `caixa` (min → max) |
|---|---|---|---|---|
| 01 | `monitor` → `vertice` | Carcaça `RB(0.78, 0.46, 0.035, 0.012)` em (0.95, 1.22, 0.30); **tela** `Plane(0.74, 0.42)` em (0.95, 1.22, 0.318) com `CanvasTexture` (assinatura, 13.8.5); pescoço `Box(0.06, 0.22, 0.04)` em (0.95, 0.88, 0.27); base `RB(0.26, 0.015, 0.18, 0.005)` em (0.95, 0.768, 0.30). Monitor **moderno widescreen**, não retrô | carcaça `--room-metal`; tela emissiva (13.7) | (0.56, 0.76, 0.21) → (1.34, 1.45, 0.39) |
| 02 | `porta-retrato` → `sobre` (+ `ficha`) | Moldura `RB(0.20, 0.25, 0.025, 0.006)` em (1.78, 0.89, 0.32), `rotation.y = +0.30`, `rotation.x = −0.12`; fundo `Plane(0.15, 0.19)` 2 mm à frente; silhueta genérica **sem rosto**: cabeça `CircleGeometry(0.03, 16)` + ombros `Shape` semicírculo de raio 0,06; apoio traseiro `Box(0.02, 0.20, 0.01)` | moldura `--room-wood`; fundo `--room-fabric`; silhueta `--room-metal` | (1.66, 0.76, 0.22) → (1.90, 1.03, 0.42) |
| 03 | `mural` → `experiencia` | Cortiça `Box(1.00, 0.78, 0.03)` em (2.95, 1.45, 0.015); moldura: 4 `Box` de seção 0,03 × 0,04 ao redor (externo `x` 2,42–3,48, `y` 1,03–1,87); 3 papéis `RB(0.20, 0.26, 0.004, 0.002)` em (2.62, 1.52, 0.033), (2.92, 1.38, 0.033) e (3.20, 1.30, 0.033), girados em `z` −4°, +3° e −2°; 3 tachinhas `SphereGeometry(0.012, 8, 6)` no topo de cada papel. Os papéis 3D **somem** (`visible = false`) enquanto a vista do mural está aberta | cortiça `--room-cork`; moldura `--room-wood`; papéis `--room-paper`; tachinhas `#F2B84B` (`--bulb-on` de dia) | (2.42, 1.03, 0.00) → (3.48, 1.87, 0.06) |
| 04 | `caderno` → `projetos` | Caderno **aberto** sobre a mesinha. Grupo em (2.76, 0.53, 0.33) com `rotation.y = −0.20`: capa `Box(0.42, 0.006, 0.285)` em `y` +0,003; 2 páginas `RB(0.20, 0.012, 0.27, 0.004)` em x ±0,10, `y` +0,012, giradas em `z` ±0,06 (formato em V); `CanvasTexture` nas páginas (pauta + esboço de gráfico de barras, 13.8.5); caneta `Cyl(0.006, 0.006, 0.15, 6)` deitada na diagonal sobre a página direita | capa `--room-metal`; páginas `--room-paper`; caneta `--fan-blue` | (2.53, 0.53, 0.17) → (2.99, 0.57, 0.49) |
| 05 | `caixa` → `habilidades` | Grupo no chão em (3.42, 0, 0.70), `rotation.y = −0.25`: corpo `RB(0.44, 0.20, 0.22, 0.012)` em `y` 0,10; tampa `RB(0.45, 0.04, 0.23, 0.012)` em `y` 0,21; junta `Box(0.452, 0.008, 0.232)` em `y` 0,19; alça `Tor(0.07, 0.011, 6, 12, π)` em `y` 0,235; 2 fechos `Box(0.04, 0.05, 0.012)` na frente | corpo e tampa `--fan-red`; junta, alça e fechos `--room-metal` | (3.18, 0.00, 0.55) → (3.66, 0.31, 0.85) |
| 06 | `estante` → `formacao` | Laterais 2 `RB(0.03, 1.95, 0.34, 0.006)` em `x` 3,665 e 4,535; base e topo `Box(0.84, 0.03, 0.34)` em `y` 0,035 e 1,935; prateleiras `Box(0.84, 0.025, 0.32)` em `y` 0,48, 0,92 e 1,36; fundo `Box(0.84, 1.95, 0.01)` em `z` 0,005. **Livros:** 1 `InstancedMesh` de `Box` (cerca de 46), alturas 0,20–0,30, larguras 0,028–0,05, profundidades 0,20–0,24, cores sorteadas com semente fixa (`mulberry32(7)`) entre `--room-fabric`, `--fan-blue`, `--room-paper`, `--room-wood-dark`, `--room-cork`, `--room-metal` e `--fan-red`; os 2 últimos de cada fileira inclinados 12°. No compartimento de cima, 2 **quadros de certificado** `RB(0.18, 0.14, 0.015, 0.004)` encostados a 10°, com miolo `Plane` `--room-paper`. Os livros 3D **somem** enquanto a vista da estante está aberta | madeira `--room-wood`; fundo `--room-wood-dark` | (3.65, 0.00, 0.00) → (4.55, 1.95, 0.34) |
| 07 | `lenco` → `alem` | Gancho `Cyl(0.008, 0.008, 0.05, 6)` ao longo de `z` em (5.33, 1.80, 0.06) + ponta `SphereGeometry(0.012)`; lenço dobrado: `Ext(triângulo [(−0.16, 0), (0.16, 0), (0, −0.42)], 0.008)` com o topo em `y` 1,78 (ponta em 1,36), em `z` 0,045; debrum: o mesmo triângulo escalado 1,08, 5 mm atrás; anel `Tor(0.022, 0.008, 6, 12)` em (5.33, 1.62, 0.058). Genérico, **sem** símbolo de nenhuma associação | lenço `--room-fabric`; debrum `--room-paper`; anel `--room-wood`; gancho `--room-metal` | (5.15, 1.35, 0.035) → (5.51, 1.82, 0.09) |
| 08 | `envelope` → `contato` | Porta-cartas `RB(0.26, 0.17, 0.04, 0.006)` em (4.95, 1.105, 0.06); envelope `Box(0.22, 0.14, 0.004)` em (4.95, 1.21, 0.07), `rotation.z = 0.08`, saindo do porta-cartas; selo `Box(0.03, 0.035, 0.002)` no canto superior direito do envelope | porta-cartas `--room-wood-dark`; envelope `--room-paper`; selo `--fan-coral` | (4.81, 1.01, 0.04) → (5.09, 1.30, 0.09) |

**Focos** (câmera de cada clicável). `alvo` é o `lookAt`. `az` é o azimute em graus a partir de +z, positivo para +x; `el` é a elevação em graus. A direção da câmera é `dir = (sin az·cos el, sin el, cos az·cos el)`. A **distância é calculada** por `enquadrar()` (13.5.2) para o objeto caber **inteiro** na área livre, em qualquer proporção de tela. A "posição nominal" é o resultado em 1920×1080 e serve só para conferência (±5%).

| Cap. | `alvo` | `az` / `el` | Enquadramento | Vista: tipo e `lado` do painel | Lado do cartão do tour | Posição nominal (1920×1080) |
|---|---|---|---|---|---|---|
| 01 | (0.95, 1.22, 0.32) | 0 / 0 (de frente) | **dentro:** a tela (`janela` = (0.58, 1.01, 0.318) → (1.32, 1.43, 0.318)) preenche a moldura do SO, `min(92vw, 1100px) × min(86dvh − 56px, 700px)` | `tela` (SO) | direita | (0.95, 1.22, 1.68) |
| 02 | (1.78, 0.89, 0.32) | 17 / 14 | `margem` 0,35 | painel `porta-retrato`, `esquerda` | direita | (2.08, 1.14, 1.29) |
| 03 | (2.95, 1.45, 0.03) | 0 / 0 (de frente) | **dentro:** a cortiça (`janela` = (2.45, 1.06, 0.03) → (3.45, 1.84, 0.03)) preenche `min(86vw, 1040px) × min(80dvh − 56px, 680px)` | `cortica` | direita | (2.95, 1.45, 2.34) |
| 04 | (2.76, 0.55, 0.33) | 20 / 50 (de cima) | `margem` 0,35 | painel `caderno`, `esquerda` | direita | (3.12, 1.81, 1.33) |
| 05 | (3.42, 0.15, 0.70) | 12 / 30 | `margem` 0,35 | painel `caixa`, `direita` | esquerda | (3.74, 1.05, 2.23) |
| 06 | (4.10, 0.985, 0.34) | 0 / 0 (de frente) | **dentro:** a abertura (`janela` = (3.68, 0.05, 0.34) → (4.52, 1.92, 0.34)) preenche a altura `100dvh − 56px − 32px` (largura livre) | `estante` | esquerda | (4.10, 0.985, 4.14) |
| 07 | (5.33, 1.585, 0.06) | −22 / 6 | `margem` 0,35 | painel `tecido`, `esquerda` | esquerda | (4.81, 1.73, 1.35) |
| 08 | (4.95, 1.155, 0.065) | −18 / 6 | `margem` 0,35 | painel `carta`, `esquerda` | esquerda | (4.61, 1.27, 1.11) |
| — | **Visão geral:** (2.80, 1.00, 1.40) | 32 / 20 | caixa do quarto (−0.12, −0.12, −0.12) → (5.6, 2.83, 3.6), `margem` 0,05 | — | — | (8.18, 4.69, 10.01) |

- As vistas **dentro** (01, 03, 06) são **de frente** (`az = el = 0`) de propósito: assim a projeção da `janela` é um retângulo, e a moldura HTML encaixa nela sem distorção (13.8.4).
- Os painéis (02, 04, 05, 07, 08) usam ângulo de 3/4 para mostrar volume ("mais 3D"), e o objeto fica na **área livre** ao lado do painel.
- Nenhuma posição atravessa móveis. Verificado: a cadeira não entra no quadro do 01 nem do 02, e a bola não cobre a estante no 06 (por isso ela fica perto da porta).

### 13.5 Câmera

#### 13.5.1 Lente e visão geral

- `PerspectiveCamera`, **`fov` vertical de 30°** (perspectiva achatada, perto do isométrico, sem ser ortográfica), `near` 0,05, `far` 40.
- **Visão geral:** vista de frente-direita e de cima (`az` 32°, `el` 20°), com o quarto inteiro enquadrado na área livre. Área livre da visão geral: a tela menos 72 px no topo (HUDs) e 64 px na base (anotação "role").
- **Chegada** (1ª vez que a cena aparece em cada carregamento): a câmera começa na visão geral com distância × 1,25 e `az` + 8° e voa até a visão geral em **1200 ms** `--ease-chegada`, enquanto o `<canvas>` vai de opacidade 0 a 1 em 400 ms. Depois, os post-its entram em sequência (opacidade e 6 px de subida, 160 ms cada, com 40 ms de intervalo). **Com movimento reduzido:** tudo aparece direto, sem voo.

#### 13.5.2 Enquadramento: `enquadrar()`

Função pura em `src/cena/camera.ts`, testada no Vitest. Ela recebe a caixa do objeto, o alvo, a direção, o retângulo livre (px) e a margem, e devolve a posição e o deslocamento de tela que **centraliza o objeto na área livre**:

```ts
// caixa: Box3 (ou a janela, nas vistas "dentro", com margem 0); dir: unitário, do alvo para a câmera
// vp: { L, A } = tamanho do canvas em px; livre: { x, y, l, a } em px; fovV em radianos
export function enquadrar(caixa: Box3, alvo: Vector3, dir: Vector3, fovV: number,
                          vp: { L: number; A: number }, livre: Rect, margem: number) {
  const t = Math.tan(fovV / 2);
  const tH = t * (livre.l / vp.A) * (1 - margem);
  const tV = t * (livre.a / vp.A) * (1 - margem);
  const r = new Vector3().crossVectors(dir.clone().negate(), UP).normalize();
  const u = new Vector3().crossVectors(r, dir.clone().negate());
  let d = 0.6;                                     // distância mínima
  for (const p of cantos(caixa)) {                 // os 8 cantos
    const q = p.clone().sub(alvo);
    const prof = q.dot(dir);
    d = Math.max(d, prof + Math.abs(q.dot(r)) / tH, prof + Math.abs(q.dot(u)) / tV);
  }
  return {
    pos: alvo.clone().addScaledVector(dir, d),
    offX: vp.L / 2 - (livre.x + livre.l / 2),     // camera.setViewOffset(L, A, offX, offY, L, A)
    offY: vp.A / 2 - (livre.y + livre.a / 2),
  };
}
```

**Áreas livres** (px, recalculadas a cada `resize`):

| Contexto | Área livre |
|---|---|
| Visão geral (≥ 768 e proporção ≥ 1,3) | `x` 0…L, `y` 72…A − 64 |
| Painel de vista (02, 04, 05, 07, 08) | Painel com `min(56vw, 760px)` de largura no `lado` da config, de `y` 64 a A − 8. Área livre = o restante da largura menos 16 px de folga, de `y` 64 a A − 16 |
| Vista dentro (01, 03, 06) | O retângulo da moldura (tamanhos da tabela de 13.4), centralizado em `x` e centralizado verticalmente em `y` 56…A |
| Passo do tour (1–8) | Cartão `min(420px, 34vw)` a 24 px da borda do lado configurado. Área livre = o outro lado, a partir de 24 px do cartão, até L − 48 (o trilho fica à direita), de `y` 72 a A − 24. `margem` **0,30**, com o mesmo `alvo` e a mesma direção do foco |
| Passo 9 do tour | Igual à vista do 01 (SO embutido) |
| Mobile 3D (13.9) | Tour: `x` 0…L, `y` 56…0,55·A. Vista: `x` 16…L − 16, `y` 16…0,30·A − 8 |

**O tour reaproveita os focos:** os passos usam o `alvo` e a direção de cada objeto (13.4), só com outra área livre e margem. Não há câmera própria do tour na config.

#### 13.5.3 Voo até o objeto

- **Duração:** `--dur-voo` **900 ms** na ida, `--dur-voo-volta` **700 ms** na volta e `--dur-tour` **900 ms** entre passos. Curva `--ease-voo` = `cubic-bezier(0.65, 0, 0.35, 1)` (*ease-in-out* cúbico), aplicada a um único `t` eased.
- **Trajetória em arco** (é o que tira o voo do "sem graça"): a posição segue uma **Bézier quadrática** de `P0` a `P1` com ponto de controle `C = (P0 + P1)/2 + ŷ · min(0.6, 0.18·|P1 − P0|)`. O alvo vai de `T0` a `T1` por interpolação linear com o mesmo `t`, e `offX`/`offY` também são interpolados. A câmera chama `lookAt(alvo)` a cada quadro, sem rolagem (*roll*) nem mudança de `fov`.
- **Sequência ao clicar num objeto:**
  1. Em t = 0, os post-its, o nome na parede e as anotações vão a opacidade 0 em 120 ms, e o objeto mantém o destaque de hover (13.6).
  2. O voo começa.
  3. Em **75% do voo** (675 ms), `showModal()` abre a vista: o painel entra com opacidade 0 → 1 e deslocamento de 16 px em `--dur-reveal` (160 ms), e o foco vai para o título (5.6). Nas vistas dentro, a moldura aparece já no retângulo final (13.8.4).
  4. Na chegada, a emissão do objeto faz um pulso único (0 → 0,15 → 0 em 400 ms) e se apaga.
- **Durante o voo,** cliques e teclas são ignorados, **exceto Esc**, que cancela e volta. Um novo voo sempre parte da pose em que a câmera está (interrupção sem salto).
- **"Capítulo anterior/próximo"** dentro da vista: o conteúdo sai (opacidade em 120 ms), a câmera voa direto entre os dois focos (900 ms) e o novo conteúdo entra aos 75% do voo.
- **Voltar** (botão "Voltar ao quarto", Esc ou o voltar do navegador): a vista fecha (opacidade em 120 ms) e a câmera volta em 700 ms para a pose de origem (visão geral ou passo do tour em que o visitante estava), **recalculada** para o tamanho atual da tela. Depois, os post-its e o nome reaparecem (160 ms), e o foco volta ao post-it do objeto (5.6).
- **Link direto** (`/#exp-kpmg`, `/#ficha`): a vista abre **na hora**, sem esperar o 3D. Se a cena ainda estiver carregando, a moldura usa a geometria de painel padrão. Quando a cena fica pronta, a câmera **corta** (sem voo) para o foco, e as vistas dentro reposicionam a moldura.

#### 13.5.4 Paralaxe na visão geral

- **Só** na visão geral (passo 0, sem vista aberta), com `(hover: hover) and (pointer: fine)` e **sem** `prefers-reduced-motion`.
- O ponteiro normalizado (`nx`, `ny` ∈ [−1, 1], a partir do centro do palco) orbita a câmera em volta do alvo da visão geral: `az + 1,5°·nx` e `el + 1,0°·(−ny)` (o ponteiro subindo mostra mais de cima). Distância e alvo não mudam.
- **Amortecimento exponencial:** `atual += (meta − atual) · (1 − e^(−5·dt))`, com `dt` em segundos. A renderização para quando `|meta − atual| < 0,0005 rad`. Com o ponteiro fora da janela, a meta volta a 0.
- O nome, os post-its e as anotações acompanham a paralaxe, porque são reprojetados a cada quadro (13.8).

#### 13.5.5 Movimento reduzido (`prefers-reduced-motion: reduce`)

- Todos os voos, a chegada e os passos do tour viram **corte direto** (pose final no quadro seguinte), e o conteúdo da vista aparece sem deslocamento.
- **Sem** paralaxe, pulso de emissão, desenho animado da linha do monitor, transição de luz (a troca dia/noite é instantânea) ou entrada escalonada dos post-its.
- O tour continua como **lista** de cartões (12.13.2), e a câmera corta a cada passo.

### 13.6 Hover, foco e clique

- **Alvo de clique:** um `Box` invisível por objeto, do tamanho da `caixa` + 0,04 m em cada eixo. Esses alvos ficam **fora do grafo da cena** (matriz atualizada uma vez) e são os **únicos** testados pelo `Raycaster`, no máximo uma vez por quadro, no `pointermove`.
- **Destaque** (hover do ponteiro, foco de teclado no `<a class="objeto">` ou hover do post-it; os três dão o mesmo resultado):
  1. **Contorno:** um "casco invertido" com a geometria fundida do objeto, `MeshBasicMaterial` com `side: BackSide`, escalado por eixo em `(s + 0.024)/s` (onde `s` é o tamanho da `caixa` naquele eixo). Isso dá cerca de 1,2 cm de contorno. Cor `#15171C` de dia e `#ECE8DF` à noite (= `--text`), `toneMapped: false`. Fica `visible = false` fora do destaque (custo zero).
  2. **Emissão:** a `emissive` dos materiais do objeto vai de 0 a `#FFFFFF` × 0,08 (dia) / × 0,12 (noite) em `--dur-1` (120 ms).
  3. **Rótulo:** o post-it do objeto entra no estado de hover de 12.13.4 (sobe 3 px e a rotação vai a 0°), e a linha temática aparece abaixo do nome comum ("O monitor", mono 12 px, `--text-muted` sobre `--postit`, 6,72 / 5,35:1). No foco de teclado, o post-it ganha também o anel duplo de 3.3.
  4. **Cursor** `pointer` no `<canvas>` enquanto houver um objeto sob o ponteiro.
- **Sincronia DOM ↔ cena:** o `<a class="objeto">` (post-it) continua sendo **o** elemento acessível. `focus`/`mouseenter` no link chamam `cena.destacar(id)`, e o hover na cena aplica `data-hover` no link. **Clique no objeto 3D = `link.click()`** (o roteador, o histórico e as vistas são os mesmos de hoje). Um clique só conta com deslocamento < 6 px e duração < 500 ms entre `pointerdown` e `pointerup`.
- **Teclado:** sem mudança (7.1 e 12.8). `Tab` e as setas percorrem os post-its 01…08 na ordem do DOM, e o destaque segue o foco. Focar um objeto **não** move a câmera.
- **Toque:** não há hover. Um toque no objeto ou no post-it abre a vista.
- Na visão geral, no tour e na chegada, o destaque funciona; com uma vista aberta, ele fica desligado (só o objeto da vista mantém o pulso de chegada).

### 13.7 Luz dia e noite

- **Renderizador:** `outputColorSpace = SRGBColorSpace`; `toneMapping = NeutralToneMapping`, exposição 1. Todos os materiais **sem luz** (tela, céu, lâmpadas, feixe, contorno) usam `toneMapped: false`, para as cores de token saírem exatas. Os materiais com luz são `MeshLambertMaterial`.
- **O número de luzes é fixo nos dois temas.** O tema só interpola intensidade e cor, então nunca há recompilação de shader.
- **Sombras** (só no nível completo, 13.9): `PCFShadowMap`. **Só o sol/lua projeta sombra**, com `mapSize` 1024, câmera ortográfica de ±3,2, `near` 0,5, `far` 12, `bias` −0,0004, `normalBias` 0,02 e `radius` 3. A cena é estática, então `shadowMap.autoUpdate = false`, com `needsUpdate = true` uma única vez depois de montar. A troca de tema não exige refazer a sombra, porque a direção da luz não muda. Paredes, móveis e objetos projetam e recebem sombra; o céu, o feixe e as lâmpadas, não.

| Luz | Dia (luz acesa) | Noite (luz apagada) |
|---|---|---|
| `HemisphereLight` | céu `#F4F1EA`, chão `#C9B79A`, 2,2 | céu `#2B3560`, chão `#14120F`, 0,55 |
| `DirectionalLight` "sol/lua", em (−3.6, 4.4, 2.6) → alvo (1.3, 0, 1.9), **entra pela janela** e desenha a mancha no tapete | `#FFF1D6`, 2,6 | `#9FB3FF`, 0,5 (a lua projeta a mesma janela, mais fria e fraca) |
| `DirectionalLight` de preenchimento, em (6, 5, 8) → (2.8, 1, 1.4), sem sombra | `#FFFFFF`, 0,8 | `#FFFFFF`, 0,15 |
| `SpotLight` da luminária, na cúpula (0.60, 1.14, 0.44) → (1.15, 0.76, 0.52), ângulo 0,75 rad, penumbra 0,7, `decay` 2 | 0 | `#FFD27A`, 6 |
| `PointLight` de halo da luminária, no mesmo ponto, distância 2,6, `decay` 2 | 0 | `#FFD27A`, 1,2 |
| `PointLight` do monitor, em (0.95, 1.20, 0.65), distância 2,0, `decay` 2 | 0 | `#BFE6DA`, 0,8 |

| Emissivo (`MeshBasicMaterial`) | Dia | Noite |
|---|---|---|
| Tela do monitor | textura de dia (fundo `--room-screen` `#F2F6F4`) | textura de noite (fundo `#10241F`) |
| Céu da janela | `#BFDDE8` + prédios `#9FB3BF` | `#0B1430` + prédios `#1A2440` + janelas acesas `#FFD27A` + lua `#F2E8C9` |
| Lâmpadas do varal e da luminária | `--bulb-off` `#D6D2C6` | `--bulb-on` `#FFD27A` |
| Feixe de sol | visível (alfa 0,10 → 0) | `visible = false` |

- **Critério de calibração** (o `dev-frontend` ajusta as intensidades acima até cumprir, e o `revisor-qualidade` confere com o conta-gotas numa captura de tela):
  - de dia, a parede do fundo **fora** da mancha de sol fica em `#EFE9DC` ± 6% de luminância;
  - o tapete **dentro** da mancha nunca chega a branco puro;
  - à noite, nenhuma face visível fica mais escura que `#191C28`, e a mesa sob a luminária fica claramente quente.
- **Troca pelo interruptor:** a cena ouve a mudança de `data-theme` no `<html>` (`MutationObserver`) e interpola as luzes e as cores dos emissivos em `--dur-light` (320 ms, `--ease-std`). As texturas da tela e do céu trocam no meio da transição. O fundo CSS do palco acompanha o tema. **Com movimento reduzido,** a troca é instantânea.
- **Nível leve** (sem sombras): a mancha de sol vira um **decalque** no piso. É o polígono obtido projetando os 4 cantos do vão da janela na direção da luz até `y` = 0,002, com `MeshBasicMaterial` `#FFF1D6`, opacidade 0,35 (dia) ou `#9FB3FF` com 0,12 (noite), `transparent` e `depthWrite: false`. Sob a cadeira, a mesinha, a caixa, a bola e a planta entram **sombras de contato**: `CircleGeometry` com textura radial compartilhada (64×64, `rgba(21,23,28,.18)` → 0).

### 13.8 Texto na cena: sempre HTML real

Nenhum texto com significado fica só no WebGL. O `<canvas>` é `aria-hidden="true"`, e todo texto de canvas é decorativo e repete algo que já está no HTML.

#### 13.8.1 Nome na parede: HTML em 3D (`CSS3DRenderer`)

- O bloco `.parede-bloco` (o `<h1>` com o nome, "Dados → IA" e o post-it "Fale comigo!") é **um único `CSS3DObject`** plano, colado na parede do fundo. O `CSS3DRenderer` (addon) usa a mesma câmera do WebGL, então o texto fica em perspectiva junto com a parede, mas continua selecionável, legível por leitor de tela e com foco no link.
- O `domElement` do `CSS3DRenderer` é inserido **no mesmo lugar do DOM** onde o bloco estava. Assim, a ordem de leitura e de `Tab` não muda: "Modo recrutador" → PT|EN → interruptor → (Pular) → "Fale comigo!" → objetos 01…08 → tour.
- **Escala:** o bloco é desenhado em "px de parede", com **200 px = 1 m** (`CSS3DObject.scale = 1/200`). Canto superior esquerdo do bloco em (0.32, 2.50, 0.004).
  - Nome: Bricolage 800, **44 px de parede** (0,22 m), `white-space: nowrap`. Mede cerca de 2,4 m, de `x` 0,32 a 2,72.
  - "Dados → IA": Atkinson Hyperlegible Mono 500, 20 px de parede, 6 px abaixo do nome, com a seta em SVG `--accent`.
  - Na tela, isso dá cerca de 45 px de corpo em 1920×1080 e 33 px em 1024×768.
- **Contraste:** mantém o halo de 12.13.3 (`-webkit-text-stroke: 6px var(--halo)` + `paint-order`), ou seja, 17,93:1 de dia e 15,06:1 à noite sobre qualquer pixel. **Não use** `will-change` nos elementos CSS3D (o texto ficaria borrado).
- **Post-it "Fale comigo!":** dentro do mesmo bloco, à direita do nome, com centro em (3.10, 2.24) na parede, `rotate(−5deg)`, 96 × 80 px de parede. Cores e textos de 12.13.3.
- **Antes de a cena ficar pronta** (e quando o 3D não está ativo), o bloco aparece **plano**, em CSS normal, no canto superior esquerdo do palco (`left: 6vw; top: 14vh`). Quando a cena fica pronta, ele recebe a transformação 3D, num cruzamento de opacidade de 240 ms junto com a chegada (instantâneo com movimento reduzido).
- O bloco some (opacidade 0 em 120 ms) em voos, vistas e passos do tour ≥ 1, como hoje.

#### 13.8.2 Post-its dos objetos: HTML voltado para a tela

- Os post-its continuam `<a class="objeto">` dentro do `<ol class="objetos">` (12.13.4) e **não** entram no CSS3D. Ficam **de frente para a tela** (sem perspectiva), para o texto não deformar.
- A posição vem da **projeção de uma âncora 3D** (`postit.ancora`) mais um **pivô** (o ponto do post-it que fica sobre a âncora), via `transform: translate3d(px, px, 0) rotate(rot)`. A reprojeção acontece só nos quadros em que a câmera se move.
- **Tamanho na cena 3D:** `inline-size: max-content; max-inline-size: 9.5rem`, com `padding` de 8 × 10 px. Número em mono 12 px e nome comum em Patrick Hand **17 px**, em até 2 linhas. Mesmas cores, sombra e estados de 12.13.4.

| Cap. | `ancora` (m) | `pivo` | `rot` |
|---|---|---|---|
| 01 | (0.62, 1.41, 0.34): canto superior esquerdo da tela | `topo-esq` | 4° |
| 02 | (1.93, 0.96, 0.30): à direita da moldura | `topo-esq` | −3° |
| 03 | (3.44, 1.83, 0.05): canto superior direito da cortiça | `topo-dir` | 3° |
| 04 | (2.76, 0.50, 0.54): borda da frente da mesinha | `topo-centro` | −2° |
| 05 | (3.42, 0.00, 0.88): no chão, à frente da caixa | `topo-centro` | 2° |
| 06 | (4.10, 1.95, 0.30): em cima da estante | `base-centro` | −3° |
| 07 | (5.33, 1.34, 0.08): abaixo da ponta do lenço | `topo-centro` | −4° |
| 08 | (4.95, 1.00, 0.08): abaixo do porta-cartas | `topo-centro` | 3° |

- **Regra de colisão** (testada em 13.14): na visão geral em 1280×800, 1440×900, 1920×1080 e 2560×1080, nenhum post-it encosta em outro, no bloco do nome ou nos HUDs (folga ≥ 8 px). Se colidir, ajuste só a `ancora` ou o `pivo` na config.

#### 13.8.3 Anotações à mão

- Mesmas regras de 12.13.5, com novas âncoras:
  - **"comece aqui":** relativa ao post-it 01, com o texto em (−180 px, −90 px) a partir do canto superior esquerdo do post-it e a seta até esse canto (`relativoA: 'monitor'`);
  - **"role…":** fixa na tela, centralizada, a 96 px da base.
- A seta é recalculada nos quadros em que a câmera se move.

#### 13.8.4 SO, mural e estante: moldura HTML sobre a `janela` projetada

- Depois do voo (e a cada `resize`), `cena.retanguloJanela(id)` projeta os 4 cantos da `janela` e devolve a caixa em px. Como essas vistas são de frente, o retângulo é exato.
- `vista.ts` usa esse retângulo no lugar do cálculo em % de hoje. O mínimo de 560 × 360 px e o *clamp* à tela continuam.
- **Monitor/SO:** a área de trabalho HTML cobre exatamente a tela 3D, e a carcaça 3D aparece em volta como bisel. **Não** desenhe bisel em CSS. No passo 9 do tour, é o mesmo nó (12.13.1).
- **Mural e estante:** a moldura HTML continua opaca, com o fundo temático em CSS (cortiça e madeira, como hoje), cobrindo a `janela`. Os papéis e os livros 3D ficam `visible = false` enquanto a vista está aberta, para não aparecerem pelas bordas.
- As bordas 3D reais (moldura do mural e laterais da estante) aparecem em volta da moldura HTML. Na estante, a moldura tem pelo menos 560 px de largura e cobre as laterais quando a estante projetada for mais estreita.

#### 13.8.5 Texturas de canvas (decorativas)

Todas são `CanvasTexture` com `colorSpace = SRGBColorSpace`, desenhadas **depois** de `document.fonts.load()` das fontes usadas. Todas são decorativas.

| Textura | Tamanho | Conteúdo |
|---|---|---|
| Tela do monitor (assinatura) | 1024×576 (nível leve: 768×432) | Fundo `#F2F6F4` (dia) ou `#10241F` (noite) com grade de pontos (`--border` / `#2E3240`, 1,5 px a cada 32 px). A **linha da carreira** usa o mesmo `d` do SVG de sobreposição atual (`Path2D`): traço de 6 px, `#4F545C` / `#A3A6AE` até 2026 e `#B8400F` / `#FF8A4C` depois do vértice. Rótulos "2026" e "IA" em mono 500 28 px na mesma cor do trecho. No 1º hover ou foco do monitor, a linha se desenha em `--dur-draw` (700 ms, atualizando a textura a cada quadro). Nível leve e movimento reduzido: estática |
| Céu e cidade | 512×384 × 2 (dia/noite) | Céu chapado; 9 prédios retangulares de alturas fixas; à noite, 14 janelas acesas 6×8 px e a lua (círculo de 26 px) |
| Pôster | 256×352 | Diagonal do canto inferior esquerdo ao superior direito: metade `--fan-red`, metade `--fan-blue`. **Teia geométrica original:** 7 raios retos a partir do canto inferior esquerdo + 4 anéis poligonais concêntricos, linha `--room-paper` de 2 px com alfa 0,55. Sem figura, máscara, logo ou texto |
| Páginas do caderno | 512×320 | Pauta `#D6D2C6` a cada 20 px; na página direita, esboço de 5 barras crescentes em contorno `#4F545C` de 2 px (aceno a dados, sem números) |
| Lombadas dos estojos | 512×128 (atlas) | Os nomes "VALORANT", "Counter-Strike", "Resident Evil 4" e "Call of Duty" em Atkinson Hyperlegible Mono 500, na vertical, `#15171C` sobre `#FFFDF7` ou `#FFFDF7` sobre `#2B2F38`; 1 estojo sem nome. Só texto em fonte comum, **sem** logo nem fonte oficial |

### 13.9 Mobile, retrato e níveis de qualidade

**Telas em tela cheia** (largura ≥ 768 **e** proporção ≥ 1,3): o 3D carrega **automaticamente** (13.10).

**Mobile e retrato** (largura < 768 **ou** proporção < 1,3): o 3D **não carrega sozinho**. Isso protege a 1ª impressão no celular e o Lighthouse mobile.

```
360 × 640 — padrão (sem 3D)                360 × 640 — depois de "Entrar no quarto em 3D"
┌──────────────────────────────┐          ┌──────────────────────────────┐
│[≡ Modo recrutador]  [PT|EN][◑]│          │[≡ Modo recrutador]  [PT|EN][◑]│
│                              │          │      (canvas: maquete na     │
│   ╱‾‾‾ linha da carreira ↗IA │ ← SVG    │       área livre de cima,    │
│                              │   atual  │       55% da altura)         │
│ Matheus Maki Nagano          │          │                              │
│ Dados → IA                   │          ├──────────────────────────────┤
│ [Fale comigo! · LinkedIn ↗]  │          │ 01 de 08 · O monitor ·       │
│ [Entrar no quarto em 3D]     │          │ Projeto Vértice              │
│ Explorar o quarto ↓          │          │ {tour.vertice.resumo}        │
├──────────────────────────────┤          │ [Abrir capítulo]             │
│ ▢01 Projeto Vértice  resumo →│ nichos   └──────────────────────────────┘
│ ▢02 Sobre mim        resumo →│ só texto   cartões do tour rolando na base (45%)
└──────────────────────────────┘
```

- **Padrão (sem 3D):**
  - herói em 100svh com o SVG da linha da carreira (a assinatura, já existente, ≤ 1 KB) em grande atrás do nome;
  - o bloco do nome em fluxo normal (não CSS3D), com o post-it "Fale comigo!" e o botão secundário **[Entrar no quarto em 3D]**;
  - abaixo, os **nichos só de texto**, em 1 coluna: post-it do capítulo, `{tema}`, `{tour.<id>.resumo}` e "Abrir capítulo". As vistas abrem em tela cheia, como hoje.
- **Depois do toque em "Entrar no quarto em 3D"** (escolha guardada em `sessionStorage`):
  - o herói e os nichos dão lugar ao palco `sticky` de 100svh com o tour pela rolagem;
  - o cartão ocupa os 45% de baixo, e a câmera enquadra nos 55% de cima;
  - não há post-its nem paralaxe; tocar num objeto 3D abre a vista, e [Abrir capítulo] no cartão é o caminho acessível;
  - a vista vira uma **folha inferior** de 70svh, com o objeto enquadrado nos 30% de cima;
  - nível leve sempre.
- **Tablet deitado** (≥ 768, proporção ≥ 1,3): layout de desktop, no nível leve se o ponteiro for `coarse`.

| | Nível completo | Nível leve |
|---|---|---|
| Quando | Padrão em tela cheia | `(pointer: coarse)`, **ou** `hardwareConcurrency ≤ 4`, **ou** `deviceMemory ≤ 4`, **ou** `saveData`, **ou** queda automática |
| `pixelRatio` | `min(devicePixelRatio, 2)` | `min(devicePixelRatio, 1.5)` |
| `antialias` | `true` | `false` |
| Sombras | `PCFShadowMap` 1024 (13.7) | **desligadas**; decalque de sol + sombras de contato |
| `powerPreference` | `'high-performance'` | `'low-power'` |
| Textura da tela | 1024×576, linha animada | 768×432, estática |
| Paralaxe | sim (ponteiro fino) | só com ponteiro fino |

- **Queda automática:** durante o 1º voo, se a média de 30 quadros passar de 24 ms, `pixelRatio` vai para 1. Se no voo seguinte ainda passar, as sombras desligam e o decalque liga. Isso exige recompilar uma única vez e vale pelo resto da sessão.

### 13.10 Carregamento, fallback e performance

**Carregamento sob demanda** (o modo recrutador continua sendo o HTML base):
1. **Script do `<head>`** (≤ 1,5 KB): além do que já faz, em tela cheia e sem `?modo=recrutador`, ele testa `canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })` e libera o contexto com `WEBGL_lose_context`.
   - Se falhar, define `data-modo="recrutador"` **antes da 1ª pintura** (sem CLS) e grava `sessionStorage.semWebgl = 1`. Depois do `load`, anuncia `{quarto.semWebgl}` na região `role="status"`.
   - No mobile, o teste acontece só no toque em "Entrar no quarto em 3D". Se falhar, o botão some e a mensagem aparece no lugar dele.
2. **Módulo principal** (`src/scripts/quarto.ts`, ≤ 14 KB gzip): em tela cheia, depois do `load`, chama `requestIdleCallback` (*timeout* de 2000 ms; sem suporte, `setTimeout` de 200 ms) e faz `import('../cena/index.ts')`. Esse é **o único** caminho que traz o `three`.
3. **Montagem fatiada:** casca → móveis → clicáveis → texturas, com `scheduler.yield()` (ou `setTimeout(0)`) entre as fatias, para nenhuma tarefa passar de 50 ms. Antes do 1º quadro, `await renderer.compileAsync(scene, camera)`.
4. **Enquanto carrega:** HUD, bloco do nome plano (13.8.1) e a **intro SQL** (11.2) como tela de carregamento na 1ª visita. Se a cena ficar pronta antes do fim da animação (cerca de 2,4 s), a intro termina normalmente; se não, a barra "executando…" continua até a cena ficar pronta, e só então aparece a linha de resultado. "Pular" esconde a intro, mas não cancela o carregamento.
   - Nas visitas seguintes: uma pílula `role="status"` com fundo do HUD, `{quarto.carregando}` e uma barra indeterminada (estática com movimento reduzido), centralizada a 96 px da base.
   - Os post-its ficam `visibility: hidden` até a cena estar pronta (sem links invisíveis no `Tab`).
5. **Falha** (erro de rede no *chunk*, `webglcontextlost` sem `webglcontextrestored` em 2 s ou exceção na montagem): o palco mostra um cartão `.papel` com `{quarto.erroCena}`, **[Tentar de novo]** e **[Modo recrutador]**. Não há troca automática de modo, para evitar CLS e surpresa.
6. **Renderização sob demanda:** não existe laço contínuo. `invalidar()` pede um `requestAnimationFrame` só enquanto houver voo, paralaxe amortecendo, transição de luz, desenho da linha ou mudança de destaque. Parado = 0 quadros por segundo. Com `visibilitychange` oculto, tudo pausa. Ao sair do modo quarto, a cena pausa; no `pagehide`, ela é destruída (`dispose` de geometrias, materiais, texturas e do renderizador).
7. **`resize`:** `ResizeObserver` no palco → `setSize`, `aspect` e a pose atual recalculada por `enquadrar()` (sem animação), mais o tamanho do `CSS3DRenderer`.

**Importações permitidas** (*tree-shaking*: só importações nomeadas, nunca `import * as THREE`): `three` (última estável, ≥ r170, `WebGLRenderer`); `three/addons/geometries/RoundedBoxGeometry.js`; `three/addons/utils/BufferGeometryUtils.js`; `three/addons/renderers/CSS3DRenderer.js`. **Proibido:** `three/webgpu`/TSL, `OrbitControls`, `GLTFLoader` ou qualquer modelo externo, `EffectComposer`/`OutlinePass`/pós-processamento, `troika-three-text` e HDRI. `@types/three` entra como devDependency. Custo zero: tudo MIT.

**Orçamento** (substitui 12.9 e 12.13.8; `scripts/medir-cena.mjs` faz o CI falhar se passar):

| Recurso | Orçamento |
|---|---|
| *Chunk* da cena (`three` + addons + `src/cena/**`), gzip | **≤ 250 KB** (meta ≤ 190 KB) |
| Módulo principal + script do `<head>`, gzip | ≤ 14 KB + ≤ 1,5 KB |
| HTML por idioma / CSS | ≤ 45 KB / ≤ 24 KB gzip |
| Fontes | ≤ 130 KB (sem mudança) |
| Imagens da cena | **0 bytes** |
| *Draw calls* / triângulos (visão geral, nível completo) | ≤ 100 / ≤ 60 mil |
| Memória de GPU (texturas + sombra) | ≤ 32 MB |
| Cena pronta após o `load` | ≤ 1,5 s (desktop médio, banda larga); ≤ 3 s no nível leve |
| Quadro durante voos | ≤ 16,7 ms (completo); ≤ 33 ms (leve) |
| **Metas Lighthouse** | **≥ 90 nas 4 categorias.** Mobile (emulado, retrato): o 3D não carrega, a página é o HTML leve, LCP ≤ 2,5 s. Desktop: TBT ≤ 150 ms com o 3D carregando no *idle*, CLS ≤ 0,02, INP ≤ 200 ms. O LCP é texto (nome ou cabeçalho), nunca o `<canvas>` |

- **Medição honesta:** o `revisor-qualidade` roda o Lighthouse desktop **com GPU real** (Chrome local, não *headless* com SwiftShader). No SwiftShader, o teste do `<head>` falha de propósito e a página vira o modo recrutador. Os dois resultados vão para o relatório.

### 13.11 Contraste (novas combinações)

Todo texto novo é HTML com tokens já verificados: post-its (12.13.4), bloco do nome com halo (12.13.3), HUD e pílula de carregamento (12.1: pior caso 11,74:1 em `--text` e 4,99:1 em `--text-muted`), cartão de erro `.papel` (3.4), herói e nichos mobile sobre `--bg`/`--surface` (3.1, 3.2) e linha temática do post-it (13.6). As únicas cores novas aparecem no canvas, são decorativas e mesmo assim passam de AA:

| Texto / traço (canvas da tela) | Fundo | Razão |
|---|---|---|
| Rótulos e linha até 2026, dia: `#4F545C` | `#F2F6F4` | **6,99:1** |
| Linha depois de 2026, dia: `#B8400F` | `#F2F6F4` | **5,10:1** |
| Rótulos e linha até 2026, noite: `#A3A6AE` | `#10241F` | **6,66:1** |
| Linha depois de 2026, noite: `#FF8A4C` | `#10241F` | **6,95:1** |

- Os materiais sem luz usam `toneMapped: false`, então esses valores saem exatos na tela.
- O contorno de destaque (13.6) é reforço; o indicador de foco que conta para a WCAG é o anel duplo do post-it (3.3).
- Em `forced-colors`, o `<canvas>` não muda, e todos os textos e controles HTML seguem as cores do sistema.

### 13.12 Config e validador (`src/config/quarto.ts`)

O formato muda para metros. Os campos `imagem`, `areasReservadas`, `clique`, `vista.camera`, `vista.janela` (%), `tour.camera` e `postit.{x,y}` saem.

```ts
type V3 = [number, number, number];
type Caixa = { min: V3; max: V3 };
type Pivo = 'topo-esq' | 'topo-centro' | 'topo-dir' | 'esq-centro' | 'dir-centro' | 'base-centro';

interface ObjetoQuarto {
  id: IdObjeto; capitulo: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8; destino: string; secoes: string[];
  caixa: Caixa;                                       // AABB em metros (13.4)
  foco: { alvo: V3; az: number; el: number; margem?: number };   // margem padrão 0.35
  janela?: Caixa;                                     // só nas vistas dentro (01, 03, 06); plana em z
  preencher?: { lVw: number; lMax: number; aVh: number; aMenos: number; aMax: number }; // moldura alvo da vista dentro
  vista: { tipo: TipoVista; lado?: 'esquerda' | 'direita' };
  tour: { lado: 'esquerda' | 'direita' };
  postit: { ancora: V3; pivo: Pivo; rot: number };
}
interface ConfigQuarto {
  limites: Caixa;                                     // (−0.12, −0.12, −0.12) → (5.6, 2.83, 3.6)
  geral: { alvo: V3; az: number; el: number; margem: number; fov: number };
  paredeNome: { ancora: V3; pxPorMetro: 200 };
  objetos: ObjetoQuarto[];
  anotacoes: Array<{ id: 'comece'; relativoA: IdObjeto; dx: number; dy: number; rot: number; larguraMax: number }
                 | { id: 'role'; tela: { x: string; base: number }; rot: number; larguraMax: number }>;
}
```

- `preencher` do 01: `{ lVw: .92, lMax: 1100, aVh: .86, aMenos: 56, aMax: 700 }`; do 03: `{ lVw: .86, lMax: 1040, aVh: .80, aMenos: 56, aMax: 680 }`; do 06: `{ lVw: .92, lMax: 99999, aVh: 1, aMenos: 88, aMax: 99999 }`.
- **Validador** (derruba a build):
  - 8 objetos, capítulos 1–8 e destinos únicos;
  - cada `caixa` dentro de `limites`, e nenhuma `caixa` se cruza com outra;
  - `foco.alvo` dentro da própria `caixa` (as vistas dentro aceitam o alvo na face da `janela`);
  - `janela` e `preencher` presentes **só e sempre** em `tela`, `cortica` e `estante`;
  - nas vistas dentro, `az = el = 0`;
  - `az` ∈ [−60, 60], `el` ∈ [−10, 70] e `margem` ∈ [0,05; 0,5];
  - `postit.ancora` a no máximo 0,4 m da `caixa` do objeto, e `rot` ∈ [−6, 6].
- **Calibração:** `?calibrar=1` (só em desenvolvimento) mostra os alvos de clique em *wireframe*, os `alvo`s como esferas de 2 cm, as `janela`s em contorno vermelho e as âncoras dos post-its. Ele também registra no console as colisões de post-its na tela atual. `?calibrar=og` renderiza a visão geral em 1200×630, sem HUD, para capturar o `og.png`.

### 13.13 Chaves de texto

| Chave | pt | en |
|---|---|---|
| `quarto.cenaDescricao` (parágrafo `sr-only` antes de `quarto.ajuda`; substitui `quarto.imagemAlt`) | "Quarto de trabalho em 3D, visto do alto, com mesa, monitor, mural de cortiça, estante e porta. Oito objetos abrem os capítulos do site." | "A 3D workroom seen from above, with a desk, monitor, corkboard, bookshelf and door. Eight objects open the site's chapters." |
| `quarto.carregando` | "Montando o quarto em 3D…" | "Building the 3D room…" |
| `quarto.semWebgl` | "Este navegador não exibe o quarto em 3D. Mostrando o modo recrutador." | "This browser can't show the 3D room. Showing recruiter mode." |
| `quarto.erroCena` / `quarto.tentarDeNovo` | "Não foi possível carregar o quarto em 3D." / "Tentar de novo" | "Couldn't load the 3D room." / "Try again" |

- **Saem:** `quarto.imagemAlt`.
- **Mantidas:** todas as de 12.13.9, `intro.*`, `quarto.ajuda`, `quarto.explorarAbaixo` (link do herói mobile para os nichos) e `quarto.objetos.*.tema` (agora também na linha temática do post-it, 13.6).
- Nenhuma chave nova afirma fatos sobre o Matheus.

### 13.14 Tarefas para o `dev-frontend` (prevalecem sobre 12.11 e 12.13.9 onde conflitarem)

25. **Remover a pipeline raster** (13.1):
    - scripts, `npm run imagens`, `medir-imagens` no `verify`, `public/img/quarto/**`, `recortes.json`, `lqip.json`;
    - `<picture>`, *preload* da imagem, LQIP, película das vistas e `src/scripts/camera.ts`.
    - Acrescentar a nota de obsoleto em `docs/prompt-imagem-quarto.md`.
26. **Dependências:** `three` e `@types/three` (dev). Criar `src/cena/` com `index.ts` (API: `iniciar(opts)`, `irPara(id | 'geral' | passo, { animar })`, `voltar()`, `destacar(id | null)`, `retanguloJanela(id)`, `pausar()`, `destruir()`), `paleta.ts`, `casca.ts`, `decoracao.ts`, `objetos/*.ts` (um por clicável), `luzes.ts`, `texturas.ts`, `camera.ts` (`enquadrar`, voo, paralaxe), `projecao.ts` (post-its e anotações), `escolha.ts` (*raycast*) e `nivel.ts`.
27. **Casca, decoração e clicáveis** exatamente como em 13.2–13.4, com fusão por material, livros e lâmpadas em `InstancedMesh` e materiais próprios por clicável.
28. **Luz** (13.7): luzes fixas, interpolação no tema, sombra estática, `toneMapped: false` nos emissivos, calibração pelo critério dado; decalque e sombras de contato no nível leve.
29. **Câmera** (13.5): `enquadrar()` com `setViewOffset`, áreas livres, voo em arco, sequência de abertura aos 75%, volta, interrupção, chegada, paralaxe e cortes com movimento reduzido. Tokens novos em `tokens.css`: `--dur-voo: 900ms; --dur-voo-volta: 700ms; --dur-tour: 900ms; --dur-chegada: 1200ms; --ease-voo: cubic-bezier(0.65, 0, 0.35, 1); --ease-chegada: cubic-bezier(0.33, 1, 0.68, 1)`.
30. **Hover, foco e clique** (13.6) sincronizados com os `<a class="objeto">`; linha temática no post-it.
31. **Texto na cena** (13.8): bloco do nome via `CSS3DRenderer` no mesmo lugar do DOM, post-its projetados com pivô, anotações relativas, `retanguloJanela` alimentando `vista.ts`, objetos 3D ocultos nas vistas dentro e texturas de canvas.
32. **Tour** (12.13.2) usando `cena.irPara(passo)` com as áreas livres de 13.5.2; o passo 9 é a pose do 01.
33. **Mobile** (13.9): herói com a linha da carreira, nichos só de texto, botão "Entrar no quarto em 3D", palco do tour mobile e folha inferior.
34. **Carregamento e fallback** (13.10): teste no `<head>`, `import()` no *idle*, montagem fatiada + `compileAsync`, intro como carregamento, pílula de status, cartão de erro e renderização sob demanda.
35. **Config e validador** (13.12) com os valores de 13.4 e 13.8.2; `?calibrar=1` e `?calibrar=og`.
36. **Textos** (13.13) em pt e en.
37. **Testes e verificação:**
    - **Vitest:** `enquadrar()` deve manter os 8 cantos de cada `caixa` dentro da área livre (reduzida pela metade da margem) em 1920×1080, 1440×900, 1280×800, 1024×768 e 2560×1080, nos contextos de vista e de tour; o validador recusa configs inválidas.
    - **No navegador:**
      - os 8 objetos aparecem inteiros em cada foco nas 5 resoluções;
      - nenhum post-it colide na visão geral (13.8.2);
      - SO, mural e estante com a moldura sobre a `janela`;
      - Esc, "Voltar" e o voltar do navegador em todos os capítulos e no meio do voo;
      - teclado, leitor de tela, movimento reduzido, `forced-colors` e troca dia/noite;
      - links diretos `/#exp-kpmg` e `/#ficha` antes e depois da cena pronta;
      - Chrome com a aceleração de hardware desligada (deve cair no modo recrutador sem CLS);
      - 360×640 e tablet em pé.
    - **Lighthouse** conforme 13.10 (mobile emulado e desktop com GPU real); `scripts/medir-cena.mjs` no `verify`.
    - Depois da aprovação do Matheus: capturar o novo `og.png` com `?calibrar=og` (≤ 150 KB).

### 13.15 Riscos

- **Peso do `three` no celular:** mitigado por não carregar o 3D sozinho no mobile e pelo orçamento no CI. Se o *chunk* passar de 250 KB, corte primeiro o `CSS3DRenderer` (o nome vira HTML projetado sem perspectiva, como os post-its) e depois o `RoundedBoxGeometry` (troque por `Box`).
- **Aparência "genérica de Three.js":** a identidade vem da maquete cortada, dos cantos arredondados, da paleta chapada dos tokens e da luz da janela, sem texturas fotográficas. Não acrescente HDRI, *bloom* nem materiais PBR brilhantes.
- **Teste dos 30 segundos:** sem mudança em relação a 12.12. "Modo recrutador" continua sendo o 1º focável, e no celular a 1ª tela já tem nome, Dados → IA e LinkedIn em HTML.
- **Acessibilidade do 3D:** todo caminho existe sem ponteiro e sem WebGL (links, cartões e modo recrutador). O `<canvas>` é decorativo.
- **Calibração da luz:** as intensidades são o ponto de partida; o critério de 13.7 é o que vale.

## 14. Estado atual (revisão 7+)

Resumo do que vale hoje. Onde divergir das seções 11 a 13, esta seção prevalece.

- **Sem post-its numerados nem marcadores circulares.** Os objetos são destacados por luz e movimento; o `<a class="objeto">` é invisível (alvo de toque, foco e nome acessível). O número do objeto existe só para leitor de tela (`.p-num` em `sr-only`), tanto no quarto quanto nos nichos e nas vistas.
- **Objetos interativos:** em repouso, emissive creme; um *glint* guia o olhar; no hover, o objeto sobe, ganha contorno creme e um rótulo com fonte ≥ 15 px. No celular, o 1º toque mostra o rótulo e o toque duplo abre o capítulo.
- **"Fale comigo!"** é o único post-it que resta (parede do fundo), com piso de legibilidade em px de tela: abaixo do piso, o cartão é ampliado.
- **Sem subtítulo sob o nome.** "Aberto a oportunidades" aparece só na linha Status e no `og.png`.
- **Celular:** pose de retrato da câmera; cartões do tour e nichos de texto (reserva sem 3D) são cartões limpos com tokens do tema (dia/noite), sem rotação, sem fita, sem barra lateral colorida e sem número visível.
- **Vistas** sem *kickers* numerados.
- **Links externos** abrem em nova guia (`target="_blank" rel="noopener noreferrer"`, com aviso `sr-only`).
- **`og.png`** gerado do quarto 3D (`?calibrar=og`).

### 14.1 Quarto 3D, revisão 9 (prevalece sobre 13.3 e 13.8.5 no que divergir)

- **Mesa industrial:** tampo mel de 5 cm (`P.mel`) e estrutura de aço preto (`P.preto`) com laterais em "U" fechado; sem gaveteiro. A superfície continua em y = 0,76.
- **Dois monitores:** o horizontal (objeto 01, inalterado) e um vertical decorativo à esquerda, com base comprida compartilhada e haste; a tela dele é um canvas de linhas de código abstratas (`texturaTelaVertical`).
- **Luminária** passou para o canto direito do tampo (`LUMINARIA` em `luzes.ts`; spot e halo seguem a cabeça).
- **Headset branco** (base retangular, duas hastes, sela, conchas, aros cinza-metal, almofadas, microfone), **cadeira ergonômica** (encosto e assento de tela, apoio de cabeça, braços em T, base estrela cromada) e **monstera** (folhas recortadas por textura com alfa, dois tons, vaso terracota), tudo com primitivas próprias, sem marcas.
- **Quadro da parede esquerda:** "A Grande Onda de Kanagawa", Hokusai, c. 1831, **domínio público** (Wikimedia Commons, arquivo `Great_Wave_off_Kanagawa2.jpg`). Salvo reduzido em `public/img/kanagawa.jpg` (512 × 350, ~35 KB) e carregado com `TextureLoader` quando a cena monta; se falhar ou passar de 4 s, o quadro fica em papel liso. É a **única imagem da cena** (orçamento: 60 KB, conferido por `scripts/medir-cena.mjs`). O pôster vermelho e azul com teia foi removido.
