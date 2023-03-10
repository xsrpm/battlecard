import { create } from 'zustand'
import { Page } from '../constants/juego'

interface AppStore {
  actualPage: string
  playerId: string
  changeActualPage: (pageName: string) => void
  setPlayerId: (player: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  actualPage: Page.WELCOME,
  playerId: '',
  changeActualPage: (pageName) => { set({ actualPage: pageName }) },
  setPlayerId: (playerId: string) => { set({ playerId }) }
}))
