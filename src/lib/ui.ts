/**
 * Ajudantes de ligação entre o conteúdo e os componentes (sem texto próprio).
 */
import { getTextos } from './textos';
import type { Idioma } from '../i18n/idiomas';
import type { Textos } from '../schemas/conteudo';

type Ui = NonNullable<Textos['ui']>;

/**
 * Textos de "ui" são opcionais no schema. Se faltar um, a build falha: nunca há texto de reserva no código.
 */
export function getUi(lang: Idioma): Required<Pick<Ui, 'setaPara' | 'linkExterno' | 'selosStatus' | 'erro404'>> {
  const ui = getTextos(lang).ui;
  if (!ui?.setaPara || !ui.linkExterno || !ui.selosStatus || !ui.erro404) {
    throw new Error(`content/textos.${lang}.json > ui incompleto (setaPara, linkExterno, selosStatus, erro404).`);
  }
  return { setaPara: ui.setaPara, linkExterno: ui.linkExterno, selosStatus: ui.selosStatus, erro404: ui.erro404 };
}

/** Variante visual de cada chave de selo (design 5.11). */
export const VARIANTE_SELO = {
  emDesenvolvimento: 'dev',
  emAndamento: 'estado',
  atual: 'estado',
  concluido: 'estado',
  repositorioPrivado: 'privado',
  projetoAcademico: 'neutro',
  emGrupo: 'neutro',
} as const;
