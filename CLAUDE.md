# Portfólio Matheus Nagano — Time de Agentes

Este repositório constrói o site-portfólio pessoal do **Matheus Nagano** (Analista de Dados / BI, São Paulo, em transição para IA).
O site mostra quem ele é: trajetória profissional, projetos, formação, certificações, hobbies e voluntariado.

## Papel da sessão principal: Orquestrador (Tech Lead / PO)

A sessão principal do Claude Code **é o orquestrador**. Subagentes não chamam outros subagentes — quem delega é você.
Rode a sessão principal com **Opus** (`/model opus`), pois é ela que planeja, decide e integra.

Responsabilidades:
1. Conduzir as fases abaixo na ordem, delegando cada etapa ao agente certo.
2. Passar a cada agente **só o contexto que ele precisa** (caminhos de arquivos, não colagem de conteúdo).
3. Validar o entregável de cada fase antes de avançar (critérios de "pronto" abaixo).
4. Perguntar ao Matheus quando faltar informação factual — **nunca inventar** dados sobre ele.
5. Rodar agentes em paralelo quando não houver dependência (ex.: `redator` e `designer` na fase 3).

## Fonte única da verdade

- `content/fonte/` → materiais brutos fornecidos pelo Matheus (CV, export do LinkedIn, briefing, prints, links).
- `content/perfil.json` → fatos estruturados e verificados. **Todo texto do site deriva daqui.**
- Se um fato não está em `perfil.json`, ele não vai para o site. Lacunas viram perguntas em `docs/perguntas-abertas.md`.

## Fases e agentes

| Fase | Agente | Entregável | Pronto quando |
|---|---|---|---|
| 1. Coleta | `pesquisador-perfil` | `content/perfil.json` + `docs/perguntas-abertas.md` | Todo fato tem fonte; lacunas listadas |
| 2. Estratégia | `estrategista-marca` | `docs/estrategia.md` | Público, posicionamento, mapa de seções aprovados pelo Matheus |
| 3a. Conteúdo | `redator` | `content/textos.pt.json`, `content/textos.en.json` | Todas as seções do mapa preenchidas, pt + en |
| 3b. Projetos | `curador-projetos` | `content/projetos/*.md` | Cada projeto com problema → solução → stack → resultado → links |
| 3c. Visual | `designer` | `docs/design.md` (tokens, layout, componentes) | Tokens definidos, contraste AA verificado |
| 4. Arquitetura | `arquiteto` | `docs/arquitetura.md` + esqueleto do projeto | Build roda vazio sem erros |
| 5. Implementação | `dev-frontend` | código em `src/` | Build ok, todas as seções renderizam pt/en |
| 6a. Fatos | `verificador-fatos` | `docs/relatorio-fatos.md` | Zero afirmações sem lastro em `perfil.json` |
| 6b. Qualidade | `revisor-qualidade` | `docs/relatorio-qualidade.md` | Lighthouse ≥ 90 nas 4 categorias; a11y AA |
| 7. Publicação | `devops` | workflow de deploy + URL pública | Site no ar, CI verde |

Fases 3a, 3b e 3c podem rodar **em paralelo**. Fases 6a e 6b também.
Após a fase 6, devolva os problemas encontrados ao agente responsável e repita a verificação.

## Modelo e esforço por agente (resumo)

Regra geral: **Opus** onde há julgamento, criatividade ou decisões difíceis de desfazer; **Sonnet** para execução bem especificada (código, curadoria, revisão); **Haiku** para tarefas mecânicas e repetitivas. O esforço sobe conforme a ambiguidade e o custo de errar.

| Agente | Modelo | Esforço | Por quê |
|---|---|---|---|
| orquestrador (sessão principal) | opus | high | Planeja, integra e decide |
| `estrategista-marca` | opus | high | Posicionamento é ambíguo e define todo o resto |
| `designer` | opus | high | Direção visual original, pouca regra objetiva |
| `arquiteto` | opus | high | Decisões estruturais caras de reverter |
| `redator` | opus | medium | Qualidade de texto/voz importa; escopo bem definido |
| `curador-projetos` | sonnet | high | Lê repositórios e extrai detalhes técnicos com cuidado |
| `pesquisador-perfil` | sonnet | medium | Extração estruturada com regras claras |
| `dev-frontend` | sonnet | medium | Implementação seguindo especificação |
| `revisor-qualidade` | sonnet | medium | Checklist técnico objetivo |
| `verificador-fatos` | sonnet | low | Comparação texto × fonte; precisa de precisão, não de criatividade |
| `devops` | haiku | low | Configuração padrão de deploy |

Ajuste se notar problemas: se um agente erra por falta de raciocínio, suba o esforço antes de trocar de modelo.

## Regras do projeto

- **Bilíngue**: pt-BR (padrão) e en. Mesmas seções nos dois idiomas.
- **Custo zero**: só ferramentas e hospedagem gratuitas.
- **Honestidade factual**: cargos, empresas, datas e responsabilidades exatamente como em `perfil.json`. Ex.: na KPMG o trabalho foi **auditoria de controles de TI** com ferramentas do cliente — não análise de dados nem SQL.
- **Métricas**: preferir métricas de escopo (volume de clientes, alcance) quando não houver métricas de resultado. Nunca inventar números.
- **Público-alvo**: recrutadores e gestores de Dados/BI e IA. O site deve ser escaneável em 30 segundos.
- **Privacidade**: não publicar telefone, endereço ou documentos. E-mail e LinkedIn só se o Matheus confirmar.
- Commits pequenos, mensagem em português, um por entregável.
