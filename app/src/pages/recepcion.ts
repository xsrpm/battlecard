
import { initSocket, sendMessage } from '../modules/socket'
import { handleMessageSocket } from '../modules/socket-action-handler'

export const recepcion = document.getElementById('recepcion') as HTMLDivElement
export const inNombreJugador: HTMLInputElement = document.getElementById('inNombreJugador') as HTMLInputElement
const btnUnirASala = document.getElementById('btnUnirASala') as HTMLButtonElement

btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  initSocket(handleOpenSocket, handleMessageSocket, handleCloseSocket, handleErrorSocket)
})

const handleOpenSocket = () => {
  sendMessage({
    event: 'Unir a sala',
    payload: { nombreJugador: inNombreJugador.value }
  })
}

const handleCloseSocket = (e: any) => {
  console.log('close ws' + (e as string))
}

const handleErrorSocket = (e: any) => {
  if (recepcion.classList.contains('mostrarPantalla')) {
    btnUnirASala.innerText = 'Unirse a la Sala'
    btnUnirASala.setAttribute('disabled', 'false')
  }
  console.log('Error: ' + (e as string))
}
