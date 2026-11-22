import { describe, expect, it } from 'vitest';
import { horaSaoPaulo, rotuloHora } from '../src/cena/relogio';

describe('relógio de São Paulo', () => {
  it('converte UTC para America/Sao_Paulo (UTC−3) e formata o rótulo', () => {
    expect(horaSaoPaulo(new Date('2026-11-22T00:05:00Z'))).toEqual({ h: 21, m: 5 });
    expect(horaSaoPaulo(new Date('2026-11-22T03:00:00Z'))).toEqual({ h: 0, m: 0 });
    expect(rotuloHora(21, false)).toBe('São Paulo, 21h');
    expect(rotuloHora(21, true)).toBe('São Paulo, 9 PM');
    expect(rotuloHora(0, true)).toBe('São Paulo, 12 AM');
    expect(rotuloHora(12, true)).toBe('São Paulo, 12 PM');
  });
});
