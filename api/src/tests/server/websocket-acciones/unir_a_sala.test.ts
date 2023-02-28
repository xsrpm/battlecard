import { UnirASalaResponse } from "../../../response";
import request from "superwstest";
import { ResultadoUnirASala } from "../../../constants/juego";
import { WebsocketEventTitle } from "../../../constants/websocket-event-title";
import server from "../../../server/websocket-acciones";
import { nombreJugador1, nombreJugador2, unirseASala1, unirseASala2 } from '../../../utils/websocket-test-helper';

describe("Websocket Server", () => {
  beforeEach((done) => {
    server.listen(0, "localhost", done);
  });

  afterEach((done) => {
    server.close(done);
  });

  describe("estando el servidor en sala de espera", () => {
    describe("jugadores se unen a sala de espera e inician juego", () => {
      test("válido", async () => {
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala1)
          .expectJson((response: UnirASalaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA);
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO);
            expect(response.payload.jugadores[0]).toBe(nombreJugador1);
            expect(response.payload.iniciar).toBe(false);
            expect(response.payload.jugadorId).toBeDefined();
            // console.log({response})
          });
        
        await request(server, { defaultExpectOptions: { timeout: 5000 } })
          .ws("/ws")
          .sendJson(unirseASala2)
          .expectJson((response: UnirASalaResponse) => {
            expect(response.event).toBe(WebsocketEventTitle.UNIR_A_SALA);
            expect(response.payload.resultado).toBe(ResultadoUnirASala.EXITO);
            expect(response.payload.jugadores[1]).toBe(nombreJugador2);
            expect(response.payload.iniciar).toBe(true);
            expect(response.payload.jugadorId).toBeDefined();
          })
      });
    });
  });
});
