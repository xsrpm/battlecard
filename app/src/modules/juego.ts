import { EnemigoDesconectadoResponse, IniciarJuegoResponse, JugadorEnemigoResponse, JugadorResponse, TerminarTurnoResponse } from '../../../shared/types/response'
import { Carta } from './../../../shared/types/carta.d'
import { btnFinDeJuego, btnTerminarTurno, habilitacionBotonera } from './botonera.js'
import { message, setJuegoFinalizado, setNombreJugadorDerrotado, setNombreJugadorVictorioso, setSinBarrerasFlag } from './estadoGlobal'
import { info } from './info'
import { resultadoAtaque } from './resultado-ataque'
import { barreraEnemiga, barreraYo, jugDown, jugUp, manoEnemigo, manoYo, mostrarCartaCogida, mostrarJugadorEnTurno, quitarSeleccionEnCartas, zonaBatallaEnemiga, zonaBatallaYo } from './tablero'
import { cambiarPantalla } from './utils'

const juego = document.getElementById('juego') as HTMLDivElement

function inicializarJuego (message: IniciarJuegoResponse) {
  if (encuentraError()) return
  const jugador = message.payload.jugador as JugadorResponse
  const jugadorEnemigo = message.payload.jugadorEnemigo as JugadorEnemigoResponse
  for (let i = 0; i < jugador.nBarrera; i++) {
    barreraYo.children[i].classList.add('barrera')
  }
  (jugDown.querySelector("span[slot='jugadorNombre']") as HTMLHeadingElement).innerHTML = jugador.nombre;
  (jugDown.querySelector("span[slot='nCartas']") as HTMLHeadingElement).innerHTML = jugador.nDeck.toString()
  jugador.mano.forEach((c: Carta, i: number) => {
    manoYo.children[i].classList.add('mano')
    manoYo.children[i].children[0].innerHTML = c.valor.toString()
    manoYo.children[i].children[1].innerHTML = String.fromCharCode(c.elemento as any)
  })

  Array.from(zonaBatallaYo.children).forEach((el) => {
    el.classList.remove('ataque', 'defensa', 'oculto')
    el.children[0].innerHTML = ''
    el.children[1].innerHTML = ''
  })
  Array.from(zonaBatallaEnemiga.children).forEach((el) => {
    el.classList.remove('ataque', 'defensa', 'oculto')
    el.children[0].innerHTML = ''
    el.children[1].innerHTML = ''
  })
  for (let i = 0; i < jugadorEnemigo.nBarrera; i++) {
    barreraEnemiga.children[i].classList.add('barrera')
  }
  for (let i = 0; i < jugadorEnemigo.nMano; i++) {
    manoEnemigo.children[i].classList.add('oculto')
  }
  (jugUp.querySelector("span[slot='jugadorNombre']") as HTMLHeadingElement).innerHTML = jugadorEnemigo.nombre;
  (jugUp.querySelector("span[slot='nCartas']") as HTMLHeadingElement).textContent = jugadorEnemigo.nDeck.toString()
  btnTerminarTurno.classList.remove('ocultar')
  btnFinDeJuego.classList.add('ocultar')
  info.classList.remove('mostrarResultado')
  resultadoAtaque.setAttribute('mostrar', 'false')
  setSinBarrerasFlag(false)
  setJuegoFinalizado(false)
}

export function iniciarJuegoResponse (message: IniciarJuegoResponse) {
  if (encuentraError()) return
  inicializarJuego(message)
  mostrarJugadorEnTurno(message as TerminarTurnoResponse)
  habilitacionBotonera()
  cambiarPantalla(juego)
}

export function terminarTurno (message: TerminarTurnoResponse) {
  if (encuentraError()) return
  mostrarJugadorEnTurno(message)
  habilitacionBotonera()
  quitarSeleccionEnCartas()
  mostrarCartaCogida(message)
}

export function enemigoDesconectadoResponse (message: EnemigoDesconectadoResponse) {
  if (encuentraError()) return
  const { nombreJugadorVictorioso, nombreJugadorDerrotado, resultado } = message.payload
  setNombreJugadorVictorioso(nombreJugadorVictorioso)
  setNombreJugadorDerrotado(nombreJugadorDerrotado)
  info.children[0].innerHTML = resultado
  btnFinDeJuego.classList.remove('ocultar')
  btnTerminarTurno.classList.add('ocultar')
  info.classList.add('mostrarResultado')
  setJuegoFinalizado(true)
}

export function encuentraError () {
  if (typeof message.error !== 'undefined') {
    console.log(message.error)
    window.alert(message.error)
    return true
  }
  return false
}
