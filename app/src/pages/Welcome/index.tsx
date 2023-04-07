import classes from './styles.module.css'
import { useAppStore } from '../../hooks/useAppStore'
import { Page } from '../../constants/juego'
export default function Welcome (): JSX.Element {
  const changeActualPage = useAppStore(state => state.changeActualPage)
  return (
    <article className={classes.welcome}>
      <h1>BattleCard</h1>
      <form onSubmit={ (event) => {
        event.preventDefault()
        changeActualPage(Page.RECEPTION_ROOM)
      }}>
      <button id="btnJugar" autoFocus>Jugar</button>
      </form>
    </article>
  )
}
