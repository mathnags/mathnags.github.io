/**
 * Liga seções ao objeto principal do quarto (config) e ao rótulo duplo (textos.<lang>.json > quarto.objetos).
 */
import { objetosEmOrdem } from '../config/quarto';
import { numeroDoCapitulo, SECOES } from '../i18n/secoes';
import { getTextos } from './textos';
import type { Idioma } from '../i18n/idiomas';

export function rotuloSecao(lang: Idioma, secaoId: string) {
  const secao = SECOES.find((s) => s.id === secaoId);
  const principal = objetosEmOrdem.find((o) => o.destino === secaoId);
  if (!secao || secao.capitulo === null || !principal) throw new Error(`Seção "${secaoId}" sem objeto principal na config.`);
  const texto = getTextos(lang).quarto.objetos[principal.id];
  return { id: `${secaoId}-titulo`, cap: numeroDoCapitulo(secao.capitulo), tema: texto.tema, comum: texto.comum };
}
