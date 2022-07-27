import './components/jugador-panel'
import './components/resultado-ataque'

import { cambiarPantalla } from './modules/utils'
import { btnAtacarBarrera, btnAtacarCarta, btnCambiarPosicion, btnColocarEnAtaque, btnColocarEnDefensa, btnFinDeJuego, btnTerminarTurno, habilitacionBotonera, mensajeBotones } from './modules/botonera'
import { nombreJugadorDerrotado, setNombreJugadorVictorioso, setNombreJugadorDerrotado, setStepAccion, stepAccion, setIdCartaZBSeleccionada, idCartaZBSeleccionada, posicionBatalla } from './modules/estadoGlobal'
import './modules/pantallaFinDeJuego'
import { initSocket, sendMessage } from './modules/socket'
import { Estado } from './modules/tablero'

const recepcion = document.getElementById('recepcion')
const sala = document.getElementById('sala')

const juego = document.getElementById('juego')

const h2 = sala.getElementsByTagName('h2')
const inNombreJugador = document.getElementById('inNombreJugador')
const btnUnirASala = document.getElementById('btnUnirASala')
const btnJugar = document.getElementById('btnJugar')
const btnIniciarJuego = document.getElementById('btnIniciarJuego')

const resultadoAtaque = document.querySelector('resultado-ataque')
const info = document.querySelector('.info')
const manoEnemigo = document.getElementById('manoEnemigo')
const manoYo = document.getElementById('manoYo')
export const zonaBatallaYo = document.getElementById('zonaBatallaYo')
const zonaBatallaEnemiga = document.getElementById('zonaBatallaEnemiga')
const barreraYo = document.getElementById('barreraYo')
const barreraEnemiga = document.getElementById('barreraEnemiga')
export const jugDown = document.getElementById('jugDown')
const jugUp = document.getElementById('jugUp')

console.log({ location })
console.log(process.env.NODE_ENV)

let url
if (process.env.NODE_ENV !== 'production') {
  url = 'ws://localhost:8080'
} else {
  if (location.protocol === 'http:' && location.hostname === 'localhost') {
    url = `ws://${location.host}/ws`
  } else {
    url = `wss://${location.host}/ws`
  }
}

let idCartaManoSeleccionada
let idCartaZBEnemigaSeleccionada
let cartaManoSeleccionada
let cartaZBSeleccionada

let message
// let nombreJugadorDerrotado
// let nombreJugadorVictorioso
let sinBarrerasFlag
let juegoFinalizado

// Visual Life Cicle (App)

// Visual Juego

function mostrarCartaCogida() {
  if (encuentraError()) return
  const { carta, resultado } = message.payload
  if (resultado === 'EXITO') {
    if (typeof carta !== 'undefined') {
      manoYo.children[4].children[0].innerText = carta.valor
      manoYo.children[4].children[1].innerText = String.fromCharCode(
        carta.elemento
      )
      manoYo.children[4].classList.add('mano')
    } else {
      manoEnemigo.children[4].classList.add('oculto')
    }
  } else if (resultado === 'DECK VACIO') {
    setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
    setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
    info.children[0].innerText = `${nombreJugadorDerrotado} se ha quedado sin cartas para tomar del deck`
    btnFinDeJuego.classList.remove('ocultar')
    btnTerminarTurno.classList.add('ocultar')
    info.classList.add('mostrarResultado')
  } else {
    console.log('MANO LLENA')
  }
}

function mostrarJugadorEnTurno() {
  if (encuentraError()) return
  if (message.payload.jugador.enTurno) {
    jugDown.setAttribute('en-turno', 'true')
    jugUp.setAttribute('en-turno', 'false')
  } else {
    jugUp.setAttribute('en-turno', 'true')
    jugDown.setAttribute('en-turno', 'false')
  }
  jugDown.querySelector("span[slot='nCartas']").textContent =
    message.payload.jugador.nDeck
  jugUp.querySelector("span[slot='nCartas']").textContent =
    message.payload.jugadorEnemigo.nDeck
}

function inicializarJuego() {
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
  sinBarrerasFlag = false
  juegoFinalizado = false
}

function encuentraError() {
  if (typeof message.error !== 'undefined') {
    console.log(message.error)
    window.alert(message.error)
    return true
  }
}

function unirASala() {
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

function iniciarJuego() {
  if (encuentraError()) return
  inicializarJuego()
  mostrarJugadorEnTurno()
  habilitacionBotonera()
  cambiarPantalla(juego)
}

function quitarSeleccionEnCartas() {
  Array.from(manoYo.children).forEach((e) => e.classList.remove('seleccionado'))
  Array.from(zonaBatallaYo.children).forEach((e) =>
    e.classList.remove('seleccionado')
  )
}

function terminarTurno() {
  if (encuentraError()) return
  mostrarJugadorEnTurno()
  habilitacionBotonera()
  quitarSeleccionEnCartas()
  mostrarCartaCogida()
}

function seleccionarMano() {
  if (encuentraError()) return
  const { existeCarta, puedeColocarCarta } = message.payload
  if (existeCarta) {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    cartaManoSeleccionada.classList.add('seleccionado')
    if (puedeColocarCarta === 'Posible') {
      btnColocarEnAtaque.classList.remove('ocultar')
      btnColocarEnDefensa.classList.remove('ocultar')
      mensajeBotones.innerText = 'Colocar carta en posición...'
    } else {
      mensajeBotones.innerText = puedeColocarCarta
    }
  }
}

function atacarCarta() {
  if (encuentraError()) return
  const {
    estadoAtaque,
    cartaAtacante,
    cartaAtacada,
    veredicto,
    estadoCartaAtacante,
    estadoCartaAtacada,
    estadoBarrera,
    idBarreraEliminada,
    bonifCartaAtacante,
    bonifCartaAtacada
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    resultadoAtaque.querySelector("span[slot='valor-atacante']").textContent =
      cartaAtacante.valor
    resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ).textContent = String.fromCharCode(cartaAtacante.elemento)
    resultadoAtaque.querySelector("span[slot='valor-atacado']").textContent =
      cartaAtacada.valor
    resultadoAtaque.querySelector("span[slot='elemento-atacado']").textContent =
      String.fromCharCode(cartaAtacada.elemento)
    resultadoAtaque.querySelector("span[slot='resultado']").textContent =
      veredicto
    resultadoAtaque.querySelector("span[slot='bonus-atacante']").textContent =
      '+' + bonifCartaAtacante
    resultadoAtaque.querySelector("span[slot='bonus-atacado']").textContent =
      '+' + bonifCartaAtacada
    if (estadoBarrera === 'DESTRUIDA') {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = 'Barrera destruida'
      barreraEnemiga.children[idBarreraEliminada].classList.remove('barrera')
      sinBarrerasFlag = message.payload.sinBarreras
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
        setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
        info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        juegoFinalizado = true
      }
    } else {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerText = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerText = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[0].innerText = ''
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[1].innerText = ''
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].classList.remove('ataque', 'defensa', 'oculto')
    } else {
      if (
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].classList.contains('oculto')
      ) {
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].classList.remove('oculto')
        zonaBatallaEnemiga.children[idCartaZBEnemigaSeleccionada].classList.add(
          'defensa'
        )
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].children[0].innerText = cartaAtacada.valor
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].children[1].innerText = String.fromCharCode(cartaAtacada.elemento)
      }
    }
    zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove(
      'seleccionado'
    )
    mensajeBotones.innerText = ''
    resultadoAtaque.setAttribute('mostrar', 'true')
  }
}
function atacanTuCarta() {
  if (encuentraError()) return
  const {
    estadoAtaque,
    cartaAtacante,
    cartaAtacada,
    veredicto,
    estadoCartaAtacante,
    estadoCartaAtacada,
    estadoBarrera,
    idBarreraEliminada,
    idCartaAtacante,
    idCartaAtacada,
    bonifCartaAtacante,
    bonifCartaAtacada
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    resultadoAtaque.querySelector("span[slot='valor-atacante']").textContent =
      cartaAtacante.valor
    resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ).textContent = String.fromCharCode(cartaAtacante.elemento)
    resultadoAtaque.querySelector("span[slot='valor-atacado']").textContent =
      cartaAtacada.valor
    resultadoAtaque.querySelector("span[slot='elemento-atacado']").textContent =
      String.fromCharCode(cartaAtacada.elemento)
    resultadoAtaque.querySelector("span[slot='resultado']").textContent =
      veredicto
    resultadoAtaque.querySelector("span[slot='bonus-atacante']").textContent =
      '+' + bonifCartaAtacante
    resultadoAtaque.querySelector("span[slot='bonus-atacado']").textContent =
      '+' + bonifCartaAtacada
    if (estadoBarrera === 'DESTRUIDA') {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = 'Barrera destruida'
      barreraYo.children[idBarreraEliminada].classList.remove('barrera')
      sinBarrerasFlag = message.payload.sinBarreras
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
        setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
        info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        juegoFinalizado = true
      }
    } else {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[idCartaAtacante].children[0].innerText = ''
      zonaBatallaEnemiga.children[idCartaAtacante].children[1].innerText = ''
      zonaBatallaEnemiga.children[idCartaAtacante].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaAtacada].children[0].innerText = ''
      zonaBatallaYo.children[idCartaAtacada].children[1].innerText = ''
      zonaBatallaYo.children[idCartaAtacada].classList.remove(
        'ataque',
        'defensa',
        'oculto'
      )
    }
    resultadoAtaque.setAttribute('mostrar', 'true')
  }
}

function atacarBarrera() {
  if (encuentraError()) return
  const { resultado, idBarreraEliminada } = message.payload
  if (resultado === 'Barrera destruida') {
    barreraEnemiga.children[idBarreraEliminada].classList.remove('barrera')
    sinBarrerasFlag = message.payload.sinBarreras
    habilitacionBotonera()
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
      setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
      info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      juegoFinalizado = true
    } else {
      info.children[0].innerText = 'Barrera destruida'
    }
    zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove(
      'seleccionado'
    )
    info.classList.add('mostrarResultado')
  }
}

function atacanTuBarrera() {
  if (encuentraError()) return
  const { resultado, idBarreraEliminada } = message.payload
  if (resultado === 'Barrera destruida') {
    barreraYo.children[idBarreraEliminada].classList.remove('barrera')
    sinBarrerasFlag = message.payload.sinBarreras
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
      setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
      info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      juegoFinalizado = true
    } else {
      info.children[0].innerText = 'Barrera destruida'
    }
    info.classList.add('mostrarResultado')
  }
}

function cambiarPosicion() {
  if (encuentraError()) return
  const { respuesta, posBatalla } = message.payload
  if (stepAccion !== 'CAMBIAR POSICION') {
    return
  }
  if (respuesta === 'Posicion cambiada') {
    if (posBatalla === 'Posición de batalla: Ataque') {
      zonaBatallaYo.children[idCartaZBSeleccionada].className = 'slot ataque'
    } else {
      zonaBatallaYo.children[idCartaZBSeleccionada].className = 'slot defensa'
    }
  }
}

function cambiaPosicionEnemigo() {
  if (encuentraError()) return
  const { respuesta, posBatalla, idZonaBatalla, carta } = message.payload
  if (respuesta === 'Posicion cambiada') {
    zonaBatallaEnemiga.children[idZonaBatalla].children[0].innerText =
      carta.valor
    zonaBatallaEnemiga.children[idZonaBatalla].children[1].innerText =
      String.fromCharCode(carta.elemento)
    if (posBatalla === 'Posición de batalla: Ataque') {
      zonaBatallaEnemiga.children[idZonaBatalla].className = 'slot ataque'
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla].className = 'slot defensa'
    }
  }
}

function enemigoDesconectado() {
  if (encuentraError()) return
  setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
  setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
  info.children[0].innerText = message.payload.resultado
  btnFinDeJuego.classList.remove('ocultar')
  btnTerminarTurno.classList.add('ocultar')
  info.classList.add('mostrarResultado')
  juegoFinalizado = true
}

btnJugar.addEventListener('click', () => {
  cambiarPantalla(recepcion)
})

const handleOpenSocket = (e) => {
  sendMessage({
    event: 'Unir a sala',
    payload: { nombreJugador: inNombreJugador.value }
  })
}

const handleMessageSocket = (e) => {
  console.log('received:')
  message = JSON.parse(e.data)
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

btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  initSocket(url, handleOpenSocket, handleMessageSocket, handleCloseSocket, handleErrorSocket)
})
btnIniciarJuego.addEventListener('click', () => {
  sendMessage({ event: 'Iniciar juego' })
})
resultadoAtaque.addEventListener('click', () => {
  resultadoAtaque.setAttribute('mostrar', 'false')
  if (sinBarrerasFlag) {
    info.classList.add('mostrarResultado')
  }
})

manoYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugDown.getAttribute('en-turno') === 'false') return
  /**
   * @type {HTMLElement}
   */
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  idCartaManoSeleccionada = target.dataset.id
  cartaManoSeleccionada = target
  if (target.classList.contains('mano')) {
    setStepAccion('SELECCIONAR MANO')
    console.log('stepAccion: ' + stepAccion)
    console.log(target)
    sendMessage({
      event: 'Seleccionar Mano',
      payload: {
        idMano: idCartaManoSeleccionada
      }
    })
  }
})

function colocarSeleccionarZonaBatalla() {
  if (encuentraError()) return
  if (message.payload.resultado === 'Carta colocada') {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    const manoNumeroCarta =
      manoYo.children[idCartaManoSeleccionada].children[0].innerText
    const manoElementoCarta =
      manoYo.children[idCartaManoSeleccionada].children[1].innerText
    const ULTIMA_CARTA = 4
    message.payload.mano.forEach((c, i) => {
      manoYo.children[i].children[0].innerText = c.valor
      manoYo.children[i].children[1].innerText = String.fromCharCode(c.elemento)
    })
    manoYo.children[ULTIMA_CARTA].children[0].innerText = ''
    manoYo.children[ULTIMA_CARTA].children[1].innerText = ''
    manoYo.children[ULTIMA_CARTA].classList.remove('mano')
    zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerText =
      manoNumeroCarta
    zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerText =
      manoElementoCarta
    if (posicionBatalla === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('ataque')
    } else {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('defensa')
    }
    setStepAccion('STAND BY')
    console.log('CARTA COLOCADA')
  }
}

function colocaCartaOtroJugador() {
  if (encuentraError()) return
  const { posicion, idZonaBatalla, idMano, resultado, carta } = message.payload
  if (resultado === 'Carta colocada') {
    habilitacionBotonera()
    manoEnemigo.children[idMano].classList.remove('oculto')
    if (posicion === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('ataque')
      const manoNumeroCarta = carta.valor
      const manoElementoCarta = String.fromCharCode(carta.elemento)
      zonaBatallaEnemiga.children[idZonaBatalla].children[0].innerText =
        manoNumeroCarta
      zonaBatallaEnemiga.children[idZonaBatalla].children[1].innerText =
        manoElementoCarta
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('oculto')
    }
    setStepAccion('STAND BY')
    console.log('CARTA COLOCADA POR ENEMIGO')
  }
}

function standBySeleccionarZonaBatalla() {
  if (encuentraError()) return
  const {
    existeCarta,
    puedeAtacarCarta,
    puedeAtacarBarrera,
    puedeCambiarPosicion
  } = message.payload
  if (existeCarta) {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    cartaZBSeleccionada.classList.add('seleccionado')
    if (
      puedeAtacarCarta === 'Posible' ||
      puedeAtacarBarrera === 'Posible' ||
      puedeCambiarPosicion === 'Posible'
    ) {
      mensajeBotones.innerText = 'Seleccione acción'
    } else mensajeBotones.innerText = 'No acciones disponibles'
    if (puedeAtacarCarta === 'Posible') {
      btnAtacarCarta.classList.remove('ocultar')
    }
    if (puedeAtacarBarrera === 'Posible') {
      btnAtacarBarrera.classList.remove('ocultar')
    }
    if (puedeCambiarPosicion === 'Posible') {
      btnCambiarPosicion.classList.remove('ocultar')
    }
  }
}

zonaBatallaYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugDown.getAttribute('en-turno') === 'false') return
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  setIdCartaZBSeleccionada(target.dataset.id)
  cartaZBSeleccionada = target
  if (stepAccion === 'COLOCAR SELECCIONAR ZONA BATALLA') {
    if (
      !(
        target.classList.contains('ataque') ||
        target.classList.contains('defensa') ||
        target.classList.contains('oculto')
      )
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log(target)
      sendMessage({
        event: 'Colocar Carta',
        payload: {
          posicion: posicionBatalla,
          idZonaBatalla: idCartaZBSeleccionada,
          idMano: idCartaManoSeleccionada
        }
      })
    }
  } else {
    if (
      target.classList.contains('ataque') ||
      target.classList.contains('defensa') ||
      target.classList.contains('oculto')
    ) {
      setStepAccion('SELECCIONAR ZONA BATALLA')
      console.log('stepAccion: ' + stepAccion)
      console.log(target)

      sendMessage({
        event: 'Seleccionar Zona Batalla',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada
        }
      })
    }
  }
})
zonaBatallaEnemiga.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  if (stepAccion === 'ATACAR CARTA SELECCIONAR ZB ENEMIGA') {
    if (
      target.classList.contains('ataque') ||
      target.classList.contains('defensa') ||
      target.classList.contains('oculto')
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log('target: ' + target)
      idCartaZBEnemigaSeleccionada = target.dataset.id
      sendMessage({
        event: 'Atacar Carta',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada,
          idZonaBatallaEnemiga: idCartaZBEnemigaSeleccionada
        }
      })
    }
  }
})

info.addEventListener('click', function (e) {
  info.classList.remove('mostrarResultado')
})
