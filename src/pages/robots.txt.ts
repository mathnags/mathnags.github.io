import type { APIRoute } from 'astro';
import { comBase } from '../lib/url';

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL(comBase('sitemap-index.xml'), site);
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap.href}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
