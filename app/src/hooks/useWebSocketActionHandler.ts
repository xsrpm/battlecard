import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { type SeleccionarManoResponse, type IniciarJuegoResponse, type UnirASalaResponse, type SeleccionarZonaBatallaResponse, type ColocarCartaResponse, type ColocarCartaOtroJugadorResponse, type TerminarTurnoResponse, type CambiarPosicionResponse, type AtacarBarreraResponse, type AtacarCartaResponse } from '../../../api/src/response'
import { unirASala } from '../modules/socket-messages'
import { encuentraError, initSocket } from '../modules/socket'
import { useAppStore } from './useAppStore'
import { Page } from '../constants/juego'
import { useWaitingRoomStore } from './useWaitingRoomStore'
import { useGameStore } from './useGameStore'
import { ResultadoCogerCarta } from '../constants/jugador'

function useSocketHandler () {
  console.log('useSocketHandler')
  const changeActualPage = useAppStore(state => state.changeActualPage)
  const iniciarJuego = useGameStore(state => state.iniciarJuego)
  const updateBotoneraBySelectCartaEnMano = useGameStore(state => state.updateBotoneraBySelectCartaEnMano)
  const colocarCarta = useGameStore(state => state.colocarCarta)
  const colocarCartaOtroJugador = useGameStore(state => state.colocarCartaOtroJugador)
  const seleccionarZonaBatalla = useGameStore(state => state.seleccionarZonaBatalla)
  const agregarCartaRecogida = useGameStore(state => state.agregarCartaRecogida)
  const terminarTurno = useGameStore(state => state.terminarTurno)
  const terminarJuego = useGameStore(state => state.terminarJuego)
  const cambiarPosicion = useGameStore(state => state.cambiarPosicion)
  const cambiarPosicionEnemigo = useGameStore(state => state.cambiarPosicionEnemigo)
  const atacarBarrera = useGameStore(state => state.atacarBarrera)
  const atacanTuBarrera = useGameStore(state => state.atacanTuBarrera)
  const atacarCarta = useGameStore(state => state.atacarCarta)
  const atacanTuCarta = useGameStore(state => state.atacanTuCarta)
  const setPlayerId = useGameStore(state => state.setPlayerId)
  const setPlayers = useWaitingRoomStore(state => state.setPlayers)
  const setStart = useWaitingRoomStore(state => state.setStart)

  const handleMessageSocket = (e: any): void => {
    console.log('received:')
    const message = JSON.parse(e.data)
    console.log(message)
    switch (message.event) {
      case WebsocketEventTitle.UNIR_A_SALA:
        unirASalaResponse(message as UnirASalaResponse)
        break
      case WebsocketEventTitle.INICIAR_JUEGO:
        iniciarJuegoResponse(message as IniciarJuegoResponse)
        break
      case WebsocketEventTitle.SELECCIONAR_MANO:
        seleccionarManoResponse(message as SeleccionarManoResponse)
        break
      case WebsocketEventTitle.COLOCAR_CARTA:
        colocarCartaResponse(message as ColocarCartaResponse)
        break
      case WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA:
        seleccionarZonaBatallaResponse(message as SeleccionarZonaBatallaResponse)
        break
      case WebsocketEventTitle.COLOCAR_CARTA_OTRO_JUGADOR:
        colocaCartaOtroJugadorResponse(message as ColocarCartaOtroJugadorResponse)
        break
      case WebsocketEventTitle.TERMINAR_TURNO:
        terminarTurnoResponse(message as TerminarTurnoResponse)
        break
      case WebsocketEventTitle.CAMBIAR_POSICION:
        cambiarPosicionResponse(message as CambiarPosicionResponse)
        break
      case WebsocketEventTitle.CAMBIA_POSICION_ENEMIGO:
        cambiaPosicionEnemigoResponse(message as CambiarPosicionResponse)
        break
      case WebsocketEventTitle.ATACAR_BARRERA:
        atacarBarreraResponse(message as AtacarBarreraResponse)
        break
      case WebsocketEventTitle.ATACAN_TU_BARRERA:
        atacanTuBarreraResponse(message as AtacarBarreraResponse)
        break
      case WebsocketEventTitle.ATACAR_CARTA:
        atacarCartaResponse(message as AtacarCartaResponse)
        break
      case WebsocketEventTitle.ATACAN_TU_CARTA:
        atacanTuCartaResponse(message as AtacarCartaResponse)
        break
    }
  }

  function seleccionarZonaBatallaResponse (message: SeleccionarZonaBatallaResponse) {
    if (encuentraError(message)) return
    seleccionarZonaBatalla(message)
  }

  function colocarCartaResponse (message: ColocarCartaResponse) {
    if (encuentraError(message)) return
    colocarCarta(message)
  }

  function colocaCartaOtroJugadorResponse (message: ColocarCartaOtroJugadorResponse) {
    if (encuentraError(message)) return
    colocarCartaOtroJugador(message)
  }

  function unirASalaSocket (nombreJugador: string, onErrorCallback: () => void): void {
    const handleOpenSocket = (): void => {
      unirASala(nombreJugador)
    }

    const handleCloseSocket = (e: any): void => {
      console.log('close ws' + (e as string))
    }
    const handleErrorSocket = (e: any): void => {
      onErrorCallback()
      console.log('Error: ' + (e as string))
    }
    initSocket(handleOpenSocket, handleMessageSocket, handleCloseSocket, handleErrorSocket)
  }

  function unirASalaResponse (message: UnirASalaResponse): void {
    if (encuentraError(message)) return
    const { jugadores, iniciar, jugadorId } = message.payload
    setPlayers(jugadores)
    setStart(iniciar)
    if (typeof jugadorId !== 'undefined') {
      setPlayerId(jugadorId)
      changeActualPage(Page.WAITING_ROOM)
    }
  }

  function iniciarJuegoResponse (message: IniciarJuegoResponse) {
    if (encuentraError(message)) return
    iniciarJuego(message)
    changeActualPage(Page.GAME_ROOM)
  }

  function seleccionarManoResponse (message: SeleccionarManoResponse) {
    if (encuentraError(message)) return
    updateBotoneraBySelectCartaEnMano(message)
  }

  function terminarTurnoResponse (message: TerminarTurnoResponse) {
    if (encuentraError(message)) return
    terminarTurno(message)
    const { resultado } = message.payload
    if (resultado === ResultadoCogerCarta.EXITO) {
      agregarCartaRecogida(message)
    } else if (resultado === ResultadoCogerCarta.DECK_VACIO) {
      terminarJuego(message)
    } else {
      console.log('MANO LLENA')
    }
  }

  function cambiarPosicionResponse (message: CambiarPosicionResponse) {
    if (encuentraError(message)) return
    cambiarPosicion(message)
  }

  function cambiaPosicionEnemigoResponse (message: CambiarPosicionResponse) {
    if (encuentraError(message)) return
    cambiarPosicionEnemigo(message)
  }

  function atacarBarreraResponse (message: AtacarBarreraResponse) {
    if (encuentraError(message)) return
    atacarBarrera(message)
  }

  function atacanTuBarreraResponse (message: AtacarBarreraResponse) {
    if (encuentraError(message)) return
    atacanTuBarrera(message)
  }

  function atacarCartaResponse (message: AtacarCartaResponse) {
    if (encuentraError(message)) return
    atacarCarta(message)
  }

  function atacanTuCartaResponse (message: AtacarCartaResponse) {
    if (encuentraError(message)) return
    atacanTuCarta(message)
  }

  return { unirASalaSocket }
}

export default useSocketHandler
