# Relatório de fatos (fase 6a, revisão 8: estado atual, inclui mudanças não commitadas)

Referência: `content/perfil.json`. Verificados: `content/textos.pt.json`, `content/textos.en.json`, `src/components/**`, `src/cena/**` (texto em canvas), `scripts/gerar-og.mjs` (og.png) e busca por e-mail/telefone/marcadores em `src/` e `dist/`.

| arquivo/página | trecho | problema | fonte esperada | severidade |
|---|---|---|---|---|
| `Resumo.astro` + `resumo.transicao`, `hero.frase`, `hero.dados` | "Em transição para IA." + frase; fichas Local, Idiomas, Estudando, Status | Tudo derivado de `perfil.json` (título "em transição para BI e IA", foco IA, São Paulo, Inglês avançado, Pós Tech IA em andamento). Componente sem texto fixo, só chaves do JSON | `identidade`, `formacao`, `idiomas` | ok |
| `hero.dados[status]`, `hero.rotulo`, `contato.status`, `parede.direcao`, `scripts/gerar-og.mjs` (og.png) | "Aberto a oportunidades" / "Open to opportunities" | Confere com `identidade.disponibilidade`. og.png contém só nome e essa frase sobre captura do quarto | `identidade.disponibilidade` | ok |
| `ui.linkExterno`, `Quarto.astro` | "(abre em nova guia)" / "(opens in a new tab)" | Texto de interface, sem afirmação factual; pt e en equivalentes | n/a | ok |
| `quarto.objetos.*` (rótulos de hover/legendas), `tour.*`, `so.*`, `postit.*`, `anotacoes.*` | rótulos e resumos | Repetem fatos verificados (KPMG = auditoria de controles de TI; SQL na Cushman; protótipos Salesforce; Pós Tech em andamento; escotismo desde 2019). Nada novo | `perfil.json` | ok |
| `src/cena/texturas.ts` | `NOMES_LOMBADAS`: VALORANT, Counter-Strike, Resident Evil 4, Call of Duty; canvas "2026" e "IA" | Jogos listados em `hobbies`; "2026"/"IA" na linha do tempo condiz com Vértice 2026 e foco IA. Só texto, sem logos. Homem-Aranha só como texto (`lombadaExtra`) | `hobbies` | ok |
| `contato`, `hero.cta`, `postit.contato`, `vertice.ctaLinkedin` | só LinkedIn `linkedin.com/in/matheusnagano` | Conforme. Nenhum `mailto:`/`tel:` ou e-mail/telefone em `src/`, `content/textos.*`, `dist/` | `identidade.links` | ok |
| `rodape.githubUrl` | `github.com/mathnags` | Só no rodapé (`Rodape.astro`); não aparece em contato/post-it | `identidade.links.github` | ok |
| KPMG (`experiencia`, `sobre.p2`, `tour.experiencia`) | ITGCs, 10+ clientes, Excel PROCV/SOMASE | Auditoria de controles de TI com ferramentas/ERPs do cliente; sem SQL nem análise de dados | `experiencias[0]` | ok |
| `habilidades.*`, `sobre.p3` | Excel avançado; restante básico; noções LangGraph/Hadoop/Spark | Níveis iguais ao declarado. Salesforce: "apoiei validação" suaviza o "determinantes" da fonte, sem exagero | `habilidades` | ok |
| `vertice.*` | 49 arquivos de testes, Render/Neon/Actions, Riot API como próximo passo, "em desenvolvimento" | Conforme; sem "em produção" nem métricas de uso | `projetos[0]` | ok |
| pt x en | todas as seções, mesmas chaves | Mesmo conteúdo; "Tecnólogo"="Associate degree", "Castores/Filhotes"="Beaver Scouts" aceitáveis | n/a | ok |
| `src/`, textos, `dist/` | `CONFIRMAR`, `TODO`, `lorem` | Nenhum marcador (a regex em `schemas/conteudo.ts` é só validação) | n/a | ok |
| textos pt/en, `alem.volei.texto` | "Apesar de não ser bom..." / "I'm not great at it" | Citação literal do Matheus em `fonte/hobbies.md`; em `perfil.json` consta em `texto_do_matheus` | `perfil.json` hobbies | ok |
| `BaseLayout.astro` JSON-LD | `url` | Site agora consta em `perfil.json` (`identidade.site`, mathnags.github.io). Não reconferido o valor exato no código | `identidade.site` | ajustar (baixo) |

Não verificado: pixels do og.png e das texturas raster (só o script/código-fonte do texto); o `src` renderizado em `dist/` não foi reconstruído nesta rodada.

Totais: bloqueia 0, ajustar 1 (baixo).

## Veredito: APROVADO
