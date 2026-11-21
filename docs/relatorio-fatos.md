# Relatório de fatos (fase 6a, revisão 7: quarto 3D)

Referência: `content/perfil.json` e `content/fonte/`. Verificados: `content/textos.pt.json`, `content/textos.en.json`, `src/` (busca por e-mail, telefone, GitHub, marcadores pendentes) e `dist/`.

| arquivo/página | trecho | problema | fonte esperada | severidade |
|---|---|---|---|---|
| textos pt/en, `alem.volei.texto` | "Apesar de não ser bom, me divirto..." / "I'm not great at it" | Autodepreciação, mas é citação literal do Matheus em `fonte/hobbies.md` (linha 24). Falta apenas constar em `perfil.json` (ali só "não competitivo") | `hobbies.md` | ajustar (baixo) |
| textos pt/en, `intro.linhas` e `resultado` | "SELECT ... FROM trajetoria", "8 capítulos · 2019 ... → 2026 Vértice" | Elemento decorativo; datas 2019 (início da graduação) e 2026 conferem com `perfil.json`. Não afirma uso de SQL pelo Matheus além do que a fonte diz | `perfil.json` formação/projetos | ok |
| `quarto.*`, `tour.*`, `so.*`, `postit.*`, `anotacoes.*`, `vista.*` | textos novos da revisão 7 | Todos são rótulos de interface ou resumos que repetem fatos já verificados (SQL na Cushman, protótipos Salesforce, auditoria de controles de TI na KPMG, Pós Tech em andamento, escotismo desde 2019). Nada novo sem lastro | `perfil.json` | ok |
| `contato`, `hero.cta`, `postit.contato` | só LinkedIn (`linkedin.com/in/matheusnagano`) | Conforme. Sem e-mail, telefone ou `mailto:`/`tel:` em `src/`, textos e `dist/` | `perfil.json` identidade.links | ok |
| `rodape.githubUrl` | GitHub `github.com/mathnags` | Só em `Rodape.astro` (e `sameAs` do JSON-LD, invisível). Aparece em `dist/index.html`, `dist/en/index.html` e `404.html` (rodapé) | `perfil.json` (publicável só no rodapé) | ok |
| KPMG (`experiencia`, `sobre.p2`, tour) | ITGCs, 10+ clientes, Excel PROCV/SOMASE | Descrito como auditoria de controles de TI com ferramentas/ERPs do cliente; sem SQL nem análise de dados | `perfil.json` experiências[0] | ok |
| Habilidades | Excel avançado; demais básico; noções para LangGraph/Hadoop/Spark | Níveis iguais aos declarados | `perfil.json` habilidades | ok |
| Vértice | "49 arquivos de testes", Render/Neon/GitHub Actions, Riot API como próximo passo, "em desenvolvimento" | Conforme; sem "em produção" nem métricas de uso | `perfil.json` projetos[0] | ok |
| pt x en | todas as seções | Mesmas chaves e mesmo conteúdo; "Tecnólogo" = "Associate degree" e "Castores/Filhotes" = "Beaver Scouts" são equivalências aceitáveis | - | ok |
| `src/`, textos, `dist/` | `CONFIRMAR`, `TODO`, `lorem` | Nenhum marcador pendente (a regex em `schemas/conteudo.ts` é só validação) | - | ok |
| `BaseLayout.astro` JSON-LD | `url` de deploy | Pendência herdada: URL pública não consta em `perfil.json` (não reverificada nesta rodada) | `perfil.json` / `site` do Astro | ajustar (baixo) |

Não verificado: textos embutidos no código de `src/cena/` (3D) e imagens raster, onde pode haver texto desenhado. Uma busca em `src/` por e-mail, telefone e marcadores não achou nada.

Totais: bloqueia 0, ajustar 2 (baixos).

## Veredito: APROVADO
