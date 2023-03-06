import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { sendMessage } from '../modules/socket'

export function terminarTurno(jugadorId: string) {
  sendMessage({
    event: WebsocketEventTitle.TERMINAR_TURNO,
    payload: {
      jugadorId
    }
  })
}

export function cambiarPosicionEnZonaBatallaSeleccionada(jugadorId: string, idCartaZBSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.CAMBIAR_POSICION,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function atacarBarreraDesdeZonaBatallaSeleccionada(jugadorId: string, idCartaZBSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.ATACAR_BARRERA,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function colocarCartaEnZonaBatallaDesdeMano(jugadorId: string, posicionBatalla: string, idCartaZBSeleccionada: number, idCartaManoSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.COLOCAR_CARTA,
    payload: {
      jugadorId,
      posicion: posicionBatalla,
      idZonaBatalla: idCartaZBSeleccionada,
      idMano: idCartaManoSeleccionada
    }
  })
}

export function seleccionarCeldaEnZonaBatalla(jugadorId: string, idCartaZBSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function seleccionarMano(jugadorId: string, idCartaManoSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      jugadorId,
      idMano: idCartaManoSeleccionada
    }
  })
}

export function atacarCarta(jugadorId: string, idCartaZBSeleccionada: number, idCartaZBEnemigaSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.ATACAR_CARTA,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada,
      idZonaBatallaEnemiga: idCartaZBEnemigaSeleccionada
    }
  })
}

export function unirASala(nombreJugador: string) {
  sendMessage({
    event: WebsocketEventTitle.UNIR_A_SALA,
    payload: { nombreJugador }
  })
}

export function iniciarJuego(jugadorId: string) {
  sendMessage({
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      jugadorId
    }
  })
}
