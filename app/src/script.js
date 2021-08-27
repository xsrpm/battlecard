import './components/jugador-panel'
import './components/resultado-ataque'

const pantallas = document.querySelectorAll('body > div')
const bienvenida = document.getElementById('bienvenida')
const recepcion = document.getElementById('recepcion')
const sala = document.getElementById('sala')

const juego = document.getElementById('juego')
const finDeJuego = document.getElementById('finDeJuego')
const h2 = sala.getElementsByTagName('h2')
const inNombreJugador = document.getElementById('inNombreJugador')
const btnUnirASala = document.getElementById('btnUnirASala')
const btnJugar = document.getElementById('btnJugar')
const btnIniciarJuego = document.getElementById('btnIniciarJuego')
const mensajeBotones = document.getElementById('mensajeBotones')
const btnColocarEnAtaque = document.getElementById('btnColocarEnAtaque')
const btnColocarEnDefensa = document.getElementById('btnColocarEnDefensa')
const btnAtacarCarta = document.getElementById('btnAtacarCarta')
const btnAtacarBarrera = document.getElementById('btnAtacarBarrera')
const btnCambiarPosicion = document.getElementById('btnCambiarPosicion')
const btnTerminarTurno = document.getElementById('btnTerminarTurno')
const btnFinDeJuego = document.getElementById('btnFinDeJuego')
const btnVolverInicio = document.getElementById('btnVolverInicio')
const resultadoAtaque = document.querySelector('resultado-ataque')
const info = document.querySelector('.info')
const manoEnemigo = document.getElementById('manoEnemigo')
const manoYo = document.getElementById('manoYo')
const zonaBatallaYo = document.getElementById('zonaBatallaYo')
const zonaBatallaEnemiga = document.getElementById('zonaBatallaEnemiga')
const barreraYo = document.getElementById('barreraYo')
const barreraEnemiga = document.getElementById('barreraEnemiga')
const jugYo = document.getElementById('jugYo')
const jugEnemigo = document.getElementById('jugEnemigo')

const Estado = {
  NO_HAY_CARTA: 'No hay carta',
  POS_BATALLA_ATAQUE: 'Posición de batalla: Ataque',
  POS_BATALLA_DEF_ARRIBA: 'Posición de batalla: Defensa cara arriba',
  POS_BATALLA_DEF_ABAJO: 'Posición de batalla: Defensa cara abajo',
  YA_ESTA_EN_POSICION_SOLICITADA: 'Ya se está en la posición solicitada',
  ATAQUE_NO_DISPONIBLE: 'Atacar carta no disponible',
  ATAQUE_DISPONIBLE: 'Atacar carta disponible',
  CAMBIO_POS_NO_DISPONIBLE: 'Cambio de posición no disponible',
  CAMBIO_POS_DISPONIBLE: 'Cambio de posición disponible'
}

console.log(window.location.host)
const url = `${process.env.WEBSOCKET_URL}/ws`

let socket
let idCartaManoSeleccionada
let idCartaZBSeleccionada
let idCartaZBEnemigaSeleccionada
let cartaManoSeleccionada
let cartaZBSeleccionada
let stepAccion = 'STAND BY'
let posicionBatalla
let message
let nombreJugadorDerrotado
let nombreJugadorVictorioso
let sinBarrerasFlag
let juegoFinalizado

// Visual Life Cicle (App)
/**
 *
 * @param {HTMLElement} pantalla
 */
function cambiarPantalla(pantalla) {
  Array.from(pantallas).forEach((p) => {
    p.classList.remove('mostrarPantalla')
  })
  pantalla.classList.add('mostrarPantalla')
}

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
    nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
    nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
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
    jugYo.setAttribute('en-turno', 'true')
    jugEnemigo.setAttribute('en-turno', 'false')
  } else {
    jugEnemigo.setAttribute('en-turno', 'true')
    jugYo.setAttribute('en-turno', 'false')
  }
  jugYo.querySelector("span[slot='nCartas']").textContent =
    message.payload.jugador.nDeck
  jugEnemigo.querySelector("span[slot='nCartas']").textContent =
    message.payload.jugadorEnemigo.nDeck
}

function inicializarJuego() {
  if (encuentraError()) return
  for (let i = 0; i < message.payload.jugador.nBarrera; i++) {
    barreraYo.children[i].classList.add('barrera')
  }
  jugYo.querySelector("span[slot='jugadorNombre']").textContent =
    message.payload.jugador.nombre
  jugYo.querySelector("span[slot='nCartas']").textContent =
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
  jugEnemigo.querySelector("span[slot='jugadorNombre']").textContent =
    message.payload.jugadorEnemigo.nombre
  jugEnemigo.querySelector("span[slot='nCartas']").textContent =
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

function habilitacionBotonera() {
  if (jugYo.getAttribute('en-turno') === 'true') {
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

function sendMessage() {
  socket.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

function colocarCarta() {
  habilitacionBotonera()
  mensajeBotones.innerText = 'Seleccione ubicación en zona de batalla...'
  for (const celda of zonaBatallaYo.children) {
    if (
      !celda.classList.contains('ataque') &&
      !celda.classList.contains('defensa')
    ) {
      celda.classList.add('seleccionado')
    }
  }
  stepAccion = 'COLOCAR SELECCIONAR ZONA BATALLA'
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
        nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
        nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
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
        nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
        nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
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
      nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
      nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
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
      nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
      nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
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
  nombreJugadorVictorioso = message.payload.nombreJugadorVictorioso
  nombreJugadorDerrotado = message.payload.nombreJugadorDerrotado
  info.children[0].innerText = message.payload.resultado
  btnFinDeJuego.classList.remove('ocultar')
  btnTerminarTurno.classList.add('ocultar')
  info.classList.add('mostrarResultado')
  juegoFinalizado = true
}

btnJugar.addEventListener('click', () => {
  cambiarPantalla(recepcion)
})
btnUnirASala.addEventListener('click', () => {
  if (inNombreJugador.value === '') return
  socket = new WebSocket(url)
  socket.onopen = (e) => {
    message = {
      event: 'Unir a sala',
      payload: { nombreJugador: inNombreJugador.value }
    }
    sendMessage()
  }
  socket.onmessage = (e) => {
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
  socket.onerror = (e) => {
    if (recepcion.classList.contains('mostrarPantalla')) {
      btnUnirASala.innerText = 'Unirse a la Sala'
      btnUnirASala.setAttribute('disabled', 'false')
    }
    console.log('Error: ' + e)
  }
  socket.onclose = (e) => {
    console.log('close ws' + e)
  }
})
btnIniciarJuego.addEventListener('click', () => {
  message = { event: 'Iniciar juego' }
  sendMessage()
})
resultadoAtaque.addEventListener('click', () => {
  resultadoAtaque.setAttribute('mostrar', 'false')
  if (sinBarrerasFlag) {
    info.classList.add('mostrarResultado')
  }
})

btnColocarEnAtaque.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR MANO') {
    stepAccion = 'COLOCAR CARTA'
    console.log('stepAccion: ' + stepAccion)
    posicionBatalla = Estado.POS_BATALLA_ATAQUE
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})
btnColocarEnDefensa.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR MANO') {
    stepAccion = 'COLOCAR CARTA'
    console.log('stepAccion: ' + stepAccion)
    posicionBatalla = Estado.POS_BATALLA_DEF_ABAJO
    console.log('posicionBatalla: ' + posicionBatalla)
    colocarCarta()
  }
})
btnAtacarCarta.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR ZONA BATALLA') {
    console.log('ATACAR CARTA')
    stepAccion = 'ATACAR CARTA SELECCIONAR ZB ENEMIGA'
    habilitacionBotonera()
    mensajeBotones.innerText = 'Seleccione objetivo...'
  }
})
btnAtacarBarrera.addEventListener('click', () => {
  message = {
    event: 'Atacar Barrera',
    payload: {
      idZonaBatalla: idCartaZBSeleccionada
    }
  }
  sendMessage()
})
btnCambiarPosicion.addEventListener('click', () => {
  if (stepAccion === 'SELECCIONAR ZONA BATALLA') {
    console.log('CAMBIAR POSICION')
    stepAccion = 'CAMBIAR POSICION'
    habilitacionBotonera()
    message = {
      event: 'Cambiar Posicion',
      payload: {
        idZonaBatalla: idCartaZBSeleccionada
      }
    }
    sendMessage()
  }
})
btnTerminarTurno.addEventListener('click', () => {
  message = { event: 'Terminar Turno' }
  sendMessage()
})

manoYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugYo.getAttribute('en-turno') === 'false') return
  /**
   * @type {HTMLElement}
   */
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  idCartaManoSeleccionada = target.dataset.id
  cartaManoSeleccionada = target
  if (target.classList.contains('mano')) {
    stepAccion = 'SELECCIONAR MANO'
    console.log('stepAccion: ' + stepAccion)
    console.log(target)
    message = {
      event: 'Seleccionar Mano',
      payload: {
        idMano: idCartaManoSeleccionada
      }
    }
    sendMessage()
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
    stepAccion = 'STAND BY'
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
    stepAccion = 'STAND BY'
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
  if (jugYo.getAttribute('en-turno') === 'false') return
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  idCartaZBSeleccionada = target.dataset.id
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
      message = {
        event: 'Colocar Carta',
        payload: {
          posicion: posicionBatalla,
          idZonaBatalla: idCartaZBSeleccionada,
          idMano: idCartaManoSeleccionada
        }
      }
      sendMessage()
    }
  } else {
    if (
      target.classList.contains('ataque') ||
      target.classList.contains('defensa') ||
      target.classList.contains('oculto')
    ) {
      stepAccion = 'SELECCIONAR ZONA BATALLA'
      console.log('stepAccion: ' + stepAccion)
      console.log(target)

      message = {
        event: 'Seleccionar Zona Batalla',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada
        }
      }
      sendMessage()
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
      message = {
        event: 'Atacar Carta',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada,
          idZonaBatallaEnemiga: idCartaZBEnemigaSeleccionada
        }
      }
      sendMessage()
    }
  }
})

info.addEventListener('click', function (e) {
  info.classList.remove('mostrarResultado')
})
btnFinDeJuego.addEventListener('click', function () {
  finDeJuego.children[0].children[1].innerText = nombreJugadorVictorioso
  finDeJuego.children[1].children[1].innerText = nombreJugadorDerrotado
  cambiarPantalla(finDeJuego)
})

btnVolverInicio.addEventListener('click', function () {
  cambiarPantalla(bienvenida)
})
