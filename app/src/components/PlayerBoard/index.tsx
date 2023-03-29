import { type Carta } from '../../../../api/src/types'
import { PosBatalla } from '../../constants/celdabatalla'
import { STEP_ACTION } from '../../constants/stepAction'
import { type CartaEnMano } from '../../types/CartaEnMano'
import { type CeldaBatalla } from '../../types/CeldaBatalla'
import classes from './styles.module.css'
import { seleccionarMano, colocarCartaEnZonaBatallaDesdeMano, seleccionarCeldaEnZonaBatalla } from '../../modules/socket-messages'
import { useGameStore } from '../../hooks/useGameStore'

interface Props {
  children?: JSX.Element
  reverseBoard?: boolean
  zonaBatalla: CeldaBatalla[]
  barrera: boolean[]
  mano: CartaEnMano[]
  enTurno: boolean
  jugadorEnemigo?: boolean
}

export default function PlayerBoard ({ reverseBoard = false, zonaBatalla, barrera, mano, enTurno, jugadorEnemigo = false }: Props) {
  const juegoFinalizado = useGameStore(state => state.juegoFinalizado)
  const stepAction = useGameStore(state => state.stepAction)
  const setStepAction = useGameStore(state => state.setStepAction)
  const setIdCartaZBSeleccionada = useGameStore(state => state.setIdCartaZBSeleccionada)
  const playerId = useGameStore(state => state.playerId)
  const seleccionarCartaEnMano = useGameStore(state => state.seleccionarCartaEnMano)
  const posicionBatalla = useGameStore(state => state.posicionBatalla)
  const idCartaManoSeleccionada = useGameStore(state => state.idCartaManoSeleccionada)

  const additionalPosBatallaClasses = (posicionBatalla: PosBatalla, jugadorEnemigo: boolean) => {
    switch (posicionBatalla) {
      case PosBatalla.DEF_ABAJO: return jugadorEnemigo ? classes.oculto : classes.defensa
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
  const convertUnicode = (unicode: string) => {
    return unicode.replace(/0x([0-9]{4})/g, (a, b) => String.fromCharCode(parseInt(b, 16)))
  }
  const handleClickMano: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (jugadorEnemigo) return
    if (juegoFinalizado) return
    if (!enTurno) return
    let target = e.target as HTMLElement
    while (!target.classList.contains(classes.slot)) target = target.parentElement as HTMLElement
    if (target.classList.contains(classes.mano)) {
      const idCartaManoSeleccionada = Number(target.getAttribute('data-id'))
      // cartaManoSeleccionada = target
      setStepAction(STEP_ACTION.SELECCIONAR_MANO)
      seleccionarCartaEnMano(idCartaManoSeleccionada)
      console.log('stepAccion: ' + STEP_ACTION.SELECCIONAR_MANO)
      seleccionarMano(playerId as string, idCartaManoSeleccionada)
    }
  }
  const handleClickZonaBatalla: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (juegoFinalizado) return
    if (!enTurno) return
    let target = e.target as HTMLElement
    // while (!target.classList.contains(classes.slot) && target.id !== zonaBatallaYo.getAttribute('id')) target = target.parentElement as HTMLElement
    while (!target.classList.contains(classes.slot)) target = target.parentElement as HTMLElement
    const idCartaZBSeleccionada = Number(target.getAttribute('data-id'))
    setIdCartaZBSeleccionada(Number(target.getAttribute('data-id')))
    // cartaZBSeleccionada = target
    if (stepAction === STEP_ACTION.COLOCAR_SELECCIONAR_ZONA_BATALLA) {
      if (
        !(
          target.classList.contains(classes.ataque) ||
            target.classList.contains(classes.defensa) ||
            target.classList.contains(classes.oculto)
        )
      ) {
        console.log('stepAccion: ' + stepAction)
        console.log(target)
        colocarCartaEnZonaBatallaDesdeMano(playerId as string, posicionBatalla as PosBatalla, idCartaZBSeleccionada, idCartaManoSeleccionada as number)
      }
    } else {
      if (
        target.classList.contains(classes.ataque) ||
        target.classList.contains(classes.defensa) ||
        target.classList.contains(classes.oculto)
      ) {
        setStepAction(STEP_ACTION.SELECCIONAR_ZONA_BATALLA)
        console.log('stepAccion: ' + stepAction)
        console.log(target)
        seleccionarCeldaEnZonaBatalla(playerId as string, idCartaZBSeleccionada)
      }
    }
  }

  return (
    <article className={`${reverseBoard ? classes.rotar180 : ''}`}>
        <div className={classes.row} id="zonaBatalla" onClick={handleClickZonaBatalla}>
          {
            zonaBatalla.map((celdaBatalla, id) => {
              return (
                <div key={id} className={`${classes.slot} ${additionalPosBatallaClasses(celdaBatalla?.posicionBatalla as PosBatalla, jugadorEnemigo)} ${celdaBatalla.selected as boolean ? classes.sombrear : ''}`} data-id={id}>
                  <span>{celdaBatalla?.carta?.valor}</span>
                  <span>{convertUnicode(celdaBatalla?.carta?.elemento ?? '')}</span>
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
        <div className={classes.row} id="mano" onClick={handleClickMano}>
          {
            mano.map((cartaEnMano, id) => {
              return (
                <div key={id} className={`${classes.slot} ${additionalCartaEnManoClasses(cartaEnMano.carta as Carta, cartaEnMano.hidden as boolean)} ${cartaEnMano.selected as boolean ? classes.sombrear : ''}`} data-id={id}>
                  <span>{cartaEnMano.carta?.valor}</span>
                  <span>{convertUnicode(cartaEnMano?.carta?.elemento ?? '')}</span>
              </div>
              )
            })
          }
        </div>
    </article>
  )
}
