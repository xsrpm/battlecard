export interface PlayerState {
  zonaBatalla: CeldaBatalla[]
  barrera: boolean[]
  mano: CartaEnMano[]
  enTurno: boolean
  nombre: string
  nCardsInDeck: number
}
