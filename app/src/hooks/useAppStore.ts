import { create } from 'zustand'
import { Page } from '../constants/juego'

interface AppStore {
  actualPage: string
  changeActualPage: (pageName: string) => void
}

export const useAppStore = create<AppStore>((set) => ({
  actualPage: Page.WELCOME,
  changeActualPage: (pageName) => {
    set({ actualPage: pageName })
  }
}))
