
import { STEP_ACTION } from '../constants/stepAction'
import { type PosBatalla } from './../constants/celdabatalla'

export let nombreJugadorVictorioso = ''
export let nombreJugadorDerrotado = ''
export let stepAccion = STEP_ACTION.STAND_BY
export let posicionBatalla: PosBatalla
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

export const setPosicionBatalla = (posicion: PosBatalla) => {
  posicionBatalla = posicion
}

export const setNombreJugadorVictorioso = (nombre: string) => {
  nombreJugadorVictorioso = nombre
}

export const setNombreJugadorDerrotado = (nombre: string) => {
  nombreJugadorDerrotado = nombre
}

export const setStepAccion = (step: string) => {
  stepAccion = step
}
