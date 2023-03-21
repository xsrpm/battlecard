import request from 'superwstest'
import { seleccionarMano, iniciarJuego, unirASala } from './../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
import server from '../../../server/websocket-acciones'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'
import { ResultadoColocarCarta } from '../../../constants/jugador'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('seleccionar mano', () => {
    describe('primer jugador seleccionar mano', () => {
      test('válido', async () => {
        const nombreJugador1 = 'César'
        const nombreJugador2 = 'Krister'
        let jugador1Id = ''
        const player1join = request(server)
          .ws('/ws')
          .sendJson(unirASala(nombreJugador1))
          .expectJson((response: UnirASalaResponse) => { // response: jugador 1 se une a sala
            jugador1Id = response.payload.jugadorId as string
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

        const player1actions = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugador1Id))
          .expectJson() // response: jugador 1 inició el juego
          .sendJson(seleccionarMano(jugador1Id, 0))
          .expectJson({
            event: WebsocketEventTitle.SELECCIONAR_MANO,
            payload: {
              existeCarta: true,
              puedeColocarCarta: ResultadoColocarCarta.POSIBLE
            }
          })

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
