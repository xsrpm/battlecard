import WebSocket from 'ws'
import { cerrarSockets, sendMessage, sendMessageToOthers, wss } from './websocket-server'
import { Juego, Pantalla } from './juego'
const juego = new Juego()

export const WebSocketServer = wss

function unirASala (ws: any, message: any) {
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
function iniciarJuego (ws: any, message: any) {
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
        nombre: juego.jugadorActual?.nombre,
        nBarrera: juego.jugadorActual?.barrera.length,
        nDeck: juego.jugadorActual?.deck.length,
        mano: juego.jugadorActual?.mano,
        enTurno: juego.jugadorActual?.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior?.nombre,
        nBarrera: juego.jugadorAnterior?.barrera.length,
        nDeck: juego.jugadorAnterior?.deck.length,
        nMano: juego.jugadorActual?.mano.length,
        enTurno: juego.jugadorAnterior?.enTurno
      }
    }
    sendMessage(ws, message)
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior?.nombre,
        nBarrera: juego.jugadorAnterior?.barrera.length,
        nDeck: juego.jugadorAnterior?.deck.length,
        mano: juego.jugadorAnterior?.mano,
        enTurno: juego.jugadorAnterior?.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual?.nombre,
        nBarrera: juego.jugadorActual?.barrera.length,
        nDeck: juego.jugadorActual?.deck.length,
        nMano: juego.jugadorActual?.mano.length,
        enTurno: juego.jugadorActual?.enTurno
      }
    }
    sendMessageToOthers(ws, message)
  } else {
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior?.nombre,
        nBarrera: juego.jugadorAnterior?.barrera.length,
        nDeck: juego.jugadorAnterior?.deck.length,
        mano: juego.jugadorAnterior?.mano,
        enTurno: juego.jugadorAnterior?.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual?.nombre,
        nBarrera: juego.jugadorActual?.barrera.length,
        nDeck: juego.jugadorActual?.deck.length,
        nMano: juego.jugadorActual?.mano.length,
        enTurno: juego.jugadorActual?.enTurno
      }
    }
    sendMessage(ws, message)
    message.payload = {
      jugador: {
        nombre: juego.jugadorActual?.nombre,
        nBarrera: juego.jugadorActual?.barrera.length,
        nDeck: juego.jugadorActual?.deck.length,
        mano: juego.jugadorActual?.mano,
        enTurno: juego.jugadorActual?.enTurno
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior?.nombre,
        nBarrera: juego.jugadorAnterior?.barrera.length,
        nDeck: juego.jugadorAnterior?.deck.length,
        nMano: juego.jugadorAnterior?.mano.length,
        enTurno: juego.jugadorAnterior?.enTurno
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

function colocarCarta (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const { posicion, idZonaBatalla, idMano } = message.payload
  message.payload = juego.colocarCarta(idZonaBatalla, idMano, posicion)
  message.payload.mano = juego.jugadorActual?.mano
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
function seleccionarZonaBatalla (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const idZonaBatalla = message.payload.idZonaBatalla
  message.payload = juego.opcionesSeleccionarZonaBatalla(idZonaBatalla)
  sendMessage(ws, message)
}

/**
   *
   * @param {WebSocket} ws
   * @param {*} message
   */
function terminarTurno (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const res = juego.terminarTurno()
  message.payload = JSON.parse(JSON.stringify(res))
  delete message.payload.carta
  sendMessage(ws, message)
  message.payload.carta = res.carta
  message.payload.jugador = res.jugadorEnemigo
  message.payload.jugadorEnemigo = res.jugador
  sendMessageToOthers(ws, message)
  if (res.resultado === 'DECK VACIO') {
    cerrarSockets()
  }
}

/**
   *
   * @param {WebSocket} ws
   * @param {*} message
   */
function accionAutorizada (ws: any, message: any) {
  if (ws.jugador === juego.jugadorActual) {
    return true
  }
  message.error = 'Usuario no está autorizado a realizar acción'
  sendMessage(ws, message)
  return false
}

function seleccionarMano (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const idMano = message.payload.idMano
  message.payload = juego.opcionesSeleccionarMano(idMano)
  sendMessage(ws, message)
}

/**
   *
   * @param {WebSocket} ws
   * @param {*} message
   */
function atacarCarta (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const { idZonaBatalla, idZonaBatallaEnemiga } = message.payload
  message.payload = juego.atacarCarta(idZonaBatalla, idZonaBatallaEnemiga)
  sendMessage(ws, message)
  message.event = 'Atacan Tu Carta'
  message.payload.idCartaAtacante = idZonaBatalla
  message.payload.idCartaAtacada = idZonaBatallaEnemiga
  sendMessageToOthers(ws, message)
  if (message.payload.sinBarreras) {
    cerrarSockets()
  }
}

function atacarBarrera (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
  const { idZonaBatalla } = message.payload
  message.payload = juego.atacarBarrera(idZonaBatalla)
  sendMessage(ws, message)
  message.event = 'Atacan Tu Barrera'
  sendMessageToOthers(ws, message)
  if (message.payload.sinBarreras) {
    cerrarSockets()
  }
}

function cambiarPosicion (ws: WebSocket, message: any) {
  if (!accionAutorizada(ws, message)) return
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
function procesarAccion (ws: WebSocket, message: any) {
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
function finalizarPorDesconexion (ws: any) {
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
    cerrarSockets()
  }
}

wss.on('connection', (ws: any) => {
  ws.on('message', (data: any) => {
    procesarAccion(ws, data)
  })
  ws.on('error', function (event: any) {
    console.log(event)
  })
  ws.on('close', (code: any) => {
    console.info(`close ws code:${code}, player: ${ws.jugador.nombre}`)
    finalizarPorDesconexion(ws)
  })
})
