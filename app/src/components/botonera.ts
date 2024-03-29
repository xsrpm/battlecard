
import { stepAccion, setStepAccion, posicionBatalla, setPosicionBatalla, jugadorId } from '../modules/estadoGlobal'
import { colocarCarta, jugDown } from './tablero'
import { PosBatalla } from '../constants/celdabatalla'
import { atacarBarreraDesdeZonaBatallaSeleccionada, cambiarPosicionEnZonaBatallaSeleccionada, terminarTurno } from '../modules/socket-messages'
import { STEP_ACTION } from '../constants/stepAction'
import { terminarJuego } from '../pages/fin-de-juego'
import { idCartaZBSeleccionada } from '../pages/juego'

export const btnFinDeJuego = document.getElementById('btnFinDeJuego') as HTMLButtonElement
export const btnTerminarTurno = document.getElementById('btnTerminarTurno') as HTMLButtonElement
export const btnCambiarPosicion = document.getElementById('btnCambiarPosicion') as HTMLButtonElement
export const btnAtacarBarrera = document.getElementById('btnAtacarBarrera') as HTMLButtonElement
export const btnAtacarCarta = document.getElementById('btnAtacarCarta') as HTMLButtonElement
export const mensajeBotones = document.getElementById('mensajeBotones') as HTMLParagraphElement
export const btnColocarEnDefensa = document.getElementById('btnColocarEnDefensa') as HTMLButtonElement
export const btnColocarEnAtaque = document.getElementById('btnColocarEnAtaque') as HTMLButtonElement

btnFinDeJuego.addEventListener('click', function () {
  terminarJuego()
})

btnTerminarTurno.addEventListener('click', () => {
  terminarTurno(jugadorId)
})

btnCambiarPosicion.addEventListener('click', () => {
  if (stepAccion === STEP_ACTION.SELECCIONAR_ZONA_BATALLA) {
    console.log(STEP_ACTION.CAMBIAR_POSICION)
    setStepAccion(STEP_ACTION.CAMBIAR_POSICION)
    habilitacionBotonera()
    cambiarPosicionEnZonaBatallaSeleccionada(jugadorId, idCartaZBSeleccionada)
  }
})

btnAtacarBarrera.addEventListener('click', () => {
  atacarBarreraDesdeZonaBatallaSeleccionada(jugadorId, idCartaZBSeleccionada)
})

btnAtacarCarta.addEventListener('click', () => {
  if (stepAccion === STEP_ACTION.SELECCIONAR_ZONA_BATALLA) {
    console.log(STEP_ACTION.ATACAR_CARTA)
    setStepAccion(STEP_ACTION.ATACAR_CARTA_SELECCIONAR_ZB_ENEMIGA)
    habilitacionBotonera()
    mensajeBotones.innerText = 'Seleccione objetivo...'
  }
})

btnColocarEnDefensa.addEventListener('click', () => {
  if (stepAccion === STEP_ACTION.SELECCIONAR_MANO) {
    setStepAccion(STEP_ACTION.COLOCAR_CARTA)
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(PosBatalla.DEF_ABAJO)
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})

btnColocarEnAtaque.addEventListener('click', () => {
  if (stepAccion === STEP_ACTION.SELECCIONAR_MANO) {
    setStepAccion(STEP_ACTION.COLOCAR_CARTA)
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(PosBatalla.ATAQUE)
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})

export function habilitacionBotonera () {
  if (jugDown.getAttribute('en-turno') === 'true') {
    btnColocarEnAtaque.classList.add('ocultar')
    btnColocarEnDefensa.classList.add('ocultar')
    btnAtacarCarta.classList.add('ocultar')
    btnAtacarBarrera.classList.add('ocultar')
    btnCambiarPosicion.classList.add('ocultar')
    btnTerminarTurno.classList.remove('ocultar')
  } else {
    btnColocarEnAtaque.classList.add('ocultar')
    btnColocarEnDefensa.classList.add('ocultar')
    btnAtacarCarta.classList.add('ocultar')
    btnAtacarBarrera.classList.add('ocultar')
    btnCambiarPosicion.classList.add('ocultar')
    btnTerminarTurno.classList.add('ocultar')
  }
  mensajeBotones.textContent = ''
}
