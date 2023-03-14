import { type Carta } from '../../../../api/src/types'
import { PosBatalla } from '../../constants/celdabatalla'
import { type CartaEnMano } from '../../types/CartaEnMano'
import { type CeldaBatalla } from '../../types/CeldaBatalla'
import classes from './styles.module.css'

interface Props {
  children?: JSX.Element
  reverseBoard?: boolean
  zonaBatalla: CeldaBatalla[]
  barrera: boolean[]
  mano: CartaEnMano[]
}
/*
  <div className={classes.slot} data-id="2">
    <span></span>
    <span></span>
  </div>
*/
/*
  <div className={classes.slot} data-id="0"></div>
*/
/*
  <div className={`${classes.slot} ${classes.oculto}`} data-id="0">
    <span></span>
    <span></span>
  </div>
*/

export default function PlayerBoard ({ reverseBoard = false, zonaBatalla, barrera, mano }: Props) {
  const additionalPosBatallaClasses = (posicionBatalla: PosBatalla) => {
    switch (posicionBatalla) {
      case PosBatalla.DEF_ABAJO: return classes.oculto
      case PosBatalla.ATAQUE: return classes.ataque
      case PosBatalla.DEF_ARRIBA: return classes.defensa
      default: return ''
    }
  }
  const additionalCartaEnManoClasses = (carta: Carta, hidden: boolean) => {
    if (hidden) return classes.oculto
    else if (typeof carta === 'undefined') return ''
    else return classes.mano
  }
  return (
    <article className={`${reverseBoard ? classes.rotar180 : ''}`}>
        <div className={classes.row} id="zonaBatalla">
          {
            zonaBatalla.map((celdaBatalla, id) => {
              return (
                <div key={id} className={`${classes.slot} ${additionalPosBatallaClasses(celdaBatalla?.posicionBatalla as PosBatalla)} ${celdaBatalla.selected ? classes.sombrear : ''}`} data-id={id}>
                  <span>{celdaBatalla?.carta?.valor}</span>
                  <span>{celdaBatalla?.carta?.elemento}</span>
                </div>
              )
            })
          }
        </div>
        <div className={classes.row} id="barrera">
          {
            barrera.map((carta, id) => {
              return (
                <div key={id} className={`${classes.slot} ${carta ? classes.barrera : ''}`} data-id={id}></div>
              )
            })
          }
        </div>
        <div className={classes.row} id="mano">
          {
            mano.map((cartaEnMano, id) => {
              return (
                <div key={id} className={`${classes.slot} ${additionalCartaEnManoClasses(cartaEnMano.carta as Carta, cartaEnMano.hidden)} ${cartaEnMano.selected ? classes.sombrear : ''}`} data-id={id}>
                  <span>{cartaEnMano.carta?.valor}</span>
                  <span>{cartaEnMano.carta?.elemento}</span>
              </div>
              )
            })
          }
        </div>
    </article>
  )
}
