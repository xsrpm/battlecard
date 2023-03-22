import { resultadoAtaque } from './../components/resultado-ataque2'
import { create } from 'zustand'
import { type IniciarJuegoResponse } from '../../../api/src/response'
import { PosBatalla } from '../constants/celdabatalla'
import { type KeyPadState } from '../types/KeyPadState'
import { type PlayerState } from '../types/PlayerState'

interface GameRoomStore {
  jugador: PlayerState
  jugadorEnemigo: PlayerState
  botonera: KeyPadState
  gameInfo: GameInfoState
  resultadoAtaque: ResultadoAtaqueState
  iniciarJuego: (response: IniciarJuegoResponse) => void
}

export const useGameRoomStore = create<GameRoomStore>((set, get) => ({
  jugador: {
    zonaBatalla: [{}, {}, {}],
    barrera: [true, true, true, true, true],
    mano: [{}, {}, {}, {}, {}],
    enTurno: true,
    nCardsInDeck: 20,
    nombre: ''
  },
  jugadorEnemigo: {
    zonaBatalla: [{}, {}, {}],
    barrera: [true, true, true, true, true],
    mano: [{}, {}, {}, {}, {}],
    enTurno: false,
    nCardsInDeck: 20,
    nombre: ''
  },
  botonera: {
    buttons: {
      colocarEnAtaque: false,
      colocarEnDefensa: false,
      atacarCarta: false,
      atacarBarrera: false,
      cambiarPosicion: false,
      terminarTurno: false,
      finDeTurno: false
    },
    message: ''
  },
  gameInfo: {
    mostrar: false
  },
  resultadoAtaque: {
    mostrar: false
  },
  iniciarJuego: (response: IniciarJuegoResponse) => {
    const manoJugador = get().jugador.mano.map((_, id) => {
      return { carta: response.payload.jugador?.mano[id] }
    })
    const manoJugadorEnemigo = get().jugadorEnemigo.mano.map(() => {
      return { hidden: true }
    })
    const zonaBatallaJugador = get().jugador.zonaBatalla.map(() => {
      return { posicionBatalla: PosBatalla.NO_HAY_CARTA }
    })
    const botoneraEstado = (enTurno: boolean) => {
      if (enTurno) {
        return {
          buttons: { terminarTurno: true }
        }
      }
      return {
        buttons: {}
      }
    }
    set(() => ({
      jugador: {
        zonaBatalla: zonaBatallaJugador,
        mano: manoJugador,
        enTurno: response.payload.jugador?.enTurno as boolean,
        nombre: response.payload.jugador?.nombre as string,
        nCardsInDeck: response.payload.jugador?.nDeck as number,
        barrera: Array(response.payload.jugador?.nBarrera).fill(true)
      },
      jugadorEnemigo: {
        zonaBatalla: zonaBatallaJugador,
        mano: manoJugadorEnemigo,
        enTurno: response.payload.jugadorEnemigo?.enTurno as boolean,
        nombre: response.payload.jugadorEnemigo?.nombre as string,
        nCardsInDeck: response.payload.jugadorEnemigo?.nDeck as number,
        barrera: Array(response.payload.jugadorEnemigo?.nBarrera).fill(true)
      },
      botonera: botoneraEstado(response.payload.jugador?.enTurno as boolean),
      gameInfo: { mostrar: false },
      resultadoAtaque: { mostrar: false }
    }))
  }
}))
