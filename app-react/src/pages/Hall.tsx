import { useState } from 'react'

export default function Hall() {
  const [nombreJugador, setNombreJugador] = useState('')
  const onChangeNombreJugador: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setNombreJugador(event.target.value)
  }
  const handleClick = () => {
    if (nombreJugador !== '') {
      // iniciar socket
    }
  }
  return (
    <article className='flex flex-col justify-center items-center w-screen h-screen bg-blue-400'>
      <h1 className='text-white'>Ingrese su nombre/nick</h1>
      <input type='text' onChange={onChangeNombreJugador} value={nombreJugador} />
      <button
        className='rounded-lg border-2 p-1 bg-blue-200 hover:bg-blue-400 active:bg-blue-500'
        onClick={handleClick}
      >Unirse a la Sala
      </button>
    </article>
  )
}
