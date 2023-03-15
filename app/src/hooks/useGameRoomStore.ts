import { create } from 'zustand'
import { type IniciarJuegoResponse } from '../../../api/src/response'
import { PosBatalla } from '../constants/celdabatalla'
import { type PlayerState } from '../types/PlayerState'

interface GameRoomStore {
  jugador: PlayerState
  jugadorEnemigo: PlayerState
  iniciarJuego: (response: IniciarJuegoResponse) => void
}

export const useGameRoomStore = create<GameRoomStore>((set, get) => ({
  jugador: {
    zonaBatalla: [
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      },
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      },
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      }
    ],
    barrera: [true, true, true, true, true],
    mano: [{
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    }
    ],
    enTurno: true,
    nCardsInDeck: 20,
    nombre: ''
  },
  jugadorEnemigo: {
    zonaBatalla: [
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      },
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      },
      {
        posicionBatalla: PosBatalla.NO_HAY_CARTA,
        selected: false
      }
    ],
    barrera: [true, true, true, true, true],
    mano: [{
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    },
    {
      hidden: false,
      selected: false
    }
    ],
    enTurno: false,
    nCardsInDeck: 20,
    nombre: ''
  },
  iniciarJuego: (response: IniciarJuegoResponse) => {
    const manoJugador = get().jugador.mano.map((v, id) => {
      return { ...get().jugador.mano[id], carta: response.payload.jugador?.mano[id] }
    })
    set((state) => ({
      jugador: {
        ...state.jugador,
        mano: manoJugador,
        enTurno: response.payload.jugador?.enTurno as boolean,
        nombre: response.payload.jugador?.nombre as string,
        nCardsInDeck: response.payload.jugador?.nDeck as number
      }
    }))
  }
}))
