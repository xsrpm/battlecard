import { create } from 'zustand'

interface WaitingRoomStore {
  players: string[]
  start: boolean
  setPlayers: (players: string[]) => void
  setStart: (start: boolean) => void
}

export const useWaitingRoomStore = create<WaitingRoomStore>((set) => ({
  players: [],
  start: false,
  setPlayers: (players) => { set({ players }) },
  setStart: (start) => { set({ start }) }
}))
