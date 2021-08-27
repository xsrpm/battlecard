const WebSocket = require('ws')
const { Pantalla } = require('./clases/juego.js')
const Juego = require('./clases/juego.js')
/**
 * @type {Juego}
 */
const juego = new Juego()

const wss = new WebSocket.Server({ port: 8080 })

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function sendMessage(ws, message) {
  ws.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

/**
 *
 * @param {WebSocket} wsorigen
 * @param {*} message
 */
function sendMessageToOthers(wsorigen, message) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (ws !== wsorigen) {
        sendMessage(ws, message)
      }
    }
  })
}

function cerrarSala() {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close()
    }
  })
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function unirASala(ws, message) {
  const nombreJugador = message.payload.nombreJugador
  const resp = juego.unirASala(nombreJugador)
  if (resp.resultado === 'Exito') {
    ws.jugador = resp.jugador
    delete resp.jugador
    message.payload = resp
    sendMessage(ws, message)
    sendMessageToOthers(ws, message)
  } else {
    message.error = resp.resultado
    sendMessage(ws, message)
    ws.close()
  }
}
/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function iniciarJuego(ws, message) {
  const resp = juego.iniciarJuego()
  if (resp !== 'JUEGO INICIADO') {
    message.payload = {
      respuesta: resp
    }
    sendMessage(ws, message)
    ws.close()
    return
  }

  if (ws.jugador === juego.jugadorActual) {
    message.payload = {
      jugador: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
        enTurno: juego.jugadorActual.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        nMano: juego.jugadorActual.mano.length,
        enTurno: juego.jugadorAnterior.enTurno
      }
    }
    sendMessage(ws, message)
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        mano: juego.jugadorAnterior.mano,
        enTurno: juego.jugadorAnterior.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        nMano: juego.jugadorActual.mano.length,
        enTurno: juego.jugadorActual.enTurno
      }
    }
    sendMessageToOthers(ws, message)
  } else {
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        mano: juego.jugadorAnterior.mano,
        enTurno: juego.jugadorAnterior.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        nMano: juego.jugadorActual.mano.length,
        enTurno: juego.jugadorActual.enTurno
      }
    }
    sendMessage(ws, message)
    message.payload = {
      jugador: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
        enTurno: juego.jugadorActual.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        nMano: juego.jugadorAnterior.mano.length,
        enTurno: juego.jugadorAnterior.enTurno
      }
    }
    sendMessageToOthers(ws, message)
  }
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */

function colocarCarta(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const { posicion, idZonaBatalla, idMano } = message.payload
  message.payload = juego.colocarCarta(idZonaBatalla, idMano, posicion)
  message.payload.mano = juego.jugadorActual.mano
  sendMessage(ws, message)
  delete message.payload.mano
  message.event = 'Coloca Carta Otro Jugador'
  message.payload.posicion = posicion
  message.payload.idZonaBatalla = idZonaBatalla
  const ULTIMA_CARTA = 4
  message.payload.idMano = ULTIMA_CARTA
  sendMessageToOthers(ws, message)
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function seleccionarZonaBatalla(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const idZonaBatalla = message.payload.idZonaBatalla
  message.payload = juego.opcionesSeleccionarZonaBatalla(idZonaBatalla)
  sendMessage(ws, message)
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function terminarTurno(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const res = juego.terminarTurno()
  message.payload = JSON.parse(JSON.stringify(res))
  delete message.payload.carta
  sendMessage(ws, message)
  message.payload.carta = res.carta
  message.payload.jugador = res.jugadorEnemigo
  message.payload.jugadorEnemigo = res.jugador
  sendMessageToOthers(ws, message)
  if (res.resultado === 'DECK VACIO') {
    cerrarSala()
  }
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function accionAutorizada(ws, message) {
  if (ws.jugador === juego.jugadorActual) {
    return true
  }
  message.error = 'Usuario no está autorizado a realizar acción'
  sendMessage(ws, message)
  return false
}

function seleccionarMano(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const idMano = message.payload.idMano
  message.payload = juego.opcionesSeleccionarMano(idMano)
  sendMessage(ws, message)
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function atacarCarta(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const { idZonaBatalla, idZonaBatallaEnemiga } = message.payload
  message.payload = juego.atacarCarta(idZonaBatalla, idZonaBatallaEnemiga)
  sendMessage(ws, message)
  message.event = 'Atacan Tu Carta'
  message.payload.idCartaAtacante = idZonaBatalla
  message.payload.idCartaAtacada = idZonaBatallaEnemiga
  sendMessageToOthers(ws, message)
  if (message.payload.sinBarreras) {
    cerrarSala()
  }
}

function atacarBarrera(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const { idZonaBatalla } = message.payload
  message.payload = juego.atacarBarrera(idZonaBatalla)
  sendMessage(ws, message)
  message.event = 'Atacan Tu Barrera'
  sendMessageToOthers(ws, message)
  if (message.payload.sinBarreras) {
    cerrarSala()
  }
}

function cambiarPosicion(ws, message) {
  if (accionAutorizada(ws, message) === false) return
  const { idZonaBatalla } = message.payload
  message.payload = juego.cambiarPosicionBatalla(idZonaBatalla)
  sendMessage(ws, message)
  message.event = 'Cambia Posicion Enemigo'
  message.payload.idZonaBatalla = idZonaBatalla
  sendMessageToOthers(ws, message)
}

/**
 *
 * @param {WebSocket} ws
 * @param {string} data
 */
function procesarAccion(ws, message) {
  const objMessage = JSON.parse(message)
  console.log('received:')
  console.log(objMessage)
  switch (objMessage.event) {
    case 'Unir a sala':
      unirASala(ws, objMessage)
      break
    case 'Iniciar juego':
      iniciarJuego(ws, objMessage)
      break
    case 'Colocar Carta':
      colocarCarta(ws, objMessage)
      break
    case 'Seleccionar Zona Batalla':
      seleccionarZonaBatalla(ws, objMessage)
      break
    case 'Seleccionar Mano':
      seleccionarMano(ws, objMessage)
      break
    case 'Atacar Carta':
      atacarCarta(ws, objMessage)
      break
    case 'Atacar Barrera':
      atacarBarrera(ws, objMessage)
      break
    case 'Cambiar Posicion':
      cambiarPosicion(ws, objMessage)
      break
    case 'Terminar Turno':
      terminarTurno(ws, objMessage)
      break
  }
}
/**
 *
 * @param {Jugador} jugador
 */
function finalizarPorDesconexion(ws) {
  if (juego.jugador.length === 2 && juego.pantalla === Pantalla.EN_JUEGO) {
    const message = {
      event: 'Enemigo Desconectado',
      payload: {
        nombreJugadorDerrotado: ws.jugador.nombre,
        nombreJugadorVictorioso: juego.jugadorEnemigo(ws.jugador).nombre,
        resultado: `${ws.jugador.nombre} se desconectó del juego`
      }
    }
    sendMessageToOthers(ws, message)
    juego.finalizarJuego()
    cerrarSala()
  }
}

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    procesarAccion(ws, data)
  })
  ws.on('error', function (event) {
    console.log(event)
  })
  ws.on('close', (code, reason) => {
    console.info(`close ws code:${code}, player: ${ws.jugador.nombre}`)
    finalizarPorDesconexion(ws)
  })
})
