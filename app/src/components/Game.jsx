import React from 'react'

const Game = ({ show }) => {
  if (show === false) {
    return null
  }
  return (
    <article id='juego'>
      <h1>Juego</h1>
    </article>
  )
}

export default Game
