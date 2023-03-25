import { posicionBatalla } from './../modules/estadoGlobal'
import { create } from 'zustand'
import { type SeleccionarManoResponse, type IniciarJuegoResponse } from '../../../api/src/response'
import { PosBatalla } from '../constants/celdabatalla'
import { type KeyPadState } from '../types/KeyPadState'
import { type PlayerState } from '../types/PlayerState'
import { STEP_ACTION } from '../constants/stepAction'
import { ResultadoColocarCarta } from '../constants/jugador'

interface GameStore {
  jugador: PlayerState
  jugadorEnemigo: PlayerState
  botonera: KeyPadState
  gameInfo: GameInfoState
  resultadoAtaque: ResultadoAtaqueState
  stepAction: string
  playerId?: string
  setPlayerId: (playerId: string) => void
  setStepAction: (stepAction: string) => void
  juegoFinalizado: boolean
  posicionBatalla?: PosBatalla
  setPosicionBatalla: (posicionBatalla: PosBatalla) => void
  seleccionarCartaEnMano: (idCartaEnMano: number) => void
  iniciarJuego: (response: IniciarJuegoResponse) => void
  updateBotoneraBySelectCartaEnMano: (response: SeleccionarManoResponse) => void
  colocarCartaClick: (posicionBatalla: PosBatalla) => void
}

export const useGameStore = create<GameStore>((set, get) => ({
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
  stepAction: STEP_ACTION.STAND_BY,
  setStepAction: (stepAction) => {
    set({ stepAction })
  },
  setPlayerId: (playerId) => {
    set({ playerId })
  },
  juegoFinalizado: false,
  setPosicionBatalla: (posicionBatalla) => {
    set({ posicionBatalla })
  },
  seleccionarCartaEnMano: (idCartaEnMano) => {
    const manoUpdated = get().jugador.mano.map((cartaEnMano, id) => {
      return { carta: cartaEnMano.carta, selected: id === idCartaEnMano }
    })
    set({
      jugador: {
        ...get().jugador,
        mano: manoUpdated
      }
    })
  },
  iniciarJuego: (response) => {
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
  },
  updateBotoneraBySelectCartaEnMano: (response) => {
    const { existeCarta, puedeColocarCarta } = response.payload
    const botoneraUpdated = () => {
      if (puedeColocarCarta === ResultadoColocarCarta.POSIBLE) {
        return {
          buttons: {
            terminarTurno: true,
            colocarEnAtaque: true,
            colocarEnDefensa: true
          },
          message: 'Colocar carta en posición...'
        }
      } else {
        return {
          buttons: {
            terminarTurno: true
          },
          message: puedeColocarCarta
        }
      }
    }
    if (existeCarta) {
      set(() => ({
        botonera: botoneraUpdated()
      }))
    }
  },
  colocarCartaClick: (posicionBatalla: PosBatalla) => {
    if (get().stepAction === STEP_ACTION.SELECCIONAR_MANO) {
      console.log('stepAccion: ' + STEP_ACTION.COLOCAR_CARTA)
      console.log('posicionBatalla: ' + posicionBatalla)
      const seleccionarCeldasNoOcupadas = get().jugador.zonaBatalla.map((celda) => {
        return { selected: !(celda.posicionBatalla === PosBatalla.ATAQUE || celda.posicionBatalla === PosBatalla.DEF_ABAJO || celda.posicionBatalla === PosBatalla.DEF_ARRIBA) }
      })
      set(() => ({
        botonera: {
          buttons: { terminarTurno: true },
          message: 'Seleccione ubicación en zona de batalla...'
        },
        posicionBatalla,
        stepAction: STEP_ACTION.COLOCAR_SELECCIONAR_ZONA_BATALLA,
        jugador: {
          ...get().jugador,
          zonaBatalla: seleccionarCeldasNoOcupadas
        }
      }))
    }
  }
}))
