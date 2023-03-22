import { EstadoCarta, ResultadoAtacarBarrera } from './../../../constants/jugador'
import request from 'superwstest'
import { AtacarBarreraResponse, UnirASalaResponse } from './../../../response.d'
import { atacarBarrera, colocarCarta, iniciarJuego, terminarTurno, unirASala } from './../../../utils/websocket-test-helper'
import server from '../../../server/websocket-acciones'
import { PosBatalla } from '../../../constants/celdabatalla'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('atacar barrera', () => {
    describe('jugador 1 ataca una barrera enemiga', () => {
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

          .sendJson(atacarBarrera(jugadorId1, idZonaBatalla))
          .expectJson((response: AtacarBarreraResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.ATACAR_BARRERA)
            expect(response.payload.estadoAtaque).toBe(ResultadoAtacarBarrera.POSIBLE)
            expect(response.payload.estadoBarrera).toBe(EstadoCarta.DESTRUIDA)
            expect(response.payload.idBarreraEliminada).toBe(4)
            expect(response.payload.sinBarreras).toBe(false)
          }) // response: jugador 1 ataca barrera enemiga

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego
          .expectJson() // response: jugador 1 colocó una carta
          .expectJson() // response: jugador 1 terminó su turno
          .sendJson(terminarTurno(jugadorId2))
          .expectJson() // response: jugador 2 terminó su turno
          .expectJson((response: AtacarBarreraResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.ATACAN_TU_BARRERA)
            expect(response.payload.estadoAtaque).toBe(ResultadoAtacarBarrera.POSIBLE)
            expect(response.payload.estadoBarrera).toBe(EstadoCarta.DESTRUIDA)
            expect(response.payload.idBarreraEliminada).toBe(4)
            expect(response.payload.sinBarreras).toBe(false)
          }) // response: jugador 1 ataca barrera enemiga

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
