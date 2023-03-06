import { WebsocketEventTitle } from './../constants/websocket-event-title'
import { UnirASalaResponse, IniciarJuegoResponse, ColocarCartaResponse, ColocarCartaOtroJugadorResponse, SeleccionarZonaBatallaResponse, SeleccionarManoResponse, AtacarCartaResponse, AtacarBarreraResponse, CambiarPosicionResponse, TerminarTurnoResponse, EnemigoDesconectadoResponse, JugadorDesconectadoResponse } from '../../../api/src/response'
import { enemigoDesconectadoResponse, iniciarJuegoResponse, terminarTurno as terminarTurnoResponse } from '../pages/juego'
import { jugadorDesconectadoResponse, unirASalaResponse } from '../pages/sala'
import { atacanTuBarreraResponse, atacanTuCartaResponse, atacarBarreraResponse, atacarCartaResponse, cambiaPosicionEnemigoResponse, cambiarPosicionResponse, colocaCartaOtroJugadorResponse, colocarCartaResponse, seleccionarManoResponse, seleccionarZonaBatallaResponse } from '../components/tablero'

export const handleMessageSocket = (e: any) => {
  console.log('received:')
  const message = JSON.parse(e.data)
  console.log(message)
  switch (message.event) {
    case WebsocketEventTitle.UNIR_A_SALA:
      unirASalaResponse(message as UnirASalaResponse)
      break
    case WebsocketEventTitle.INICIAR_JUEGO:
      iniciarJuegoResponse(message as IniciarJuegoResponse)
      break
    case WebsocketEventTitle.COLOCAR_CARTA:
      colocarCartaResponse(message as ColocarCartaResponse)
      break
    case WebsocketEventTitle.COLOCAR_CARTA_OTRO_JUGADOR:
      colocaCartaOtroJugadorResponse(message as ColocarCartaOtroJugadorResponse)
      break
    case WebsocketEventTitle.SELECCIONAR_ZONA_BATALLA:
      seleccionarZonaBatallaResponse(message as SeleccionarZonaBatallaResponse)
      break
    case WebsocketEventTitle.SELECCIONAR_MANO:
      seleccionarManoResponse(message as SeleccionarManoResponse)
      break
    case WebsocketEventTitle.ATACAR_CARTA:
      atacarCartaResponse(message as AtacarCartaResponse)
      break
    case WebsocketEventTitle.ATACAR_BARRERA:
      atacarBarreraResponse(message as AtacarBarreraResponse)
      break
    case WebsocketEventTitle.ATACAN_TU_CARTA:
      atacanTuCartaResponse(message as AtacarCartaResponse)
      break
    case WebsocketEventTitle.ATACAN_TU_BARRERA:
      atacanTuBarreraResponse(message as AtacarBarreraResponse)
      break
    case WebsocketEventTitle.CAMBIAR_POSICION:
      cambiarPosicionResponse(message as CambiarPosicionResponse)
      break
    case WebsocketEventTitle.CAMBIA_POSICION_ENEMIGO:
      cambiaPosicionEnemigoResponse(message as CambiarPosicionResponse)
      break
    case WebsocketEventTitle.TERMINAR_TURNO:
      terminarTurnoResponse(message as TerminarTurnoResponse)
      break
    case WebsocketEventTitle.ENEMIGO_DESCONECTADO:
      enemigoDesconectadoResponse(message as EnemigoDesconectadoResponse)
      break
    case WebsocketEventTitle.JUGADOR_DESCONECTADO:
      jugadorDesconectadoResponse(message as JugadorDesconectadoResponse)
      break
  }
}
