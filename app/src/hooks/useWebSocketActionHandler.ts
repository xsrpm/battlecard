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
    // inicializarJuego(message)
    // mostrarJugadorEnTurno(message as TerminarTurnoResponse)
    // habilitacionBotonera()
    changeActualPage(Page.GAME_ROOM)
  }
  /*
  function inicializarJuego (message: IniciarJuegoResponse) {
    if (encuentraError(message)) return
    const jugador = message.payload.jugador
    const jugadorEnemigo = message.payload.jugadorEnemigo

    if (jugador != null && jugadorEnemigo != null) {
      for (let i = 0; i < jugador.nBarrera; i++) {
        barreraYo.children[i].classList.add('barrera')
      }
      (jugDown.querySelector("span[slot='jugadorNombre']") as HTMLHeadingElement).innerHTML = jugador.nombre;
      (jugDown.querySelector("span[slot='nCartas']") as HTMLHeadingElement).innerHTML = jugador.nDeck.toString()
      jugador.mano.forEach((c: Carta, i: number) => {
        manoYo.children[i].classList.add('mano')
        manoYo.children[i].children[0].innerHTML = c.valor.toString()
        manoYo.children[i].children[1].innerHTML = String.fromCharCode(c.elemento as any)
      })

      Array.from(zonaBatallaYo.children).forEach((el) => {
        el.classList.remove('ataque', 'defensa', 'oculto')
        el.children[0].innerHTML = ''
        el.children[1].innerHTML = ''
      })
      Array.from(zonaBatallaEnemiga.children).forEach((el) => {
        el.classList.remove('ataque', 'defensa', 'oculto')
        el.children[0].innerHTML = ''
        el.children[1].innerHTML = ''
      })
      for (let i = 0; i < jugadorEnemigo.nBarrera; i++) {
        barreraEnemiga.children[i].classList.add('barrera')
      }
      for (let i = 0; i < jugadorEnemigo.nMano; i++) {
        manoEnemigo.children[i].classList.add('oculto')
      }
      (jugUp.querySelector("span[slot='jugadorNombre']") as HTMLHeadingElement).innerHTML = jugadorEnemigo.nombre;
      (jugUp.querySelector("span[slot='nCartas']") as HTMLHeadingElement).textContent = jugadorEnemigo.nDeck.toString()
      btnTerminarTurno.classList.remove('ocultar')
      btnFinDeJuego.classList.add('ocultar')
      info.classList.remove('mostrarResultado')
      resultadoAtaque.setAttribute('mostrar', 'false')
      setSinBarrerasFlag(false)
      setJuegoFinalizado(false)
    }

  }
 */
  return { unirASalaSocket, iniciarJuegoResponse }
}

export default useSocketHandler
