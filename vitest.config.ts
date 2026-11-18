import { defineConfig } from 'vitest/config';

// Testes de contrato do conteúdo (content/ x schemas). Rodam em Node puro:
// nada aqui pode importar módulos virtuais do Astro (astro:content, astro:i18n, astro:assets).
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
