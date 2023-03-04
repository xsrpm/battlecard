
import { Elemento } from '../constants/carta'

export class Carta {
  valor: number
  elemento: Elemento
  constructor (valor: number, elemento: Elemento) {
    this.valor = valor
    this.elemento = elemento
  }
}
