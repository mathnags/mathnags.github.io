/**
 * Liga o nome de componente da config (src/config/quarto.ts) ao arquivo .astro.
 * O "satisfies" faz o astro check falhar se faltar um componente para algum nome da lista fechada.
 */
import type { ComponenteDecoracao, ComponenteObjeto } from '../../config/tipos';

import Monitor from './objetos/Monitor.astro';
import PortaRetrato from './objetos/PortaRetrato.astro';
import Mural from './objetos/Mural.astro';
import Caderno from './objetos/Caderno.astro';
import Caixa from './objetos/Caixa.astro';
import Estante from './objetos/Estante.astro';
import Quadros from './objetos/Quadros.astro';
import Lenco from './objetos/Lenco.astro';
import Bola from './objetos/Bola.astro';
import Headset from './objetos/Headset.astro';
import Estojos from './objetos/Estojos.astro';
import Envelope from './objetos/Envelope.astro';

import Janela from './decoracao/Janela.astro';
import Poster from './decoracao/Poster.astro';
import Vaso from './decoracao/Vaso.astro';
import MouseMousepad from './decoracao/MouseMousepad.astro';
import Mesa from './decoracao/Mesa.astro';
import Mesinha from './decoracao/Mesinha.astro';
import Cadeira from './decoracao/Cadeira.astro';
import Tapete from './decoracao/Tapete.astro';
import Luminaria from './decoracao/Luminaria.astro';
import Interruptor from './decoracao/Interruptor.astro';

export { default as Varal } from './decoracao/Varal.astro';

export const DESENHOS_OBJETO = {
  Monitor,
  PortaRetrato,
  Mural,
  Caderno,
  Caixa,
  Estante,
  Quadros,
  Lenco,
  Bola,
  Headset,
  Estojos,
  Envelope,
} satisfies Record<ComponenteObjeto, unknown>;

export const DESENHOS_DECORACAO = {
  Janela,
  Poster,
  Vaso,
  MouseMousepad,
  Mesa,
  Mesinha,
  Cadeira,
  Tapete,
  Luminaria,
  Interruptor,
} satisfies Record<ComponenteDecoracao, unknown>;
