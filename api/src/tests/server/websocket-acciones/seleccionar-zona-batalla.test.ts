import { ResultadoAtacarBarrera, ResultadoAtacarCarta, ResultadoCambiarPosicion } from './../../../constants/jugador'
import { SeleccionarZonaBatallaResponse } from './../../../response.d'
import { PosBatalla } from './../../../constants/celdabatalla'
import { iniciarJuego, seleccionarCeldaEnZonaBatalla, colocarCarta, unirASala, terminarTurno } from '../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
import request from 'superwstest'
import server from '../../../server/websocket-acciones'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('seleccionar celda en zona de batalla', () => {
    describe('jugador 1 selecciona una de sus celdas en su zona de batalla ', () => {
      test('válido', async () => {
        const nombreJugador1 = 'César'
        const nombreJugador2 = 'Krister'
        let jugadorId1 = ''
        let jugadorId2 = ''

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
          .expectJson((response: UnirASalaResponse) => {
            jugadorId2 = response.payload.jugadorId as string
          })// response: jugador 2 se une a sala

        await Promise.all([
          player1join,
          player2join
        ])

        const idZonaBatalla = 0
        const idMano = 0
        const posColocación = PosBatalla.ATAQUE

        const player1actions = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson()// response: jugador 1 inició el juego
          .sendJson(
            colocarCarta(jugadorId1, posColocación, idZonaBatalla, idMano)
          )
          .expectJson()// response: jugador 1 colocó una carta
          .sendJson(terminarTurno(jugadorId1))
          .expectJson()// response: jugador 1 terminó su turno
          .expectJson() // response: jugador 2 terminó su turno
          .sendJson(seleccionarCeldaEnZonaBatalla(jugadorId1, idZonaBatalla))
          .expectJson((response: SeleccionarZonaBatallaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA)
            expect(response.payload.existeCarta).toBe(true)
            expect(response.payload.puedeAtacarCarta).toBe(ResultadoAtacarCarta.NO_HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA)
            expect(response.payload.puedeAtacarBarrera).toBe(ResultadoAtacarBarrera.POSIBLE)
            expect(response.payload.puedeCambiarPosicion).toBe(ResultadoCambiarPosicion.POSIBLE)
          }) // response: jugador 1 cambió de posición de carta en zona de batalla

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego
          .expectJson() // response: jugador 1 colocó una carta
          .expectJson() // response: jugador 1 terminó su turno
          .sendJson(terminarTurno(jugadorId2))
          .expectJson() // response: jugador 2 terminó su turno

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
