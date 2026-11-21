/**
 * Ponte entre o módulo principal (leve, sem `three`) e a cena 3D (carregada sob demanda). Só TIPOS vêm de ../cena:
 * nada aqui importa o `three`. Enquanto a cena não existe (carregando, falha ou modo recrutador), tudo funciona sem ela:
 * as vistas abrem na geometria de painel padrão e o tour só rola.
 */
import type { Cena } from '../cena/index';
import type { Rect } from './ctx';

let cena: Cena | null = null;
const ouvintes: (() => void)[] = [];

export const cenaAtual = () => cena;
export const cenaPronta = () => cena !== null;
export const aoMudarCena = (fn: () => void) => ouvintes.push(fn);

export function definirCena(c: Cena | null) {
  cena = c;
  ouvintes.forEach((fn) => fn());
}

/** Retângulo (px) da janela de uma vista "dentro", ou null sem cena. */
export const retanguloJanela = (id: string): Rect | null => cena?.retanguloJanela(id as never) ?? null;
