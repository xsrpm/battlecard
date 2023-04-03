import { Page } from '../../constants/juego'
import { useAppStore } from '../../hooks/useAppStore'
import { useGameStore } from '../../hooks/useGameStore'
import classes from './styles.module.css'

export default function GameResult (): JSX.Element {
  const nombreJugadorVictorioso = useGameStore(store => store.nombreJugadorVictorioso)
  const nombreJugadorDerrotado = useGameStore(store => store.nombreJugadorDerrotado)
  const changeActualPage = useAppStore(state => state.changeActualPage)
  const volverAInicioHandleClick = () => {
    changeActualPage(Page.WELCOME)
  }
  return (
    <article className={classes.finDeJuego}>
      <div className={classes.victoria}>
        <h1>Victoria</h1>
        <p>{nombreJugadorVictorioso}</p>
      </div>
      <div className={classes.derrota}>
        <h1>Derrota</h1>
        <p>{nombreJugadorDerrotado}</p>
      </div>
      <button id="btnVolverInicio" className={classes.btnVolverInicio} onClick={volverAInicioHandleClick}>
        Volver a la pantalla inicial
      </button>
    </article>
  )
}
