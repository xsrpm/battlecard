import { create } from 'zustand'

interface WaitingRoomStore {
  players: string[]
  start: boolean
  updateSala: (jugadores: string[], start: boolean) => void
}

export const useWaitingRoomStore = create<WaitingRoomStore>((set) => ({
  players: [],
  start: false,
  updateSala: (players: string[], start: boolean) => {
    set({
      players,
      start
    })
  }
}))
