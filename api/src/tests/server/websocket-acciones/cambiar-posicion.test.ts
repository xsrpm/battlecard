import { Carta } from './../../../types.d'
import { ResultadoCambiarPosicion } from './../../../constants/jugador'
import { WebsocketEventTitle } from './../../../constants/websocket-event-title'
import { CambiarPosicionResponse, IniciarJuegoResponse } from './../../../response.d'
import request from 'superwstest'
import { cambiarPosicion, colocarCarta, terminarTurno, unirASala } from './../../../utils/websocket-test-helper'
import {
  iniciarJuego
} from '../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
import server from '../../../server/websocket-acciones'
import { PosBatalla } from '../../../constants/celdabatalla'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('cambiar posición', () => {
    describe('jugador 1 cambió posición de carta de defensa cara abajo a ataque', () => {
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
        const posColocación = PosBatalla.DEF_ABAJO
        let manoJugador1: Carta[]

        const player1actions = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson((response: IniciarJuegoResponse) => {
            manoJugador1 = response.payload.jugador?.mano as Carta[]
          })// response: jugador 1 inició el juego
          .sendJson(
            colocarCarta(jugadorId1, posColocación, idZonaBatalla, idMano)
          )
          .expectJson()// response: jugador 1 colocó una carta
          .sendJson(terminarTurno(jugadorId1))
          .expectJson()// response: jugador 1 terminó su turno
          .expectJson() // response: jugador 2 terminó su turno

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

        const player1changePosition = request(server)
          .ws('/ws')
          .sendJson(cambiarPosicion(jugadorId1, idZonaBatalla))
          .expectJson((response: CambiarPosicionResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.CAMBIAR_POSICION)
            expect(response.payload.respuesta).toBe(ResultadoCambiarPosicion.POSICION_CAMBIADA)
            expect(response.payload.posBatalla).toBe(PosBatalla.ATAQUE)
            expect(response.payload.carta).toEqual(manoJugador1[idMano])
          }) // response: jugador 1 cambió de posición de carta en zona de batalla

        const player2changePosition = request(server)
          .ws('/ws')
          .expectJson((response: CambiarPosicionResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.CAMBIA_POSICION_ENEMIGO)
            expect(response.payload.respuesta).toBe(ResultadoCambiarPosicion.POSICION_CAMBIADA)
            expect(response.payload.posBatalla).toBe(PosBatalla.ATAQUE)
            expect(response.payload.carta).toEqual(manoJugador1[idMano])
            expect(response.payload.idZonaBatalla).toBe(idZonaBatalla)
          })// response: jugador 1 cambió de posición de carta en zona de batalla

        await Promise.all([
          player1changePosition,
          player2changePosition
        ])
      })
    })
  })
})
