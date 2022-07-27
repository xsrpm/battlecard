import { cambiarPantalla } from './utils'
import { nombreJugadorVictorioso, nombreJugadorDerrotado, idCartaZBSeleccionada, stepAccion, setStepAccion, posicionBatalla, setPosicionBatalla } from './estadoGlobal'
import { sendMessage } from './socket'
import { colocarCarta, Estado } from './tablero'
import { jugDown } from '..'

export const btnFinDeJuego = document.getElementById('btnFinDeJuego')
export const finDeJuego = document.getElementById('finDeJuego')
export const btnTerminarTurno = document.getElementById('btnTerminarTurno')
export const btnCambiarPosicion = document.getElementById('btnCambiarPosicion')
export const btnAtacarBarrera = document.getElementById('btnAtacarBarrera')
export const btnAtacarCarta = document.getElementById('btnAtacarCarta')
export const mensajeBotones = document.getElementById('mensajeBotones')
export const btnColocarEnDefensa = document.getElementById('btnColocarEnDefensa')
export const btnColocarEnAtaque = document.getElementById('btnColocarEnAtaque')

btnFinDeJuego.addEventListener('click', function () {
  finDeJuego.children[0].children[1].innerText = nombreJugadorVictorioso
  finDeJuego.children[1].children[1].innerText = nombreJugadorDerrotado
  cambiarPantalla(finDeJuego)
})

btnTerminarTurno.addEventListener('click', () => {
  sendMessage({ event: 'Terminar Turno' })
})

btnCambiarPosicion.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR ZONA BATALLA') {
    console.log('CAMBIAR POSICION')
    setStepAccion('CAMBIAR POSICION')
    habilitacionBotonera()
    sendMessage({
      event: 'Cambiar Posicion',
      payload: {
        idZonaBatalla: idCartaZBSeleccionada
      }
    })
  }
})

btnAtacarBarrera.addEventListener('click', () => {
  sendMessage({
    event: 'Atacar Barrera',
    payload: {
      idZonaBatalla: idCartaZBSeleccionada
    }
  })
})

btnAtacarCarta.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR ZONA BATALLA') {
    console.log('ATACAR CARTA')
    setStepAccion('ATACAR CARTA SELECCIONAR ZB ENEMIGA')
    habilitacionBotonera()
    mensajeBotones.innerText = 'Seleccione objetivo...'
  }
})

btnColocarEnDefensa.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR MANO') {
    stepAccion('COLOCAR CARTA')
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(Estado.POS_BATALLA_DEF_ABAJO)
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})

btnColocarEnAtaque.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR MANO') {
    setStepAccion('COLOCAR CARTA')
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(Estado.POS_BATALLA_ATAQUE)
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})

export function habilitacionBotonera() {
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
