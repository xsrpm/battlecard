import { create } from 'zustand'
import { Page } from '../constants/juego'

interface AppStore {
  actualPage: string
  playerId?: string
  changeActualPage: (pageName: string) => void
  setPlayerId: (player: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  actualPage: Page.WELCOME,
  playerId: undefined,
  changeActualPage: (pageName) => {
    set((state) => ({
      ...state, actualPage: pageName
    }))
  },
  setPlayerId: (playerId) => { set({ playerId }) }
}))
