// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import verificarAncoras from './integrations/verificar-ancoras.mjs';

/**
 * Hospedagem: GitHub Pages. As rotas finais são "/" (pt-BR) e "/en/".
 * Isso exige site de usuário (repositório mathnags.github.io) ou domínio próprio.
 * Para publicar como site de projeto (/Portfolio-MatheusNagano/), o CI define
 * BASE_PATH=/Portfolio-MatheusNagano e nada no código muda (ver docs/arquitetura.md, seção 10).
 */
const site = process.env.SITE_URL ?? 'https://mathnags.github.io';
const base = process.env.BASE_PATH ?? '/';

const fallbackSans = ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'];
const fallbackMono = ['ui-monospace', 'Cascadia Mono', 'Consolas', 'monospace'];

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  build: { format: 'directory' },

  // Astro 7 usa 'jsx' por padrão e remove espaços entre elementos inline.
  // Num site de texto, isso cola palavras ("<strong>KPMG</strong> e"). Mantemos o modo HTML.
  compressHTML: true,

  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt',
    routing: { prefixDefaultLocale: false },
  },

  // Fontes auto-hospedadas: baixadas na build e servidas de /_astro/fonts. Nenhuma requisição a terceiros no navegador.
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Atkinson Hyperlegible Next',
      cssVariable: '--font-text',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: fallbackSans,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Bricolage Grotesque',
      cssVariable: '--font-display',
      weights: [700, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: fallbackSans,
    },
    {
      provider: fontProviders.fontsource(),
      name: 'Atkinson Hyperlegible Mono',
      cssVariable: '--font-mono',
      weights: ['400 500'],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: fallbackMono,
    },
  ],

  integrations: [
    verificarAncoras(),
    sitemap({
      i18n: {
        defaultLocale: 'pt',
        locales: { pt: 'pt-BR', en: 'en' },
      },
    }),
  ],
});
