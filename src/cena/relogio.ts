/** Hora de São Paulo para o relógio de parede (puro, testável). */
export function horaSaoPaulo(d: Date): { h: number; m: number } {
  const partes = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(d);
  const n = (tipo: string) => Number(partes.find((p) => p.type === tipo)?.value ?? 0) % 24;
  return { h: n('hour'), m: Number(partes.find((p) => p.type === 'minute')?.value ?? 0) };
}

/** "São Paulo, 21h" (pt) ou "São Paulo, 9 PM" (en). */
export const rotuloHora = (h: number, en: boolean) => (en ? `São Paulo, ${h % 12 || 12} ${h < 12 ? 'AM' : 'PM'}` : `São Paulo, ${h}h`);
