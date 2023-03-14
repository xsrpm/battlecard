import classes from './styles.module.css'

export default function KeyPad () {
  return (
    <article className={classes.keyPad}>
      <p id="mensajeBotones"></p>
      <button id="btnColocarEnAtaque" className="btnColocarEnAtaque  ocultar">
        de ataque
      </button>
      <button id="btnColocarEnDefensa" className="btnColocarEnDefensa ocultar">
        de defensa
      </button>
      <button id="btnAtacarCarta" className="ocultar">
        Atacar carta
      </button>
      <button id="btnAtacarBarrera" className="btnAtacarBarrera ocultar">
        Atacar barrera
      </button>
      <button id="btnCambiarPosicion" className="ocultar">
        Cambiar posición
      </button>
      <button id="btnTerminarTurno">Terminar turno</button>
      <button id="btnFinDeJuego" className="ocultar">
        Fin de Juego
      </button>
    </article>
  )
}
