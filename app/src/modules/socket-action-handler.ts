import { UnirASalaResponse, IniciarJuegoResponse, ColocarCartaResponse, ColocarCartaOtroJugadorResponse, SeleccionarZonaBatallaResponse, SeleccionarManoResponse, AtacarCartaResponse, AtacarBarreraResponse, CambiarPosicionResponse, TerminarTurnoResponse, EnemigoDesconectadoResponse, JugadorDesconectadoResponse } from '../../../shared/types/response'
import { message, setMessage } from './estadoGlobal'
import { enemigoDesconectadoResponse, iniciarJuegoResponse, terminarTurno as terminarTurnoResponse } from '../pages/juego'
import { jugadorDesconectadoResponse, unirASalaResponse } from '../pages/sala'
import { atacanTuBarreraResponse, atacanTuCartaResponse, atacarBarreraResponse, atacarCartaResponse, cambiaPosicionEnemigoResponse, cambiarPosicionResponse, colocaCartaOtroJugadorResponse, colocarCartaResponse, seleccionarManoResponse, seleccionarZonaBatallaResponse } from '../components/tablero'

export const handleMessageSocket = (e: any) => {
  console.log('received:')
  setMessage(JSON.parse(e.data))
  console.log(message)
  switch (message.event) {
    case 'Unir a sala':
      unirASalaResponse(message as UnirASalaResponse)
      break
    case 'Iniciar juego':
      iniciarJuegoResponse(message as IniciarJuegoResponse)
      break
    case 'Colocar Carta':
      colocarCartaResponse(message as ColocarCartaResponse)
      break
    case 'Coloca Carta Otro Jugador':
      colocaCartaOtroJugadorResponse(message as ColocarCartaOtroJugadorResponse)
      break
    case 'Seleccionar Zona Batalla':
      seleccionarZonaBatallaResponse(message as SeleccionarZonaBatallaResponse)
      break
    case 'Seleccionar Mano':
      seleccionarManoResponse(message as SeleccionarManoResponse)
      break
    case 'Atacar Carta':
      atacarCartaResponse(message as AtacarCartaResponse)
      break
    case 'Atacar Barrera':
      atacarBarreraResponse(message as AtacarBarreraResponse)
      break
    case 'Atacan Tu Carta':
      atacanTuCartaResponse(message as AtacarCartaResponse)
      break
    case 'Atacan Tu Barrera':
      atacanTuBarreraResponse(message as AtacarBarreraResponse)
      break
    case 'Cambiar Posicion':
      cambiarPosicionResponse(message as CambiarPosicionResponse)
      break
    case 'Cambia Posicion Enemigo':
      cambiaPosicionEnemigoResponse(message as CambiarPosicionResponse)
      break
    case 'Terminar Turno':
      terminarTurnoResponse(message as TerminarTurnoResponse)
      break
    case 'Enemigo Desconectado':
      enemigoDesconectadoResponse(message as EnemigoDesconectadoResponse)
      break
    case 'Jugador Desconectado':
      jugadorDesconectadoResponse(message as JugadorDesconectadoResponse)
      break
  }
}
