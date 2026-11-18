# Tarefas do dev-frontend (fase 5, design "O quarto")

Leia antes: `docs/arquitetura.md` (contrato, seção 5 sobre o quarto), `docs/design.md` (visual e interação) e `src/schemas/conteudo.ts` (formato do conteúdo).

**Regras para todas as tarefas**
- Uma tarefa por vez, na ordem. Marque `[x]` ao concluir.
- Depois de cada tarefa, `npm run verify` (lint + test + build) precisa passar.
- **Nenhum texto no componente**, nem em `aria-label`, `sr-only` ou anúncio. Use `getTextos(lang)`/`getProjetos(lang)`. Se faltar uma chave, **pare e reporte**; não crie texto de reserva.
- **Nenhuma coordenada fora de `src/config/quarto.ts`**, nem no CSS nem no JS. Desenhos usam só coordenadas locais.
- Só tokens de `src/styles/tokens.css`. Links internos com `comBase()` ou `getRelativeLocaleUrl()`.
- **Modo recrutador é a base:** escreva primeiro o HTML/CSS que funciona sem JS. O que é do quarto fica sob `html[data-modo='quarto']` e dentro de `@media screen`.
- HTML válido (o compilador Rust do Astro 7 não corrige HTML). Ordem do DOM = ordem dos capítulos.
- Verifique em `/` e `/en/`, com luz acesa e apagada, só com teclado e com JS desligado.
- **[bloqueada]** = depende de uma das 4 chaves `ui.*` ainda ausentes (`setaPara`, `linkExterno`, `selosStatus`, `erro404`; arquitetura 4.2). Pule e volte quando o orquestrador avisar.

---

## Bloco 0: ambiente

- [x] **T1. Validar o esqueleto.** Feito pelo arquiteto em 2026-11-18 (Node 26.13.1): `npm install`, `npm test` (18/18), `npm run lint` (0 erros) e `npm run build` passam. No PowerShell, use `npm.cmd`.

## Bloco 1: modo recrutador (HTML base, sem JS)

- [x] **T2. Peças de UI** (`components/ui/`): `Icone` (SVG inline com `aria-hidden`: setas →/↗, cadeado, casinha, ≡, interruptor, ✓), `Selo` (5 variantes, design 5.11), `Chip` (simples e "uso real", 5.9), `BotaoCTA` (5.10), `DualLabel` (5.1).
  *Pronto quando:* cada peça aparece nos dois temas e dentro de `.papel`, com alvo ≥ 44 px onde for interativa.
- [x] **T3. `PaginaInicial` com a estrutura do design 4.0:** `header.topo` → `main#conteudo` (`#ficha`, `nav#quarto` vazio, 8 `section` com `aria-labelledby` e `h2` via `DualLabel`) → `footer` → `dialog#vista` vazio.
  *Pronto quando:* a estrutura bate com 4.0 e a integração não acusa ids duplicados.
- [x] **T4. Topo:** botão de modo como 1º focável (`<a href="?modo=recrutador">`, textos `topo.*`), "Pular para o conteúdo" como 2º, nome, nav do modo recrutador (`SECOES` com `chaveNav`), seletor PT|EN (5.8, `topo.idioma.*`), interruptor (5.7, `topo.luz.*`, oculto sem JS) e menu mobile (`topo.menu`).
  *Pronto quando:* sem JS, todos os links funcionam; o 1º Tab cai no botão de modo e o 2º no "pular".
- [x] **T5. Resumo (`#ficha`):** eyebrow `hero.rotulo` com a seta em SVG (texto sr-only **[bloqueada: `ui.setaPara`]**), selo `resumo.transicao`, `h1`, frase, `<dl>` (`hero.dados`), 3 provas (`hero.provas`) e CTA LinkedIn. A dica `quarto.dica.*` fica com `.so-quarto`.
  *Pronto quando:* em 360×640, o nome, a frase e o CTA aparecem sem rolar; o LCP é texto.
- [x] **T6. 01 Vértice (`#vertice`):** o "site" desenhado (barra de navegador com `vertice.navegador.endereco` `aria-hidden`), selos (`selos.*`; lista com `aria-label` **[bloqueada: `ui.selosStatus`]**), resumo, `ctaSiteReal` → `siteUrl`, "Como foi construído", "O que faz", stack (frontmatter), `proximoPassoRotulo`/`proximoPasso`, `origemRotulo`/`origem` com link `origemLink` para `#alem-games`, CTA LinkedIn e `vertice.navegador.nota`. Uma coluna em contêiner < 640 px.
  *Pronto quando:* nada diz "em produção" nem "no ar"; o link real abre na mesma aba.
- [x] **T7. 02 Sobre** (`sobre.p1`–`p3` em `.papel`, 1º parágrafo em `--fs-lead`, 60ch) e **03 Experiência** (`ExperienceItem` em `<ol>`, `id={item.id}` (já vem como `exp-…`), `<time datetime={cargo.inicio}>`, KPMG com 2 cargos, "O que levei disso", `:target`).
  *Pronto quando:* `/#exp-kpmg`, `/#exp-salesforce` e `/#exp-cushman` rolam até o item no modo recrutador.
- [x] **T8. 04 Projetos** (cards de `getProjetos(lang).outros` com `id={p.ancora}`, selos `selos.projetoAcademico`/`emGrupo`, `projetos.rotuloPapel` + papel, chips; sem chips quando a stack está vazia) e **05 Habilidades** (grupos com o nível em texto no cabeçalho, chips com contexto real, `comoTrabalho`).
  *Pronto quando:* nenhum "[A CONFIRMAR]", barra ou porcentagem; o EnergíGreen aparece sem chips.
- [x] **T9. 06 Formação:** `BookItem` nas três prateleiras `formacao.ia`, `formacao.concluida` e `formacao.certificacoes[]` (com grupos), selo pela chave `status` → `selos.*`, plaquinhas `formacao.prateleiras.*`, `id="formacao-ia"` e `id="certificacoes"`, idiomas no fim, a Pós Tech no topo com o selo.
  *Pronto quando:* `/#certificacoes` e `/#formacao-ia` existem nos dois idiomas.
- [x] **T10. 07 Além** (`#alem-escotismo`, `#alem-games` e `#alem-volei`, todos de `alem.*`, com lista, filmes e link `linkVertice` para `#vertice`) e **08 Contato** (`.papel` de carta, `assinatura`, CTA literal) + **rodapé** (`rodape.copyright`).
  *Pronto quando:* a página inteira funciona sem JS e é impressa no modo recrutador (`@media print`).

## Bloco 2: o quarto

- [x] **T11. Serializar a config:** `<script type="application/json" id="quarto-config">` com `configCliente()` em `PaginaInicial`.
  *Pronto quando:* a build mostra "12 objetos com destino verificado" para `index.html` e `en/index.html`.
- [x] **T12. `Quarto.astro` (palco):** `<svg viewBox="0 0 1600 1000" aria-hidden>` com decoração, varal e lâmpadas, e objetos posicionados pela config (via `registro.ts`), mais `<ol>` de `<a class="objeto">` (design 5.3) com etiqueta e nome acessível (`quarto.objetos.<id>`) e `<p class="sr-only">{quarto.ajuda}</p>`. A legenda (5.5) fica `aria-hidden`. Tudo visível só com `data-modo='quarto'`.
  *Pronto quando:* os 12 links aparecem nos lugares da config em 768, 1024 e 1280 px, sem sobreposição; o Tab segue a ordem 01…08.
- [x] **T13. Desenhar os objetos** (um commit por componente em `objetos/`): Monitor (inclui a "tela que dobra", design 6), PortaRetrato, Mural, Caderno, Caixa, Estante, Quadros, Lenco, Bola, Headset, Estojos (lombadas de `alem.games.lista` + `lombadaExtra`, só ≥ 1024 px) e Envelope. Siga as regras de arte do design 9.1.
  *Pronto quando:* cada um fica dentro da própria caixa, com cores só `--room-*`/`--bulb-*`/`--fan-*` e nenhum logo, personagem ou arma.
- [x] **T14. Desenhar a decoração** (`decoracao/`) e o modo noite: Janela (céu, lua e janelinhas à noite), Poster, Vaso, MouseMousepad, Mesa, Mesinha, Cadeira, Tapete, Luminaria, Interruptor e Varal.
  *Pronto quando:* o SVG total tem ≤ 45 KB bruto e ≤ 400 elementos; a luz apagada troca tudo só por CSS.
- [x] **T15. Mobile (< 768): nichos.** Mesma `<ol>` restilizada em ladrilhos (5.4), com os desenhos de `mobile.desenhos` em `contexto="ladrilho"`. Os secundários ficam ocultos. Uma coluna abaixo de 340 px ou com altura < 500 px.
  *Pronto quando:* em 360 px, os 8 ladrilhos ficam em 2 colunas com alvo ≥ 44 px.

## Bloco 3: interação (`src/scripts/`)

- [x] **T16. Modo** (`modo.ts`): o botão alterna `data-modo` sem recarregar, salva em `localStorage.modo`, faz `replaceState` mantendo o hash, move o foco e anuncia `status.modoAtivado.*` num `role="status"`.
  *Pronto quando:* `?modo=recrutador#exp-kpmg` abre no modo recrutador rolado até a KPMG.
- [x] **T17. Vista + histórico** (`vista.ts`, `historico.ts`): `showModal()`, a seção movida para o dialog e devolvida ao fechar, `data-vista`, barra com `vista.voltar`, `vista.anterior` e `vista.proximo`, atalhos `vista.atalho.*` no mobile, e a tabela de histórico da arquitetura 5.5. Ainda sem animação.
  *Pronto quando:* abrir → anterior/próximo → voltar do navegador leva ao quarto em um passo; `/#certificacoes` abre a estante rolada; o foco volta ao objeto de origem.
- [x] **T18. Câmera** (`camera.ts`): interpolação do `viewBox` (400 ms ida / 320 ms volta, `--ease-out`/`--ease-std`), viagem entre objetos, corte direto com movimento reduzido, cliques ignorados durante o zoom e Esc invertendo.
  *Pronto quando:* no DevTools com CPU 4× mais lenta, os quadros ficam ≤ 33 ms; se não ficarem, use o fallback com `transform`.
- [x] **T19. Teclado, lidos e legenda** (`teclado.ts`, `lidos.ts`, `legenda.ts`): setas, Home e End entre objetos; "lido" em `sessionStorage` (lâmpada + ✓ + `quarto.estado.lido`); "próximo sugerido"; legenda no hover/foco.
  *Pronto quando:* não há atalho de tecla única; os pulsos param em ≤ 5 s.
- [x] **T20. Tema e idioma** (`tema.ts`, `idioma.ts`): interruptor com `aria-pressed` e `localStorage.tema`; o seletor de idioma preserva o hash, e a vista reabre na outra língua já aproximada.
  *Pronto quando:* não pisca ao recarregar; trocar de idioma com `#experiencia` aberto reabre o mural em `/en/`.
- [x] **T21. Molduras das vistas** (`styles/vistas.css`): `tela`, `cortica`, `estante`, `porta-retrato`, `caderno`, `caixa`, `tecido` e `carta` (design 4.4), com a regra de legibilidade `min(560px, 92%)` × `min(360px, 80%)`, *container queries* e expansão FLIP no mobile.
  *Pronto quando:* o texto nunca fica abaixo de 16 px; no zoom de 400% o conteúdo rola dentro da moldura.

## Bloco 4: fechamento

- [x] **T22. Página 404** **[bloqueada: `ui.erro404`]**: `src/pages/404.astro` com links para `/` e `/en/`.
- [ ] **T23. Passada final:** Lighthouse mobile em `/` e `/en/` (`npm run build && npm run preview`) e a lista de testes do design 10.3. Confira o orçamento: HTML ≤ 55 KB gzip, CSS ≤ 20 KB, JS ≤ 1 KB + 10 KB e ≤ 7 requisições.
  *Pronto quando:* as 4 categorias ficam ≥ 90 nas duas rotas, sem erro no console e sem texto ou coordenada fora do lugar.
