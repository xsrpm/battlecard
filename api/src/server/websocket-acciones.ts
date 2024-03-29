import { cambiarPosicionSchema } from './../schemas/cambiar-posicion.schema'
import { atacarBarreraSchema } from './../schemas/atacar-barrera.schema'
import { atacarCartaSchema } from './../schemas/atacar-carta.schema'
import { seleccionarManoSchema } from './../schemas/seleccionar-mano.schema'
import { terminalTurnoSchema } from './../schemas/terminar-turno.schema'
import { selZonaBatallaSchema } from './../schemas/seleccionar-zona-batalla.schema'
import { iniciarJuegoSchema } from './../schemas/iniciar-juego.schema'
import WebSocket from 'ws'
import { v4 as uuidv4 } from 'uuid'

import { ResultadoUnirASala, ResultadoIniciarJuego, Pantalla } from '../constants/juego'
import { AtacarCartaResponse, CambiarPosicionResponse, ColocarCartaOtroJugadorResponse, ColocarCartaResponse, EnemigoDesconectadoResponse, IniciarJuegoResponse, SeleccionarManoResponse, SeleccionarZonaBatallaResponse, TerminarTurnoResponse, WebsocketEvent, UnirASalaResponse, WebsocketEventAuthenticated, JugadorDesconectadoResponse, AtacarBarreraResponse } from '../response'
import { SeleccionarZonaBatallaRequest } from '../schemas/seleccionar-zona-batalla.schema'
import { Jugador } from './../classes/jugador'
import { Juego } from '../classes/juego'
import { UnirASalaRequest, unirASalaSchema } from '../schemas/unir-a-sala.schema'
import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { Carta } from '../classes/carta'
import { ColocarCartaRequest, colocarCartaSchema } from '../schemas/colocar-carta.schema'
import { SeleccionarManoRequest } from '../schemas/seleccionar-mano.schema'
import { AtacarCartaRequest } from '../schemas/atacar-carta.schema'
import { AtacarBarreraRequest } from '../schemas/atacar-barrera.schema'
import { CambiarPosicionRequest } from '../schemas/cambiar-posicion.schema'
import { PosBatalla } from '../constants/celdabatalla'

import { ResultadoCogerCarta } from '../constants/jugador'
import { IniciarJuegoRequest } from '../schemas/iniciar-juego.schema'
import { cerrarSockets, sendMessage, sendMessageToOthers, server, WebSocketServer } from './websocket-server'
import { info, error } from '../utils/logger'
import { fromZodError } from 'zod-validation-error'

WebSocketServer.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: any) => {
    procesarAccion(ws, data)
  })
  ws.on('error', function (event: any) {
    error(event)
  })
  ws.on('close', (code: number) => {
    procesarDesconexion(ws, code)
  })
})

function procesarAccion (ws: WebSocket, message: string) {
  const objMessage = JSON.parse(message)
  info('received:')
  info(objMessage)
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

const procesarDesconexion = (ws: WebSocket, code: number) => {
  for (const jg of jugadoresConectados) {
    if ((jg?.websocket as any) === ws) {
      info(`close ws code:${code}, player: ${jg.jugador.nombre}`)
      finalizarPorDesconexion(ws, jg.jugador)
    }
  }
}

function finalizarPorDesconexion (ws: WebSocket, jugadorDesconectado: Jugador) {
  if (jugadoresConectados.length === 2 && juego.pantalla === Pantalla.EN_JUEGO) {
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
  } else if (juego.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
    const { jugadores, iniciar } = juego.salirDeSala(jugadorDesconectado)
    const message: JugadorDesconectadoResponse = {
      event: WebsocketEventTitle.JUGADOR_DESCONECTADO,
      payload: {
        resultado: `${jugadorDesconectado.nombre} salió de la sala`, jugadores, iniciar
      }
    }
    sendMessageToOthers(ws, message)
    ws.close()
  }
}

const juego = new Juego()

interface JugadorConectado {
  uuid: string
  jugador: Jugador
  websocket: WebSocket
}

const jugadoresConectados: JugadorConectado[] = []

function unirASala (ws: WebSocket, reqEvent: UnirASalaRequest) {
  try {
    unirASalaSchema.parse(reqEvent)
    const { nombreJugador } = reqEvent.payload
    const { jugador, resultado, jugadores, iniciar } = juego.unirASala(nombreJugador)
    const jugadorConectado: JugadorConectado = {
      jugador: (jugador as Jugador),
      uuid: uuidv4(),
      websocket: ws
    }
    jugadoresConectados.push(jugadorConectado)
    if (resultado === ResultadoUnirASala.EXITO) {
      const respEvent: UnirASalaResponse = {
        event: WebsocketEventTitle.UNIR_A_SALA,
        payload: {
          resultado,
          jugadores: jugadores as string[],
          iniciar: iniciar as boolean,
          jugadorId: jugadorConectado?.uuid
        }
      }
      sendMessage(ws, respEvent)
      delete respEvent.payload?.jugadorId
      sendMessageToOthers(ws, respEvent)
    } else {
      const respEvent: WebsocketEvent = {
        event: WebsocketEventTitle.UNIR_A_SALA,
        error: resultado
      }
      sendMessage(ws, respEvent)
      ws.close()
    }
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.UNIR_A_SALA,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function iniciarJuego (ws: WebSocket, reqEvent: IniciarJuegoRequest) {
  try {
    iniciarJuegoSchema.parse(reqEvent)
    const { jugadorId } = reqEvent.payload
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
    const jugadorActual = (juego.jugadorActual as Jugador)
    const jugadorAnterior = (juego.jugadorAnterior as Jugador)
    const jugadorConectadoActual = jugadoresConectados.find((jugadorConectado) => {
      return jugadorConectado.jugador === juego.jugadorActual
    })
    if (jugadorId === jugadorConectadoActual?.uuid) { // jugador 1 inicia el juego
      // console.log('jugador 1 inicia el juego')
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
      sendMessageToOthers(ws, respEvent)
    } else {
      // console.log('jugador 2 inicia el juego')
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
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.INICIAR_JUEGO,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function colocarCarta (ws: WebSocket, reqEvent: ColocarCartaRequest) {
  try {
    colocarCartaSchema.parse(reqEvent)
    if (!accionAutorizada(ws, reqEvent as any)) return
    const { posicion, idZonaBatalla, idMano } = reqEvent.payload
    const respColocarCarta = juego.colocarCarta(idZonaBatalla, idMano, posicion as PosBatalla)
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
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.COLOCAR_CARTA,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function seleccionarZonaBatalla (ws: WebSocket, reqEvent: SeleccionarZonaBatallaRequest) {
  try {
    selZonaBatallaSchema.parse(reqEvent)
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
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function terminarTurno (ws: WebSocket, message: WebsocketEvent) {
  try {
    terminalTurnoSchema.parse(message)
    if (!accionAutorizada(ws, message as any)) return
    const res = juego.terminarTurno()
    const respTerminarTurno: TerminarTurnoResponse = {
      event: WebsocketEventTitle.TERMINAR_TURNO,
      payload: {
        jugador: res.jugador,
        jugadorEnemigo: res.jugadorEnemigo,
        resultado: res.resultado
      }
    }
    if (res.resultado === ResultadoCogerCarta.DECK_VACIO) {
      respTerminarTurno.payload.nombreJugadorDerrotado = juego.jugadorActual?.nombre
      respTerminarTurno.payload.nombreJugadorVictorioso = juego.jugadorAnterior?.nombre
    }
    sendMessage(ws, respTerminarTurno)
    respTerminarTurno.payload.jugador = res.jugadorEnemigo
    respTerminarTurno.payload.carta = res.carta
    respTerminarTurno.payload.jugadorEnemigo = res.jugador
    respTerminarTurno.payload.resultado = res.resultado
    sendMessageToOthers(ws, respTerminarTurno)
    if (res.resultado === ResultadoCogerCarta.DECK_VACIO) {
      juego.finalizarJuego()
      cerrarSockets()
    }
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.TERMINAR_TURNO,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function accionAutorizada (ws: WebSocket, message: WebsocketEventAuthenticated) {
  const { jugadorId } = message.payload
  const jugadorConectadoActual = jugadoresConectados.find((jugadorConectado) => {
    return jugadorConectado.jugador === juego.jugadorActual
  })
  if (jugadorId === jugadorConectadoActual?.uuid) {
    return true
  }
  message.error = 'Usuario no está autorizado a realizar acción'
  sendMessage(ws, message)
  return false
}

function seleccionarMano (ws: WebSocket, message: SeleccionarManoRequest) {
  try {
    seleccionarManoSchema.parse(message)
    if (!accionAutorizada(ws, message as any)) return
    const { idMano } = message.payload
    const respSeleccionarMano: SeleccionarManoResponse = {
      event: WebsocketEventTitle.SELECCIONAR_MANO,
      payload: {
        ...juego.opcionesSeleccionarMano(idMano)
      }
    }
    sendMessage(ws, respSeleccionarMano)
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.SELECCIONAR_MANO,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function atacarCarta (ws: WebSocket, message: AtacarCartaRequest) {
  try {
    atacarCartaSchema.parse(message)
    if (!accionAutorizada(ws, message as any)) return
    const { idZonaBatalla, idZonaBatallaEnemiga } = message.payload
    const resp = juego.atacarCarta(idZonaBatalla, idZonaBatallaEnemiga)
    const respAtacarCarta: AtacarCartaResponse = {
      event: WebsocketEventTitle.ATACAR_CARTA,
      payload: {
        ...resp
      }
    }
    if (resp?.sinBarreras as boolean) {
      respAtacarCarta.payload.nombreJugadorDerrotado = juego.jugadorAnterior?.nombre
      respAtacarCarta.payload.nombreJugadorVictorioso = juego.jugadorActual?.nombre
    }
    sendMessage(ws, respAtacarCarta)
    respAtacarCarta.event = WebsocketEventTitle.ATACAN_TU_CARTA
    respAtacarCarta.payload.idCartaAtacante = idZonaBatalla
    respAtacarCarta.payload.idCartaAtacada = idZonaBatallaEnemiga
    sendMessageToOthers(ws, respAtacarCarta)
    if (respAtacarCarta.payload.sinBarreras as boolean) {
      juego.finalizarJuego()
      cerrarSockets()
    }
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.ATACAR_CARTA,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function atacarBarrera (ws: WebSocket, message: AtacarBarreraRequest) {
  try {
    atacarBarreraSchema.parse(message)
    if (!accionAutorizada(ws, message as any)) return
    const { idZonaBatalla } = message.payload
    const resp = juego.atacarBarrera(idZonaBatalla)
    const rptaAtacarBarrera: AtacarBarreraResponse = {
      event: WebsocketEventTitle.ATACAR_BARRERA,
      payload: {
        ...resp
      }
    }
    if (resp?.sinBarreras as boolean) {
      rptaAtacarBarrera.payload.nombreJugadorDerrotado = juego.jugadorAnterior?.nombre
      rptaAtacarBarrera.payload.nombreJugadorVictorioso = juego.jugadorActual?.nombre
    }
    sendMessage(ws, rptaAtacarBarrera)
    rptaAtacarBarrera.event = WebsocketEventTitle.ATACAN_TU_BARRERA
    sendMessageToOthers(ws, rptaAtacarBarrera)
    if (resp?.sinBarreras as boolean) {
      juego.finalizarJuego()
      cerrarSockets()
    }
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.ATACAR_BARRERA,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

function cambiarPosicion (ws: WebSocket, message: CambiarPosicionRequest) {
  try {
    cambiarPosicionSchema.parse(message)
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
  } catch (err) {
    const validationError = fromZodError(err as any)
    const respError: WebsocketEvent = {
      event: WebsocketEventTitle.CAMBIAR_POSICION,
      error: validationError.message
    }
    sendMessage(ws, respError)
  }
}

export default server
