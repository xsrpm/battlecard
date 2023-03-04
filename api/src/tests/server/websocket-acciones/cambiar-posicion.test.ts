import request from 'superwstest'
import {
  iniciarJuego,
  unirseASala1,
  unirseASala2,
  terminarTurno,
  colocarCarta,
  cambiarPosicion
} from '../../../utils/websocket-test-helper'
import { UnirASalaResponse } from '../../../response'
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

  describe('estando el servidor en sala de espera', () => {
    describe('cambiar posición', () => {
      test('válido', async () => {
        let jugadorId1 = ''
        let jugadorId2 = ''
        const idZonaBatalla = 0
        const idMano = 0
        await request(server)
          .ws('/ws')
          .sendJson(unirseASala1)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId1 = response.payload.jugadorId as string
          })
          .exec(async () => {
            await request(server)
              .ws('/ws')
              .sendJson(unirseASala2)
              .expectJson((response: UnirASalaResponse) => {
                jugadorId2 = response.payload.jugadorId as string
              })
              .sendJson(iniciarJuego(jugadorId2))
          })
          .expectJson()
          .expectJson()
          .sendJson(
            colocarCarta(jugadorId1, PosBatalla.ATAQUE, idZonaBatalla, idMano)
          )
          .expectJson()
          .sendJson(terminarTurno(jugadorId1))
          .expectJson()
          .exec(async () => {
            await request(server).ws('/ws').sendJson(terminarTurno(jugadorId2))
          })
          .sendJson(cambiarPosicion(jugadorId1, idZonaBatalla))
          .expectJson({
            event: WebsocketEventTitle.CAMBIAR_POSICION,
            payload: {
              jugadorId: jugadorId1,
              idZonaBatalla
            }
          })
      })
    })
  })
})
