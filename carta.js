const Elemento = { CORAZON: "\u2665", COCO: "\u2666", TREBOL: "\u2663", ESPADA: "\u2660" };
Object.freeze(Elemento);

class Carta {
  static get MAXVALORCARTA() { return 13 };
  static get NUMEROELEMENTOSCARTAS() {
    return Object.keys(Carta.Elemento).length;
  }
  static get Elemento() { return Elemento; };

  constructor(valor, elemento) {
    this.valor = valor;
    this.elemento = elemento;
  }
  equals(carta) {
    if (this === carta) return true;
    if (!(carta instanceof Carta))
      return false;
    if (this.valor != carta.valor || this.elemento != carta.elemento)
      return false;
    return true;
  }
  clone() {
    let clon = Object.assign(new Carta(), this);
    return clon;
  }
}

module.exports = Carta;