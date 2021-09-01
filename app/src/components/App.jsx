import React from 'react'
import EndGame from './EndGame'
import Game from './Game'
import Hall from './Hall'
import Reception from './Reception'
import Welcome from './Welcome'

const App = () => {
  const [windows, setWindows] = React.useState({
    welcome: true,
    reception: false,
    hall: false,
    game: false,
    endGame: false
  })

  let socket

  function changeWindow(window) {
    const defaultWindows = {
      welcome: false,
      reception: false,
      hall: false,
      game: false,
      endGame: false
    }
    setWindows({
      ...defaultWindows,
      [window]: true
    })
  }

  return (
    <article>
      <Welcome show={windows.welcome} changeWindow={changeWindow} />
      <Reception
        show={windows.reception}
        changeWindow={changeWindow}
        socket={socket}
      />
      <Hall show={windows.hall} changeWindow={changeWindow} socket={socket} />
      <Game show={windows.game} changeWindow={changeWindow} socket={socket} />
      <EndGame show={windows.endGame} changeWindow={changeWindow} />
    </article>
  )
}

export default App
