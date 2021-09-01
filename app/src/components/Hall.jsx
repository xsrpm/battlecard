import React from 'react'

const Hall = ({ show }) => {
  if (show === false) {
    return null
  }
  return (
    <article id='sala'>
      <h1>Sala de Espera</h1>
      <div>
        <h2>(Sin Jugador)</h2>
      </div>
      <div>
        <h2>(Sin Jugador)</h2>
      </div>
      <button id='btnIniciarJuego' disabled>
        Iniciar Juego
      </button>
    </article>
  )
}

export default Hall
