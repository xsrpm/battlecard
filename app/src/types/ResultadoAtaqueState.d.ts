import { type Carta } from '../../../api/src/types'

interface ResultadoAtaqueState {
  mostrar: boolean
  atacante?: {
    carta: Carta
    bonus: string
  }
  atacado?: {
    carta: Carta
    bonus: string
  }
  veredicto?: string
  detalleVeredicto?: string
}
