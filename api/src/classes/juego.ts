
import { ResultadoCogerCarta } from '../constants/jugador';
import { ResultadoIniciarJuego, ResultadoSalirDeSala } from '../constants/juego';
import {  Jugador, RptaCogerUnaCartaDelDeck } from './jugador'
import {Juego as IJuego } from '../types'
import { Pantalla, ResultadoUnirASala, Sala } from '../constants/juego'
import { PosBatalla } from '../constants/celdabatalla'


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

export interface JugadorConectado{
  uuid : string,
  jugador: Jugador,
  websocket?: WebSocket
}

export class Juego implements IJuego{
  jugadores: Jugador[]
  jugadorActual: Jugador | null
  jugadorAnterior: Jugador | null
  idCartaZonaBSel
  idCartaZonaBSelEnemigo
  idCartaManoSel
  estadoSala
  pantalla: string | null
  momento: any

  constructor() {
    this.jugadores = []
    this.jugadorActual = null
    this.jugadorAnterior = null
    this.idCartaZonaBSel = 0
    this.idCartaZonaBSelEnemigo = 0
    this.idCartaManoSel = 0
    this.pantalla = null
    this.momento = null
    this.estadoSala = Sala.SALA_ABIERTA
  }

  unirASala (nombreJugador: string): RptaUnirASala {
    if (this.estadoSala !== Sala.SALA_ABIERTA) return { resultado: ResultadoUnirASala.SALA_LLENA_NO_PUEDEN_ENTRAR_JUGADORES }
    else if (nombreJugador === '') return { resultado: ResultadoUnirASala.NO_INDICO_NOMBRE_JUGADOR }
    else if (this.jugadores.filter((j) => j.nombre === nombreJugador).length >= 1) return { resultado: ResultadoUnirASala.NOMBRE_EN_USO }
    else {
      const jugador = new Jugador(nombreJugador)
      this.jugadores.push(jugador)
      this.jugadores.length < 2 ? this.estadoSala = Sala.SALA_ABIERTA : this.estadoSala = Sala.SALA_CERRADA
      this.pantalla = Pantalla.EN_SALA_DE_ESPERA
      return {
        resultado: ResultadoUnirASala.EXITO,
        jugador,
        jugadores: this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === Sala.SALA_CERRADA
      }
    }
  }

  salirDeSala(pJugador: Jugador){
    const resp = this.jugadores.find((jugador)=> jugador === pJugador )
    if(!resp){
      return {
        resultado: ResultadoSalirDeSala.NO_ESTA_EN_SALA,
        jugadores :  this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === Sala.SALA_CERRADA
      }
    }
    this.jugadores = this.jugadores.filter((jugador) => jugador !== resp)
    this.jugadores.length < 2 ? this.estadoSala = Sala.SALA_ABIERTA : this.estadoSala = Sala.SALA_CERRADA
    return {
      resultado: ResultadoSalirDeSala.SALIO_DE_SALA,
      jugadores :  this.obtenerNombreJugadores(),
      iniciar: this.estadoSala === Sala.SALA_CERRADA
    }
  }

  obtenerNombreJugadores () {
    const jugNames = []
    for (const jc of this.jugadores) {
      jugNames.push(jc.nombre)
    }
    return jugNames
  }

  iniciarJuego () {
    if (this.estadoSala === Sala.SALA_ABIERTA &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      return ResultadoIniciarJuego.NO_SE_TIENEN_2_JUGADORES_PARA_EMPEZAR
    }
    if (this.estadoSala === Sala.SALA_CERRADA &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      this.estadoSala = Sala.SALA_INICIADA
      this.jugadores[0].repartirCartas()
      this.jugadores[1].repartirCartas()
      this.jugadorActual = this.jugadores[0]
      this.jugadorAnterior = this.jugadores[1]
      this.jugadorActual.setEnTurno(true)
      this.jugadorAnterior.setEnTurno(false)
      this.jugadorActual.iniciarTurno()
      this.pantalla = Pantalla.EN_JUEGO
      return ResultadoIniciarJuego.JUEGO_INICIADO
    } else {
      return ResultadoIniciarJuego.CONDICION_NO_MANEJADA_AL_INICIAR_JUEGO
    }
  }

  finalizarJuego () {
    this.pantalla = Pantalla.FIN_DE_JUEGO
    this.jugadores = []
    this.jugadorActual = null
    this.jugadorAnterior = null
    this.idCartaZonaBSel = 0
    this.idCartaZonaBSelEnemigo = 0
    this.idCartaManoSel = 0
    this.pantalla = null
    this.momento = null
    this.estadoSala = Sala.SALA_ABIERTA
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
    if (res?.resultado === ResultadoCogerCarta.DECK_VACIO) {
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
    if (res.resultado === ResultadoCogerCarta.DECK_VACIO) {
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

  colocarCarta(idPosZB: number, idCartaMano: number, posBatalla: PosBatalla) {
    return (this.jugadorActual as Jugador).colocarCarta(
      idPosZB,
      idCartaMano,
      posBatalla
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

  atacarBarrera (idCartaAtacante: number) {
    const res = (this.jugadorActual as Jugador).atacarBarrera((this.jugadorAnterior as Jugador), idCartaAtacante)
    if (typeof res.sinBarreras !== 'undefined') {
      if (res.sinBarreras) {
        this.finalizarJuego()
      }
    }
    return res
  }

  atacarCarta (idCartaAtacante: number, idCartaAtacada: number) {
    const res = (this.jugadorActual as Jugador).atacarCarta((this.jugadorAnterior as Jugador), idCartaAtacante, idCartaAtacada)
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
    return this.jugadores.filter(j => j.nombre !== jugador.nombre)[0]
  }
}
