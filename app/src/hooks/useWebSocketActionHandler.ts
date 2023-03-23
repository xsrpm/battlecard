import { WebsocketEventTitle } from '../constants/websocket-event-title'
import { type IniciarJuegoResponse, type UnirASalaResponse } from '../../../api/src/response'
import { unirASala } from '../modules/socket-messages'
import { encuentraError, initSocket } from '../modules/socket'
import { useAppStore } from './useAppStore'
import { Page } from '../constants/juego'
import { useWaitingRoomStore } from './useWaitingRoomStore'
import { useGameRoomStore } from './useGameRoomStore'

function useSocketHandler () {
  console.log('useSocketHandler')
  const changeActualPage = useAppStore(state => state.changeActualPage)
  const iniciarJuego = useGameRoomStore(state => state.iniciarJuego)
  const setPlayerId = useAppStore(state => state.setPlayerId)
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
    }
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

  return { unirASalaSocket, iniciarJuegoResponse }
}

export default useSocketHandler
