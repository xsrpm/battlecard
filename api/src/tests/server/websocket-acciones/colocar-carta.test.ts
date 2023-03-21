import request from 'superwstest'
import { PosBatalla } from './../../../constants/celdabatalla'
import {
  ColocarCartaOtroJugadorResponse,
  ColocarCartaResponse,
  IniciarJuegoResponse
} from './../../../response.d'
import {
  ResultadoColocarCarta
} from './../../../constants/jugador'
import {
  iniciarJuego,
  colocarCarta,
  unirASala
} from '../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
import server from '../../../server/websocket-acciones'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'
import { Carta } from '../../../types'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('colocar carta', () => {
    describe('jugador 1 coloca una carta', () => {
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

        let manoJug1: Carta[]
        let cartaColocada: Carta
        const posColocación = PosBatalla.ATAQUE
        const idPosicionCartaMano = 0
        const idPosicionCartaZB = 0
        const idPosicionCartaVisualmenteRemovida = 4
        const player1startGame = request(server)
          .ws('/ws')
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson((response: IniciarJuegoResponse) => { // response: jugador 1 inició el juego
            manoJug1 = response.payload.jugador?.mano as Carta[]
            cartaColocada = manoJug1.shift() as Carta
          })

        const player2startGame = request(server)
          .ws('/ws')
          .expectJson() // response: jugador 1 inició el juego

        await Promise.all([
          player1startGame,
          player2startGame
        ])

        const player1PutCard = request(server)
          .ws('/ws')
          .sendJson(colocarCarta(jugadorId1, posColocación, 0, idPosicionCartaMano))
          .expectJson((response: ColocarCartaResponse) => { // response: jugador 1 colocó carta
            expect(response.event).toBe(WebsocketEventTitle.COLOCAR_CARTA)
            expect(response.payload.resultado).toBe(
              ResultadoColocarCarta.CARTA_COLOCADA
            )
            expect(response.payload.mano).toEqual(manoJug1)
          })

        const player2PutCard = request(server)
          .ws('/ws')
          .expectJson((response: ColocarCartaOtroJugadorResponse) => { // response: jugador 1 colocó carta
            expect(response.event).toBe(WebsocketEventTitle.COLOCAR_CARTA_OTRO_JUGADOR)
            expect(response.payload.resultado).toBe(ResultadoColocarCarta.CARTA_COLOCADA)
            expect(response.payload.carta).toEqual(cartaColocada)
            expect(response.payload.posicion).toBe(posColocación)
            expect(response.payload.idMano).toBe(idPosicionCartaVisualmenteRemovida)
            expect(response.payload.idZonaBatalla).toBe(idPosicionCartaZB)
          })

        await Promise.all([
          player1PutCard,
          player2PutCard
        ])
      })
    })
  })
})
