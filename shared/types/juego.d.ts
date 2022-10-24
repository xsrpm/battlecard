import { Jugador } from './jugador';
export  interface Juego{
    jugador: Jugador[]
    jugadorActual: Jugador | null
    jugadorAnterior: Jugador | null
    idCartaZonaBSel: number
    idCartaZonaBSelEnemigo: number
    idCartaManoSel:number
    estadoSala: string
    pantalla: string | null
    momento: any
}