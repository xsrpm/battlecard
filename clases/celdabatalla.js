// eslint-disable-next-line no-unused-vars
const Carta = require("./carta.js");

const Estado = {
  NO_HAY_CARTA: "No hay carta",
  POS_BATALLA_ATAQUE: "Posición de batalla: Ataque",
  POS_BATALLA_DEF_ARRIBA: "Posición de batalla: Defensa cara arriba",
  POS_BATALLA_DEF_ABAJO: "Posición de batalla: Defensa cara abajo",
  YA_ESTA_EN_POSICION_SOLICITADA: "Ya se está en la posición solicitada",
  ATAQUE_NO_DISPONIBLE: "Atacar carta no disponible",
  ATAQUE_DISPONIBLE: "Atacar carta disponible",
  CAMBIO_POS_NO_DISPONIBLE: "Cambio de posición no disponible",
  CAMBIO_POS_DISPONIBLE: "Cambio de posición disponible",
};
Object.freeze(Estado);

class CeldaBatalla {
  static get Estado() {
    return Estado;
  }

  constructor() {
    this.posBatalla = CeldaBatalla.Estado.NO_HAY_CARTA;
    this.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
    this.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
    /**
     * @type {Carta}
     */
    this.carta = null;
  }

  /**
   *
   * @param {Carta} carta
   * @param {string} posBatalla
   */
  agregarCarta(carta, posBatalla) {
    this.posBatalla = posBatalla;
    this.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
    if (posBatalla === CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      this.dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
    else this.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
    this.carta = carta;
  }
  /**
   *
   * @param {string} posBatalla
   */
  cambioPosicionBatalla(posBatalla) {
    if (this.dispCambio === CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE)
      return CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
    if (this.posBatalla === posBatalla)
      return CeldaBatalla.Estado.YA_ESTA_EN_POSICION_SOLICITADA;
    this.posBatalla = posBatalla;
    this.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
    return posBatalla;
  }

  cambioPosicionBatallaAtaque() {
    let res = this.cambioPosicionBatalla(
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    );
    if (res === CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      this.dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
    return res;
  }

  cambioPosicionBatallaDefensa() {
    let res = this.cambioPosicionBatalla(
      CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
    );
    if (res === CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA)
      this.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
    return res;
  }

  ataqueRealizado() {
    this.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
    this.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
  }

  quitarCarta() {
    /**
     * @type {Carta}
     */
    this.carta = null;
    this.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
    this.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
    this.posBatalla = CeldaBatalla.Estado.NO_HAY_CARTA;
  }
}

module.exports = CeldaBatalla;
