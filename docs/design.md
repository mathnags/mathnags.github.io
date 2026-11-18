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
  <section id="ficha">        Resumo (Hero)
  <nav id="quarto">           palco: <svg viewBox> aria-hidden + <ol> de 12 links (só no modo quarto)
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
| Mesa · mesinha · cadeira · tapete · luminária · interruptor | — | 40,600,520,300 · 830,640,180,260 · 200,640,160,260 · 300,900,500,60 · 760,0,80,110 · 1440,480,16,28 | — | — | — | — |

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
| **Próximo sugerido** | — | ponto `--accent` de 8 px + anel que pulsa 2× e para; texto oculto "próximo sugerido" |
| **Lido** | a lâmpada do capítulo acende (`--bulb-on`; à noite, com `--glow`) | ✓ `--pine` de 12 px; texto oculto "lido" |
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
| `Tab` / `Shift+Tab` | página | botão de modo → idioma → luz → CTA do resumo → **objetos na ordem dos capítulos**: 01 monitor, 02 porta-retrato, 03 mural, 04 caderno, 05 caixa, 06 estante, 06 quadros, 07 lenço, 07 bola, 07 headset, 07 estojos, 08 envelope → rodapé |
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
- `vista.tipo` ∈ {tela, cortica, estante} ⇒ `janela` presente; secundários têm `mobile.ladrilho = null`;
- todas as chaves de texto `textos.*` (10.2) existem em pt e en.

O JS do quarto **não tem coordenadas fixas no código**: ele lê a config, serializada no HTML como `<script type="application/json" id="quarto-config">` (≤ 3 KB).

### 9.3 Abordagem técnica

**DOM + SVG inline, sem canvas e sem bibliotecas de animação.** Os objetos são `<a>` reais. O SVG é só o desenho, pintado por variáveis CSS. A câmera é um único `viewBox` interpolado em `requestAnimationFrame` **apenas durante os 400 ms do zoom**, sem loop contínuo. Durante o zoom, desligue os efeitos de hover (`pointer-events: none` no palco) e use `will-change: transform` só no fallback com `transform`.

### 9.4 Orçamento de performance (Lighthouse ≥ 90 nas 4 categorias, mobile simulado)

| Recurso | Orçamento |
|---|---|
| HTML por idioma (todo o conteúdo + SVG inline + config) | ≤ 55 KB gzip |
| SVG do quarto (componentes + decoração, após SVGO) | ≤ 45 KB bruto / ≤ 11 KB gzip, ≤ 400 elementos |
| CSS total (inclui as 8 molduras de vista) | ≤ 20 KB gzip |
| JS: script inline no `<head>` | ≤ 1 KB |
| JS: `quarto.ts` compilado (câmera, teclado, histórico, vistas, modo) | ≤ 10 KB gzip, `type="module"` |
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

360, 768, 1024 e 1280 px; luz acesa e apagada; zoom do navegador em 200% e 400%; só teclado (Tab na ordem dos capítulos, Esc devolvendo o foco); NVDA + Firefox e VoiceOver + Safari com vista aberta; `forced-colors`; reduced motion (corte direto); JS desligado (abre no modo recrutador); `?modo=recrutador#exp-kpmg`; `/#certificacoes` (abre a estante já aproximada e rolada); voltar do navegador após abrir, navegar entre capítulos e voltar (deve cair no quarto em um passo); troca de idioma com vista aberta; e medição do zoom no painel Performance do DevTools com CPU 4× mais lenta.
