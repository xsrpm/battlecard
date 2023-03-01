import { PosBatalla } from './../../../constants/celdabatalla';
import {
  ColocarCartaResponse,
  IniciarJuegoResponse,
} from "./../../../response.d";
import {
  ResultadoColocarCarta,
} from "./../../../constants/jugador";
import {
  iniciarJuego,
  unirseASala1,
  unirseASala2,
  colocarCarta,
} from "../../../utils/websocket-test-helper";
import { UnirASalaResponse } from "../../../response";
import request from "superwstest";
import server from "../../../server/websocket-acciones";
import { WebsocketEventTitle } from "../../../constants/websocket-event-title";
import { Carta } from '../../../types';

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
        let jugadorId1 = "";
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala1)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId1 = response.payload.jugadorId as string;
          });

        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala2)

        let manoJug1: Carta[];
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(iniciarJuego(jugadorId1))
          .expectJson((response: IniciarJuegoResponse) => {
            manoJug1 = response.payload.jugador?.mano as Carta[];
            manoJug1.shift()
          });

        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(colocarCarta(jugadorId1,PosBatalla.ATAQUE,0,0))
          .expectJson((response: ColocarCartaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.COLOCAR_CARTA);
            expect(response.payload.resultado).toBe(
              ResultadoColocarCarta.CARTA_COLOCADA
            );
            expect(response.payload.mano).toEqual(manoJug1);
          })
      });
    });
  });
});
