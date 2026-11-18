/**
 * Único ponto de leitura de content/textos.<lang>.json.
 * A validação roda na build: se o JSON quebrar o contrato, a build falha com a lista de erros.
 */
import { z } from 'astro/zod';
import textosPt from '../../content/textos.pt.json';
import textosEn from '../../content/textos.en.json';
import { textosSchema, type Textos } from '../schemas/conteudo';
import type { Idioma } from '../i18n/idiomas';

function validar(lang: Idioma, dados: unknown): Textos {
  const resultado = textosSchema.safeParse(dados);
  if (!resultado.success) {
    throw new Error(`content/textos.${lang}.json não segue o contrato:\n${z.prettifyError(resultado.error)}`);
  }
  return resultado.data;
}

const TEXTOS: Record<Idioma, Textos> = {
  pt: validar('pt', textosPt),
  en: validar('en', textosEn),
};

export function getTextos(lang: Idioma): Textos {
  return TEXTOS[lang];
}
