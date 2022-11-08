import { cambiarPantalla } from './utils'
import { nombreJugadorVictorioso, nombreJugadorDerrotado, idCartaZBSeleccionada, stepAccion, setStepAccion, posicionBatalla, setPosicionBatalla, jugadorId } from './estadoGlobal'
import { sendMessage } from './socket'
import { colocarCarta, jugDown } from './tablero'
import { PosBatalla } from '../constants/celdabatalla'

export const btnFinDeJuego = document.getElementById('btnFinDeJuego') as HTMLButtonElement
export const finDeJuego = document.getElementById('finDeJuego') as HTMLDivElement
export const btnTerminarTurno = document.getElementById('btnTerminarTurno') as HTMLButtonElement
export const btnCambiarPosicion = document.getElementById('btnCambiarPosicion') as HTMLButtonElement
export const btnAtacarBarrera = document.getElementById('btnAtacarBarrera') as HTMLButtonElement
export const btnAtacarCarta = document.getElementById('btnAtacarCarta') as HTMLButtonElement
export const mensajeBotones = document.getElementById('mensajeBotones') as HTMLParagraphElement
export const btnColocarEnDefensa = document.getElementById('btnColocarEnDefensa') as HTMLButtonElement
export const btnColocarEnAtaque = document.getElementById('btnColocarEnAtaque') as HTMLButtonElement

btnFinDeJuego.addEventListener('click', function () {
  finDeJuego.children[0].children[1].innerHTML = nombreJugadorVictorioso
  finDeJuego.children[1].children[1].innerHTML = nombreJugadorDerrotado
  cambiarPantalla(finDeJuego)
})

btnTerminarTurno.addEventListener('click', () => {
  sendMessage({
    event: 'Terminar Turno',
    payload: {
      jugadorId
    }
  })
})

btnCambiarPosicion.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR ZONA BATALLA') {
    console.log('CAMBIAR POSICION')
    setStepAccion('CAMBIAR POSICION')
    habilitacionBotonera()
    sendMessage({
      event: 'Cambiar Posicion',
      payload: {
        jugadorId,
        idZonaBatalla: idCartaZBSeleccionada
      }
    })
  }
})

btnAtacarBarrera.addEventListener('click', () => {
  sendMessage({
    event: 'Atacar Barrera',
    payload: {
      jugadorId,
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
    setStepAccion('COLOCAR CARTA')
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(PosBatalla.DEF_ABAJO)
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})

btnColocarEnAtaque.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR MANO') {
    setStepAccion('COLOCAR CARTA')
    console.log('stepAccion: ' + stepAccion)
    setPosicionBatalla(PosBatalla.ATAQUE)
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