import { SeleccionarZonaBatallaRequest } from '../schemas/seleccionar-zona-batalla.schema'
import { Jugador, RptaAccionAtacarBarrera, RptaCambiarPosicion } from './jugador'
import WebSocket from 'ws'
import { cerrarSockets, sendMessage, sendMessageToOthers, wss } from './websocket-server'
import { Juego, Pantalla } from './juego'
import { UnirASalaRequest } from '../schemas/unir-a-sala.schema'
import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { Carta } from './carta'
import { ColocarCartaRequest } from '../schemas/colocar-carta.schema'
import { SeleccionarManoRequest } from '../schemas/seleccionar-mano.schema'
import { AtacarCartaRequest } from '../schemas/atacar-carta.schema'
import { AtacarBarreraRequest } from '../schemas/atacar-barrera.schema'
import { CambiarPosicionRequest } from '../schemas/cambiar-posicion.schema'
const juego = new Juego()

export const WebSocketServer = wss

interface WebsocketEvent {
  event: string
  payload?: object
  error?: string
}

interface UnirASalaResponse extends WebsocketEvent {
  payload: {
    resultado: string
    jugadores: string[]
    iniciar: boolean
  }
}

interface WebSocketJugador extends WebSocket {
  jugador: Jugador
}

function unirASala (ws: WebSocketJugador, reqEvent: UnirASalaRequest) {
  const nombreJugador = reqEvent.payload.nombreJugador
  const respUnirASala = juego.unirASala(nombreJugador)
  if (respUnirASala.resultado === 'Exito') {
    ws.jugador = respUnirASala.jugador as Jugador
    const respEvent: UnirASalaResponse = {
      event: WebsocketEventTitle.UNIR_A_SALA,
      payload: {
        resultado: respUnirASala.resultado,
        jugadores: respUnirASala.jugadores as string[],
        iniciar: respUnirASala.iniciar as boolean
      }
    }
    sendMessage(ws, respEvent)
    sendMessageToOthers(ws, respEvent)
  } else {
    const respEvent: WebsocketEvent = {
      event: WebsocketEventTitle.UNIR_A_SALA,
      error: respUnirASala.resultado
    }
    sendMessage(ws, respEvent)
    ws.close()
  }
}

interface IniciarJuegoResponse extends WebsocketEvent {
  payload: {
    respuesta: string
    jugador?: {
      nombre?: string
      nBarrera?: number
      nDeck?: number
      mano?: Carta[]
      enTurno?: boolean
    }
    jugadorEnemigo?: {
      nombre?: string
      nBarrera?: number
      nDeck?: number
      nMano?: number
      enTurno?: boolean
    }
  }
}

function iniciarJuego (ws: WebSocketJugador) {
  const respIniciarJuego = juego.iniciarJuego()
  if (respIniciarJuego !== 'JUEGO INICIADO') {
    const respEvent: IniciarJuegoResponse = {
      event: WebsocketEventTitle.INICIAR_JUEGO,
      payload: {
        respuesta: respIniciarJuego
      }
    }
    sendMessage(ws, respEvent)
    ws.close()
    return
  }
  const respEvent: IniciarJuegoResponse = {
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      respuesta: respIniciarJuego,
      jugador: {},
      jugadorEnemigo: {}
    }
  }
  if (ws.jugador === juego.jugadorActual) {
    respEvent.payload.jugador = {
      nombre: juego.jugadorActual?.nombre,
      nBarrera: juego.jugadorActual?.barrera.length,
      nDeck: juego.jugadorActual?.deck.length,
      mano: juego.jugadorActual?.mano,
      enTurno: juego.jugadorActual?.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: juego.jugadorAnterior?.nombre,
      nBarrera: juego.jugadorAnterior?.barrera.length,
      nDeck: juego.jugadorAnterior?.deck.length,
      nMano: juego.jugadorActual?.mano.length,
      enTurno: juego.jugadorAnterior?.enTurno
    }
    sendMessage(ws, respEvent)
    respEvent.payload.jugador = {
      nombre: juego.jugadorAnterior?.nombre,
      nBarrera: juego.jugadorAnterior?.barrera.length,
      nDeck: juego.jugadorAnterior?.deck.length,
      mano: juego.jugadorAnterior?.mano,
      enTurno: juego.jugadorAnterior?.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: juego.jugadorActual?.nombre,
      nBarrera: juego.jugadorActual?.barrera.length,
      nDeck: juego.jugadorActual?.deck.length,
      nMano: juego.jugadorActual?.mano.length,
      enTurno: juego.jugadorActual?.enTurno
    }

    sendMessageToOthers(ws, respEvent)
  } else {
    respEvent.payload.jugador = {
      nombre: juego.jugadorAnterior?.nombre,
      nBarrera: juego.jugadorAnterior?.barrera.length,
      nDeck: juego.jugadorAnterior?.deck.length,
      mano: juego.jugadorAnterior?.mano,
      enTurno: juego.jugadorAnterior?.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: juego.jugadorActual?.nombre,
      nBarrera: juego.jugadorActual?.barrera.length,
      nDeck: juego.jugadorActual?.deck.length,
      nMano: juego.jugadorActual?.mano.length,
      enTurno: juego.jugadorActual?.enTurno
    }

    sendMessage(ws, respEvent)
    respEvent.payload.jugador = {
      nombre: juego.jugadorActual?.nombre,
      nBarrera: juego.jugadorActual?.barrera.length,
      nDeck: juego.jugadorActual?.deck.length,
      mano: juego.jugadorActual?.mano,
      enTurno: juego.jugadorActual?.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: juego.jugadorAnterior?.nombre,
      nBarrera: juego.jugadorAnterior?.barrera.length,
      nDeck: juego.jugadorAnterior?.deck.length,
      nMano: juego.jugadorAnterior?.mano.length,
      enTurno: juego.jugadorAnterior?.enTurno
    }
    sendMessageToOthers(ws, respEvent)
  }
}

interface ColocarCartaResponse extends WebsocketEvent {
  payload: {
    mano: Carta[]
    resultado: string
  }
}

interface ColocarCartaOtroJugadorResponse extends WebsocketEvent {
  payload: {
    posicion: string
    idZonaBatalla: number
    idMano: number
    resultado: string
    carta: Carta
  }
}

function colocarCarta (ws: WebSocket, reqEvent: ColocarCartaRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, reqEvent)) return
  const { posicion, idZonaBatalla, idMano } = reqEvent.payload
  const respColocarCarta = juego.colocarCarta(idZonaBatalla, idMano, posicion)
  const respEvent: ColocarCartaResponse = {
    event: WebsocketEventTitle.COLOCAR_CARTA,
    payload: {
      mano: juego.jugadorActual?.mano as Carta[],
      resultado: respColocarCarta.resultado
    }
  }
  sendMessage(ws, respEvent)
  const ULTIMA_CARTA = 4
  const respOtrosEvent: ColocarCartaOtroJugadorResponse = {
    event: WebsocketEventTitle.COLOCAR_CARTA_OTRO_JUGADOR,
    payload: {
      idMano: ULTIMA_CARTA,
      idZonaBatalla,
      posicion,
      carta: respColocarCarta.carta as Carta,
      resultado: respColocarCarta.resultado
    }
  }
  sendMessageToOthers(ws, respOtrosEvent)
}

interface SeleccionarZonaBatallaResponse extends WebsocketEvent {
  payload: {
    existeCarta: boolean
    puedeAtacarCarta: string
    puedeAtacarBarrera: string
    puedeCambiarPosicion: string
  }
}

function seleccionarZonaBatalla (ws: WebSocket, reqEvent: SeleccionarZonaBatallaRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, reqEvent)) return
  const { idZonaBatalla } = reqEvent.payload
  const respOpcSelZB = juego.opcionesSeleccionarZonaBatalla(idZonaBatalla)
  const respSeleccionarZB: SeleccionarZonaBatallaResponse = {
    event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
    payload: {
      ...respOpcSelZB
    }
  }
  sendMessage(ws, respSeleccionarZB)
}

interface TerminarTurnoResponse extends WebsocketEvent {
  payload: {
    jugador: {
      enTurno: boolean
      nDeck: number
    }
    jugadorEnemigo: {
      enTurno: boolean
      nDeck: number
    }
    nombreJugadorDerrotado?: string
    nombreJugadorVictorioso?: string
    resultado?: string
    carta?: Carta
  }
}

function terminarTurno (ws: WebSocket, message: WebsocketEvent) {
  if (!accionAutorizada(ws as WebSocketJugador, message)) return
  const res = juego.terminarTurno()
  let respTerminarTurno: TerminarTurnoResponse = {
    event: WebsocketEventTitle.TERMINAR_TURNO,
    payload: {
      jugador: {
        enTurno: res.jugador.enTurno,
        nDeck: res.jugador.nDeck
      },
      jugadorEnemigo: {
        enTurno: res.jugadorEnemigo.enTurno,
        nDeck: res.jugadorEnemigo.nDeck
      },
      nombreJugadorDerrotado: res.nombreJugadorDerrotado as string,
      nombreJugadorVictorioso: res.nombreJugadorVictorioso as string,
      resultado: res.resultado
    }
  }
  sendMessage(ws, respTerminarTurno)
  respTerminarTurno = {
    event: WebsocketEventTitle.TERMINAR_TURNO,
    payload: {
      carta: res.carta,
      jugador: res.jugadorEnemigo,
      jugadorEnemigo: res.jugador
    }
  }
  sendMessageToOthers(ws, respTerminarTurno)
  if (res.resultado === 'DECK VACIO') {
    cerrarSockets()
  }
}

function accionAutorizada (ws: WebSocketJugador, message: WebsocketEvent) {
  if (ws.jugador === juego.jugadorActual) {
    return true
  }
  message.error = 'Usuario no está autorizado a realizar acción'
  sendMessage(ws, message)
  return false
}

interface SeleccionarManoResponse extends WebsocketEvent {
  payload: {
    existeCarta: boolean
    puedeColocarCarta: string
  }
}

function seleccionarMano (ws: WebSocket, message: SeleccionarManoRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, message)) return
  const { idMano } = message.payload
  const respSeleccionarMano: SeleccionarManoResponse = {
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      ...juego.opcionesSeleccionarMano(idMano)
    }
  }
  sendMessage(ws, respSeleccionarMano)
}

interface AtacarCartaResponse extends WebsocketEvent {
  payload: {
    cartaAtacante?: Carta
    cartaAtacada?: Carta
    veredicto?: string
    idBarreraEliminada?: number
    estadoCartaAtacante?: string
    estadoCartaAtacada?: string
    estadoBarrera?: string
    sinBarreras?: boolean
    bonifCartaAtacante?: number
    bonifCartaAtacada?: number
    nombreJugadorDerrotado?: string
    nombreJugadorVictorioso?: string
    estadoAtaque: string
    idCartaAtacante?: number
    idCartaAtacada?: number
  }
}

function atacarCarta (ws: WebSocket, message: AtacarCartaRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, message)) return
  const { idZonaBatalla, idZonaBatallaEnemiga } = message.payload
  const respAtacarCarta: AtacarCartaResponse = {
    event: WebsocketEventTitle.ATACAR_CARTA,
    payload: {
      ...juego.atacarCarta(idZonaBatalla, idZonaBatallaEnemiga)
    }
  }
  sendMessage(ws, respAtacarCarta)
  respAtacarCarta.event = WebsocketEventTitle.ATACAN_TU_CARTA
  respAtacarCarta.payload.idCartaAtacante = idZonaBatalla
  respAtacarCarta.payload.idCartaAtacada = idZonaBatallaEnemiga
  sendMessageToOthers(ws, message)
  if (respAtacarCarta.payload.sinBarreras as boolean) {
    cerrarSockets()
  }
}

interface AtacarBarreraResponse extends WebsocketEvent {
  payload: RptaAccionAtacarBarrera
}

function atacarBarrera (ws: WebSocket, message: AtacarBarreraRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, message)) return
  const { idZonaBatalla } = message.payload
  const rptaAtacarBarrera: AtacarBarreraResponse = {
    event: WebsocketEventTitle.ATACAR_BARRERA,
    payload: juego.atacarBarrera(idZonaBatalla)
  }
  sendMessage(ws, rptaAtacarBarrera)
  rptaAtacarBarrera.event = WebsocketEventTitle.ATACAN_TU_BARRERA
  sendMessageToOthers(ws, rptaAtacarBarrera)
  if (rptaAtacarBarrera.payload.sinBarreras as boolean) {
    cerrarSockets()
  }
}

interface RptaCambiarPosicionId extends RptaCambiarPosicion {
  idZonaBatalla?: number
}

interface CambiarPosicionResponse extends WebsocketEvent {
  payload: RptaCambiarPosicionId
}

function cambiarPosicion (ws: WebSocket, message: CambiarPosicionRequest) {
  if (!accionAutorizada(ws as WebSocketJugador, message)) return
  const { idZonaBatalla } = message.payload
  const respCambiarPosicion: CambiarPosicionResponse = {
    event: WebsocketEventTitle.CAMBIAR_POSICION,
    payload: juego.cambiarPosicionBatalla(idZonaBatalla)
  }
  sendMessage(ws, respCambiarPosicion)
  respCambiarPosicion.event = WebsocketEventTitle.CAMBIA_POSICION_ENEMIGO
  respCambiarPosicion.payload.idZonaBatalla = idZonaBatalla
  sendMessageToOthers(ws, respCambiarPosicion)
}

function procesarAccion (ws: WebSocket, message: string) {
  const objMessage = JSON.parse(message)
  console.log('received:')
  console.log(objMessage)
  switch (objMessage.event) {
    case WebsocketEventTitle.UNIR_A_SALA:
      unirASala(ws as WebSocketJugador, objMessage)
      break
    case WebsocketEventTitle.INICIAR_JUEGO:
      iniciarJuego(ws as WebSocketJugador)
      break
    case WebsocketEventTitle.COLOCAR_CARTA:
      colocarCarta(ws, objMessage)
      break
    case WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA:
      seleccionarZonaBatalla(ws, objMessage)
      break
    case WebsocketEventTitle.SELECCIONAR_MANO:
      seleccionarMano(ws, objMessage)
      break
    case WebsocketEventTitle.ATACAR_CARTA:
      atacarCarta(ws, objMessage)
      break
    case WebsocketEventTitle.ATACAR_BARRERA:
      atacarBarrera(ws, objMessage)
      break
    case WebsocketEventTitle.CAMBIAR_POSICION:
      cambiarPosicion(ws, objMessage)
      break
    case WebsocketEventTitle.TERMINAR_TURNO:
      terminarTurno(ws, objMessage)
      break
  }
}

function finalizarPorDesconexion (ws: WebSocketJugador) {
  if (juego.jugador.length === 2 && juego.pantalla === Pantalla.EN_JUEGO) {
    const message = {
      event: WebsocketEventTitle.ENEMIGO_DESCONECTADO,
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

wss.on('connection', (ws: WebSocketJugador) => {
  ws.on('message', (data: any) => {
    procesarAccion(ws, data)
  })
  ws.on('error', function (event: any) {
    console.log(event)
  })
  ws.on('close', (code: number) => {
    console.info(`close ws code:${code}, player: ${ws.jugador.nombre}`)
    finalizarPorDesconexion(ws)
  })
})
