import { WebsocketEvent } from '../../../shared/types/response'
import { PosBatalla } from './../constants/celdabatalla'

export let nombreJugadorVictorioso = ''
export let nombreJugadorDerrotado = ''
export let idCartaZBSeleccionada: number
export let stepAccion = 'STAND BY'
export let posicionBatalla: PosBatalla
export let message: WebsocketEvent
export let juegoFinalizado: boolean
export let sinBarrerasFlag: boolean
export let jugadorId: string

export const setJugadorId = (value: string) => {
  jugadorId = value
}

export const setSinBarrerasFlag = (value: boolean) => {
  sinBarrerasFlag = value
}

export const setJuegoFinalizado = (juegoF: boolean) => {
  juegoFinalizado = juegoF
}

export const setMessage = (msg: WebsocketEvent) => {
  message = msg
}

export const setPosicionBatalla = (posicion: PosBatalla) => {
  posicionBatalla = posicion
}

export const setNombreJugadorVictorioso = (nombre: string) => {
  nombreJugadorVictorioso = nombre
}

export const setNombreJugadorDerrotado = (nombre: string) => {
  nombreJugadorDerrotado = nombre
}

export const setIdCartaZBSeleccionada = (id: number) => {
  idCartaZBSeleccionada = id
}

export const setStepAccion = (step: string) => {
  stepAccion = step
}
