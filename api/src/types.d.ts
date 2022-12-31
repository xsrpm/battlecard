
export interface CeldaBatalla{
    posBatalla: string
    dispAtaque: string
    dispCambio: string
    carta: ICarta | null
}

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

export  interface Juego{
    jugadoresConectados: JugadorConectado[]
    jugadorActual: JugadorConectado | null
    jugadorAnterior: JugadorConectado | null
    idCartaZonaBSel: number
    idCartaZonaBSelEnemigo: number
    idCartaManoSel:number
    estadoSala: string
    pantalla: string | null
    momento: any
}

export interface Carta{
	valor: number
	elemento: string
}