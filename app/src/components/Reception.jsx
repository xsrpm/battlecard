import React from 'react'

const Reception = ({ show }) => {
  const articleStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    backgroundColor: 'blue'
  }

  const handleClick = () => {}

  return (
    show && (
      <article style={articleStyle}>
        <h1 style={{ color: 'white' }}>Ingrese su nombre/nick</h1>
        <input type='text' id='inNombreJugador' />
        <button id='btnUnirASala' onClick={handleClick}>
          Unirse a la Sala
        </button>
      </article>
    )
  )
}

export default Reception
