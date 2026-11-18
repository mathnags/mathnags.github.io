// @ts-check
/**
 * Depois da build, confere no HTML gerado (pt e en) o que a config do quarto não consegue checar sozinha
 * (docs/design.md 9.2): todo "destino" e toda "secao" existem como id, e não há ids duplicados.
 * Lê a própria config serializada em <script type="application/json" id="quarto-config">.
 * Enquanto a página não tiver esse script (esqueleto), apenas avisa.
 */
import { readFile } from 'node:fs/promises';

const PAGINAS = ['index.html', 'en/index.html'];

/** @returns {import('astro').AstroIntegration} */
export default function verificarAncoras() {
  return {
    name: 'verificar-ancoras',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const erros = [];
        for (const pagina of PAGINAS) {
          const html = await readFile(new URL(pagina, dir), 'utf8');
          const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
          const repetidos = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
          for (const id of repetidos) erros.push(`${pagina}: id duplicado "${id}"`);

          const bloco = html.match(/<script[^>]*\sid="quarto-config"[^>]*>([\s\S]*?)<\/script>/);
          if (!bloco) {
            logger.warn(`${pagina}: sem #quarto-config; verificação dos destinos do quarto pulada.`);
            continue;
          }
          /** @type {{ objetos: { id: string; destino: string; secoes: string[] }[] }} */
          const config = JSON.parse(bloco[1]);
          const existentes = new Set(ids);
          for (const o of config.objetos) {
            for (const alvo of [o.destino, ...o.secoes]) {
              if (!existentes.has(alvo)) erros.push(`${pagina}: objeto "${o.id}" aponta para #${alvo}, que não existe`);
            }
          }
          logger.info(`${pagina}: ${config.objetos.length} objetos com destino verificado.`);
        }
        if (erros.length) throw new Error(`Âncoras do quarto inválidas:\n- ${erros.join('\n- ')}`);
      },
    },
  };
}
