import Board from '../../components/Board'
import KeyPad from '../../components/KeyPad'
import Player from '../../components/Player'
import PlayerBoard from '../../components/PlayerBoard'
import PlayerDashboard from '../../components/PlayerDashboard'
import { useGameRoomStore } from '../../hooks/useGameRoomStore'
import classes from './styles.module.css'

export default function GameRoom (): JSX.Element {
  const { jugador, jugadorEnemigo } = useGameRoomStore()
  return (
    <article className={classes.juego}>
      <Board>
        <>
          <Player>
            <>
              <PlayerDashboard
                playerName={jugador.nombre}
                nDeckCards={jugador.nCardsInDeck}
                enTurno={jugador.enTurno}
              />
              <PlayerBoard reverseBoard={true} zonaBatalla={jugadorEnemigo.zonaBatalla} barrera={jugadorEnemigo.barrera} mano={jugadorEnemigo.mano}/>
            </>
          </Player>
          <Player>
            <>
              <PlayerDashboard
                playerName={jugador.nombre}
                nDeckCards={jugador.nCardsInDeck}
                enTurno={jugador.enTurno}
              />
              <PlayerBoard zonaBatalla={jugador.zonaBatalla} barrera={jugador.barrera} mano={jugador.mano}/>
            </>
          </Player>
        </>
      </Board>
      <KeyPad />
    </article>
  )
}
