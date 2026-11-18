# Estratégia de marca pessoal: Matheus Nagano

Fase 2 · Fontes: `content/perfil.json`, `content/fonte/respostas-fase1.md`, `docs/perguntas-abertas.md`.
Atualização 2026-11-17: nova seção **8. Gamificação**, a partir de `content/fonte/decisao-gamificacao.md`. As seções 0 a 7 continuam valendo; a seção 8 define como elas aparecem no formato de RPG.
Regra: tudo aqui deriva de `perfil.json`. Quando algo depende de um fato não confirmado, aparece marcado com **[PENDENTE]** e entra em "Decisões pendentes para o Matheus".

---

## 0. Diagnóstico em 5 linhas

- **Força real:** um produto em desenvolvimento, já acessível (Vértice, verticetour.com.br) construído orquestrando agentes de IA com Claude Code, com 49 arquivos de testes no backend, bilíngue, em conformidade com a LGPD e monitorado por agentes.
- **Força de base:** formação dupla (Sistemas de Informação + Data Science), cerca de 3 anos em empresas globais (Cushman & Wakefield, Salesforce, KPMG) e inglês avançado.
- **Fragilidade:** nenhuma experiência profissional com cargo de IA ou de dados, habilidades técnicas declaradas como básicas (exceto Excel), nenhum dashboard de BI e repositório do Vértice privado.
- **Consequência:** o site não pode vender senioridade. Precisa vender **trajetória coerente + prova de que ele entrega + honestidade sobre o nível**. Para um recrutador de IA, um júnior honesto com um produto no ar vale mais que um júnior com uma lista longa de buzzwords.
- **Decisão estrutural:** o Vértice sobe para logo depois do Hero. A experiência formal vem depois, como contexto.

---

## 1. Público-alvo

### Primário: recrutadores e gestores de IA (prioridade definida em respostas-fase1.md, item 5)

| Quem | O que procura em 30 segundos | O que o site entrega |
|---|---|---|
| **Recrutador(a) de IA / tech** | Para que vaga ele serve? Tem algo concreto com IA? Fala inglês? Onde está? | Rótulo-alvo "IA" no Hero, card do Vértice "em desenvolvimento", Pós Tech em IA em andamento, inglês avançado, São Paulo, botão do LinkedIn |
| **Gestor(a) técnico(a) de IA** | Ele constrói coisas que funcionam? Como usa IA para trabalhar? Testa? Assume responsabilidade pelo que entrega? Sabe o próprio nível? | Bloco "Como foi construído" do Vértice (agentes especializados, testes, monitoramento), stack declarada e níveis honestos |

### Secundário: recrutadores e gestores de Dados/BI

| Quem | O que procura em 30 segundos | O que o site entrega |
|---|---|---|
| **Recrutador(a) de Dados/BI** | SQL, Power BI, Python, Excel, formação em dados | Formação em Data Science, SQL em uso real (Cushman & Wakefield), Excel avançado (KPMG), certificações FIAP e Alura de Power BI |
| **Gestor(a) de Dados/BI** | Rigor com qualidade de dados e capacidade de falar com o negócio | KPMG: regras de negócio traduzidas em critérios testáveis e validação de grandes populações de dados; Salesforce: requisitos traduzidos em protótipos |

**Recomendação:** escreva para o primário e deixe o secundário encontrar o que precisa nas seções de Experiência, Habilidades e Formação, sem uma trilha dedicada. Uma trilha "BI" sem nenhum dashboard enfraqueceria o site.

---

## 2. Posicionamento

### Três opções

**A. "O tradutor que constrói"**
> Profissional de tecnologia em transição para IA. Passei por dados, CRM e auditoria de TI traduzindo necessidades de negócio em critérios técnicos e hoje aplico isso orquestrando agentes de IA. O resultado é o Vértice, uma plataforma em desenvolvimento.

**B. "Dados → IA, direto"**
> Formado em Sistemas de Informação e Data Science, em transição para Inteligência Artificial, com uma plataforma web em desenvolvimento construída com agentes de IA.

**C. "Rigor de auditoria aplicado à IA"**
> Ex-auditor de controles de TI na KPMG que leva rigor de verificação e testes para o desenvolvimento com IA.

### Recomendação: **A**, com a frase de Hero curta derivada dela

- **Por que A:** é a única opção que liga todas as etapas da trajetória num fio verdadeiro, a tradução entre negócio e tecnologia (ver Narrativa), e termina numa prova verificável. Para um gestor de IA, "especificar bem para agentes" é exatamente a habilidade que interessa num júnior.
- **Por que não B:** é honesta, mas genérica. Qualquer pessoa recém-formada em dados poderia assiná-la.
- **Por que não C:** sobrevaloriza a KPMG, que foi auditoria de controles de TI e não desenvolvimento, e pode soar como alguém que quer ficar em GRC/auditoria.

**Frase de Hero proposta (pt):**
> Transição para Inteligência Artificial, com base em dados e um produto no ar.
> Construí o Vértice, uma plataforma em desenvolvimento, orquestrando agentes de IA com Claude Code.

**(en):**
> Moving into AI, with a data background and a product in development.
> I built Vértice, a web platform in development, by orchestrating AI agents with Claude Code.

**Rótulo do Hero (cargo-alvo):** recomendo **"Dados → IA"** ou "Em transição para IA" em vez de "Analista de Dados". `perfil.json` usa "Analista de Dados" como título, mas nenhuma experiência registrada teve esse cargo (os cargos foram IT Intern, Solution Engineer Intern, Audit Trainee e Audit Associate). Num site cujo diferencial é a honestidade, um recrutador que compara o título com a timeline não pode encontrar contradição. **[PENDENTE: decisão 1]**

---

## 3. Narrativa

### Fio condutor: **traduzir necessidades em algo que a tecnologia executa e verificar se funciona**

Cada etapa usa fatos de `perfil.json`. As mudanças de rota ficam visíveis.

| Etapa | Fato | O que soma |
|---|---|---|
| **Formação** (SI na Anhembi Morumbi 2019–2025; Data Science na FIAP, 2025) | Bacharelado + tecnólogo | Base em sistemas e em dados |
| **Cushman & Wakefield**: IT Intern (2020-08 → 2021-12) | Manutenção e higienização de bases via SQL; documentação e treinamentos que reduziram o tempo de resposta de chamados | Primeiro contato com dados reais e qualidade de dados; hábito de documentar para o usuário final |
| **Salesforce**: Solution Engineer Intern (2021-12 → 2022-12) | Protótipos (flows, dashboards, permissões) para cerca de 7 oportunidades de venda; treinou times da América Latina | Requisito de negócio → demonstração técnica funcionando. É a tradução em sua forma mais pura |
| **KPMG**: Audit Trainee → Audit Associate (2023-10 → 2026-06) | Testes de ITGCs em sistemas de mais de 10 clientes globais; regras de negócio → critérios testáveis; validação de grandes populações de dados em Excel | Rigor de verificação: "como provo que isso funciona?" **Mudança de rota assumida:** saiu do caminho de produto/dados para auditoria e voltou |
| **Virada para IA** (2026) | Vértice (ideia em jun/2026); cursos Alura de RAG, LangChain e IA aplicada (out/2026); Pós Tech FIAP em IA para Devs (início out/2026) | Junta tudo: especifica para agentes de IA (tradução), exige testes automatizados (verificação) e assume a manutenção (responsabilidade) |

**Como contar no site (Sobre):** 3 parágrafos curtos.
1. De onde veio: formação em sistemas e dados; primeiro trabalho com SQL e qualidade de dados.
2. O padrão: em CRM e em auditoria, o trabalho era transformar o que o negócio precisa em algo técnico e verificável.
3. Para onde vai: IA. Já construiu o Vértice com agentes de IA e está cursando a Pós em IA. Diz claramente que está no início técnico e aprende construindo.

**O que NÃO dizer:**
- Não chamar a KPMG de "análise de dados" nem associá-la a SQL (regra do projeto).
- Não sugerir que saiu da KPMG *para* migrar para IA. A coincidência de datas existe (KPMG até 2026-06, ideia do Vértice em 2026-06), mas a motivação não está em `perfil.json`.
- Não afirmar que escreveu todo o código do Vértice sozinho. O fato é que ele o construiu **orquestrando agentes de IA especializados** e corrige quando um problema é sinalizado. Isso deve ser dito como mérito, não escondido.

---

## 4. Pilares de prova

| # | Pilar | Evidência (perfil.json) | Peso |
|---|---|---|---|
| 1 | **Entrega com IA, em desenvolvimento** | **Vértice**: verticetour.com.br no ar; balanceamento por rank, veto de mapas Bo1/Bo3/Bo5, 3 formatos de campeonato, link público, bilíngue, LGPD; agentes especializados (backend, frontend, testes, regras do jogo, produto); 49 arquivos de testes no backend; monitoramento de falhas por agentes; integração com a API da Riot em andamento | **Prova principal** |
| 2 | **Formação ativa em IA** | Pós Tech IA para Devs (FIAP, em andamento); Alura: Arquiteturas RAG com LLMs/LangChain, LangChain e Python com OpenAI, Python IA Aplicada (out/2026); RAG e Fine-Tuning; n8n | Mostra direção e ritmo |
| 3 | **Tradução negócio ↔ técnica em empresas globais** | Salesforce: protótipos para cerca de 7 oportunidades **[PENDENTE: confirmar número]**; KPMG: regras → critérios testáveis em mais de 10 clientes globais **[PENDENTE: confirmar uso]** | Diferencial sobre juniores vindos só de cursos |
| 4 | **Base em dados** | Data Science (FIAP); SQL em uso real (Cushman & Wakefield); Excel avançado; certificações FIAP (Python/SQL/Eng. de Dados, Power BI, Big Data) | Sustenta o público secundário |

### Como apresentar o Vértice sem link de código

O repositório é privado, então a prova precisa ser **visível sem código**:
- **Botão principal do card:** "Ver no ar → verticetour.com.br". O site em si é a prova.
- **Bloco "Como foi construído"**, a parte que mais interessa a gestores de IA: agentes especializados por papel, 49 arquivos de testes, CI com GitHub Actions, deploy no Render, banco PostgreSQL (Neon), monitoramento por agentes e correção humana.
- **Selo:** "Repositório privado". Dito com naturalidade, sem pedir desculpa.
- **Origem:** campeonatos que ele organizava entre amigos (hobbies em `perfil.json`). Problema real, usuário real.
- **Não usar:** número de usuários ou de campeonatos, porque não há dados confirmados (pergunta aberta 12).
- **Datas:** há conflito entre a ideia em jun/2026 e o CV em nov/2026. Recomendo exibir "2026 – atual". **[PENDENTE: decisão 2]**
- **Recomendado:** 2 ou 3 prints do Vértice em `content/fonte/` para o card (o designer decide o formato).

### Outros projetos
- **StockSage** (projeto da faculdade: Random Forest + Looker Studio). Recomendo incluir como card compacto "Projeto acadêmico", porque é o único item com ML e dashboard. Faltam o papel e a instituição. **[PENDENTE: decisão 5]**
- **EnergíGreen**: só entra se stack e papel forem confirmados. Sem isso, a descrição fica vaga demais e enfraquece a seção.
- **Projetos de IA planejados**: não entram até existirem (pergunta 23).

---

## 5. Mapa de seções (ordem final recomendada)

A sugestão inicial (Hero → Sobre → Experiência → Projetos → …) **foi alterada**: Projetos sobe para a 2ª posição. Para o público de IA, a experiência formal não é a prova; o Vértice é.

| # | Seção | Objetivo | Conteúdo-chave | Escaneável em 30s? |
|---|---|---|---|---|
| 1 | **Hero** | Responder "quem é, para onde vai, por que acreditar" | Nome **Matheus Maki Nagano**, rótulo "Dados → IA", frase de posicionamento, 3 chips de prova ("Vértice em desenvolvimento", "Pós Tech IA, FIAP, em andamento", "Inglês avançado"), São Paulo, CTA LinkedIn + "Ver o Vértice" | **Sim, por inteiro** |
| 2 | **Projeto em destaque: Vértice** | Provar entrega com IA | O que é → como foi construído (agentes, testes, CI, deploy) → stack → status → link do site; selo "repositório privado" | **Sim:** título, 1 linha, selo "Em desenvolvimento", botão do site. O detalhe técnico fica abaixo da dobra do card |
| 3 | **Sobre** | Contar a trajetória como um fio só | 3 parágrafos (ver Narrativa) | Parcial: só a 1ª frase precisa funcionar sozinha |
| 4 | **Experiência** | Dar contexto e credibilidade corporativa | Timeline reversa: KPMG (Associate + Trainee agrupados), Salesforce, Cushman & Wakefield; 2–3 bullets cada, com uma linha "o que levei disso" | **Sim:** empresa, cargo e período em linha. Bullets abaixo |
| 5 | **Outros projetos** | Mostrar repertório além do Vértice | StockSage (e EnergíGreen, se confirmado) como cards compactos "acadêmico" | Não precisa |
| 6 | **Habilidades** | Mostrar o que sabe, com nível honesto | Ver formato abaixo | **Sim:** os grupos e o rótulo de nível |
| 7 | **Formação & Certificações** | Mostrar base e direção | Ordem: **IA primeiro** (Pós Tech + Alura IA), depois formação, depois Dados/BI, depois Salesforce; idiomas aqui | Parcial: a Pós Tech em IA precisa aparecer no topo |
| 8 | **Além do trabalho** | Revelar caráter e origem do produto | Escotismo + games/campeonatos | Não precisa |
| 9 | **Contato** | Converter | Só LinkedIn, numa frase-convite | **Sim** |

**Teste dos 30 segundos.** Rolando só pelo Hero e pelo card do Vértice, o leitor deve sair sabendo:
1. Ele busca IA.
2. Ele tem um produto em desenvolvimento construído com agentes de IA.
3. Está estudando IA formalmente (Pós Tech FIAP).
4. Tem base em dados e passagem por Salesforce e KPMG.
5. Onde falar com ele (LinkedIn).

### Formato de Habilidades (recomendado)
Sem barras nem porcentagens. Dois níveis com o rótulo exato do que o Matheus declarou:
- **Avançado:** Excel (tabelas dinâmicas com bases grandes, PROCV, SOMASE).
- **Básico, em evolução:** agrupado em **IA** (IA Generativa e engenharia de prompts, LangChain, noções de LangGraph), **Dados & BI** (SQL, Python/Pandas, Power BI, ETL e qualidade de dados, Azure/Databricks, noções de Hadoop/Spark, Airflow) e **Desenvolvimento web** (Node/Express, React/Vite, PostgreSQL, GitHub Actions).
- **Marcador "usado em contexto real"** ao lado de cada habilidade aplicada fora de sala de aula: SQL → Cushman & Wakefield; Excel → KPMG; plataforma Salesforce → Salesforce; Node/React/PostgreSQL/GitHub Actions → Vértice. Isso compensa o "básico" com evidência sem inflar o nível.

### Além do trabalho: por que importa
- **Escotismo, chefe do ramo Castores/Filhotes no Grupo Coopercotia (desde 2019-08, atual)**: compromisso voluntário contínuo há mais de 7 anos e responsabilidade por crianças de 5–6 anos. *Por que importa:* constância e liderança fora do trabalho, além da capacidade de explicar coisas de forma simples, o mesmo padrão dos treinamentos na Cushman & Wakefield e na Salesforce. (O cargo exato "Chefe" ainda está para confirmar; pergunta 7.)
- **Games e campeonatos organizados entre amigos**: *Por que importa:* é a origem do Vértice. Ele identificou um problema na própria comunidade, primeiro organizou na mão e depois construiu a solução. Apresentar como a "história de origem" do produto, ligada ao card do Vértice.
- **Pôquer Texas Hold'em**: **recomendo não incluir.** Acrescenta pouco à narrativa e pode ser lido de forma ambígua por recrutadores. Só entra se o Matheus fizer questão.

---

## 6. Tom de voz

**3 adjetivos: direto, honesto, construtor.**

| | Assim sim | Assim não |
|---|---|---|
| **Direto** | "Estou migrando para IA." / "I'm moving into AI." | "Profissional apaixonado por tecnologia em constante busca por novos desafios." / "Passionate tech enthusiast always seeking new challenges." |
| **Honesto** | "Meu nível em SQL, Python e Power BI é básico; Excel é avançado." / "My SQL, Python and Power BI skills are at a basic level; Excel is advanced." | "Especialista em dados e IA." / "Data & AI expert." |
| **Honesto** | "Na KPMG, testei controles de TI de mais de 10 clientes globais." / "At KPMG, I tested IT controls for 10+ global clients." | "Na KPMG, analisei dados com SQL." / "At KPMG, I ran SQL data analysis." |
| **Construtor** | "Construí o Vértice orquestrando agentes de IA com Claude Code. Está no ar, com 49 arquivos de testes no backend." / "I built Vértice by orchestrating AI agents with Claude Code. It's live, with 49 backend test files." | "Desenvolvi sozinho uma plataforma full-stack escalável." / "Single-handedly engineered a scalable full-stack platform." |

**Regras de estilo:**
- Primeira pessoa, frases curtas, verbo no começo dos bullets.
- Sem adjetivos de autoelogio ("apaixonado", "proativo", "expert"); os fatos fazem esse trabalho.
- **en** não é tradução literal: usar convenções de CV em inglês ("10+ global clients", "~7 sales opportunities") e o mesmo nível de honestidade.
- Termos técnicos em inglês nos dois idiomas quando é o uso do mercado (RAG, LLM, CI, deploy).

---

## 7. CTA

- **CTA principal: "Conversar no LinkedIn" / "Let's talk on LinkedIn"** → linkedin.com/in/matheusnagano. É o único canal de contato autorizado, aparece no Hero, no fim do card do Vértice e em Contato.
- **CTA secundário: "Ver o Vértice" / "See Vértice"**: no Hero, rola até o card; dentro do card, abre verticetour.com.br.
- **GitHub (github.com/mathnags):** só como ícone discreto no rodapé, porque o projeto principal é privado e um GitHub com pouco conteúdo público pode enfraquecer a impressão.
- **Download de CV:** fora por enquanto (pergunta 18 em aberto). Se aprovado, entra como terceiro CTA, numa versão sem telefone e endereço.

---

## 8. Gamificação

Fonte da decisão: `content/fonte/decisao-gamificacao.md` (2026-11-17). Formato: **jogo explorável com estética de RPG / ficha de personagem**. Substitui a direção "caderno de campo" de `docs/design.md`.

**Princípio que governa tudo:** o RPG é a **embalagem**, não o conteúdo. Todo texto continua derivando de `perfil.json`; a metáfora só muda o rótulo e a forma de navegar. Se um elemento de jogo exigir um dado que não existe em `perfil.json`, o elemento sai, o dado não é inventado.

### 8.1 Mapa seção → elemento de RPG

A ordem do mapa de seções (seção 5) continua valendo. Ela é a ordem do modo recrutador, a ordem de tabulação e a ordem do conteúdo no HTML. A exploração muda a forma de chegar às seções, não a hierarquia.

| # | Seção (seção 5) | Elemento de RPG (pt / en) | O que mostra, só com fatos de `perfil.json` | Regra de honestidade |
|---|---|---|---|---|
| 1 | Hero | **Ficha de personagem** / *Character sheet* | Nome **Matheus Maki Nagano**; **Classe: Dados → IA**; origem São Paulo, SP; status "aberto a oportunidades"; idiomas (Inglês avançado, Japonês básico, Espanhol básico); **atributos** = as 3 competências comportamentais com evidência: *Tradução negócio ↔ técnica* (Salesforce), *Verificação* (KPMG), *Liderança* (Escotismo); 3 chips de prova e CTA LinkedIn | Atributos **sem número**. Cada um mostra a evidência no lugar do valor. A ficha sozinha precisa passar no teste dos 30 segundos |
| 1b | (rótulo do Hero) | **Classe** / *Class* | "Dados → IA", com a mudança de classe em andamento (ver 8.4) | A classe é a direção declarada, não um cargo. Nenhum cargo registrado foi "Analista de Dados" ou de IA |
| 2 | Vértice | **Missão principal** / *Main quest*, status "em andamento" | O que é → como foi construído (agentes especializados, 49 arquivos de testes, CI, deploy, monitoramento por agentes e correção feita pelo Matheus) → stack → link verticetour.com.br; selo "repositório privado"; integração com a API da Riot como **próximo objetivo da missão** | Status "em desenvolvimento". Nunca "concluída", "em produção" ou "com usuários". Sem recompensas, sem métricas de uso. Sem arte ou logo de VALORANT/Riot |
| 3 | Sobre | **História do personagem** / *Backstory* | Os 3 parágrafos da Narrativa (seção 3), com as mudanças de rota visíveis | Mesmas proibições de "O que NÃO dizer" (seção 3) |
| 4 | Experiência | **Guildas** / *Guilds* | KPMG, Salesforce e Cushman & Wakefield com o **nome real**, cargo exato e período. Na KPMG, a passagem de Audit Trainee para Audit Associate aparece como "subiu de posto na guilda" | Não renomear empresas nem cargos. KPMG = auditoria de controles de TI, nunca dados ou SQL. Sem logos das empresas |
| 5 | Outros projetos | **Missões concluídas em grupo** / *Party quests* | StockSage e EnergíGreen como projetos da FIAP, papel "ajudou a desenvolver o MVP". EnergíGreen sem stack, que está em aberto | "Em grupo" é obrigatório: deixa claro que não foram solo |
| 6 | Habilidades | **Árvore de habilidades** / *Skill tree* | 3 ramos: **IA**, **Dados & BI**, **Desenvolvimento web**. Cada nó tem só dois estados possíveis: **Avançado** (apenas Excel) ou **Básico**. Os nós com o marcador "usado em contexto real" (seção 5) ganham o selo "testado em campo" / *field-tested*, com o lugar onde foi usado | Nada de nós "bloqueados" com habilidades futuras que não estão em `perfil.json`. Nada de pontos, barras ou nível numérico |
| 7 | Formação & Certificações | **Treinamento de classe** (formação) + **Conquistas** (certificações) / *Class training* + *Achievements* | Pós Tech IA para Devs no topo como "treinamento em andamento" (início 2026-10, previsto 2027-08); graduações concluídas; conquistas agrupadas por emissor com o nome exato e o ano **só quando existe** em `perfil.json` | Sem raridade, sem pontos, sem porcentagem de progresso da Pós. Certificação sem ano fica sem ano |
| 8 | Além do trabalho | **Side quests** | **Escotismo**: side quest ativa desde 2019-08, chefe do ramo Castores/Filhotes no Grupo Coopercotia. *Por que importa:* mais de 7 anos de compromisso voluntário e liderança de crianças de 5–6 anos. **Campeonatos entre amigos**: a side quest que virou a missão principal. *Por que importa:* é a origem do Vértice, um problema real da própria comunidade | Pôquer não entra (`perfil.json`: NÃO PUBLICAR) |
| 9 | Contato | **Convite para o grupo** / *Invite to party* | CTA "Conversar no LinkedIn" / "Let's talk on LinkedIn" | O texto do botão continua literal. A metáfora fica só no título da seção |

**Regra de rótulo duplo:** todo título de jogo vem acompanhado do nome convencional, por exemplo "Missões · Projetos" ou "Guildas · Experiência". O recrutador nunca precisa decifrar a metáfora.

### 8.2 Modo recrutador: preservar a leitura em 30 segundos

Recomendação opinativa: **o jogo é opcional, o conteúdo nunca é.**

1. **Disponível desde o primeiro segundo.** O botão "Modo recrutador" / "Recruiter mode" é o primeiro elemento focável da página, visível no primeiro viewport em desktop e mobile, antes de qualquer animação ou introdução. Não há tela de "press start" bloqueando o conteúdo.
2. **A ficha já é o resumo.** Mesmo no modo jogo, a ficha (Hero) mostra em texto simples nome, classe, status, os 3 chips de prova e o LinkedIn. Quem não clicar em nada ainda passa no teste dos 30 segundos.
3. **O modo recrutador é a mesma página, linear.** Mesmos textos de `content/textos.*.json`, mesma ordem da seção 5, títulos convencionais ("Projetos", "Experiência"), sem a navegação exploratória e sem animação. Não é um segundo site nem um PDF.
4. **Nada fica trancado atrás de exploração.** Todo o conteúdo está no HTML desde o carregamento. Explorar só revela ou anima. Isso protege SEO, leitores de tela e o Lighthouse ≥ 90.
5. **Compartilhável e persistente.** O modo vale via URL (ex.: `?modo=recrutador`) e fica salvo na visita. Assim o Matheus pode mandar o link direto em modo recrutador numa candidatura.
6. **Acessibilidade.** Respeitar `prefers-reduced-motion`, ter navegação completa por teclado nos dois modos e manter AA. Os dois idiomas (pt/en) funcionam nos dois modos.

### 8.3 O que nunca gamificar

- **Números inventados:** XP, nível do personagem ("Lv. 27"), HP/mana, pontos de atributo ("Força 8"), porcentagem de domínio, barras de habilidade, pontuação total.
- **Atributos inventados:** só entram as competências que estão em `perfil.json` (habilidades comportamentais), cada uma com a evidência. Nada de "Carisma", "Sabedoria" ou similares sem lastro.
- **Progresso inventado:** porcentagem da Pós Tech, "70% da mudança de classe", contagem de usuários ou de campeonatos do Vértice.
- **Valor inventado das conquistas:** raridade ("lendária"), pontos por certificação, ranking contra outras pessoas.
- **Fatos alterados pela metáfora:** nomes de empresas, cargos e datas aparecem exatamente como em `perfil.json`. A KPMG não vira "missão de dados". A saída da KPMG não vira "evento que desencadeou a mudança de classe", porque a motivação não está em `perfil.json`.
- **Status do Vértice:** nunca "missão concluída", "boss derrotado" ou "em produção".
- **Tom:** nada de "épico", "lendário" ou "nível máximo". O tom de voz (seção 6) vale também para os textos de jogo.
- **Propriedade de terceiros:** sem arte, logos, fontes, sons ou personagens de jogos existentes, incluindo VALORANT/Riot no card do Vértice. O nome do jogo pode aparecer em texto, como fato.

### 8.4 Como a metáfora reforça o posicionamento Dados → IA

- **Mudança de classe, não troca de personagem.** Em RPG, quem muda de classe mantém o que já aprendeu. É exatamente a mensagem da Narrativa: Dados (SI, Data Science, SQL na Cushman & Wakefield, certificações FIAP) é a **classe de base**, e IA é a **classe em treinamento**, sem esconder que o nível técnico ainda é básico.
- **Requisitos da mudança de classe, todos verificáveis:** Pós Tech IA para Devs em andamento (FIAP), cursos Alura de RAG, LangChain e IA aplicada (out/2026) e a missão principal, o Vértice, construída orquestrando agentes de IA. A ficha mostra a mudança como "em andamento", sem porcentagem.
- **Habilidades passivas que atravessam as classes.** *Tradução negócio ↔ técnica* (Salesforce) e *Verificação* (KPMG) aparecem como atributos que seguem com o personagem para a nova classe. Isso materializa o posicionamento A, "o tradutor que constrói": quem especifica bem e verifica o resultado é quem orquestra bem agentes de IA.
- **As mudanças de rota viram jornada, não buraco.** A passagem por auditoria fica legível como parte do caminho do personagem, o que reforça a regra de não esconder mudanças de rota (seção 3).
- **Coerência com a origem do produto.** O Vértice nasceu de campeonatos de games organizados entre amigos. Um portfólio em formato de jogo conta essa origem sem precisar explicá-la, desde que a estética seja original.

### 8.5 Decisões da gamificação para o Matheus aprovar

1. **Atributos da ficha:** usar as 3 competências com evidência (Tradução, Verificação, Liderança), sem números?
2. **Modo padrão:** abrir no modo jogo, com a ficha já legível e o botão "Modo recrutador" visível desde o primeiro segundo? (Recomendado.) A alternativa é abrir no modo recrutador e oferecer o jogo como opção.
3. **Vocabulário:** aprovar os rótulos da tabela 8.1 (Ficha, Classe, Missão principal, Guildas, Árvore de habilidades, Conquistas, Side quests, Convite para o grupo), sempre com o nome convencional ao lado.

---

## Decisões pendentes para o Matheus

1. **Posicionamento e Hero.** Aprovar a opção A e o rótulo "Dados → IA" no lugar de "Analista de Dados" (nenhum cargo registrado teve esse nome). Definir também o nome de exibição: "Matheus Nagano" ou "Matheus Maki Nagano".
2. **Data do Vértice.** Exibir "2026 – atual", o que resolve o conflito entre jun/2026 (ideia) e nov/2026 (CV)? Se possível, enviar 2–3 prints da plataforma para o card.
3. **Status atual.** A KPMG terminou em 2026-06. O Hero deve dizer algo como "aberto a oportunidades em IA"? Esse fato não está em `perfil.json` e não será publicado sem confirmação.
4. **Métricas de escopo.** Confirmar se podem ser publicadas "mais de 10 clientes globais" (e o nome KPMG junto) e "cerca de 7 oportunidades" (Salesforce). Se houver números verificáveis de uso do Vértice, enviar; sem eles, nenhum número será usado.
5. **Itens menores de conteúdo.** (a) StockSage entra como card acadêmico? Se sim, qual foi seu papel e em qual instituição. (b) EnergíGreen fica de fora até ter stack e papel? (c) Pôquer fica de fora? (d) Cargo exato no escotismo é "Chefe"?
