import { MAX_BARRERA_CARDS, MAX_MANO_CARDS, MAX_DECK } from './../../../constants/jugador';
import { iniciarJuego, nombreJugador1, nombreJugador2 } from './../../../utils/websocket-test-helper';
import { IniciarJuegoResponse, UnirASalaResponse } from "../../../response";
import request from "superwstest";
import { WebsocketEventTitle } from "../../../constants/websocket-event-title";
import server from "../../../server/websocket-acciones";
import { unirseASala1, unirseASala2 } from '../../../utils/websocket-test-helper';
import { ResultadoIniciarJuego } from '../../../constants/juego';

describe("Websocket Server", () => {
  beforeEach((done) => {
    server.listen(0, "localhost", done);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe("estando el servidor en sala de espera", () => {
    describe("iniciar el juego", () => {
      test("válido", async () => {
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala1)
        let jugadorId = ""
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala2)
          .expectJson((response: UnirASalaResponse) => {
            expect(response.payload.jugadorId).toBeDefined();
            jugadorId = response.payload.jugadorId as string
          })
          .sendJson(iniciarJuego(jugadorId))
          .expectJson((response: IniciarJuegoResponse) =>{
            expect(response.event).toBe(WebsocketEventTitle.INICIAR_JUEGO)
            expect(response.payload.respuesta).toBe(ResultadoIniciarJuego.JUEGO_INICIADO)
            expect(response.payload.jugador?.nombre).toBe(nombreJugador2)
            expect(response.payload.jugador?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugador?.mano.length).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugador?.enTurno).toBe(false)
            expect(response.payload.jugador?.nDeck).toBe(MAX_DECK-MAX_BARRERA_CARDS-MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.nombre).toBe(nombreJugador1)
            expect(response.payload.jugadorEnemigo?.nBarrera).toBe(MAX_BARRERA_CARDS)
            expect(response.payload.jugadorEnemigo?.nMano).toBe(MAX_MANO_CARDS)
            expect(response.payload.jugadorEnemigo?.enTurno).toBe(true)
            expect(response.payload.jugadorEnemigo?.nDeck).toBe(MAX_DECK-MAX_BARRERA_CARDS-MAX_MANO_CARDS)
          })
      });
    });
  });
});
