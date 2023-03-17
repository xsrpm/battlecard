import { type Carta } from '../../../api/src/types'
import { type PosBatalla } from '../constants/celdabatalla'

interface CeldaBatalla {
  carta?: Carta
  posicionBatalla?: PosBatalla
  selected?: boolean
}
