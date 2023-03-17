import Board from '../../components/Board'
import GameInfo from '../../components/GameInfo'
import KeyPad from '../../components/KeyPad'
import Player from '../../components/Player'
import PlayerBoard from '../../components/PlayerBoard'
import PlayerDashboard from '../../components/PlayerDashboard'
import ResultAttack from '../../components/ResultAttack'
import { useGameRoomStore } from '../../hooks/useGameRoomStore'
import classes from './styles.module.css'

export default function GameRoom (): JSX.Element {
  const { jugador, jugadorEnemigo, botonera } = useGameRoomStore()
  return (
    <article className={classes.juego}>
      <Board>
        <>
          <Player>
            <>
              <PlayerDashboard
                playerName={jugadorEnemigo.nombre}
                nDeckCards={jugadorEnemigo.nCardsInDeck}
                enTurno={jugadorEnemigo.enTurno}
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
      <KeyPad buttons={botonera.buttons} message={botonera.message}/>
      <ResultAttack />
      <GameInfo />
    </article>
  )
}
