/**
 * Idiomas do site. "pt" é o padrão e vive em "/"; "en" vive em "/en/".
 * Os códigos aqui precisam bater com i18n.locales em astro.config.mjs.
 * Sem imports do Astro: este módulo também é usado pelos testes.
 */
export const IDIOMAS = ['pt', 'en'] as const;
export type Idioma = (typeof IDIOMAS)[number];
export const IDIOMA_PADRAO: Idioma = 'pt';

export const CONFIG_IDIOMA: Record<Idioma, { htmlLang: 'pt-BR' | 'en'; hreflang: string; ogLocale: string }> = {
  pt: { htmlLang: 'pt-BR', hreflang: 'pt-BR', ogLocale: 'pt_BR' },
  en: { htmlLang: 'en', hreflang: 'en', ogLocale: 'en_US' },
};

export function ehIdioma(valor: unknown): valor is Idioma {
  return typeof valor === 'string' && (IDIOMAS as readonly string[]).includes(valor);
}

export function outroIdioma(lang: Idioma): Idioma {
  return lang === 'pt' ? 'en' : 'pt';
}
