/**
 * Níveis de qualidade e queda automática (docs/design.md 13.9).
 * Completo: pixelRatio min(dpr, 2), antialias, sombras PCF 1024. Leve: pixelRatio min(dpr, 1,5), sem antialias, sem sombras
 * (decalque de sol + sombras de contato).
 */
export type Nivel = 'completo' | 'leve';

interface NavegadorExtra extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

/** Nível leve: ponteiro grosseiro, poucos núcleos ou pouca memória, economia de dados ou tela compacta (mobile). */
export function escolherNivel(compacta: boolean): Nivel {
  const n = navigator as NavegadorExtra;
  const leve =
    compacta ||
    matchMedia('(pointer: coarse)').matches ||
    (n.hardwareConcurrency ?? 8) <= 4 ||
    (n.deviceMemory ?? 8) <= 4 ||
    n.connection?.saveData === true;
  return leve ? 'leve' : 'completo';
}

export const pixelRatioDe = (nivel: Nivel) => Math.min(devicePixelRatio || 1, nivel === 'leve' ? 1.5 : 2);

export type Queda = 'ok' | 'pixel' | 'sombra' | 'lento';

/**
 * Queda automática: durante cada voo a média dos quadros é medida. Acima de 24 ms no 1º voo, pixelRatio vai para 1; se no
 * voo seguinte ainda passar, as sombras desligam e o decalque liga; se no seguinte passar de 40 ms, a cena é considerada
 * lenta demais e o site cai no modo recrutador. Cada etapa vale pelo resto da sessão.
 */
export class MonitorQuadros {
  private etapa = 0;
  private soma = 0;
  private n = 0;

  iniciarVoo() {
    this.soma = 0;
    this.n = 0;
  }

  registrar(ms: number) {
    // O primeiro quadro de um voo costuma pagar compilação de shader e upload de textura: não conta.
    if (ms > 0 && ms < 500) {
      this.soma += ms;
      this.n++;
    }
  }

  /** Chamar ao fim de cada voo (nunca em cortes). */
  terminarVoo(): Queda {
    if (this.n < 12) return 'ok';
    const media = this.soma / this.n;
    if (this.etapa === 0 && media > 24) {
      this.etapa = 1;
      return 'pixel';
    }
    if (this.etapa === 1 && media > 24) {
      this.etapa = 2;
      return 'sombra';
    }
    if (this.etapa === 2 && media > 40) {
      this.etapa = 3;
      return 'lento';
    }
    return 'ok';
  }
}
