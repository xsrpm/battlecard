import Board from '../../components/Board'
import GameInfo from '../../components/GameInfo'
import KeyPad from '../../components/KeyPad'
import Player from '../../components/Player'
import PlayerBoard from '../../components/PlayerBoard'
import PlayerDashboard from '../../components/PlayerDashboard'
import ResultAttack from '../../components/ResultAttack'
import { useGameStore } from '../../hooks/useGameStore'
import classes from './styles.module.css'

export default function GameRoom (): JSX.Element {
  const jugador = useGameStore(state => state.jugador)
  const jugadorEnemigo = useGameStore(state => state.jugadorEnemigo)
  const gameInfo = useGameStore(state => state.gameInfo)
  const resultadoAtaque = useGameStore(state => state.resultadoAtaque)
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
              <PlayerBoard reverseBoard zonaBatalla={jugadorEnemigo.zonaBatalla} barrera={jugadorEnemigo.barrera} mano={jugadorEnemigo.mano} enTurno={jugadorEnemigo.enTurno} jugadorEnemigo />
            </>
          </Player>
          <Player>
            <>
              <PlayerDashboard
                playerName={jugador.nombre}
                nDeckCards={jugador.nCardsInDeck}
                enTurno={jugador.enTurno}
              />
              <PlayerBoard zonaBatalla={jugador.zonaBatalla} barrera={jugador.barrera} mano={jugador.mano} enTurno={jugador.enTurno} />
            </>
          </Player>
        </>
      </Board>
      <KeyPad />
      { resultadoAtaque.mostrar && <ResultAttack />}
      { gameInfo.mostrar && <GameInfo message={gameInfo.message as string} />}
    </article>
  )
}
