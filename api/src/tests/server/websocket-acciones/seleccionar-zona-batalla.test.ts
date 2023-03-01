import {  iniciarJuego, unirseASala1, unirseASala2, seleccionarCeldaEnZonaBatalla, seleccionarCeldaEnZonaBatallaResponse } from '../../../utils/websocket-test-helper';
import { UnirASalaResponse } from "../../../response";
import request from "superwstest";
import server from "../../../server/websocket-acciones";

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
        let jugadorId1 = ""
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala1)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId1 = response.payload.jugadorId as string
          })
        
        let jugadorId2 = ""
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala2)
          .expectJson((response: UnirASalaResponse) => {
            jugadorId2 = response.payload.jugadorId as string
          })
          .sendJson(iniciarJuego(jugadorId2))
        
          await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(seleccionarCeldaEnZonaBatalla(jugadorId1, 0))
          .expectJson(seleccionarCeldaEnZonaBatallaResponse)
      });
    });
  });
});
