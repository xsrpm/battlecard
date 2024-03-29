
import { useGameStore } from '../../hooks/useGameStore'
import { useWaitingRoomStore } from '../../hooks/useWaitingRoomStore'
import { iniciarJuego } from '../../modules/socket-messages'
import classes from './styles.module.css'

export default function WaitingRoom (): JSX.Element {
  const playerId = useGameStore(state => state.playerId)
  const players = useWaitingRoomStore(state => state.players)
  const start = useWaitingRoomStore(state => state.start)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    iniciarJuego(playerId as string)
  }
  return (
    <article className={classes.waitingRoom}>
      <h1>Sala de Espera</h1>
      <div>
        <h2>{ players[0] ?? '(Sin Jugador)' }</h2>
      </div>
      <div>
        <h2>{ players[1] ?? '(Sin Jugador)' }</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <input type="submit" value="Iniciar Juego" disabled={!start} autoFocus/>
      </form>
    </article>
  )
}
