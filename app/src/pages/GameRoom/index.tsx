import Board from '../../components/Board'
import KeyPad from '../../components/KeyPad'
import Player from '../../components/Player'
import PlayerBoard from '../../components/PlayerBoard'
import PlayerDashboard from '../../components/PlayerDashboard'
import { Elemento } from '../../constants/carta'
import { PosBatalla } from '../../constants/celdabatalla'
import { type CartaEnMano } from '../../types/CartaEnMano'
import { type CeldaBatalla } from '../../types/CeldaBatalla'
import classes from './styles.module.css'

export default function GameRoom (): JSX.Element {
  const jugador: { zonaBatalla: CeldaBatalla[], barrera: boolean[], mano: CartaEnMano[] } = {
    zonaBatalla: [{
      carta: {
        valor: 4,
        elemento: Elemento.COCO
      },
      posicionBatalla: PosBatalla.ATAQUE,
      selected: false
    },
    {
      posicionBatalla: PosBatalla.NO_HAY_CARTA,
      selected: false
    },
    {
      posicionBatalla: PosBatalla.NO_HAY_CARTA,
      selected: false
    }
    ],
    barrera: [true, true, true, true, false],
    mano: [{
      carta: {
        valor: 7,
        elemento: Elemento.ESPADA
      },
      hidden: false,
      selected: false
    },
    {
      hidden: true,
      selected: false
    },
    {
      hidden: true,
      selected: false
    },
    {
      hidden: true,
      selected: false
    },
    {
      hidden: false,
      selected: false
    }
    ]
  }
  return (
    <article className={classes.juego}>
      <Board>
        <>
          <Player>
            <>
              <PlayerDashboard
                playerName={'César'}
                nDeckCards={20}
                enTurno={false}
              />
              <PlayerBoard reverseBoard={true} zonaBatalla={jugador.zonaBatalla} barrera={jugador.barrera} mano={jugador.mano}/>
            </>
          </Player>
          <Player>
            <>
              <PlayerDashboard
                playerName={'xsrfhk'}
                nDeckCards={20}
                enTurno={true}
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
