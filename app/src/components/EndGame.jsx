import React from 'react'

const EndGame = ({ show }) => {
  if (show === false) {
    return null
  }
  return (
    <article id='finDeJuego'>
      <div className='victoria'>
        <h1>Victoria</h1>
        <p>a</p>
      </div>
      <div className='derrota'>
        <h1>Derrota</h1>
        <p>a</p>
      </div>
      <button id='btnVolverInicio' className='btnVolverInicio'>
        Volver a la pantalla inicial
      </button>
    </article>
  )
}

export default EndGame
