import { unirASalaSocket } from '../modules/socket-action-handler'

export const recepcion = document.getElementById('recepcion') as HTMLDivElement
export const inNombreJugador: HTMLInputElement = document.getElementById('inNombreJugador') as HTMLInputElement
const btnUnirASala = document.getElementById('btnUnirASala') as HTMLButtonElement

btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  unirASalaSocket(inNombreJugador.value, unirASalaOnError)
})

function unirASalaOnError() {
  if (recepcion.classList.contains('mostrarPantalla')) {
    btnUnirASala.innerText = 'Unirse a la Sala'
    btnUnirASala.setAttribute('disabled', 'false')
  }
}
