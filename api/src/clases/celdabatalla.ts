import { DispAtaque, PosBatalla, DispCambio } from './../constants/celdabatalla';
import { CeldaBatalla as ICeldaBatalla } from '../types';
import { Carta } from './carta'

export class CeldaBatalla implements ICeldaBatalla{
  posBatalla: PosBatalla
  dispAtaque: DispAtaque
  dispCambio: DispCambio
  carta: Carta | null

  constructor () {
    this.posBatalla = PosBatalla.NO_HAY_CARTA
    this.dispAtaque = DispAtaque.NO_DISPONIBLE
    this.dispCambio = DispCambio.NO_DISPONIBLE
    this.carta = null
  }

  /**
   *
   * @param {Carta} carta
   * @param {string} posBatalla
   */
  agregarCarta (carta: Carta, posBatalla: PosBatalla) {
    this.posBatalla = posBatalla
    this.dispCambio = DispCambio.NO_DISPONIBLE
    if (posBatalla === PosBatalla.ATAQUE) {
      this.dispAtaque = DispAtaque.DISPONIBLE
    } else this.dispAtaque = DispAtaque.NO_DISPONIBLE
    this.carta = carta
  }

  /**
   *
   * @param {string} posBatalla
   */
  cambioPosicionBatalla (posBatalla: any) {
    if (this.dispCambio === DispCambio.NO_DISPONIBLE) {
      return DispCambio.NO_DISPONIBLE
    }
    if (this.posBatalla === posBatalla) {
      return PosBatalla.YA_ESTA_EN_POSICION_SOLICITADA
    }
    this.posBatalla = posBatalla
    this.dispCambio = DispCambio.NO_DISPONIBLE
    return posBatalla
  }

  cambioPosicionBatallaAtaque () {
    const res = this.cambioPosicionBatalla(
      PosBatalla.ATAQUE
    )
    if (res === PosBatalla.ATAQUE) {
      this.dispAtaque = DispAtaque.DISPONIBLE
    }
    return res
  }

  cambioPosicionBatallaDefensa () {
    const res = this.cambioPosicionBatalla(
      PosBatalla.DEF_ARRIBA
    )
    if (res === PosBatalla.DEF_ARRIBA) {
      this.dispAtaque = DispAtaque.NO_DISPONIBLE
    }
    return res
  }

  ataqueRealizado () {
    this.dispAtaque = DispAtaque.NO_DISPONIBLE
    this.dispCambio = DispCambio.NO_DISPONIBLE
  }

  quitarCarta () {
    this.carta = null
    this.dispAtaque = DispAtaque.NO_DISPONIBLE
    this.dispCambio = DispCambio.NO_DISPONIBLE
    this.posBatalla = PosBatalla.NO_HAY_CARTA
  }
}
