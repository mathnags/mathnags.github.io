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
