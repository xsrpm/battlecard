import { AtacarBarreraResponse, AtacarCartaResponse, CambiarPosicionResponse, ColocarCartaOtroJugadorResponse, ColocarCartaResponse, EnemigoDesconectadoResponse, IniciarJuegoResponse, SeleccionarManoResponse, SeleccionarZonaBatallaResponse, TerminarTurnoResponse, UnirASalaResponse } from './../../../shared/types/response.d'
import { message, setMessage } from './estadoGlobal'
import { encuentraError, enemigoDesconectadoResponse, iniciarJuegoResponse, terminarTurno as terminarTurnoResponse } from './juego'
import { inNombreJugador, recepcion } from './recepcion'
import { initSocket, sendMessage } from './socket'
import { atacanTuBarreraResponse, atacanTuCartaResponse, atacarBarreraResponse, atacarCartaResponse, cambiaPosicionEnemigoResponse, cambiarPosicionResponse, colocaCartaOtroJugadorResponse, colocarCartaResponse, seleccionarManoResponse, seleccionarZonaBatallaResponse } from './tablero'
import { cambiarPantalla } from './utils'

const btnIniciarJuego = document.getElementById('btnIniciarJuego') as HTMLButtonElement
const sala = document.getElementById('sala') as HTMLDivElement
const h2 = sala.getElementsByTagName('h2')
const btnUnirASala = document.getElementById('btnUnirASala') as HTMLButtonElement

function unirASalaResponse (message: UnirASalaResponse) {
  const { jugadores, iniciar } = message.payload
  h2[0].innerText = '(Sin Jugador)'
  h2[1].innerText = '(Sin Jugador)'
  if (encuentraError()) return
  for (let i = 0; i < jugadores.length; i++) {
    h2[i].innerText = jugadores[i]
  }
  iniciar
    ? (btnIniciarJuego.disabled = false)
    : (btnIniciarJuego.disabled = true)
  cambiarPantalla(sala)
}

btnIniciarJuego?.addEventListener('click', () => {
  sendMessage({ event: 'Iniciar juego' })
})

btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  initSocket(handleOpenSocket, handleMessageSocket, handleCloseSocket, handleErrorSocket)
})

const handleErrorSocket = (e: any) => {
  if (recepcion.classList.contains('mostrarPantalla')) {
    btnUnirASala.innerText = 'Unirse a la Sala'
    btnUnirASala.setAttribute('disabled', 'false')
  }
  console.log('Error: ' + (e as string))
}

const handleCloseSocket = (e: any) => {
  console.log('close ws' + (e as string))
}

const handleOpenSocket = () => {
  sendMessage({
    event: 'Unir a sala',
    payload: { nombreJugador: inNombreJugador.value }
  })
}

const handleMessageSocket = (e: any) => {
  console.log('received:')
  setMessage(JSON.parse(e.data))
  console.log(message)
  switch (message.event) {
    case 'Unir a sala':
      unirASalaResponse(message as UnirASalaResponse)
      break
    case 'Iniciar juego':
      iniciarJuegoResponse(message as IniciarJuegoResponse)
      break
    case 'Colocar Carta':
      colocarCartaResponse(message as ColocarCartaResponse)
      break
    case 'Coloca Carta Otro Jugador':
      colocaCartaOtroJugadorResponse(message as ColocarCartaOtroJugadorResponse)
      break
    case 'Seleccionar Zona Batalla':
      seleccionarZonaBatallaResponse(message as SeleccionarZonaBatallaResponse)
      break
    case 'Seleccionar Mano':
      seleccionarManoResponse(message as SeleccionarManoResponse)
      break
    case 'Atacar Carta':
      atacarCartaResponse(message as AtacarCartaResponse)
      break
    case 'Atacar Barrera':
      atacarBarreraResponse(message as AtacarBarreraResponse)
      break
    case 'Atacan Tu Carta':
      atacanTuCartaResponse(message as AtacarCartaResponse)
      break
    case 'Atacan Tu Barrera':
      atacanTuBarreraResponse(message as AtacarBarreraResponse)
      break
    case 'Cambiar Posicion':
      cambiarPosicionResponse(message as CambiarPosicionResponse)
      break
    case 'Cambia Posicion Enemigo':
      cambiaPosicionEnemigoResponse(message as CambiarPosicionResponse)
      break
    case 'Terminar Turno':
      terminarTurnoResponse(message as TerminarTurnoResponse)
      break
    case 'Enemigo Desconectado':
      enemigoDesconectadoResponse(message as EnemigoDesconectadoResponse)
      break
  }
}
