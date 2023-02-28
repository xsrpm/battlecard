import { WebsocketEventTitle } from '../constants/websocket-event-title';

export const nombreJugador1 = "César";
export const unirseASala1 = {
  event: WebsocketEventTitle.UNIR_A_SALA,
  payload: {
    nombreJugador: nombreJugador1,
  },
};

export const nombreJugador2 = "Krister";
export const unirseASala2 = {
  event: WebsocketEventTitle.UNIR_A_SALA,
  payload: {
    nombreJugador: nombreJugador2,
  },
};
export const iniciarJuego = (jugadorId:string) =>({
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      jugadorId
    }
  })