import React from 'react'

const Welcome = ({ show, changeWindow }) => {
  const styleArticle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    backgroundColor: 'yellow'
  }

  const handleClick = () => {
    changeWindow('reception')
  }

  return (
    show && (
      <article style={styleArticle}>
        <h1>BattleCard</h1>
        <button id='btnJugar' onClick={handleClick}>
          Jugar
        </button>
      </article>
    )
  )
}

export default Welcome
