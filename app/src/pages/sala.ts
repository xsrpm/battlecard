import { type UnirASalaResponse, type JugadorDesconectadoResponse } from '../../../api/src/response'
import { setJugadorId, jugadorId } from '../modules/estadoGlobal'
import { encuentraError } from '../modules/socket'
import { iniciarJuego } from '../modules/socket-messages'
import { cambiarPantalla } from '../modules/utils'

const btnIniciarJuego = document.getElementById('btnIniciarJuego') as HTMLButtonElement
const sala = document.getElementById('sala') as HTMLDivElement
const h2 = sala.getElementsByTagName('h2')

export function unirASalaResponse (message: UnirASalaResponse): void {
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
  iniciarJuego(jugadorId)
})

export function jugadorDesconectadoResponse (message: JugadorDesconectadoResponse): void {
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
