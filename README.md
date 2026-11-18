# Portfólio Matheus Nagano

Site-portfólio construído por um time de 10 agentes no Claude Code, coordenados pela sessão principal (o orquestrador).

## Como começar

1. Abra esta pasta no terminal e rode `claude`.
2. Coloque a sessão principal no Opus: `/model opus` (ela é o orquestrador).
3. Confira se os agentes foram carregados: `/agents`.
4. Preencha `content/fonte/briefing.md` e coloque na mesma pasta seu CV e o PDF do LinkedIn.
5. Diga ao Claude:

   > Leia o CLAUDE.md e comece a fase 1 com o pesquisador-perfil.

O orquestrador conduz as fases, roda agentes em paralelo quando possível e para para pedir sua aprovação na estratégia e no design.

## O time

| Agente | Modelo | Esforço | Função |
|---|---|---|---|
| *(sessão principal)* | opus | high | Orquestrador: planeja, delega, integra |
| `pesquisador-perfil` | sonnet | medium | Fatos estruturados em `perfil.json` |
| `estrategista-marca` | opus | high | Público, posicionamento, mapa de seções |
| `redator` | opus | medium | Textos pt-BR + inglês |
| `curador-projetos` | sonnet | high | Estudos de caso dos projetos |
| `designer` | opus | high | Identidade visual e tokens |
| `arquiteto` | opus | high | Stack, estrutura e esqueleto |
| `dev-frontend` | sonnet | medium | Implementação |
| `verificador-fatos` | sonnet | low | Checa cada afirmação contra a fonte |
| `revisor-qualidade` | sonnet | medium | A11y, SEO, performance |
| `devops` | haiku | low | Deploy e CI gratuitos |

## Fluxo

```
1 pesquisador-perfil ─► 2 estrategista-marca ─► [você aprova]
                                  │
        ┌─────────────────────────┼─────────────────────────┐
   3a redator              3b curador-projetos         3c designer ─► [você aprova]
        └─────────────────────────┼─────────────────────────┘
                                  ▼
                           4 arquiteto ─► 5 dev-frontend
                                  │
                ┌─────────────────┴─────────────────┐
         6a verificador-fatos             6b revisor-qualidade
                └─────────────────┬─────────────────┘
                     (correções voltam ao dev/redator)
                                  ▼
                              7 devops ─► site no ar
```

## Estrutura

```
CLAUDE.md                 instruções do orquestrador e regras do projeto
.claude/agents/           definição de cada agente (modelo, esforço, ferramentas, instruções)
content/fonte/            seus materiais brutos (briefing, CV, LinkedIn, prints)
content/perfil.json       fatos verificados (gerado na fase 1)
content/projetos/         estudos de caso (gerados na fase 3)
docs/                     estratégia, design, arquitetura, relatórios de revisão
```

## Ajustes finos

- Para trocar o modelo ou o esforço de um agente, edite `model:` e `effort:` no topo do arquivo dele em `.claude/agents/`.
- Se um agente erra por falta de raciocínio, suba o `effort` antes de trocar para um modelo maior.
- Para adicionar um projeto depois de pronto: crie `content/projetos/<slug>.md` (o `curador-projetos` pode fazer isso) e rode o `verificador-fatos`.

## Publicação

O site vai para https://mathnags.github.io/ pelo workflow `.github/workflows/deploy.yml`. Cada push na `main` roda `npm ci` e `npm run verify` (lint, testes e build) e, se passar, publica `dist/` no GitHub Pages. Também é possível rodar manualmente em Actions → Deploy → Run workflow.

Primeira vez: em Settings → Pages → Build and deployment → Source, escolha **GitHub Actions** (não "Deploy from a branch"). Para domínio próprio, configure o DNS e o campo Custom domain nessa mesma tela, e ajuste `site` no `astro.config.mjs` (ou a variável `SITE_URL`).
