# Relatório de fatos (fase 6a, segunda verificação)

Referência: `content/perfil.json` (inclui agora `content/fonte/respostas-fase6.md`). Verificados: textos pt/en, `content/projetos/*.md`, `src/`, `dist/`, JSON-LD Person e `scripts/gerar-og.mjs` (og.png).

## Itens da rodada anterior
| # | Item | Situação |
|---|---|---|
| 1 | GitHub na seção Contato | Corrigido: `Contato.astro` sem GitHub; `dist` tem GitHub só no rodapé (pt e en) |
| 2, 3 | "resolvia na mão" | Agora com lastro em `perfil.json` (respostas-fase6) |
| 4 | "fluxo de integração" | Corrigido ("Uso GitHub Actions, deploy no Render e banco PostgreSQL no Neon") |
| 5 | "primeiro contato com dados reais" | Agora com lastro em `perfil.json` |
| 6 | `sobre.p2` | Reescrito só com fatos (7 oportunidades, 10+ clientes) |
| 7 | `aprendizado` | Esvaziado (`""`) |
| 8 | Escotismo | Verificado, sem inferências |
| 9 | Prateleira "IA, em andamento" | Renomeada para "Inteligência Artificial" |
| 10 | `meta.description` | Agora diz "em nível básico" |
| 11, 12 | Marcadores em `.md` | Sem `CONFIRMAR` em `content/projetos` nem em textos |

## Conteúdo novo
| Arquivo | Trecho | Problema | Correção | Severidade |
|---|---|---|---|---|
| JSON-LD (`BaseLayout.astro` linha 81) | `"url":"https://mathnags.github.io/"` | URL de deploy não consta em `perfil.json` (não há URL pública confirmada) | Confirmar o domínio final de publicação, ou usar o `site` do Astro | ajustar |
| JSON-LD | `sameAs` inclui o GitHub | É metadado invisível, não link na página. Regra "GitHub só no rodapé" não é violada, mas vale o Matheus saber | Nenhuma, ou remover o GitHub do `sameAs` | ajustar (baixo) |
| `scripts/gerar-og.mjs` | "Matheus Maki Nagano", "Dados → IA" | Conforme `perfil.json`. Sem telefone, e-mail, métricas ou "em produção" | Nenhuma | ok |

Nota (sem ação): "Tecnólogo em Data Science" vira "Associate degree" no inglês, uma equivalência aceitável. pt/en estão alinhados nos trechos conferidos.

Totais: bloqueia 0, ajustar 2 (ambos baixos, só metadados).

## Veredito: APROVADO
Nenhum item "bloqueia". Recomenda-se resolver o item da URL do JSON-LD antes da publicação.

---

# Revisão 5 (textos novos)

Verificados: `ficha.titulo`, `intro.*`, `menu.*` (pt/en) e texto fixo de `Quarto.astro`, `CapitulosLista.astro`, `intro.ts`. Nada de texto fixo com fato novo; tudo vem de `textos.*.json`.

| Arquivo / chave | Trecho | Resultado |
|---|---|---|
| `intro.linhas` | `SELECT ano, capitulo FROM trajetoria WHERE cidade = 'São Paulo' AND ano BETWEEN 2019 AND 2026 ORDER BY ano;` | Decorativa, não afirma nível de SQL nem fato. São Paulo e 2019–2026 coincidem com `perfil.json` (formação desde 2019, tudo em São Paulo). pt e en equivalentes. ok |
| `intro.resultado` | "8 capítulos · 2019 Sistemas de Informação → 2026 Vértice · Dados → IA" | 8 capítulos conferem com `menu.itens`; Sistemas de Informação iniciou em 2019-01; Vértice é 2026 e "Dados → IA" é o título. Não diz que o Vértice está em produção. pt e en equivalentes. ok |
| `ficha.titulo`, `menu.*` | Resumo, Capítulos, nomes dos capítulos | Rótulos neutros, pt/en equivalentes. ok |

Ressalva (baixo, ajustar): a query retorna uma lista de "ano, capitulo", mas o resultado mostra só um resumo; é efeito de interface, não afirmação factual. Nenhuma ação obrigatória.

Totais da revisão 5: bloqueia 0, ajustar 0 novos. Pendências anteriores (URL do JSON-LD e `sameAs`) continuam abertas.

## Veredito: APROVADO

---

# Revisão 6 (tour, SO do monitor, post-its, anotações)

Verificados: `tour.*`, `so.*`, `anotacoes.*`, `postit.*`, `parede.*`, `quarto.imagemAlt` e `quarto.ajuda` (pt/en), `Vertice.astro` (arquivos do SO), `Quarto.astro` e `dist/`.

| Arquivo | Chave / linha | Afirmação | Problema | Correção | Severidade |
|---|---|---|---|---|---|
| `src/components/secoes/Contato.astro` | linhas 34-36 (`<p class="so-na-vista carta-github">`) | Link do GitHub dentro da seção Contato (dist: 3 ocorrências de github.com/mathnags por página: JSON-LD, Contato, rodapé) | Regressão do item 1 da primeira rodada. Regra: GitHub só no rodapé; contato só pelo LinkedIn | Remover esse `<p>` e manter só o link do `Rodape.astro` | bloqueia |

Conferido sem problemas:
- `tour.*` pt/en: todos os resumos têm lastro (SQL na Cushman, protótipos na Salesforce, auditoria de controles de TI na KPMG, 2 MVPs FIAP, Excel avançado e demais básico, Pós Tech em andamento, escotismo desde 2019, contato pelo LinkedIn). Vértice marcado "Em desenvolvimento".
- `so.*`: nomes de arquivos (LEIA-ME, funcionalidades.md, stack.json, proximo-passo.md, origem.md) apenas rotulam conteúdo já verificado de `vertice.*` (funcionalidades, stack, próximo passo, origem, como foi construído). Não há texto factual novo no componente. Selo "Repositório privado" e "Em desenvolvimento" conferem com `perfil.json`. A lombada/monograma "MMN" vem das iniciais do nome.
- `anotacoes`, `postit` (LinkedIn), `parede.direcao` ("Dados → IA"): ok. `imagemAlt` e `quarto.ajuda` ("8 capítulos em 8 objetos"): coerentes entre si.
- `dist/`: sem pôquer, e-mail, telefone, CONFIRMAR, "em produção" ou "no ar"; sem métricas novas. pt e en equivalentes.

Pendências antigas: URL do JSON-LD (`mathnags.github.io`) a confirmar; `sameAs` com GitHub (baixo).

Totais da revisão 6: bloqueia 1, ajustar 0 novos.

## Veredito: REPROVADO
Corrigir o link do GitHub em Contato e reverificar.
