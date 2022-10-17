const Elemento = {
  CORAZON: '0x2665',
  COCO: '0x2666',
  TREBOL: '0x2663',
  ESPADA: '0x2660'
}
Object.freeze(Elemento)

export class Carta {
  valor: number
  elemento: string
  static get MAX_VALOR_CARTA () {
    return 13
  }

  static get MIN_VALOR_CARTA () {
    return 1
  }

  static get NUMERO_ELEMENTOS_CARTAS () {
    return Object.keys(Carta.Elemento).length
  }

  static get Elemento () {
    return Elemento
  }

  /**
   *
   * @param {number} valor
   * @param {string} elemento
   */
  constructor (valor: any, elemento: any) {
    this.valor = valor
    this.elemento = elemento
  }
}
