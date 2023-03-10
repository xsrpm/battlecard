import { WebsocketEventTitle } from './../constants/websocket-event-title'
import { type UnirASalaResponse } from '../../../api/src/response'
import { unirASala } from './socket-messages'
import { encuentraError, initSocket } from './socket'
import { useAppStore } from '../hooks/useAppStore'
import { Page } from '../constants/juego'
import { useWaitingRoomStore } from '../hooks/useWaitingRoomStore'

function useSocketHandler () {
  const changeActualPage = useAppStore(state => state.changeActualPage)
  const playerId = useAppStore(state => state.playerId)
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
    if (playerId !== undefined) setPlayerId(jugadorId as string)
    setPlayers(jugadores)
    setStart(iniciar)
    // h2[0].innerText = '(Sin Jugador)'
    // h2[1].innerText = '(Sin Jugador)'
    // for (let i = 0; i < jugadores.length; i++) {
    //  h2[i].innerText = jugadores[i]
    // }
    // iniciar ? (btnIniciarJuego.disabled = false) : (btnIniciarJuego.disabled = true)
    changeActualPage(Page.WAITING_ROOM)
  }

  return { unirASalaResponse, unirASalaSocket }
}

export default useSocketHandler
