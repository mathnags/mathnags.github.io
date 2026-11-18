# Prompt e especificação da imagem do quarto

Para o Matheus gerar a arte do quarto (dia e noite) numa IA de imagem gratuita ou no Blender. A especificação de uso no site está em `docs/design.md`, seções 12 e **12.13** (versão atual: cena densa, monitor grande, parede livre para o nome, luz suave e raio de sol).

> **Antes de começar: confira os termos de uso da ferramenta.** Eles precisam permitir usar a imagem gerada **no seu portfólio público** (alguns planos gratuitos restringem o uso, exigem atribuição ou não garantem direitos). Guarde um print ou link dos termos e anote a ferramenta, o modelo, a data, o prompt e a seed em `content/fonte/arte/origem.md`. Isso documenta a origem da arte.
>
> Exemplos de ferramentas gratuitas (os termos mudam com o tempo; confira os de cada uma): Microsoft Designer / Bing Image Creator, plano gratuito do Leonardo.Ai ou do Ideogram, Stable Diffusion rodando no seu PC (ComfyUI ou Fooocus, com a licença do modelo verificada) e **Blender** (arte 100% sua).

---

## 1. Composição exata (vale para dia e noite)

Imagem **16:9**, mostrando o **quarto inteiro** numa vista ampla (não é um close na mesa), **rica e densa**, com pouco espaço vazio, mas com os 8 objetos principais bem legíveis. As posições estão em **% da largura (x) e da altura (y)**, medidas a partir do canto superior esquerdo. Os números entre colchetes indicam o capítulo de cada objeto clicável.

```
 x→ 0%      10%      20%      30%      40%      50%      60%      70%      80%      90%    100%
 y  ┌──────────────────────────────────────────────────────────────────────────────────────────┐
 0% │ [HUD: canto calmo]    varal de luzinhas · · · · · · · · · · · · · · ·  [HUD: canto calmo]│
 4% │                 ┌──── PAREDE LISA PARA O NOME (x 26–60%, y 4–15%) ────┐                  │
15% │ janela          └─────────────────────────────────────────────────────┘ ┌──── PORTA ────┐│
    │ (2–10%,  ┌[1] MONITOR GRANDE (16–38%, 26–54%)┐  pôster  ┌[3] MURAL┐ ┌[6]─┐ │[7] lenço     ││
    │  16–48%) │  tela lisa e iluminada            │  (40–46%,│47–60%   │ │ESTA│ │(80–84%,32–42%)││
    │  raio de │  (17.5–36.5%, 28–49%)             │  16–34%) │16–36%   │ │NTE │ │[8] envelope/ ││
    │  sol →   └───────────────────────────────────┘  [2]porta└─────────┘ │63– │ │caixa correio ││
    │ estojos  headset   teclado  mousepad coral      -retrato  [4]caderno│76% │ │(85–91%,46–54%)│
    │ ═════════ MESA LARGA (10–45%, tampo em y ≈ 55%) ═════════ (39–44%,  na    │22– │ │              ││
    │  fita LED sob a mesa · cadeira · cabos organizados      46–56%)  mesinha│74% │ │  bola + joe- ││
    │                                                                 (49–57%,└────┘ │  lheiras     ││
    │  plantas · caixas · cesto                      [5] caixa de      58–64%)       │ (86–91%,     ││
    │                                                ferramentas (57–65%, 72–81%)    │  74–82%)     ││
86% │  tapete com padrão geométrico simples          ░ área calma para a anotação ░  └──────────────┘│
    └──────────────────────────────────────────────────────────────────────────────────────────┘
```

| Cap. | Objeto (clicável) | Área (x / y em %) | Como deve aparecer |
|---|---|---|---|
| 1 | **Monitor grande, moderno, widescreen**, sobre a mesa | x 16–38 / y 26–54 (tela: x 17.5–36.5 / y 28–49) | Monitor de tela plana, bordas finas, **tela lisa e iluminada** (cor sólida suave, **sem nada desenhado**: o site coloca a área de trabalho por cima). Grande o bastante para ser o maior objeto da mesa |
| 2 | **Porta-retrato** na ponta direita da mesa | x 39–44 / y 46–56 | Moldura de madeira com **imagem abstrata** (paisagem simples ou cor lisa), **sem pessoa nem rosto** |
| 3 | **Mural de cortiça** na parede | x 47–60 / y 16–36 | Cortiça com 3 a 4 papéis presos por tachinhas, **com linhas abstratas no lugar de texto** |
| 4 | **Caderno** espiral fechado, sobre uma mesinha | x 49–57 / y 58–64 | Com marcador de página; bem destacado da mesinha |
| 5 | **Caixa de ferramentas** metálica no chão | x 57–65 / y 72–81 | Tampa entreaberta, com chave e régua genéricas. Nenhuma arma |
| 6 | **Estante** de livros alta | x 63–76 / y 22–74 | Livros de alturas e cores variadas (**lombadas sem texto legível**), alguns diplomas enrolados, pequenos objetos neutros |
| 7 | **Lenço escoteiro** num gancho da porta | x 80–84 / y 32–42 | Triangular, genérico, cor lisa com borda de outra cor, com anel. **Sem flor-de-lis nem símbolo** |
| 8 | **Envelope numa caixa de correio** de madeira na porta | x 85–91 / y 46–54 | Envelope claro; claramente separado do lenço |

**Decorações (não clicáveis), para deixar a cena rica, todas genéricas e sem marca:**
- **janela** à esquerda (x 2–10%, y 16–48%), com cidade genérica ao fundo e, no peitoril, **um vaso com duas plantinhas, uma verde e uma vermelha**;
- **pôster vermelho e azul com teia geométrica estilizada** num canto (x 40–46%, y 16–34%; sem aranha, olhos, máscara, figura ou texto);
- na mesa: **pilha de estojos de jogos** com lombadas lisas e coloridas (sem texto nem logo), **headset** genérico, teclado, **mouse sobre um mousepad vermelho-coral** liso, caneca, luminária de mesa, cabos organizados, pequena planta;
- **bola de vôlei** genérica com **joelheiras**, no chão perto da porta;
- **varal de luzinhas** quentes no alto da parede (sem passar pela área do nome); **fita de LED** sob a mesa; cadeira de escritório; tapete com padrão geométrico simples; plantas de chão; caixas organizadoras; cesto;
- **decoração neutra**, que não sugira hobbies ou fatos que o Matheus não tem: **nada de violão, skate, troféus, medalhas, bandeiras, camisas de time ou fotos de pessoas**.

**Áreas que precisam ficar calmas** (o site coloca texto e botões por cima):
- **Parede do nome:** x 26–60%, y 4–15%. Parede **lisa, de cor uniforme e clara de dia**, sem quadros nem luzinhas cruzando.
- **Cantos do topo:** x 0–22% e x 80–100%, y 0–12%. Só parede, teto ou janela.
- **Base central:** x 36–64%, y 86–96%. Só piso ou tapete liso.
- **Borda direita:** x 96–100%, y 25–75%. Pode ser a porta ou a parede, sem objetos pequenos importantes.

**Regras de composição:**
- Os 8 objetos ficam **separados entre si** (pelo menos ~2%) e dentro de x 6–94% e y 15–86%.
- A ordem dos capítulos corre **da esquerda para a direita**: monitor e porta-retrato na mesa, depois mural, caderno, caixa, estante, e lenço e envelope na porta.

---

## 2. Prompt (dia), em inglês, pronto para copiar

```
A cozy, richly detailed digital illustration of a young data analyst's bedroom-office, showing the whole room in a wide view (not a close-up), gentle 3/4 isometric-style perspective (slightly elevated camera facing the back wall, side edges slightly visible), 16:9 widescreen. Dense and lived-in, lots of small details and textures, little empty space, yet every key object clearly readable. Soft, warm natural light: a visible sunbeam enters through the window on the far left and falls diagonally across the floor and the desk, with soft gentle shadows; warm wood tones, cream walls, calm and inviting mood. Clean painterly illustration style, crisp edges, high detail.

Exact layout, left to right:
- Far left (x 2–10%, y 16–48%): a window with a generic city skyline; on the windowsill, a small ceramic pot with two little plants, one green and one red. The sunbeam comes from this window.
- A long wooden desk (x 10–45%, desk top at about 55% height) with a large modern widescreen flat monitor with thin bezels (x 16–38%, y 26–54%); its screen (x 17.5–36.5%, y 28–49%) is plain, softly glowing and completely blank. On the desk: a keyboard, a mouse on a plain coral-red mousepad, a generic headset, a stack of plain video game cases with blank colorful spines, a mug, a desk lamp, a small plant, tidy cables. A subtle LED strip under the desk. An office chair.
- On the right end of the desk (x 39–44%, y 46–56%): a small wooden photo frame showing a simple abstract landscape, no people.
- On the wall, a framed poster split diagonally in red and blue with a stylized geometric web pattern in one corner (x 40–46%, y 16–34%), no figures.
- A cork board (x 47–60%, y 16–36%) with three or four papers pinned with thumbtacks; the papers show only abstract lines.
- A low side table with a closed spiral notebook with a bookmark (x 49–57%, y 58–64%).
- On the floor (x 57–65%, y 72–81%): a metal toolbox with its lid slightly open, showing a generic wrench and ruler.
- A tall wooden bookshelf (x 63–76%, y 22–74%) full of books of varied heights and colors (spines without readable text), a couple of rolled diplomas, small neutral objects.
- A wooden door on the right (x 78–94%): on a hook (x 80–84%, y 32–42%) hangs a plain triangular scout neckerchief with a contrasting border and a slide ring; on the door (x 85–91%, y 46–54%) a small wooden mailbox holding a light envelope; on the floor near the door (x 86–91%, y 74–82%) a generic volleyball with knee pads.
- Warm fairy lights along the very top of the back wall, a rug with a simple geometric pattern, floor plants, storage boxes, a basket.

Leave a plain, smooth, evenly lit empty wall area at the top center (x 26–60%, y 4–15%) with nothing on it. Keep the top-left and top-right corners calm, and the bottom center floor (x 36–64%, y 86–96%) plain. All key objects clearly separated and fully visible. No people.
```

## 3. Negative prompt

```
text, letters, words, numbers, readable writing, captions, watermark, signature, logo, brand, trademark, emblem, icon, UI, HUD, crosshair, game interface, image on monitor screen, retro CRT computer, people, person, face, human silhouette, hands, character, mascot, superhero, spider, spider emblem, mask, costume, uniform, robot, weapon, gun, rifle, pistol, knife, sword, grenade, bomb, ammunition, military insignia, umbrella symbol, red and white octagon, fleur-de-lis, scout emblem, trophy, medal, flag, guitar, skateboard, sports jersey, famous artwork, movie poster, game cover art, video game characters, neon pink, lilac palette, space theme, cyberpunk, horror, blood, empty bare room, distorted perspective, objects overlapping the key objects, cropped objects, blurry, low resolution, jpeg artifacts
```

Se a ferramenta não tiver campo de negative prompt, acrescente ao fim do prompt: *"No text, no logos, no people, no characters, no weapons, no video game art."*

## 4. Variante noturna (mesma composição)

**O ideal é gerar a noite a partir da imagem de dia**, para que os objetos fiquem exatamente no mesmo lugar:
- **Na IA:** use a mesma seed e o mesmo prompt mais o trecho abaixo, ou use a função de editar/"image-to-image" a partir da imagem de dia, com força baixa (~0,35–0,5), para mudar só a luz.
- **No Blender:** use a mesma câmera e a mesma cena, com um segundo conjunto de luzes.

```
Same room, same camera, same composition and object positions as the day version. Night time: no sunbeam; the ceiling light is off; the room is softly lit by the warm fairy lights, the warm desk lamp, a soft teal LED strip glowing under the desk, and the plain glowing blank monitor screen casting light on the desk. Through the window, a night sky with the moon and small lit windows in the distant city. The top-center wall area stays plain, smooth and empty (slightly darker). Cozy and calm, darker but every object still clearly visible. No neon pink.
```

Negative prompt: o mesmo do item 3.

## 5. Exportação

- **Proporção 16:9.** Resolução ideal de **3840×2160**, mínimo de **2560×1440**.
- Se a ferramenta gerar menor (ex.: 1792×1024 ou 1344×768), amplie com um upscaler gratuito (ex.: Upscayl, de código aberto) até 3840×2160 e revise se não surgiram artefatos.
- **PNG, sRGB**, sem marca-d'água.
- Os dois arquivos precisam ter **o mesmo tamanho em pixels**.

## 6. Onde salvar

```
content/fonte/arte/quarto-dia.png
content/fonte/arte/quarto-noite.png
content/fonte/arte/origem.md      ← ferramenta, modelo, data, prompt, seed, link/print dos termos
```

`content/fonte/` fica só no seu computador (está no `.gitignore`). O `dev-frontend` gera as versões otimizadas (AVIF/WebP, recortes do mobile) a partir desses arquivos, e só elas vão para o repositório público.

## 7. Checklist antes de mandar

**Formato**
- [ ] 16:9, ≥ 2560×1440 (ideal 3840×2160), PNG; dia e noite com o mesmo tamanho.

**Cena**
- [ ] É o **quarto inteiro**, rico e com pouco espaço vazio, mas sem bagunça que esconda os objetos principais.
- [ ] De dia, há **raio de sol** entrando pela janela e **sombras suaves**.

**Os 8 objetos**
- [ ] Monitor, porta-retrato, mural, caderno, caixa de ferramentas, estante, lenço e envelope/caixa de correio estão **visíveis, inteiros e separados** uns dos outros.
- [ ] Cada um está **perto da posição da tabela** (até ~3% de diferença) e dentro de x 6–94% e y 15–86%.
- [ ] O **monitor é moderno, widescreen e grande** (cerca de 1/5 da largura), com **tela lisa e iluminada**, sem imagem nem texto.
- [ ] O porta-retrato **não mostra pessoa nem rosto**.
- [ ] O caderno se distingue da mesinha; o envelope se distingue do lenço e da porta.

**Espaço para o site**
- [ ] A **parede do nome** (x 26–60%, y 4–15%) está lisa, de cor uniforme e sem nada.
- [ ] Os cantos do topo, a base central (x 36–64%, y 86–96%) e a borda direita estão calmos.

**Sem marcas nem terceiros**
- [ ] Nenhum texto legível em lugar nenhum (livros, papéis, pôster, envelope, tela, estojos).
- [ ] Nenhum logo ou marca (inclusive no monitor, no headset, no teclado, na bola e nos estojos).
- [ ] Nenhuma pessoa, personagem, mascote, máscara, silhueta humana ou arma.
- [ ] Nenhuma arte de jogo, mira ou interface.
- [ ] O pôster é só vermelho e azul com teia geométrica: sem aranha, olhos ou figura.
- [ ] O vaso tem plantas verde e vermelha **sem rótulo**.
- [ ] O lenço não tem flor-de-lis nem símbolo.
- [ ] Nada lembra o símbolo da Umbrella (octógono ou guarda-chuva vermelho e branco).
- [ ] Nenhum objeto sugere hobby ou fato que você não tem (violão, troféu, bandeira, camisa de time…).

**Noite**
- [ ] Com a imagem de noite sobre a de dia a 50% de opacidade (em qualquer editor), os objetos coincidem (desvio de até ~0,5%).
- [ ] À noite, os 8 objetos continuam reconhecíveis, e a parede do nome continua lisa.

**Direitos**
- [ ] Os termos da ferramenta permitem uso no portfólio público.
- [ ] `origem.md` está preenchido.
