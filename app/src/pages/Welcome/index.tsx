import classes from './styles.module.css'

export default function Welcome (): JSX.Element {
  return (
    <article className={classes.welcome}>
      <h1>BattleCard</h1>
      <form onSubmit={ () => { }}>
      <button id="btnJugar">Jugar</button>
      </form>
    </article>
  )
}
