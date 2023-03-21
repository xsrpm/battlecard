import { UnirASalaResponse } from '../../../response'
import request from 'superwstest'
import { ResultadoUnirASala } from '../../../constants/juego'
import { WebsocketEventTitle } from '../../../constants/websocket-event-title'
import server from '../../../server/websocket-acciones'
import { unirASala } from '../../../utils/websocket-test-helper'

describe('Websocket Server', () => {
  beforeEach((done) => {
    server.listen(0, 'localhost', done)
  })

  afterEach((done) => {
    server.close(done)
  })

  describe('estando el servidor en sala de espera', () => {
    describe('jugadores se unen a sala de espera', () => {
      test('válido', async () => {
        const playerName1 = 'César'
        const playerName2 = 'Krister'
        const player1actions = request(server)
          .ws('/ws')
          .sendJson(unirASala(playerName1))
          .expectJson((response: UnirASalaResponse) => {
            // console.log('PLAYER 1 response: player 1 has joined to the room')
            // console.log(response)
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA)
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO)
            expect(response.payload.jugadores[0]).toBe(playerName1)
            expect(response.payload.iniciar).toBe(false)
            expect(response.payload.jugadorId).toBeDefined()
          })
          .expectJson((response) => {
            // console.log('PLAYER 1 response: player 2 has joined to the room')
            // console.log(response)
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA)
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO)
            expect(response.payload.jugadores[0]).toBe(playerName1)
            expect(response.payload.jugadores[1]).toBe(playerName2)
            expect(response.payload.iniciar).toBe(true)
            expect(response.payload.jugadorId).not.toBeDefined()
          })

        const player2actions = request(server)
          .ws('/ws')
          .expectJson((response) => {
            // console.log('PLAYER 2 response: player 1 has joined to the room')
            // console.log(response)
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA)
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO)
            expect(response.payload.jugadores[0]).toBe(playerName1)
            expect(response.payload.iniciar).toBe(false)
            expect(response.payload.jugadorId).not.toBeDefined()
          })
          .sendJson(unirASala(playerName2))
          .expectJson((response: UnirASalaResponse) => {
            // console.log('PLAYER 2 response: player 2 has joined to the room')
            // console.log(response)
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA)
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO)
            expect(response.payload.jugadores[0]).toBe(playerName1)
            expect(response.payload.jugadores[1]).toBe(playerName2)
            expect(response.payload.iniciar).toBe(true)
            expect(response.payload.jugadorId).toBeDefined()
          })

        await Promise.all([
          player1actions,
          player2actions
        ])
      })
    })
  })
})
