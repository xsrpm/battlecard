import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { sendMessage } from '../modules/socket'
import { idCartaZBSeleccionada, jugadorId, posicionBatalla } from './estadoGlobal'

export function terminarTurno() {
  sendMessage({
    event: WebsocketEventTitle.TERMINAR_TURNO,
    payload: {
      jugadorId
    }
  })
}

export function cambiarPosicionEnZonaBatallaSeleccionada() {
  sendMessage({
    event: WebsocketEventTitle.CAMBIAR_POSICION,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function atacarBarreraDesdeZonaBatallaSeleccionada() {
  sendMessage({
    event: WebsocketEventTitle.ATACAR_BARRERA,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function colocarCartaEnZonaBatallaDesdeMano(idCartaManoSeleccionada: number) {
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

export function seleccionarCeldaEnZonaBatalla() {
  sendMessage({
    event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
    payload: {
      jugadorId,
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
}

export function seleccionarMano(idCartaManoSeleccionada: number) {
  sendMessage({
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      jugadorId,
      idMano: idCartaManoSeleccionada
    }
  })
}

export function atacarCarta(idCartaZBEnemigaSeleccionada: number) {
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

export function iniciarJuego() {
  sendMessage({
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      jugadorId
    }
  })
}
