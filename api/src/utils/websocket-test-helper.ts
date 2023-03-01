import { ResultadoColocarCarta } from '../constants/jugador';
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

  export const seleccionarMano = (jugadorId:string, idMano: number) => ({
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      jugadorId,
      idMano
    }
  })

  export const seleccionarManoResponse = {
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      existeCarta: true,
      puedeColocarCarta: ResultadoColocarCarta.POSIBLE
    }
  }