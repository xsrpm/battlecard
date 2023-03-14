
import './App.css'
import { Page } from './constants/juego'
import { useAppStore } from './hooks/useAppStore'
import Welcome from './pages/Welcome'
import ReceptionRoom from './pages/ReceptionRoom'
import WaitingRoom from './pages/WaitingRoom'
import GameRoom from './pages/GameRoom'

function App (): JSX.Element {
  const actualPage = useAppStore((state) => state.actualPage)
  return (
    <div className="App">
      { actualPage === Page.WELCOME && <Welcome/>}
      { actualPage === Page.RECEPTION_ROOM && <ReceptionRoom />}
      { actualPage === Page.WAITING_ROOM && <WaitingRoom />}
      { actualPage === Page.GAME_ROOM && <GameRoom />}
    </div>
  )
}

export default App
