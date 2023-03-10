import { useRef } from 'react'
import useSocketHandler from '../../modules/socket-action-handlerr'
import classes from './styles.module.css'
export default function ReceptionRoom (): JSX.Element {
  const { unirASalaSocket } = useSocketHandler()
  const submitRef = useRef<HTMLInputElement>(null)
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const inNombreJugador = (event.target as any)[0].value
    console.log(inNombreJugador)
    if (inNombreJugador === '') return
    unirASalaSocket(inNombreJugador, unirASalaOnError)
  }
  function unirASalaOnError (): void {
    (submitRef.current as HTMLInputElement).value = 'Unirse a la Sala';
    (submitRef.current as HTMLInputElement).setAttribute('disabled', 'false')
  }

  return (
    <article className={classes.receptionRoom}>
      <h1>Ingrese su nombre/nick</h1>
      <form onSubmit={handleSubmit}>
        <input id="inputNombreJugador" />
        <input type="submit" value="Unirse a la Sala" ref={submitRef}/>
      </form>
    </article>
  )
}
