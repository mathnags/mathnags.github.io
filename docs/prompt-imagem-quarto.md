# Prompt e especificação da imagem do quarto

Para o Matheus gerar a arte do quarto (dia e noite) numa IA de imagem gratuita ou no Blender. Ela substitui o quarto em SVG. A especificação de uso no site está em `docs/design.md`, seção 12.

> **Antes de começar: confira os termos de uso da ferramenta.** Os termos precisam permitir usar a imagem gerada **no seu portfólio público** (alguns planos gratuitos restringem o uso, exigem atribuição ou não garantem direitos). Guarde um print ou link dos termos e anote a ferramenta, o modelo, a data, o prompt e a seed em `content/fonte/arte/origem.md`. Isso documenta a origem da arte.
>
> Exemplos de ferramentas gratuitas (os termos mudam com o tempo; confira os de cada uma): Microsoft Designer / Bing Image Creator, plano gratuito do Leonardo.Ai ou do Ideogram, Stable Diffusion rodando no seu PC (ComfyUI ou Fooocus, com a licença do modelo verificada) e **Blender** (arte 100% sua).

---

## 1. Composição exata (vale para dia e noite)

Imagem **16:9**. As posições estão em **% da largura (x) e da altura (y)**, medidas a partir do canto superior esquerdo. Os números entre colchetes indicam o capítulo de cada objeto clicável.

```
 x→ 0%      10%      20%      30%      40%      50%      60%      70%      80%      90%    100%
 y  ┌──────────────────────────────────────────────────────────────────────────────────────────┐
 0% │ ░░░░░░░░░░░░░░░ FAIXA LIVRE DO TOPO (0–13%): teto/parede lisa, só varal de luzinhas ░░░░░ │
13% │ janela      [pôster v+a]          ┌[3] MURAL DE CORTIÇA┐            ┌───── PORTA ─────┐ │
    │ (3–14%)     (23–31%,15–30%)       │ x 40–54% y 18–38%  │   ┌[6]──┐   │ [7] lenço        │ │
    │ vaso no     estojos na prateleira └────────────────────┘   │ESTAN│   │ (79–83%, 34–44%) │ │
    │ peitoril    (15–22%, 22–30%)                               │ TE  │   │ [8] envelope /   │ │
    │       ┌[1] MONITOR┐ [2]porta-                              │62–76│   │ caixa de correio │ │
    │       │18–32%     │  retrato                               │26–74│   │ (84–90%, 46–54%) │ │
    │ head- │y 34–52%   │ (33–38%,      [4] caderno              │     │   │                  │ │
    │ set   └───────────┘  47–58%)      na mesinha               └─────┘   │                  │ │
    │ ═══════ MESA (14–37%, tampo em y ≈ 56%) ═══  (43–51%, 58–64%)         │      bola de     │ │
    │   LED sob a mesa · cadeira        [5] caixa de ferramentas            │      vôlei       │ │
    │                                   no chão (52–60%, 70–80%)            │   (86–91%, 74–82%)│ │
86% │                          tapete                                       └──────────────────┘ │
88% │ ░░░░░░░░░░░░░░░░░░░ FAIXA LIVRE DA BASE (88–100%): só piso ░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
    └──────────────────────────────────────────────────────────────────────────────────────────┘
```

| Cap. | Objeto (clicável) | Área aproximada (x / y em %) | Como deve aparecer |
|---|---|---|---|
| 1 | **Monitor** sobre a mesa | x 18–32 / y 34–52 | Monitor grande, **tela lisa e iluminada** (cor sólida suave, sem nada desenhado: o site sobrepõe um gráfico). Teclado e mouse à frente |
| 2 | **Porta-retrato** sobre a mesa, à direita do monitor | x 33–38 / y 47–58 | Moldura de madeira com uma **imagem abstrata** (paisagem simples ou cor lisa), **sem rosto nem pessoa** |
| 3 | **Mural de cortiça** na parede | x 40–54 / y 18–38 | Cortiça com 3 a 4 papéis presos por tachinhas, **com linhas abstratas no lugar de texto** |
| 4 | **Caderno** sobre uma mesinha baixa | x 43–51 / y 58–64 | Caderno espiral fechado, com marcador de página; bem destacado da mesinha |
| 5 | **Caixa de ferramentas** no chão | x 52–60 / y 70–80 | Caixa metálica com tampa entreaberta, com ferramentas genéricas (chave, régua). Nenhuma arma |
| 6 | **Estante** de livros | x 62–76 / y 26–74 | 3 a 4 prateleiras com livros de alturas e cores variadas, **lombadas sem texto legível**; alguns diplomas enrolados ou emoldurados ao lado (decoração) |
| 7 | **Lenço escoteiro** num gancho da porta | x 79–83 / y 34–44 | Lenço triangular genérico, de cor lisa com borda de outra cor, com anel (passador). **Sem flor-de-lis nem símbolo** |
| 8 | **Envelope / caixa de correio** na porta | x 84–90 / y 46–54 | Envelope claro preso numa pequena caixa de correio de madeira na porta; claramente separado do lenço |

**Decorações (não clicáveis), todas genéricas e sem marca:**
- **janela** à esquerda (x 3–14%, y 18–50%) com uma cidade genérica ao fundo e um **vaso com duas plantinhas, uma verde e uma vermelha**, no peitoril;
- **pôster vermelho e azul com uma teia geométrica estilizada** num canto (sem aranha, olhos, máscara, figura ou texto);
- **estojos de jogos empilhados** numa prateleira acima da mesa, com lombadas lisas e coloridas, sem texto nem logo;
- **headset** genérico apoiado ao lado do monitor;
- **mousepad vermelho-coral** liso;
- **bola de vôlei** genérica (gomos brancos e de uma cor neutra) com joelheiras, no chão perto da porta;
- **varal de luzinhas** quentes atravessando o alto da parede;
- **fita de LED** sob a mesa, cadeira, tapete, luminária de teto e planta.

**Regras de composição:**
- Os 8 objetos clicáveis ficam **separados entre si** (pelo menos ~2% de espaço) e **dentro da área segura**: x 6–94% e y 15–86%.
- **Faixa do topo (0–13%)** e **faixa da base (88–100%)** ficam calmas (parede, teto, piso). É ali que o site coloca o HUD e o menu.
- A ordem dos capítulos corre **da esquerda para a direita**, mais ou menos como na tabela.

---

## 2. Prompt (dia), em inglês, pronto para copiar

```
A cozy, richly detailed digital illustration of a young data analyst's bedroom-office, seen in a gentle 3/4 isometric-style view (slightly elevated camera, facing the back wall, both side edges slightly visible), 16:9 widescreen composition. Warm, soft afternoon light coming from a window on the far left; warm wood tones, cream walls, soft shadows, clean shapes, high detail but uncluttered, calm and inviting mood.

Exact layout, left to right:
- Far left (x 3–14%, y 18–50%): a window with a generic city skyline outside; on the windowsill, a small ceramic pot with two little plants, one green and one red.
- Left-center: a wooden desk (x 14–37%, desk top at about 56% height) with a large computer monitor (x 18–32%, y 34–52%) whose screen is plain, softly glowing and completely blank; a keyboard, a mouse on a plain coral-red mousepad, and a generic headset resting beside the monitor. Under the desk, a subtle LED strip. An office chair in front of the desk.
- On the desk, right of the monitor (x 33–38%, y 47–58%): a small wooden photo frame showing a simple abstract landscape, no people.
- Above the desk on the wall: a small shelf with a stack of plain video game cases with blank colorful spines (x 15–22%, y 22–30%), and a framed poster split diagonally in red and blue with a stylized geometric web pattern in one corner (x 23–31%, y 15–30%).
- Center wall (x 40–54%, y 18–38%): a cork board with three or four papers pinned with thumbtacks, papers show only abstract lines.
- Below it, a low side table with a closed spiral notebook with a bookmark (x 43–51%, y 58–64%).
- On the floor (x 52–60%, y 70–80%): a metal toolbox with its lid slightly open, showing a generic wrench and ruler.
- Right-center (x 62–76%, y 26–74%): a wooden bookshelf with books of varied heights and colors (spines without readable text), and a couple of rolled diplomas.
- Right (x 78–94%, y 18–80%): a wooden door; on a hook (x 79–83%, y 34–44%) hangs a plain triangular scout neckerchief with a contrasting border and a slide ring; on the door (x 84–90%, y 46–54%) a small wooden mailbox holding a light envelope; on the floor near the door (x 86–91%, y 74–82%) a generic volleyball with knee pads.
- A string of warm fairy lights across the top of the back wall; a ceiling lamp; a soft rug on the floor.

Keep the top 13% of the image calm (plain wall/ceiling and fairy lights only) and the bottom 12% calm (floor only). All key objects clearly separated and fully visible. No people.
```

## 3. Negative prompt

```
text, letters, words, numbers, readable writing, captions, watermark, signature, logo, brand, trademark, emblem, icon, UI, HUD, crosshair, game interface, screenshot on monitor, people, person, face, human silhouette, hands, character, mascot, superhero, spider, spider emblem, mask, costume, uniform, robot, weapon, gun, rifle, pistol, knife, sword, grenade, bomb, ammunition, military insignia, umbrella symbol, red and white octagon, fleur-de-lis, scout emblem, famous artwork, movie poster, game cover art, video game characters, neon pink, cyberpunk, horror, blood, clutter, distorted perspective, extra objects overlapping the key objects, cropped objects, blurry, low resolution, jpeg artifacts
```

Se a ferramenta não tiver campo de negative prompt, acrescente ao fim do prompt: *"No text, no logos, no people, no characters, no weapons, no video game art."*

## 4. Variante noturna (mesma composição)

**O ideal é gerar a noite a partir da imagem de dia**, para que os objetos fiquem exatamente no mesmo lugar:
- **Na IA:** use a mesma seed e o mesmo prompt mais o trecho abaixo, ou use a função de editar/"image-to-image" a partir da imagem de dia, com força baixa (~0,35–0,5), para mudar só a luz.
- **No Blender:** use a mesma câmera e a mesma cena, com um segundo conjunto de luzes.

Trecho a acrescentar (ou prompt de edição):

```
Same room, same camera, same composition and object positions as the day version. Night time: the ceiling lamp is off; the room is lit by the warm fairy lights along the wall, a soft teal LED strip glowing under the desk, and the plain glowing blank monitor screen casting light on the desk. Through the window, a night sky with the moon and small lit windows in the distant city. Cozy, calm, slightly darker but still readable; objects remain clearly visible. No neon pink.
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

**Os 8 objetos**
- [ ] Monitor, porta-retrato, mural, caderno, caixa de ferramentas, estante, lenço e envelope/caixa de correio estão **visíveis, inteiros e separados** uns dos outros.
- [ ] Cada um está **perto da posição da tabela** (até ~3% de diferença) e dentro de x 6–94% e y 15–86%.
- [ ] O caderno se distingue da mesinha; o envelope se distingue do lenço e da porta.
- [ ] A tela do monitor está **lisa e iluminada**, sem imagem nem texto.
- [ ] O porta-retrato **não mostra pessoa nem rosto**.

**Espaço para o site**
- [ ] O topo (0–13%) e a base (88–100%) estão calmos, sem objetos importantes. É ali que entram o nome, os botões e o menu.

**Sem marcas nem terceiros**
- [ ] Nenhum texto legível em lugar nenhum (livros, papéis, pôster, envelope, tela, estojos).
- [ ] Nenhum logo ou marca (inclusive no monitor, no headset, na bola e nos estojos).
- [ ] Nenhuma pessoa, personagem, mascote, máscara, silhueta humana ou arma.
- [ ] Nenhuma arte de jogo, mira ou interface.
- [ ] O pôster é só vermelho e azul com teia geométrica: sem aranha, olhos ou figura.
- [ ] O vaso tem plantas verde e vermelha **sem rótulo**.
- [ ] O lenço não tem flor-de-lis nem símbolo.
- [ ] Nada lembra o símbolo da Umbrella (octógono ou guarda-chuva vermelho e branco).

**Noite**
- [ ] Com a imagem de noite sobre a de dia a 50% de opacidade (em qualquer editor), os objetos coincidem (desvio de até ~0,5%).
- [ ] À noite, os 8 objetos continuam reconhecíveis.

**Direitos**
- [ ] Os termos da ferramenta permitem uso no portfólio público.
- [ ] `origem.md` está preenchido.
