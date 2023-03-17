export interface KeyPadState {
  buttons: {
    colocarEnAtaque?: boolean
    colocarEnDefensa?: boolean
    atacarCarta?: boolean
    atacarBarrera?: boolean
    cambiarPosicion?: boolean
    terminarTurno?: boolean
    finDeTurno?: boolean
  }
  message?: string
}
