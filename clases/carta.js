const Elemento = { CORAZON: "\u2665", COCO: "\u2666", TREBOL: "\u2663" , ESPADA: "\u2660" };
Object.freeze(Elemento);

class Carta {
  static get MAX_VALOR_CARTA() { return 13 }
  static get MIN_VALOR_CARTA() { return 1 }
  static get NUMERO_ELEMENTOS_CARTAS() {
    return Object.keys(Carta.Elemento).length;
  }
  static get Elemento() { return Elemento; }
/**
 * 
 * @param {number} valor 
 * @param {string} elemento 
 */
  constructor(valor, elemento) {
    this.valor = valor;
    this.elemento = elemento;
  }
}

module.exports = Carta;