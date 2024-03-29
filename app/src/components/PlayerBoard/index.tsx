import { type Carta } from '../../../../api/src/types'
import { PosBatalla } from '../../constants/celdabatalla'
import { STEP_ACTION } from '../../constants/stepAction'
import { type CartaEnMano } from '../../types/CartaEnMano'
import { type CeldaBatalla } from '../../types/CeldaBatalla'
import classes from './styles.module.css'
import { seleccionarMano, colocarCartaEnZonaBatallaDesdeMano, seleccionarCeldaEnZonaBatalla, atacarCarta } from '../../modules/socket-messages'
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
  const setIdCartaZBEnemigaSeleccionada = useGameStore(state => state.setIdCartaZBEnemigaSeleccionada)
  const playerId = useGameStore(state => state.playerId)
  const seleccionarCartaEnMano = useGameStore(state => state.seleccionarCartaEnMano)
  const posicionBatalla = useGameStore(state => state.posicionBatalla)
  const idCartaManoSeleccionada = useGameStore(state => state.idCartaManoSeleccionada)
  const idCartaZBSeleccionada = useGameStore(state => state.idCartaZBSeleccionada)

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
      setStepAction(STEP_ACTION.SELECCIONAR_MANO)
      seleccionarCartaEnMano(idCartaManoSeleccionada)
      console.log('stepAccion: ' + STEP_ACTION.SELECCIONAR_MANO)
      seleccionarMano(playerId as string, idCartaManoSeleccionada)
    }
  }
  const handleClickZonaBatalla: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (juegoFinalizado) return
    // if (!enTurno) return
    let target = e.target as HTMLElement
    while (!target.classList.contains(classes.slot)) {
      if (target.getAttribute('data-section') === 'zonaBatalla') break
      target = target.parentElement as HTMLElement
    }

    if (jugadorEnemigo) {
      if (stepAction === STEP_ACTION.ATACAR_CARTA_SELECCIONAR_ZB_ENEMIGA) {
        if (
          target.classList.contains(classes.ataque) ||
          target.classList.contains(classes.defensa) ||
          target.classList.contains(classes.oculto)
        ) {
          console.log('stepAccion: ' + stepAction)
          console.log('target: ', target)
          const idCartaZBEnemigaSeleccionada = Number(target.getAttribute('data-id'))
          setIdCartaZBEnemigaSeleccionada(Number(target.getAttribute('data-id')))
          atacarCarta(playerId as string, idCartaZBSeleccionada as number, idCartaZBEnemigaSeleccionada)
        }
      }
    } else {
      const idCartaZBSeleccionada = Number(target.getAttribute('data-id'))
      setIdCartaZBSeleccionada(Number(target.getAttribute('data-id')))
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
  }

  return (
    <article className={`${reverseBoard ? classes.rotar180 : ''}`}>
        <section className={classes.row} data-section="zonaBatalla" onClick={handleClickZonaBatalla}>
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
        </section>
        <section className={classes.row} data-section="barrera">
          {
            barrera.map((carta, id) => {
              return (
                <div key={id} className={`${classes.slot} ${carta ? classes.barrera : ''}`} data-id={id}></div>
              )
            })
          }
        </section>
        <section className={classes.row} data-section="mano" onClick={handleClickMano}>
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
        </section>
    </article>
  )
}
