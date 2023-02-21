import { RptaAtacarBarrera } from './../../api/src/clases/jugador';
import { Carta } from './carta'

export interface WebsocketEvent {
    event: string
    payload?: object
    error?: string
}

export interface WebsocketEventAuthenticated extends WebsocketEvent{
    payload: {
        jugadorId: string
    }
}

export interface UnirASalaResponse extends WebsocketEvent {
    payload: {
        resultado: string
        jugadores: string[]
        iniciar: boolean,
        jugadorId?: string
    }
}

interface JugadorResponse{
    nombre: string
    nBarrera: number
    nDeck: number
    mano: Carta[]
    enTurno: boolean
}

interface JugadorEnemigoResponse{
    nombre: string
    nBarrera: number
    nDeck: number
    nMano: number
    enTurno: boolean
}

export interface IniciarJuegoResponse extends WebsocketEvent {
    payload: {
        respuesta: string
        jugador?: JugadorResponse
        jugadorEnemigo?: JugadorEnemigoResponse
    }
}

export interface TerminarTurnoResponse extends WebsocketEvent {
    payload: {
        jugador: {
            enTurno: boolean
            nDeck: number
        }
        jugadorEnemigo: {
            enTurno: boolean
            nDeck: number
        }
        nombreJugadorDerrotado?: string
        nombreJugadorVictorioso?: string
        resultado?: string
        carta?: Carta
    }
}

export interface ColocarCartaResponse extends WebsocketEvent {
    payload: {
        mano: Carta[]
        resultado: string
    }
}

export interface ColocarCartaOtroJugadorResponse extends WebsocketEvent {
    payload: {
        posicion: string
        idZonaBatalla: number
        idMano: number
        resultado: string
        carta: Carta
    }
}

export interface SeleccionarZonaBatallaResponse extends WebsocketEvent {
    payload: {
        existeCarta: boolean
        puedeAtacarCarta: string
        puedeAtacarBarrera: string
        puedeCambiarPosicion: string
    }
}

export interface SeleccionarManoResponse extends WebsocketEvent {
    payload: {
        existeCarta: boolean
        puedeColocarCarta: string
    }
}

export interface AtacarCartaResponse extends WebsocketEvent {
    payload: {
        cartaAtacante?: Carta
        cartaAtacada?: Carta
        veredicto?: string
        idBarreraEliminada?: number
        estadoCartaAtacante?: string
        estadoCartaAtacada?: string
        estadoBarrera?: string
        sinBarreras?: boolean
        bonifCartaAtacante?: number
        bonifCartaAtacada?: number
        nombreJugadorDerrotado?: string
        nombreJugadorVictorioso?: string
        estadoAtaque: string
        idCartaAtacante?: number
        idCartaAtacada?: number
    }
}

export interface RptaAtacarBarrera {
    resultado: string;
    idBarreraEliminada?: number;
    sinBarreras?: boolean;
    nombreJugadorDerrotado?: string;
    nombreJugadorVictorioso?: string;
  }

export interface AtacarBarreraResponse extends WebsocketEvent {
    payload: RptaAtacarBarrera
}

export interface CambiarPosicionResponse extends WebsocketEvent {
    payload: {
        idZonaBatalla?: number,
        respuesta: string;
        posBatalla: string;
        carta: Carta | null;
    }
}

export interface EnemigoDesconectadoResponse extends WebsocketEvent{
    payload:{
        nombreJugadorDerrotado: string;
        nombreJugadorVictorioso: string;
        resultado: string
    }
}

export interface JugadorDesconectadoResponse extends WebsocketEvent {
    payload: {
        resultado: string
        jugadores: Array<string>,
        iniciar: boolean
    }
}