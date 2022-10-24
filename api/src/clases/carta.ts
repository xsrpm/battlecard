import { Carta as ICarta } from '../../../shared/types/carta';
import { Elemento } from '../constants/carta';

export class Carta implements ICarta{
  valor: number
  elemento: Elemento
  constructor (valor: number, elemento: Elemento) {
    this.valor = valor
    this.elemento = elemento
  }
}
