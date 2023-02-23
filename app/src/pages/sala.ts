import { UnirASalaResponse, JugadorDesconectadoResponse } from '../../../shared/types/response'
import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { setJugadorId, jugadorId } from '../modules/estadoGlobal'
import { encuentraError, sendMessage } from '../modules/socket'
import { cambiarPantalla } from '../modules/utils'

const btnIniciarJuego = document.getElementById('btnIniciarJuego') as HTMLButtonElement
const sala = document.getElementById('sala') as HTMLDivElement
const h2 = sala.getElementsByTagName('h2')

export function unirASalaResponse (message: UnirASalaResponse) {
  if (encuentraError(message)) return
  const { jugadores, iniciar, jugadorId } = message.payload
  h2[0].innerText = '(Sin Jugador)'
  h2[1].innerText = '(Sin Jugador)'
  if (jugadorId !== undefined) setJugadorId(jugadorId)
  for (let i = 0; i < jugadores.length; i++) {
    h2[i].innerText = jugadores[i]
  }
  iniciar
    ? (btnIniciarJuego.disabled = false)
    : (btnIniciarJuego.disabled = true)
  cambiarPantalla(sala)
}

btnIniciarJuego?.addEventListener('click', () => {
  sendMessage({
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      jugadorId
    }
  })
})

export function jugadorDesconectadoResponse(message: JugadorDesconectadoResponse) {
  if (encuentraError(message)) return
  const { resultado, jugadores, iniciar } = message.payload

  h2[0].innerText = '(Sin Jugador)'
  h2[1].innerText = '(Sin Jugador)'
  for (let i = 0; i < jugadores.length; i++) {
    h2[i].innerText = jugadores[i]
  }
  iniciar ? (btnIniciarJuego.disabled = false) : (btnIniciarJuego.disabled = true)
  console.log(resultado)
}
