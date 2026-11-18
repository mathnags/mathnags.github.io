/**
 * Caminhos internos respeitando o "base" do Astro (GitHub Pages pode servir em /<repo>/).
 * Nunca escreva "/algo" direto num href ou src: use comBase("algo").
 * Para trocar de idioma, use getRelativeLocaleUrl() de "astro:i18n" (ver BaseLayout).
 */
export function comBase(caminho: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/?$/, '/');
  return base + caminho.replace(/^\/+/, '');
}

export function ehUrlExterna(valor: string): boolean {
  return /^https?:\/\//i.test(valor);
}
