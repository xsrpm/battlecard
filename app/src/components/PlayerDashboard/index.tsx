import classes from './styles.module.css'

interface Props {
  children?: JSX.Element
  playerName: string
  nDeckCards: number
  enTurno: boolean
}

export default function PlayerDashboard ({ playerName, enTurno, nDeckCards }: Props) {
  return (
    <article className={`${classes.playerDashboard} ${enTurno ? classes.jugEnTurno : ''} `}>
        <h2>{playerName}</h2>
        <h3>
          Deck:
          <span>{nDeckCards}</span>
        </h3>
        {enTurno ? <p>En turno</p> : ''}
    </article>
  )
}
