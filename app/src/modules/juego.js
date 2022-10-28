import { btnFinDeJuego, btnTerminarTurno, habilitacionBotonera } from './botonera.js'
import { message, setJuegoFinalizado, setNombreJugadorDerrotado, setNombreJugadorVictorioso, setSinBarrerasFlag } from './estadoGlobal'
import { info } from './info'
import { resultadoAtaque } from './resultado-ataque'
import { barreraEnemiga, barreraYo, jugDown, jugUp, manoEnemigo, manoYo, mostrarCartaCogida, mostrarJugadorEnTurno, quitarSeleccionEnCartas, zonaBatallaEnemiga, zonaBatallaYo } from './tablero'
import { cambiarPantalla } from './utils'

const juego = document.getElementById('juego')

function inicializarJuego () {
  if (encuentraError()) return
  for (let i = 0; i < message.payload.jugador.nBarrera; i++) {
    barreraYo.children[i].classList.add('barrera')
  }
  jugDown.querySelector("span[slot='jugadorNombre']").textContent =
      message.payload.jugador.nombre
  jugDown.querySelector("span[slot='nCartas']").textContent =
      message.payload.jugador.nDeck
  message.payload.jugador.mano.forEach((c, i) => {
    manoYo.children[i].classList.add('mano')
    manoYo.children[i].children[0].innerText = c.valor
    manoYo.children[i].children[1].innerText = String.fromCharCode(c.elemento)
  })

  Array.from(zonaBatallaYo.children).forEach((el) => {
    el.classList.remove('ataque', 'defensa', 'oculto')
    el.children[0].innerText = ''
    el.children[1].innerText = ''
  })
  Array.from(zonaBatallaEnemiga.children).forEach((el) => {
    el.classList.remove('ataque', 'defensa', 'oculto')
    el.children[0].innerText = ''
    el.children[1].innerText = ''
  })
  for (let i = 0; i < message.payload.jugadorEnemigo.nBarrera; i++) {
    barreraEnemiga.children[i].classList.add('barrera')
  }
  for (let i = 0; i < message.payload.jugadorEnemigo.nMano; i++) {
    manoEnemigo.children[i].classList.add('oculto')
  }
  jugUp.querySelector("span[slot='jugadorNombre']").textContent =
      message.payload.jugadorEnemigo.nombre
  jugUp.querySelector("span[slot='nCartas']").textContent =
      message.payload.jugadorEnemigo.nDeck
  btnTerminarTurno.classList.remove('ocultar')
  btnFinDeJuego.classList.add('ocultar')
  info.classList.remove('mostrarResultado')
  resultadoAtaque.setAttribute('mostrar', 'false')
  setSinBarrerasFlag(false)
  setJuegoFinalizado(false)
}

export function iniciarJuego () {
  if (encuentraError()) return
  inicializarJuego()
  mostrarJugadorEnTurno()
  habilitacionBotonera()
  cambiarPantalla(juego)
}

export function terminarTurno () {
  if (encuentraError()) return
  mostrarJugadorEnTurno()
  habilitacionBotonera()
  quitarSeleccionEnCartas()
  mostrarCartaCogida()
}

export function enemigoDesconectado () {
  if (encuentraError()) return
  setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
  setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
  info.children[0].innerText = message.payload.resultado
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
}
