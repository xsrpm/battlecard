
export let nombreJugadorVictorioso = ''
export let nombreJugadorDerrotado = ''
export let idCartaZBSeleccionada
export let stepAccion = 'STAND BY'
export let posicionBatalla
export let message

export const setMessage = (msg) => {
  message = msg
}

export const setPosicionBatalla = (posicion) => {
  posicionBatalla = posicion
}

export const setNombreJugadorVictorioso = (nombre) => {
  nombreJugadorVictorioso = nombre
}

export const setNombreJugadorDerrotado = (nombre) => {
  nombreJugadorDerrotado = nombre
}

export const setIdCartaZBSeleccionada = (id) => {
  idCartaZBSeleccionada = id
}

export const setStepAccion = (step) => {
  stepAccion = step
}
