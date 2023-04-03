import { create } from 'zustand'
import { type JugadorDesconectadoResponse } from '../../../api/src/response'

interface WaitingRoomStore {
  players: string[]
  start: boolean
  setPlayers: (players: string[]) => void
  setStart: (start: boolean) => void
  salirDeSala: (message: JugadorDesconectadoResponse) => void
}

export const useWaitingRoomStore = create<WaitingRoomStore>((set) => ({
  players: [],
  start: false,
  setPlayers: (players) => { set({ players }) },
  setStart: (start) => { set({ start }) },
  salirDeSala: (message: JugadorDesconectadoResponse) => {
    const { resultado, jugadores, iniciar } = message.payload
    console.log(resultado)
    set({
      players: jugadores,
      start: iniciar
    })
  }
}))
