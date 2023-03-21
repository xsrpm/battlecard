import request from 'superwstest'
import { ResultadoCogerCarta } from './../../../constants/jugador'
import {
  TerminarTurnoResponse,
  IniciarJuegoResponse
} from './../../../response.d'
import {
  iniciarJuego,
  terminarTurno,
  unirASala
} from '../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
import server from '../../../server/websocket-acciones'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('terminar turno', () => {
    describe('jugador 1 termina su turno e inicia turno de jugador 2', () => {
      test('válido', async () => {
        const nombreJugador1 = 'César'
        const nombreJugador2 = 'Krister'
        let jugadorId1 = ''

        const player1join = request(server)
          .ws('/ws')
          .sendJson(unirASala(nombreJugador1))
          .expectJson((response: UnirASalaResponse) => { // response: jugador 1 se une a sala
            jugadorId1 = response.payload.jugadorId as string
          })
          .expectJson() // response: jugador 2 se une a sala

        const player2join = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 se une a sala
          .sendJson(unirASala(nombreJugador2))
          .expectJson()// response: jugador 2 se une a sala

        await Promise.all([
          player1join,
          player2join
        ])

        let nDeckJugador1: number
        let nDeckJugador2: number
        const player1startGame = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson((response: IniciarJuegoResponse) => {
            nDeckJugador1 = response.payload.jugador?.nDeck as number
            nDeckJugador2 = response.payload.jugadorEnemigo?.nDeck as number
          })// response: jugador 1 inició el juego

        const player2startGame = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego

        await Promise.all([
          player1startGame,
          player2startGame
        ])

        const player1endTurn = request(server)
          .ws('/ws')
          .sendJson(terminarTurno(jugadorId1))
          .expectJson((response: TerminarTurnoResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.TERMINAR_TURNO)
            expect(response.payload.resultado).toBe(
              ResultadoCogerCarta.MANO_LLENA
            )
            expect(response.payload.jugador.enTurno).toBe(false)
            expect(response.payload.jugador.nDeck).toBe(nDeckJugador2)
            expect(response.payload.jugadorEnemigo.enTurno).toBe(true)
            expect(response.payload.jugadorEnemigo.nDeck).toBe(nDeckJugador1)
            expect(response.payload.resultado).toBe(ResultadoCogerCarta.MANO_LLENA)
          })

        const player2endTurn = request(server)
          .ws('/ws')
          .expectJson((response: TerminarTurnoResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.TERMINAR_TURNO)
            expect(response.payload.jugador.enTurno).toBe(true)
            expect(response.payload.jugador.nDeck).toBe(nDeckJugador2)
            expect(response.payload.jugadorEnemigo.enTurno).toBe(false)
            expect(response.payload.jugadorEnemigo.nDeck).toBe(nDeckJugador1)
            expect(response.payload.resultado).toBe(ResultadoCogerCarta.MANO_LLENA)
          })

        await Promise.all([
          player1endTurn,
          player2endTurn
        ])
      })
    })
  })
})
