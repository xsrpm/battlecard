import { create } from 'zustand'

interface ReceptionRoomStore {
  submitDisabled: boolean
  setSubmitDisabled: (submitEnabled: boolean) => void
}

export const useReceptionRoomStore = create<ReceptionRoomStore>((set) => ({
  submitDisabled: false,
  setSubmitDisabled: (submitDisabled) => { set({ submitDisabled }) }
}))
