import useSocketHandler from '../../hooks/useWebSocketActionHandler'
import classes from './styles.module.css'
import { useState } from 'react'

export default function ReceptionRoom (): JSX.Element {
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const { unirASalaSocket } = useSocketHandler()

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const inNombreJugador = (event.target as any)[0].value
    console.log(inNombreJugador)
    if (inNombreJugador === '') return
    unirASalaSocket(inNombreJugador, unirASalaOnError)
  }

  function unirASalaOnError (): void {
    // (submitRef.current as HTMLInputElement).value = 'Unirse a la Sala';
    // (submitRef.current as HTMLInputElement).setAttribute('disabled', 'false')
    setSubmitDisabled(true)
  }

  return (
    <article className={classes.receptionRoom}>
      <h1>Ingrese su nombre/nick</h1>
      <form onSubmit={handleSubmit}>
        <input id="inputNombreJugador" />
        <input type="submit" value="Unirse a la Sala" disabled={ submitDisabled}/>
      </form>
    </article>
  )
}
