import { create } from 'zustand'
import { type SeleccionarManoResponse, type IniciarJuegoResponse, type ColocarCartaResponse, type SeleccionarZonaBatallaResponse, type ColocarCartaOtroJugadorResponse, type TerminarTurnoResponse, type CambiarPosicionResponse } from '../../../api/src/response'
import { PosBatalla } from '../constants/celdabatalla'
import { type KeyPadState } from '../types/KeyPadState'
import { type PlayerState } from '../types/PlayerState'
import { STEP_ACTION } from '../constants/stepAction'
import { ResultadoAtacarBarrera, ResultadoAtacarCarta, ResultadoCambiarPosicion, ResultadoCogerCarta, ResultadoColocarCarta } from '../constants/jugador'
import { type Carta } from '../../../api/src/types'

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
  idCartaZBSeleccionada?: number
  setIdCartaZBSeleccionada: (idCartaZBSeleccionada: number) => void
  idCartaManoSeleccionada?: number
  seleccionarCartaEnMano: (idCartaEnMano: number) => void
  iniciarJuego: (response: IniciarJuegoResponse) => void
  updateBotoneraBySelectCartaEnMano: (response: SeleccionarManoResponse) => void
  colocarCartaClick: (posicionBatalla: PosBatalla) => void
  colocarCarta: (message: ColocarCartaResponse) => void
  seleccionarZonaBatalla: (message: SeleccionarZonaBatallaResponse) => void
  colocarCartaOtroJugador: (message: ColocarCartaOtroJugadorResponse) => void
  terminarTurno: (message: TerminarTurnoResponse) => void
  agregarCartaRecogida: (message: TerminarTurnoResponse) => void
  terminarJuego: (message: TerminarTurnoResponse) => void
  nombreJugadorDerrotado?: string
  nombreJugadorVictorioso?: string
  cambiarPosicionClick: () => void
  cambiarPosicion: (message: CambiarPosicionResponse) => void
  cambiarPosicionEnemigo: (message: CambiarPosicionResponse) => void
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
  setIdCartaZBSeleccionada: (idCartaZBSeleccionada) => {
    set({ idCartaZBSeleccionada })
  },
  seleccionarCartaEnMano: (idCartaEnMano) => {
    const manoUpdated = get().jugador.mano.map((cartaEnMano, id) => {
      return { carta: cartaEnMano.carta, selected: id === idCartaEnMano }
    })
    const zonaBatallaNoSelected = get().jugador.zonaBatalla.map((celdabatalla) => {
      return { ...celdabatalla, selected: false }
    })
    set({
      jugador: {
        ...get().jugador,
        mano: manoUpdated,
        zonaBatalla: zonaBatallaNoSelected
      },
      idCartaManoSeleccionada: idCartaEnMano
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
      console.log(posicionBatalla)
      const seleccionarCeldasNoOcupadas = get().jugador.zonaBatalla.map((celda) => {
        return { ...celda, selected: !(celda.posicionBatalla === PosBatalla.ATAQUE || celda.posicionBatalla === PosBatalla.DEF_ABAJO || celda.posicionBatalla === PosBatalla.DEF_ARRIBA) }
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
  },
  colocarCarta: (message: ColocarCartaResponse) => {
    const { resultado, mano } = message.payload
    if (resultado === ResultadoColocarCarta.CARTA_COLOCADA) {
      const cartaPorColocar = get().jugador.mano.find((cartaEnMano) => {
        return cartaEnMano.selected
      })?.carta
      const updatedMano = get().jugador.mano.map((_, id) => {
        return { carta: mano[id], selected: false }
      })
      const zonaBatallaUpdated = get().jugador.zonaBatalla.map((celdabatalla, id) => {
        const newCelda = { ...celdabatalla, selected: false }
        if (id === get().idCartaZBSeleccionada) {
          newCelda.carta = cartaPorColocar
          newCelda.posicionBatalla = get().posicionBatalla
        }
        return newCelda
      })
      set({
        jugador: {
          ...get().jugador,
          mano: updatedMano,
          zonaBatalla: zonaBatallaUpdated
        },
        botonera: {
          buttons: { terminarTurno: true },
          message: ''
        },
        stepAction: STEP_ACTION.STAND_BY
      })
      console.log('CARTA COLOCADA')
    }
  },
  seleccionarZonaBatalla: (message: SeleccionarZonaBatallaResponse) => {
    const {
      existeCarta,
      puedeAtacarCarta,
      puedeAtacarBarrera,
      puedeCambiarPosicion
    } = message.payload
    if (existeCarta) {
      const zonaBatallaUpdated = get().jugador.zonaBatalla.map((celdabatalla, id) => {
        return { ...celdabatalla, selected: get().idCartaZBSeleccionada === id }
      })
      const manoUpdated = get().jugador.mano.map((cartaEnMano) => {
        return { ...cartaEnMano, selected: false }
      })
      const updateBotonera = {
        buttons: { terminarTurno: true, atacarCarta: puedeAtacarCarta === ResultadoAtacarCarta.POSIBLE, atacarBarrera: puedeAtacarBarrera === ResultadoAtacarBarrera.POSIBLE, cambiarPosicion: puedeCambiarPosicion === ResultadoCambiarPosicion.POSIBLE },
        message: puedeAtacarCarta === ResultadoAtacarCarta.POSIBLE ||
          puedeAtacarBarrera === ResultadoAtacarBarrera.POSIBLE ||
          puedeCambiarPosicion === ResultadoCambiarPosicion.POSIBLE
          ? 'Seleccione acción'
          : 'No acciones disponibles'
      }

      set({
        jugador: {
          ...get().jugador,
          zonaBatalla: zonaBatallaUpdated,
          mano: manoUpdated
        },
        botonera: updateBotonera
      })
    }
  },
  colocarCartaOtroJugador: (message: ColocarCartaOtroJugadorResponse) => {
    const { posicion, idZonaBatalla, idMano, resultado, carta } = message.payload
    if (resultado === ResultadoColocarCarta.CARTA_COLOCADA) {
      const zonaBatallaUpdated = get().jugadorEnemigo.zonaBatalla.map((celdabatalla, id) => {
        const newCelda = { ...celdabatalla }
        if (id === idZonaBatalla) {
          newCelda.carta = carta
          newCelda.posicionBatalla = posicion as PosBatalla
        }
        return newCelda
      })
      const updateManoEnemigo = get().jugadorEnemigo.mano.map((cartaEnMano, id) => {
        return { ...cartaEnMano, hidden: id !== idMano }
      })
      set({
        jugadorEnemigo: {
          ...get().jugadorEnemigo,
          mano: updateManoEnemigo,
          zonaBatalla: zonaBatallaUpdated
        },
        stepAction: STEP_ACTION.STAND_BY
      })
      console.log('CARTA COLOCADA POR ENEMIGO')
    }
  },
  terminarTurno: (message: TerminarTurnoResponse) => {
    const { jugador, jugadorEnemigo } = message.payload
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
    const zonaBatallaUpdated = get().jugador.zonaBatalla.map((celdabatalla) => {
      return { ...celdabatalla, selected: false }
    })
    const manoUpdated = get().jugador.mano.map((cartaEnMano) => {
      return { ...cartaEnMano, selected: false }
    })
    set({
      jugador: {
        ...get().jugador,
        enTurno: jugador.enTurno,
        nCardsInDeck: jugador.nDeck,
        zonaBatalla: zonaBatallaUpdated,
        mano: manoUpdated
      },
      jugadorEnemigo: {
        ...get().jugadorEnemigo,
        enTurno: jugadorEnemigo.enTurno,
        nCardsInDeck: jugadorEnemigo.nDeck
      },
      botonera: botoneraEstado(jugador.enTurno)
    })
  },
  agregarCartaRecogida: (message: TerminarTurnoResponse) => {
    const { carta } = message.payload
    const manoEnemigo = [...get().jugadorEnemigo.mano]
    const manoJugador = [...get().jugador.mano]
    if (typeof carta !== 'undefined') {
      manoJugador[4] = { carta, selected: false }
    } else {
      manoEnemigo[4] = { selected: false, hidden: true }
    }
    set({
      jugador: {
        ...get().jugador,
        mano: manoJugador
      },
      jugadorEnemigo: {
        ...get().jugadorEnemigo,
        mano: manoEnemigo
      }
    })
  },
  terminarJuego: (message: TerminarTurnoResponse) => {
    const { resultado, nombreJugadorDerrotado, nombreJugadorVictorioso } = message.payload
    const customMessage = (resultado: string) => {
      switch (resultado) {
        case ResultadoCogerCarta.DECK_VACIO: return `${nombreJugadorDerrotado as string} se ha quedado sin cartas para tomar del deck`
        default: return 'CASO POR DEFECTO'
      }
    }
    set({
      nombreJugadorDerrotado: nombreJugadorDerrotado as string,
      nombreJugadorVictorioso: nombreJugadorVictorioso as string,
      botonera: {
        buttons: { finDeJuego: true }
      },
      gameInfo: {
        mostrar: true,
        message: customMessage(resultado as string)
      }
    })
  },
  cambiarPosicionClick: () => {
    set({
      stepAction: STEP_ACTION.CAMBIAR_POSICION,
      botonera: {
        buttons: { terminarTurno: true }
      }
    })
    console.log(STEP_ACTION.CAMBIAR_POSICION)
  },
  cambiarPosicion: (message: CambiarPosicionResponse) => {
    const { respuesta, posBatalla } = message.payload
    if (get().stepAction === STEP_ACTION.CAMBIAR_POSICION) {
      if (respuesta === ResultadoCambiarPosicion.POSICION_CAMBIADA) {
        const updatedZonaBatalla = get().jugador.zonaBatalla.map((celdaBatalla, id) => {
          return { ...celdaBatalla, posicionBatalla: id === get().idCartaZBSeleccionada ? posBatalla as PosBatalla : celdaBatalla.posicionBatalla }
        })
        set({
          jugador: {
            ...get().jugador,
            zonaBatalla: updatedZonaBatalla
          }
        })
      }
    }
  },
  cambiarPosicionEnemigo: (message: CambiarPosicionResponse) => {
    const { respuesta, posBatalla, idZonaBatalla, carta } = message.payload
    if (respuesta === ResultadoCambiarPosicion.POSICION_CAMBIADA) {
      const updatedZonaBatalla = get().jugadorEnemigo.zonaBatalla.map((celdaBatalla, id) => {
        return { ...celdaBatalla, carta: id === idZonaBatalla ? carta as Carta : celdaBatalla.carta, posicionBatalla: id === idZonaBatalla ? posBatalla as PosBatalla : celdaBatalla.posicionBatalla }
      })
      set({
        jugadorEnemigo: {
          ...get().jugadorEnemigo,
          zonaBatalla: updatedZonaBatalla
        }
      })
    }
  }

}))
