import request from 'superwstest'
import { MAX_BARRERA_CARDS, MAX_MANO_CARDS, MAX_DECK } from './../../../constants/jugador'
import { iniciarJuego, unirASala } from './../../../utils/websocket-test-helper'
import { IniciarJuegoResponse, UnirASalaResponse } from '../../../response'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'
import server from '../../../server/websocket-acciones'
import { ResultadoIniciarJuego } from '../../../constants/juego'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('estando el servidor en sala de espera', () => {
    describe('primer jugador inicia el juego', () => {
      test('válido', async () => {
        const nombreJugador1 = 'César'
        const nombreJugador2 = 'Krister'
        let jugador1Id = ''
        const player1actions = request(server)
          .ws('/ws')
          .sendJson(unirASala(nombreJugador1))
          .expectJson((response: UnirASalaResponse) => { // response: jugador 1 se une a sala
            jugador1Id = response.payload.jugadorId as string
            console.log('🚀 ~ file: iniciar-juego.test.ts:29 ~ .expectJson ~ jugador1Id:', jugador1Id)
          })
          .expectJson() // response: jugador 2 se une a sala
          .sendJson(iniciarJuego(jugador1Id))
          .expectJson((response: IniciarJuegoResponse) => { // response: jugador 1 inició el juego
            console.log('🚀 ~ file: iniciar-juego.test.ts:34 ~ .expectJson ~ response:', response)
            console.log('// response: jugador 1 inició el juego')
            expect(response.event).toBe(WebsocketEventTitle.INICIAR_JUEGO)
            expect(response.payload.respuesta).toBe(ResultadoIniciarJuego.JUEGO_INICIADO)
            expect(response.payload.jugador?.nombre).toBe(nombreJugador1)
            expect(response.payload.jugador?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugador?.mano.length).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugador?.enTurno).toBe(true)
            expect(response.payload.jugador?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.nombre).toBe(nombreJugador2)
            expect(response.payload.jugadorEnemigo?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugadorEnemigo?.nMano).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.enTurno).toBe(false)
            expect(response.payload.jugadorEnemigo?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
          })

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 se une a sala
          .sendJson(unirASala(nombreJugador2))
          .expectJson()// response: jugador 2 se une a sala
          .expectJson((response: IniciarJuegoResponse) => { // response: jugador 1 inició el juego
            expect(response.event).toBe(WebsocketEventTitle.INICIAR_JUEGO)
            expect(response.payload.respuesta).toBe(ResultadoIniciarJuego.JUEGO_INICIADO)
            expect(response.payload.jugador?.nombre).toBe(nombreJugador2)
            expect(response.payload.jugador?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugador?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugador?.mano.length).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugador?.enTurno).toBe(false)
            expect(response.payload.jugadorEnemigo?.nombre).toBe(nombreJugador1)
            expect(response.payload.jugadorEnemigo?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugadorEnemigo?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.nMano).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.enTurno).toBe(true)
          })

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
    describe('segundo jugador inicia el juego', () => {
      test('válido', async () => {
        const nombreJugador1 = 'César'
        const nombreJugador2 = 'Krister'
        let jugador2Id = ''
        const player1actions = request(server)
          .ws('/ws')
          .sendJson(unirASala(nombreJugador1))
          .expectJson() // response: jugador 1 se une a sala
          .expectJson() // response: jugador 2 se une a sala
          .expectJson((response: IniciarJuegoResponse) => { // response: Jugador 2 inició el juego
            expect(response.event).toBe(WebsocketEventTitle.INICIAR_JUEGO)
            expect(response.payload.respuesta).toBe(ResultadoIniciarJuego.JUEGO_INICIADO)
            expect(response.payload.jugador?.nombre).toBe(nombreJugador1)
            expect(response.payload.jugador?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugador?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugador?.mano.length).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugador?.enTurno).toBe(true)
            expect(response.payload.jugadorEnemigo?.nombre).toBe(nombreJugador2)
            expect(response.payload.jugadorEnemigo?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugadorEnemigo?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.nMano).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.enTurno).toBe(false)
          })

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 se une a sala
          .sendJson(unirASala(nombreJugador2))
          .expectJson((response: UnirASalaResponse) => { // response: jugador 2 se une a sala
            jugador2Id = response.payload.jugadorId as string
          })
          .sendJson(iniciarJuego(jugador2Id))
          .expectJson((response: IniciarJuegoResponse) => { // response: jugador 2 inició el juego
            expect(response.event).toBe(WebsocketEventTitle.INICIAR_JUEGO)
            expect(response.payload.respuesta).toBe(ResultadoIniciarJuego.JUEGO_INICIADO)
            expect(response.payload.jugador?.nombre).toBe(nombreJugador2)
            expect(response.payload.jugador?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugador?.mano.length).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugador?.enTurno).toBe(false)
            expect(response.payload.jugador?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.nombre).toBe(nombreJugador1)
            expect(response.payload.jugadorEnemigo?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugadorEnemigo?.nMano).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.enTurno).toBe(true)
            expect(response.payload.jugadorEnemigo?.nDeck).toBe(MAX_DECK - MAX_BARRERA_CARDS - MAX_MANO_CARDS)
          })

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
