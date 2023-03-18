import { type IniciarJuegoResponse } from '../../../api/src/response'
import { Elemento } from '../constants/carta'
import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { useGameRoomStore } from '../hooks/useGameRoomStore'
import { act, renderHook } from '@testing-library/react'
import { type PlayerState } from '../types/PlayerState'
import { PosBatalla } from '../constants/celdabatalla'

describe('useGameRoomStore', () => {
  test('iniciarJuego', () => {
    const { result } = renderHook(() => useGameRoomStore())
    const iniciarJuegoResponse: IniciarJuegoResponse = {
      event: WebsocketEventTitle.INICIAR_JUEGO,
      payload: {
        jugador: {
          enTurno: true,
          mano: [
            { valor: 1, elemento: Elemento.COCO },
            { valor: 2, elemento: Elemento.COCO },
            { valor: 3, elemento: Elemento.COCO },
            { valor: 4, elemento: Elemento.COCO },
            { valor: 5, elemento: Elemento.COCO }
          ],
          nBarrera: 5,
          nDeck: 20,
          nombre: 'César'
        },
        jugadorEnemigo: {
          enTurno: false,
          nBarrera: 5,
          nDeck: 20,
          nMano: 5,
          nombre: 'Juan'
        },
        respuesta: ''
      }
    }
    act(() => {
      result.current.iniciarJuego(iniciarJuegoResponse)
    })

    const jugadorExpected: PlayerState = {
      enTurno: true,
      nCardsInDeck: 20,
      nombre: 'César',
      barrera: [true, true, true, true, true],
      mano: [
        {
          carta: { valor: 1, elemento: Elemento.COCO }
        },
        {
          carta: { valor: 2, elemento: Elemento.COCO }
        },
        {
          carta: { valor: 3, elemento: Elemento.COCO }
        },
        {
          carta: { valor: 4, elemento: Elemento.COCO }
        },
        {
          carta: { valor: 5, elemento: Elemento.COCO }
        }
      ],
      zonaBatalla: [
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        },
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        },
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        }
      ]
    }
    const jugadorEnemigoExpected: PlayerState = {
      enTurno: false,
      nCardsInDeck: 20,
      nombre: 'Juan',
      barrera: [true, true, true, true, true],
      mano: [
        {
          hidden: true
        },
        {
          hidden: true
        },
        {
          hidden: true
        },
        {
          hidden: true
        },
        {
          hidden: true
        }
      ],
      zonaBatalla: [
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        },
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        },
        {
          posicionBatalla: PosBatalla.NO_HAY_CARTA
        }
      ]
    }
    const botoneraExpected = {
      buttons: { terminarTurno: true }
    }
    expect(result.current.jugador).toEqual(jugadorExpected)
    expect(result.current.jugadorEnemigo).toEqual(jugadorEnemigoExpected)
    expect(result.current.botonera).toEqual(botoneraExpected)
  })
})