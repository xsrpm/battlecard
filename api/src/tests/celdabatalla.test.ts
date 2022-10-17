import { expect, describe, test, beforeEach } from '@jest/globals'
import { Carta } from '../clases/carta'
import { CeldaBatalla } from '../clases/celdabatalla'

describe('CeldaBatalla clase', () => {
  test('tiene propiedades estáticas válidas', () => {
    expect(CeldaBatalla.Estado.NO_HAY_CARTA).toBe('No hay carta')
    expect(CeldaBatalla.Estado.POS_BATALLA_ATAQUE).toBe(
      'Posición de batalla: Ataque'
    )
    expect(CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA).toBe(
      'Posición de batalla: Defensa cara arriba'
    )
    expect(CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO).toBe(
      'Posición de batalla: Defensa cara abajo'
    )
    expect(CeldaBatalla.Estado.YA_ESTA_EN_POSICION_SOLICITADA).toBe(
      'Ya se está en la posición solicitada'
    )
    expect(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE).toBe(
      'Atacar carta no disponible'
    )
    expect(CeldaBatalla.Estado.ATAQUE_DISPONIBLE).toBe(
      'Atacar carta disponible'
    )
    expect(CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE).toBe(
      'Cambio de posición no disponible'
    )
    expect(CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE).toBe(
      'Cambio de posición disponible'
    )
  })
})

describe('CeldaBatalla objeto', () => {
  const carta = new Carta(12, Carta.Elemento.COCO)
  /**
   * @type {CeldaBatalla}
   */
  let celda: CeldaBatalla
  beforeEach(() => {
    celda = new CeldaBatalla()
  })

  test('crea objeto CeldaBatalla válido', () => {
    expect(celda.posBatalla).toBe(CeldaBatalla.Estado.NO_HAY_CARTA)
    expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE)
    expect(celda.carta).toBeNull()
  })

  describe('agregar carta', () => {
    test('en posición de ataque es válido', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      expect(celda.posBatalla).toBe(CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
      expect(celda.carta).toEqual(carta)
    })
    test('en posición de defensa válido', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO)
      expect(celda.posBatalla).toBe(CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO)
      expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
      expect(celda.carta).toEqual(carta)
    })
  })

  describe('cambiar posicion de batalla', () => {
    test('a ataque valido de defensa boca abajo', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO)
      celda.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE
      celda.cambioPosicionBatallaAtaque()
      expect(celda.posBatalla).toBe(CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
    })

    test('a ataque valido de defensa boca arriba', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA)
      celda.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE
      celda.cambioPosicionBatallaAtaque()
      expect(celda.posBatalla).toBe(CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
    })

    test('a defensa valido de ataque', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      celda.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE
      celda.cambioPosicionBatallaDefensa()
      expect(celda.posBatalla).toBe(CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA)
      expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE)
      expect(celda.dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
    })

    test('no disponible', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      expect(celda.cambioPosicionBatallaDefensa()).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      )
    })

    test('no es necesario (ya está en esa posición)', () => {
      celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      celda.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE
      expect(celda.cambioPosicionBatallaAtaque()).toBe(
        CeldaBatalla.Estado.YA_ESTA_EN_POSICION_SOLICITADA
      )
    })
  })

  test('ataque realizado', () => {
    celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
    celda.dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE
    celda.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE
    celda.ataqueRealizado()
    expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE)
  })

  test('quitar carta válido', () => {
    celda.agregarCarta(carta, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
    celda.quitarCarta()
    expect(celda.carta).toBeNull()
    expect(celda.posBatalla).toBe(CeldaBatalla.Estado.NO_HAY_CARTA)
    expect(celda.dispAtaque).toBe(CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE)
    expect(celda.dispCambio).toBe(CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE)
  })
})
