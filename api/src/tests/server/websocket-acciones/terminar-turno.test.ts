import request from "superwstest";
import { ResultadoCogerCarta } from "./../../../constants/jugador";
import {
  TerminarTurnoResponse,
  IniciarJuegoResponse,
} from "./../../../response.d";
import {
  iniciarJuego,
  unirseASala1,
  unirseASala2,
  terminarTurno,
  colocarCarta
} from "../../../utils/websocket-test-helper";
import { UnirASalaResponse } from "../../../response";
import server from "../../../server/websocket-acciones";
import { WebsocketEventTitle } from "../../../constants/websocket-event-title";
import { PosBatalla } from "../../../constants/celdabatalla";

describe("Websocket Server", () => {
  beforeEach((done) => {
    server.listen(0, "localhost", done);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe("estando el servidor en sala de espera", () => {
    describe("terminar turno", () => {
      test("válido", async () => {
        let jugadorId1 = "";
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala1)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId1 = response.payload.jugadorId as string;
          });
        let jugadorId2 = "";
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala2)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId2 = response.payload.jugadorId as string;
          });

        let nDeckJugador1: number;
        let nDeckJugador2: number;
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson((response: IniciarJuegoResponse) => {
            nDeckJugador1 = response.payload.jugador?.nDeck as number;
            nDeckJugador2 = response.payload.jugadorEnemigo?.nDeck as number;
          });

        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(colocarCarta(jugadorId1, PosBatalla.ATAQUE, 0, 0));

        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(terminarTurno(jugadorId1))
          .expectJson((response: TerminarTurnoResponse) => {
            console.log(response);
            expect(response.event).toBe(WebsocketEventTitle.TERMINAR_TURNO);
            expect(response.payload.resultado).toBe(
              ResultadoCogerCarta.MANO_LLENA
            );
            expect(response.payload.jugador.enTurno).toBe(false);
            expect(response.payload.jugador.nDeck).toBe(nDeckJugador2);
            expect(response.payload.jugadorEnemigo.enTurno).toBe(true);
            expect(response.payload.jugadorEnemigo.nDeck).toBe(nDeckJugador1);
          });

        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(terminarTurno(jugadorId2))
          .expectJson((response: TerminarTurnoResponse) => {
            console.log(response);
            expect(response.event).toBe(WebsocketEventTitle.TERMINAR_TURNO);
            expect(response.payload.resultado).toBe(
              ResultadoCogerCarta.EXITO
            );
            expect(response.payload.jugador.enTurno).toBe(false);
            expect(response.payload.jugador.nDeck).toBe(nDeckJugador2);
            expect(response.payload.jugadorEnemigo.enTurno).toBe(true);
            expect(response.payload.jugadorEnemigo.nDeck).toBe(nDeckJugador1-1);
          });
      });
    });
  });
});
