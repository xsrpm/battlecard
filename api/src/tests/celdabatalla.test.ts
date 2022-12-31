import { PosBatalla, DispAtaque, DispCambio } from './../constants/celdabatalla';
import { Carta } from '../clases/carta'
import { CeldaBatalla } from '../clases/celdabatalla'
import { Elemento } from '../constants/carta'

describe('CeldaBatalla objeto', () => {
  const carta = new Carta(12, Elemento.COCO)
  /**
   * @type {CeldaBatalla}
   */
  let celda: CeldaBatalla
  beforeEach(() => {
    celda = new CeldaBatalla()
  })

  test('crea objeto CeldaBatalla válido', () => {
    expect(celda.posBatalla).toBe(PosBatalla.NO_HAY_CARTA)
    expect(celda.dispAtaque).toBe(DispAtaque.NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(DispCambio.NO_DISPONIBLE)
    expect(celda.carta).toBeNull()
  })

  describe('agregar carta', () => {
    test('en posición de ataque es válido', () => {
      celda.agregarCarta(carta, PosBatalla.ATAQUE)
      expect(celda.posBatalla).toBe(PosBatalla.ATAQUE)
      expect(celda.dispAtaque).toBe(DispAtaque.DISPONIBLE)
      expect(celda.dispCambio).toBe(
        DispCambio.NO_DISPONIBLE
      )
      expect(celda.carta).toEqual(carta)
    })
    test('en posición de defensa válido', () => {
      celda.agregarCarta(carta, PosBatalla.DEF_ABAJO)
      expect(celda.posBatalla).toBe(PosBatalla.DEF_ABAJO)
      expect(celda.dispAtaque).toBe(DispAtaque.NO_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        DispCambio.NO_DISPONIBLE
      )
      expect(celda.carta).toEqual(carta)
    })
  })

  describe('cambiar posicion de batalla', () => {
    test('a ataque valido de defensa boca abajo', () => {
      celda.agregarCarta(carta, PosBatalla.DEF_ABAJO)
      celda.dispCambio = DispCambio.DISPONIBLE
      celda.cambioPosicionBatallaAtaque()
      expect(celda.posBatalla).toBe(PosBatalla.ATAQUE)
      expect(celda.dispAtaque).toBe(DispAtaque.DISPONIBLE)
      expect(celda.dispCambio).toBe(
        DispCambio.NO_DISPONIBLE
      )
    })

    test('a ataque valido de defensa boca arriba', () => {
      celda.agregarCarta(carta, PosBatalla.DEF_ARRIBA)
      celda.dispCambio = DispCambio.DISPONIBLE
      celda.cambioPosicionBatallaAtaque()
      expect(celda.posBatalla).toBe(PosBatalla.ATAQUE)
      expect(celda.dispAtaque).toBe(DispAtaque.DISPONIBLE)
      expect(celda.dispCambio).toBe(
        DispCambio.NO_DISPONIBLE
      )
    })

    test('a defensa valido de ataque', () => {
      celda.agregarCarta(carta, PosBatalla.ATAQUE)
      celda.dispCambio = DispCambio.DISPONIBLE
      celda.cambioPosicionBatallaDefensa()
      expect(celda.posBatalla).toBe(PosBatalla.DEF_ARRIBA)
      expect(celda.dispAtaque).toBe(DispAtaque.NO_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        DispCambio.NO_DISPONIBLE
      )
    })

    test('no disponible', () => {
      celda.agregarCarta(carta, PosBatalla.ATAQUE)
      expect(celda.cambioPosicionBatallaDefensa()).toBe(
        DispCambio.NO_DISPONIBLE
      )
    })

    test('no es necesario (ya está en esa posición)', () => {
      celda.agregarCarta(carta, PosBatalla.ATAQUE)
      celda.dispCambio = DispCambio.DISPONIBLE
      expect(celda.cambioPosicionBatallaAtaque()).toBe(
        PosBatalla.YA_ESTA_EN_POSICION_SOLICITADA
      )
    })
  })

  test('ataque realizado', () => {
    celda.agregarCarta(carta, PosBatalla.ATAQUE)
    celda.dispAtaque = DispAtaque.DISPONIBLE
    celda.dispCambio = DispCambio.DISPONIBLE
    celda.ataqueRealizado()
    expect(celda.dispAtaque).toBe(DispAtaque.NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(DispCambio.NO_DISPONIBLE)
  })

  test('quitar carta válido', () => {
    celda.agregarCarta(carta, PosBatalla.ATAQUE)
    celda.quitarCarta()
    expect(celda.carta).toBeNull()
    expect(celda.posBatalla).toBe(PosBatalla.NO_HAY_CARTA)
    expect(celda.dispAtaque).toBe(DispAtaque.NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(DispCambio.NO_DISPONIBLE)
  })
})
