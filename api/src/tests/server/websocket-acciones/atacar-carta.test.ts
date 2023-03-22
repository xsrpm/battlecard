import { ResultadoAtacarCarta } from './../../../constants/jugador'

import request from 'superwstest'
import { AtacarCartaResponse, UnirASalaResponse } from './../../../response.d'
import { atacarUnaCarta, colocarCarta, iniciarJuego, terminarTurno, unirASala } from './../../../utils/websocket-test-helper'
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

  describe('atacar carta', () => {
    describe('jugador 1 ataca una carta enemiga en posición de ataque', () => {
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

        const idZonaBatallaJ1 = 0
        const idZonaBatallaJ2 = 0
        const idMano = 0
        const posColocación = PosBatalla.ATAQUE

        const player1iniciarJuego = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson()// response: jugador 1 inició el juego

        const player2iniciarJuego = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego

        await Promise.all([
          player1iniciarJuego,
          player2iniciarJuego
        ])

        const player1actions = request(server)
          .ws('/ws')
          .sendJson(
            colocarCarta(jugadorId1, posColocación, idZonaBatallaJ1, idMano)
          )
          .expectJson()// response: jugador 1 colocó una carta
          .sendJson(terminarTurno(jugadorId1))
          .expectJson()// response: jugador 1 terminó su turno
          .expectJson()// response: jugador 2 colocó una carta
          .expectJson() // response: jugador 2 terminó su turno
          .sendJson(atacarUnaCarta(jugadorId1, idZonaBatallaJ1, idZonaBatallaJ2))
          .expectJson((response: AtacarCartaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.ATACAR_CARTA)
            expect(response.payload.estadoAtaque).toBe(ResultadoAtacarCarta.POSIBLE)
            expect(response.payload.cartaAtacante).toBeDefined()
            expect(response.payload.cartaAtacada).toBeDefined()
            expect(response.payload.veredicto).toBeDefined()
            expect(response.payload.estadoCartaAtacante).toBeDefined()
            expect(response.payload.estadoCartaAtacada).toBeDefined()
            expect(response.payload.estadoBarrera).toBeDefined()
            expect(response.payload.sinBarreras).toBe(false)
            expect(response.payload.bonifCartaAtacante).toBeDefined()
            expect(response.payload.bonifCartaAtacada).toBeDefined()
            expect(response.payload.idBarreraEliminada).toBeDefined()
          }) // response: jugador 1 ataca una carta enemiga

        const player2actions = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 colocó una carta
          .expectJson() // response: jugador 1 terminó su turno
          .sendJson(colocarCarta(jugadorId2, posColocación, idZonaBatallaJ2, idMano))
          .expectJson()// response: jugador 2 colocó una carta
          .sendJson(terminarTurno(jugadorId2))
          .expectJson() // response: jugador 2 terminó su turno
          .expectJson((response: AtacarCartaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.ATACAN_TU_CARTA)
            expect(response.payload.estadoAtaque).toBe(ResultadoAtacarCarta.POSIBLE)
            expect(response.payload.cartaAtacante).toBeDefined()
            expect(response.payload.cartaAtacada).toBeDefined()
            expect(response.payload.veredicto).toBeDefined()
            expect(response.payload.estadoCartaAtacante).toBeDefined()
            expect(response.payload.estadoCartaAtacada).toBeDefined()
            expect(response.payload.estadoBarrera).toBeDefined()
            expect(response.payload.sinBarreras).toBe(false)
            expect(response.payload.bonifCartaAtacante).toBeDefined()
            expect(response.payload.bonifCartaAtacada).toBeDefined()
            expect(response.payload.idCartaAtacante).toBeDefined()
            expect(response.payload.idCartaAtacada).toBeDefined()
          }) // response: jugador 1 ataca una carta enemiga

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
