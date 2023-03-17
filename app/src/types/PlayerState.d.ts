import { type CartaEnMano } from './CartaEnMano'
import { type CeldaBatalla } from './CeldaBatalla'

export interface PlayerState {
  zonaBatalla: CeldaBatalla[]
  barrera: boolean[]
  mano: CartaEnMano[]
  enTurno: boolean
  nombre: string
  nCardsInDeck: number
}
