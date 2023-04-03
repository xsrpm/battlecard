import { PosBatalla } from '../../constants/celdabatalla'
import { Page } from '../../constants/juego'
import { STEP_ACTION } from '../../constants/stepAction'
import { useAppStore } from '../../hooks/useAppStore'
import { useGameStore } from '../../hooks/useGameStore'
import { atacarBarreraDesdeZonaBatallaSeleccionada, cambiarPosicionEnZonaBatallaSeleccionada, terminarTurno } from '../../modules/socket-messages'
import classes from './styles.module.css'

export default function KeyPad () {
  const { buttons, message } = useGameStore(state => state.botonera)
  const playerId = useGameStore(state => state.playerId)
  const stepAction = useGameStore(state => state.stepAction)
  const cambiarPosicionClick = useGameStore(state => state.cambiarPosicionClick)
  const idCartaZBSeleccionada = useGameStore(state => state.idCartaZBSeleccionada)
  const colocarCartaClick = useGameStore(state => state.colocarCartaClick)
  const atacarCartaClick = useGameStore(state => state.atacarCartaClick)
  const changeActualPage = useAppStore(state => state.changeActualPage)
  const colocarEnAtaqueHandleClick = () => {
    colocarCartaClick(PosBatalla.ATAQUE)
  }
  const colocarEnDefensaHandleClick = () => {
    colocarCartaClick(PosBatalla.DEF_ABAJO)
  }
  const terminarTurnoHandleClick = () => {
    terminarTurno(playerId as string)
  }
  const cambiarPosicionHandleClick = () => {
    if (stepAction === STEP_ACTION.SELECCIONAR_ZONA_BATALLA) {
      cambiarPosicionClick()
      cambiarPosicionEnZonaBatallaSeleccionada(playerId as string, idCartaZBSeleccionada as number)
    }
  }
  const atacarBarreraHandleClick = () => {
    atacarBarreraDesdeZonaBatallaSeleccionada(playerId as string, idCartaZBSeleccionada as number)
  }
  const atacarCartaHandleClick = () => {
    atacarCartaClick()
  }
  const finDeJuegoHandleClick = () => {
    changeActualPage(Page.GAME_RESULT)
  }
  return (
    <article className={classes.keyPad}>
      <p id="mensajeBotones">{message}</p>
      {buttons.colocarEnAtaque as boolean && <button id="btnColocarEnAtaque" className="btnColocarEnAtaque" onClick={colocarEnAtaqueHandleClick}>de ataque</button>}
      {buttons.colocarEnDefensa as boolean && <button id="btnColocarEnDefensa" className="btnColocarEnDefensa" onClick={colocarEnDefensaHandleClick}>de defensa</button>}
      {buttons.atacarCarta as boolean && <button id="btnAtacarCarta" onClick={atacarCartaHandleClick}>Atacar carta</button>}
      {buttons.atacarBarrera as boolean && <button id="btnAtacarBarrera" className="btnAtacarBarrera" onClick={atacarBarreraHandleClick}>Atacar barrera</button>}
      {buttons.cambiarPosicion as boolean && <button id="btnCambiarPosicion" onClick={cambiarPosicionHandleClick}>Cambiar posición</button>}
      {buttons.terminarTurno as boolean && <button id="btnTerminarTurno" onClick={terminarTurnoHandleClick}>Terminar turno</button>}
      {buttons.finDeJuego as boolean && <button id="btnFinDeJuego" onClick={finDeJuegoHandleClick}>Fin de Juego</button>}
    </article>
  )
}
