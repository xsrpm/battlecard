import { Carta } from './carta';
import { CeldaBatalla } from './celdabatalla';

export interface Jugador{
    cartaColocada: boolean
    nAtaquesDisponibles: number
    nCambiosPosicionesDisponibles: number
    zonaBatalla: CeldaBatalla[]
    barrera: Carta[]
    mano: Carta[]
    deck: Carta[]
    nTurnos:number
    nombre: string
    puedeColocarCartaEnZB: boolean
    nCartasEnZB: number
    enTurno: boolean
}