import { message, setMessage } from './estadoGlobal'
import { encuentraError, enemigoDesconectado, iniciarJuego, terminarTurno } from './juego'
import { inNombreJugador, recepcion } from './recepcion'
import { initSocket, sendMessage } from './socket'
import { atacanTuBarrera, atacanTuCarta, atacarBarrera, atacarCarta, cambiaPosicionEnemigo, cambiarPosicion, colocaCartaOtroJugador, colocarSeleccionarZonaBatalla, seleccionarMano, standBySeleccionarZonaBatalla } from './tablero'
import { cambiarPantalla } from './utils'

const btnIniciarJuego = document.getElementById('btnIniciarJuego')
const sala = document.getElementById('sala')
const h2 = sala.getElementsByTagName('h2')
const btnUnirASala = document.getElementById('btnUnirASala')

function unirASala () {
  h2[0].innerText = '(Sin Jugador)'
  h2[1].innerText = '(Sin Jugador)'
  if (encuentraError()) return
  for (let i = 0; i < message.payload.jugadores.length; i++) {
    h2[i].innerText = message.payload.jugadores[i]
  }
  message.payload.iniciar === true
    ? (btnIniciarJuego.disabled = false)
    : (btnIniciarJuego.disabled = true)
  cambiarPantalla(sala)
}

btnIniciarJuego.addEventListener('click', () => {
  sendMessage({ event: 'Iniciar juego' })
})

btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  initSocket(handleOpenSocket, handleMessageSocket, handleCloseSocket, handleErrorSocket)
})

const handleErrorSocket = (e) => {
  if (recepcion.classList.contains('mostrarPantalla')) {
    btnUnirASala.innerText = 'Unirse a la Sala'
    btnUnirASala.setAttribute('disabled', 'false')
  }
  console.log('Error: ' + e)
}

const handleCloseSocket = (e) => {
  console.log('close ws' + e)
}

const handleOpenSocket = (e) => {
  sendMessage({
    event: 'Unir a sala',
    payload: { nombreJugador: inNombreJugador.value }
  })
}

const handleMessageSocket = (e) => {
  console.log('received:')
  setMessage(JSON.parse(e.data))
  console.log(message)
  switch (message.event) {
    case 'Unir a sala':
      unirASala()
      break
    case 'Iniciar juego':
      iniciarJuego()
      break
    case 'Colocar Carta':
      colocarSeleccionarZonaBatalla()
      break
    case 'Coloca Carta Otro Jugador':
      colocaCartaOtroJugador()
      break
    case 'Seleccionar Zona Batalla':
      standBySeleccionarZonaBatalla()
      break
    case 'Seleccionar Mano':
      seleccionarMano()
      break
    case 'Atacar Carta':
      atacarCarta()
      break
    case 'Atacar Barrera':
      atacarBarrera()
      break
    case 'Atacan Tu Carta':
      atacanTuCarta()
      break
    case 'Atacan Tu Barrera':
      atacanTuBarrera()
      break
    case 'Cambiar Posicion':
      cambiarPosicion()
      break
    case 'Cambia Posicion Enemigo':
      cambiaPosicionEnemigo()
      break
    case 'Terminar Turno':
      terminarTurno()
      break
    case 'Enemigo Desconectado':
      enemigoDesconectado()
      break
  }
}
