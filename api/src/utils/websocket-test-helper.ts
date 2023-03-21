import {
  ResultadoAtacarCarta,
  ResultadoAtacarBarrera,
  ResultadoCambiarPosicion
} from './../constants/jugador'
import { WebsocketEventTitle } from '../constants/websocket-event-title'

export const unirASala = (nombreJugador: string) => ({
  event: WebsocketEventTitle.UNIR_A_SALA,
  payload: {
    nombreJugador
  }
})

export const iniciarJuego = (jugadorId: string) => ({
  event: WebsocketEventTitle.INICIAR_JUEGO,
  payload: {
    jugadorId
  }
})

export const seleccionarMano = (jugadorId: string, idMano: number) => ({
  event: WebsocketEventTitle.SELECCIONAR_MANO,
  payload: {
    jugadorId,
    idMano
  }
})

export const seleccionarCeldaEnZonaBatalla = (
  jugadorId: string,
  idZonaBatalla: number
) => ({
  event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
  payload: {
    jugadorId,
    idZonaBatalla
  }
})

export const seleccionarCeldaEnZonaBatallaResponse = {
  event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
  payload: {
    existeCarta: true,
    puedeAtacarCarta:
      ResultadoAtacarCarta.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO,
    puedeAtacarBarrera:
      ResultadoAtacarBarrera.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO,
    puedeCambiarPosicion:
      ResultadoCambiarPosicion.SIN_CAMBIOS_DE_POSICION_DISPONIBLES
  }
}

export const colocarCarta = (
  jugadorId: string,
  posicion: string,
  idZonaBatalla: number,
  idMano: number
) => ({
  event: WebsocketEventTitle.COLOCAR_CARTA,
  payload: {
    jugadorId,
    posicion,
    idZonaBatalla,
    idMano
  }
})

export const terminarTurno = (jugadorId: string) => ({
  event: WebsocketEventTitle.TERMINAR_TURNO,
  payload: {
    jugadorId
  }
})

export const cambiarPosicion = (jugadorId: string, idZonaBatalla: number) => ({
  event: WebsocketEventTitle.CAMBIAR_POSICION,
  payload: {
    jugadorId,
    idZonaBatalla
  }
})
