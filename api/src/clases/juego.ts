import { Jugador, RptaCogerUnaCartaDelDeck } from './jugador'

export const Pantalla = {
  EN_SALA_DE_ESPERA: 'EN SALA DE ESPERA',
  EN_JUEGO: 'EN JUEGO',
  FIN_DE_JUEGO: 'FIN DE JUEGO'
}
Object.freeze(Pantalla)

interface RptaUnirASala {
  resultado: string
  jugador?: Jugador
  jugadores?: string[]
  iniciar?: boolean
}

interface RptaCogerUnaCartaDelDeckJuego extends RptaCogerUnaCartaDelDeck {
  nombreJugadorDerrotado?: string
  nombreJugadorVictorioso?: string
}

interface RptaTerminarJuego extends RptaCogerUnaCartaDelDeckJuego {
  jugador: {
    enTurno: boolean
    nDeck: number
  }
  jugadorEnemigo: {
    enTurno: boolean
    nDeck: number
  }
}

export class Juego {
  jugador: Jugador[]
  jugadorActual: Jugador | null
  jugadorAnterior: Jugador | null
  idCartaZonaBSel
  idCartaZonaBSelEnemigo
  idCartaManoSel
  estadoSala
  pantalla: string | null
  momento: any

  static get Pantalla () {
    return Pantalla
  }

  constructor () {
    /**
     * @type {Array<Jugador>}
     */
    this.jugador = []
    /**
     * @type {Jugador}
     */
    this.jugadorActual = null
    /**
     * @type {Jugador}
     */
    this.jugadorAnterior = null
    this.idCartaZonaBSel = 0
    this.idCartaZonaBSelEnemigo = 0
    this.idCartaManoSel = 0
    this.pantalla = null
    this.momento = null
    this.estadoSala = 'SALA ABIERTA'
  }

  /**
   *
   * @param {string} nombreJugador
   */
  unirASala (nombreJugador: string): RptaUnirASala {
    if (this.estadoSala !== 'SALA ABIERTA') return { resultado: 'Sala llena, no pueden entrar jugadores' }
    else if (nombreJugador === '') return { resultado: 'No indicó nombre de jugador' }
    else if (this.jugador.filter((j) => j.nombre === nombreJugador).length >= 1) return { resultado: 'Nombre de Usuario/Nick en uso' }
    else {
      const jug = new Jugador(nombreJugador)
      this.jugador.push(jug)
      this.jugador.length < 2 ? this.estadoSala = 'SALA ABIERTA' : this.estadoSala = 'SALA CERRADA'
      this.pantalla = Juego.Pantalla.EN_SALA_DE_ESPERA
      return {
        resultado: 'Exito',
        jugador: jug,
        jugadores: this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === 'SALA CERRADA'
      }
    }
  }

  obtenerNombreJugadores () {
    const jugNames = []
    for (const j of this.jugador) {
      jugNames.push(j.nombre)
    }
    return jugNames
  }

  iniciarJuego () {
    if (this.estadoSala === 'SALA ABIERTA' &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      return 'No se tienen 2 jugadores para empezar'
    }
    if (this.estadoSala === 'SALA CERRADA' &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      this.estadoSala = 'SALA INICIADA'
      this.jugador[0].repartirCartas()
      this.jugador[1].repartirCartas()
      this.jugadorActual = this.jugador[0]
      this.jugadorAnterior = this.jugador[1]
      this.jugadorActual.setEnTurno(true)
      this.jugadorAnterior.setEnTurno(false)
      this.jugadorActual.iniciarTurno()
      this.pantalla = Pantalla.EN_JUEGO
      return 'JUEGO INICIADO'
    } else {
      return 'Condición no manejada al iniciarJuego'
    }
  }

  finalizarJuego () {
    this.pantalla = Pantalla.FIN_DE_JUEGO
    this.jugador = []
    this.jugadorActual = null
    this.jugadorAnterior = null
    this.idCartaZonaBSel = 0
    this.idCartaZonaBSelEnemigo = 0
    this.idCartaManoSel = 0
    this.pantalla = null
    this.momento = null
    this.estadoSala = 'SALA ABIERTA'
  }

  cambioDeJugadorActual () {
    const jugadorTmp = this.jugadorActual
    this.jugadorActual = this.jugadorAnterior
    this.jugadorAnterior = jugadorTmp
    this.jugadorActual?.iniciarTurno()
    this.jugadorActual?.setEnTurno(true)
    this.jugadorAnterior?.setEnTurno(false)
  }

  cogerUnaCartaDelDeck (): RptaCogerUnaCartaDelDeckJuego {
    const res = (this.jugadorActual as Jugador).cogerUnaCartaDelDeck()
    if (res?.resultado === 'DECK VACIO') {
      return {
        ...res,
        nombreJugadorDerrotado: this.jugadorActual?.nombre,
        nombreJugadorVictorioso: this.jugadorAnterior?.nombre
      }
    } else return res
  }

  terminarTurno (): RptaTerminarJuego {
    this.cambioDeJugadorActual()
    const res = this.cogerUnaCartaDelDeck()
    if (res.resultado === 'DECK VACIO') {
      this.finalizarJuego()
    }
    return {
      ...res,
      jugador: {
        enTurno: (this.jugadorAnterior as Jugador).enTurno,
        nDeck: (this.jugadorAnterior as Jugador).deck.length
      },
      jugadorEnemigo: {
        enTurno: (this.jugadorActual as Jugador).enTurno,
        nDeck: (this.jugadorActual as Jugador).deck.length
      }
    }
  }

  /**
 *
 * @param {number} idPosZB
 * @param {number} idCartaMano
 * @returns String
 */
  colocarCarta (idPosZB: number, idCartaMano: number, posCarta: string) {
    return (this.jugadorActual as Jugador).accionColocarCarta(
      idPosZB,
      idCartaMano,
      posCarta
    )
  }

  opcionesSeleccionarZonaBatalla (idZonaBatalla: number) {
    return {
      existeCarta: (this.jugadorActual as Jugador).existeCartaEnCeldaBatalla(idZonaBatalla),
      puedeAtacarCarta: (this.jugadorActual as Jugador).puedeAtacarCartaDesdeId((this.jugadorAnterior as Jugador), idZonaBatalla),
      puedeAtacarBarrera: (this.jugadorActual as Jugador).posibilidadAtacarBarrera((this.jugadorAnterior as Jugador), idZonaBatalla),
      puedeCambiarPosicion: (this.jugadorActual as Jugador).posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla)
    }
  }

  opcionesSeleccionarMano (idMano: number) {
    return {
      existeCarta: (this.jugadorActual as Jugador).tieneCartaEnMano(idMano),
      puedeColocarCarta: (this.jugadorActual as Jugador).puedeColocarCartaDesdeId(idMano)
    }
  }

  /**
   *
   * @param {number} idCartaAtacante
   */
  atacarBarrera (idCartaAtacante: number) {
    const res = (this.jugadorActual as Jugador).accionAtacarBarrera((this.jugadorAnterior as Jugador), idCartaAtacante)
    if (typeof res.sinBarreras !== 'undefined') {
      if (res.sinBarreras) {
        this.finalizarJuego()
      }
    }
    return res
  }

  /**
 *
 * @param {number} idCartaAtacante
 * @param {number} idCartaAtacada
 */
  atacarCarta (idCartaAtacante: number, idCartaAtacada: number) {
    const res = (this.jugadorActual as Jugador).accionAtacarCarta((this.jugadorAnterior as Jugador), idCartaAtacante, idCartaAtacada)
    if (typeof res.sinBarreras !== 'undefined') {
      if (res.sinBarreras) {
        this.finalizarJuego()
      }
    }
    return res
  }

  cambiarPosicionBatalla (idCarta: number) {
    return (this.jugadorActual as Jugador).cambiarPosicionBatalla(idCarta)
  }

  jugadorEnemigo (jugador: Jugador) {
    return this.jugador.filter(j => j.nombre !== jugador.nombre)[0]
  }
}
