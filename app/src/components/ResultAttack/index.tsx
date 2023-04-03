import { type Carta } from '../../../../api/src/types'
import { useGameStore } from '../../hooks/useGameStore'
import classes from './styles.module.css'

interface Props {
  cartaAtacante: Carta
  bonusAtacante: string
  cartaAtacada: Carta
  bonusAtacada: string
  veredicto: string
  detalleVeredicto: string
}

export default function ResultAttack ({ cartaAtacante, bonusAtacante, cartaAtacada, bonusAtacada, veredicto, detalleVeredicto }: Props) {
  const ocultarResultadoAtaque = useGameStore(state => state.ocultarResultadoAtaque)
  const convertUnicode = (unicode: string) => {
    return unicode.replace(/0x([0-9]{4})/g, (a, b) => String.fromCharCode(parseInt(b, 16)))
  }
  const resultadoAtaqueHandleClick = () => {
    ocultarResultadoAtaque()
  }
  return (
    <div className={classes.resultadoAtaque} onClick={resultadoAtaqueHandleClick}>
      <div className={classes.atacante}>
        Atacante
      </div>
      <div className={classes.carta}>
        <slot>{cartaAtacante.valor}</slot>
        <slot>{convertUnicode(cartaAtacante.elemento)}</slot>
      </div>
      <div className={classes.bonusAtacante}>
        <slot>{bonusAtacante}</slot>
      </div>
      <div className={classes.vs}>
        <span>VS</span>
      </div>
      <div className={classes.resultado}>
        <slot>{veredicto}</slot>
      </div>
      <div className={classes.detalleResultado}>
        <slot>{detalleVeredicto}</slot>
      </div>
      <div className={classes.atacado}>
        Atacado
      </div>
      <div className={classes.carta}>
        <slot>{cartaAtacada.valor}</slot>
        <slot>{convertUnicode(cartaAtacada.elemento)}</slot>
      </div>
      <div className={classes.bonusAtacado}>
        <slot>{bonusAtacada}</slot>
      </div>
    </div>
  )
}
