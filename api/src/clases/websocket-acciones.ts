import { ResultadoUnirASala, ResultadoIniciarJuego } from './../constants/juego';
import { AtacarBarreraResponse, AtacarCartaResponse, CambiarPosicionResponse, ColocarCartaOtroJugadorResponse, ColocarCartaResponse, EnemigoDesconectadoResponse, IniciarJuegoResponse, SeleccionarManoResponse, SeleccionarZonaBatallaResponse, TerminarTurnoResponse, WebsocketEvent, UnirASalaResponse, WebsocketEventAuthenticated } from './../response.d';
import { SeleccionarZonaBatallaRequest } from '../schemas/seleccionar-zona-batalla.schema'
import { Jugador } from './jugador'
import WebSocket from 'ws'
import { cerrarSockets, sendMessage, sendMessageToOthers, wss } from './websocket-server'
import { Juego } from './juego'
import { UnirASalaRequest } from '../schemas/unir-a-sala.schema'
import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { Carta } from './carta'
import { ColocarCartaRequest } from '../schemas/colocar-carta.schema'
import { SeleccionarManoRequest } from '../schemas/seleccionar-mano.schema'
import { AtacarCartaRequest } from '../schemas/atacar-carta.schema'
import { AtacarBarreraRequest } from '../schemas/atacar-barrera.schema'
import { CambiarPosicionRequest } from '../schemas/cambiar-posicion.schema'
import { PosBatalla } from '../constants/celdabatalla'
import { Pantalla } from '../constants/juego'
import { ResultadoCogerCarta } from '../constants/jugador';
import { IniciarJuegoRequest } from '../schemas/iniciar-juego.schema';
const juego = new Juego()

export const WebSocketServer = wss

function unirASala (ws: WebSocket, reqEvent: UnirASalaRequest) {
  const {nombreJugador} = reqEvent.payload
  const { jugadorConectado, resultado, jugadores, iniciar} = juego.unirASala(nombreJugador)
 
  if (resultado === ResultadoUnirASala.EXITO) {
    const respEvent: UnirASalaResponse = {
      event: WebsocketEventTitle.UNIR_A_SALA,
      payload : {
        resultado,
        jugadores: jugadores as string[],
        iniciar: iniciar as boolean,
        jugadorId : jugadorConectado?.uuid
      }
    }
    sendMessage(ws, respEvent)
    delete respEvent.payload.jugadorId
    sendMessageToOthers(ws, respEvent)
  } else {
    const respEvent: WebsocketEvent = {
      event: WebsocketEventTitle.UNIR_A_SALA,
      error: resultado
    }
    sendMessage(ws, respEvent)
    ws.close()
  }
}

function iniciarJuego (ws: WebSocket, reqEvent: IniciarJuegoRequest) {
  const {jugadorId} = reqEvent.payload
  const respIniciarJuego = juego.iniciarJuego()
  const respEvent: IniciarJuegoResponse = {
    event: WebsocketEventTitle.INICIAR_JUEGO,
    payload: {
      respuesta: respIniciarJuego
    }
  }
  if (respIniciarJuego !== ResultadoIniciarJuego.JUEGO_INICIADO) {
    sendMessage(ws, respEvent)
    ws.close()
    return
  }
  const jugadorActual = (juego.jugadorActual?.jugador as Jugador)
  const jugadorAnterior = (juego.jugadorAnterior?.jugador as Jugador)
  if (jugadorId === juego.jugadorActual?.uuid) {
    respEvent.payload.jugador = {
      nombre: jugadorActual.nombre,
      nBarrera: jugadorActual.barrera.length,
      nDeck: jugadorActual.deck.length,
      mano: jugadorActual.mano,
      enTurno: jugadorActual.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: jugadorAnterior.nombre,
      nBarrera: jugadorAnterior.barrera.length,
      nDeck: jugadorAnterior.deck.length,
      nMano: jugadorAnterior.mano.length,
      enTurno: jugadorAnterior.enTurno
    }
     sendMessage(ws, respEvent)
    respEvent.payload.jugador = {
      nombre: jugadorAnterior.nombre,
      nBarrera: jugadorAnterior.barrera.length,
      nDeck: jugadorAnterior.deck.length,
      mano:jugadorAnterior.mano,
      enTurno: jugadorAnterior.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: jugadorActual.nombre,
      nBarrera: jugadorActual.barrera.length,
      nDeck: jugadorActual.deck.length,
      nMano: jugadorActual.mano.length,
      enTurno: jugadorActual.enTurno
    }
    sendMessageToOthers(ws, respEvent)
  } else {
    respEvent.payload.jugador = {
      nombre: jugadorAnterior.nombre,
      nBarrera: jugadorAnterior.barrera.length,
      nDeck: jugadorAnterior.deck.length,
      mano: jugadorAnterior.mano,
      enTurno: jugadorAnterior.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: jugadorActual.nombre,
      nBarrera: jugadorActual.barrera.length,
      nDeck: jugadorActual.deck.length,
      nMano: jugadorActual.mano.length,
      enTurno: jugadorActual.enTurno
    }
    sendMessage(ws, respEvent)
    respEvent.payload.jugador = {
      nombre: jugadorActual.nombre,
      nBarrera: jugadorActual.barrera.length,
      nDeck: jugadorActual.deck.length,
      mano: jugadorActual.mano,
      enTurno: jugadorActual.enTurno
    }
    respEvent.payload.jugadorEnemigo = {
      nombre: jugadorAnterior.nombre,
      nBarrera: jugadorAnterior.barrera.length,
      nDeck: jugadorAnterior.deck.length,
      nMano: jugadorAnterior.mano.length,
      enTurno: jugadorAnterior.enTurno
    }
    sendMessageToOthers(ws, respEvent)
  }
}

function colocarCarta (ws: WebSocket, reqEvent: ColocarCartaRequest) {
  if (!accionAutorizada(ws, reqEvent as any)) return
  const { posicion, idZonaBatalla, idMano } = reqEvent.payload
  const respColocarCarta = juego.colocarCarta(idZonaBatalla, idMano, posicion as PosBatalla)
  const respEvent: ColocarCartaResponse = {
    event: WebsocketEventTitle.COLOCAR_CARTA,
    payload: {
      mano: juego.jugadorActual?.jugador.mano as Carta[],
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

function seleccionarZonaBatalla (ws: WebSocket, reqEvent: SeleccionarZonaBatallaRequest) {
  if (!accionAutorizada(ws, reqEvent as any)) return
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

function terminarTurno (ws: WebSocket, message: WebsocketEvent) {
  if (!accionAutorizada(ws , message as any)) return
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
  if (res.resultado === ResultadoCogerCarta.DECK_VACIO) {
    cerrarSockets()
  }
}

function accionAutorizada (ws: WebSocket, message: WebsocketEventAuthenticated) {
  const {jugadorId} = message.payload
  if(jugadorId === juego.jugadorActual?.uuid){
    return true
  }
  message.error = 'Usuario no está autorizado a realizar acción'
  sendMessage(ws, message)
  return false
}

function seleccionarMano (ws: WebSocket, message: SeleccionarManoRequest) {
  if (!accionAutorizada(ws as WebSocket, message as any)) return
  const { idMano } = message.payload
  const respSeleccionarMano: SeleccionarManoResponse = {
    event: WebsocketEventTitle.SELECCIONAR_MANO,
    payload: {
      ...juego.opcionesSeleccionarMano(idMano)
    }
  }
  sendMessage(ws, respSeleccionarMano)
}

function atacarCarta (ws: WebSocket, message: AtacarCartaRequest) {
  if (!accionAutorizada(ws, message as any)) return
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
  sendMessageToOthers(ws, respAtacarCarta)
  if (respAtacarCarta.payload.sinBarreras as boolean) {
    cerrarSockets()
  }
}

function atacarBarrera (ws: WebSocket, message: AtacarBarreraRequest) {
  if (!accionAutorizada(ws , message as any)) return
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

function cambiarPosicion (ws: WebSocket, message: CambiarPosicionRequest) {
  if (!accionAutorizada(ws, message as any)) return
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
      unirASala(ws, objMessage)
      break
    case WebsocketEventTitle.INICIAR_JUEGO:
      iniciarJuego(ws, objMessage)
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

function finalizarPorDesconexion (ws: WebSocket, jugadorDesconectado: Jugador) {
  if (juego.jugadoresConectados.length === 2 && juego.pantalla === Pantalla.EN_JUEGO) {
    const message: EnemigoDesconectadoResponse = {
      event: WebsocketEventTitle.ENEMIGO_DESCONECTADO,
      payload: {
        nombreJugadorDerrotado: jugadorDesconectado.nombre,
        nombreJugadorVictorioso: juego.jugadorEnemigo(jugadorDesconectado).nombre,
        resultado: `${jugadorDesconectado.nombre} se desconectó del juego`
      }
    }
    sendMessageToOthers(ws, message)
    juego.finalizarJuego()
    cerrarSockets()
  }
}

wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: any) => {
    procesarAccion(ws, data)
  })
  ws.on('error', function (event: any) {
    console.log(event)
  })
  ws.on('close', (code: number) => {
    for( const jg of juego.jugadoresConectados){
      if((jg?.websocket as any) === ws){
        console.info(`close ws code:${code}, player: ${jg.jugador.nombre}`)
        finalizarPorDesconexion(ws, jg.jugador)
      }
    }
  })
})
