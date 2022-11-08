import { v4 as uuidv4 } from 'uuid';
import { ResultadoCogerCarta } from './../constants/jugador';
import { ResultadoIniciarJuego } from './../constants/juego';
import { Jugador, RptaCogerUnaCartaDelDeck } from './jugador'
import {Juego as IJuego } from '../types'
import { Pantalla, ResultadoUnirASala, Sala } from '../constants/juego'
import { PosBatalla } from '../constants/celdabatalla'


interface RptaUnirASala {
  resultado: string
  jugadorConectado?: JugadorConectado
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

interface JugadorConectado{
  uuid : string,
  jugador: Jugador,
  websocket?: WebSocket
}

export class Juego implements IJuego{
  jugadoresConectados: JugadorConectado[]
  jugadorActual: JugadorConectado | null
  jugadorAnterior: JugadorConectado | null
  idCartaZonaBSel
  idCartaZonaBSelEnemigo
  idCartaManoSel
  estadoSala
  pantalla: string | null
  momento: any

  constructor() {
    this.jugadoresConectados = []
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
    else if (this.jugadoresConectados.filter((j) => j.jugador.nombre === nombreJugador).length >= 1) return { resultado: ResultadoUnirASala.NOMBRE_EN_USO }
    else {
      const jugadorConectado: JugadorConectado = {
        jugador : new Jugador(nombreJugador),
        uuid: uuidv4()
      }
      this.jugadoresConectados.push(jugadorConectado)
      this.jugadoresConectados.length < 2 ? this.estadoSala = Sala.SALA_ABIERTA : this.estadoSala = Sala.SALA_CERRADA
      this.pantalla = Pantalla.EN_SALA_DE_ESPERA
      return {
        resultado: ResultadoUnirASala.EXITO,
        jugadorConectado,
        jugadores: this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === Sala.SALA_CERRADA
      }
    }
  }

  obtenerNombreJugadores () {
    const jugNames = []
    for (const jc of this.jugadoresConectados) {
      jugNames.push(jc.jugador.nombre)
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
      this.jugadoresConectados[0].jugador.repartirCartas()
      this.jugadoresConectados[1].jugador.repartirCartas()
      this.jugadorActual = this.jugadoresConectados[0]
      this.jugadorAnterior = this.jugadoresConectados[1]
      this.jugadorActual.jugador.setEnTurno(true)
      this.jugadorAnterior.jugador.setEnTurno(false)
      this.jugadorActual.jugador.iniciarTurno()
      this.pantalla = Pantalla.EN_JUEGO
      return ResultadoIniciarJuego.JUEGO_INICIADO
    } else {
      return ResultadoIniciarJuego.CONDICION_NO_MANEJADA_AL_INICIAR_JUEGO
    }
  }

  finalizarJuego () {
    this.pantalla = Pantalla.FIN_DE_JUEGO
    this.jugadoresConectados = []
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
    this.jugadorActual?.jugador.iniciarTurno()
    this.jugadorActual?.jugador.setEnTurno(true)
    this.jugadorAnterior?.jugador.setEnTurno(false)
  }

  cogerUnaCartaDelDeck (): RptaCogerUnaCartaDelDeckJuego {
    const res = (this.jugadorActual?.jugador as Jugador).cogerUnaCartaDelDeck()
    if (res?.resultado === ResultadoCogerCarta.DECK_VACIO) {
      return {
        ...res,
        nombreJugadorDerrotado: this.jugadorActual?.jugador.nombre,
        nombreJugadorVictorioso: this.jugadorAnterior?.jugador.nombre
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
        enTurno: (this.jugadorAnterior?.jugador as Jugador).enTurno,
        nDeck: (this.jugadorAnterior?.jugador as Jugador).deck.length
      },
      jugadorEnemigo: {
        enTurno: (this.jugadorActual?.jugador as Jugador).enTurno,
        nDeck: (this.jugadorActual?.jugador as Jugador).deck.length
      }
    }
  }

  colocarCarta(idPosZB: number, idCartaMano: number, posBatalla: PosBatalla) {
    return (this.jugadorActual?.jugador as Jugador).colocarCarta(
      idPosZB,
      idCartaMano,
      posBatalla
    )
  }

  opcionesSeleccionarZonaBatalla (idZonaBatalla: number) {
    return {
      existeCarta: (this.jugadorActual?.jugador as Jugador).existeCartaEnCeldaBatalla(idZonaBatalla),
      puedeAtacarCarta: (this.jugadorActual?.jugador as Jugador).puedeAtacarCartaDesdeId((this.jugadorAnterior?.jugador as Jugador), idZonaBatalla),
      puedeAtacarBarrera: (this.jugadorActual?.jugador as Jugador).posibilidadAtacarBarrera((this.jugadorAnterior?.jugador as Jugador), idZonaBatalla),
      puedeCambiarPosicion: (this.jugadorActual?.jugador as Jugador).posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla)
    }
  }

  opcionesSeleccionarMano (idMano: number) {
    return {
      existeCarta: (this.jugadorActual?.jugador as Jugador).tieneCartaEnMano(idMano),
      puedeColocarCarta: (this.jugadorActual?.jugador as Jugador).puedeColocarCartaDesdeId(idMano)
    }
  }

  atacarBarrera (idCartaAtacante: number) {
    const res = (this.jugadorActual?.jugador as Jugador).atacarBarrera((this.jugadorAnterior?.jugador as Jugador), idCartaAtacante)
    if (typeof res.sinBarreras !== 'undefined') {
      if (res.sinBarreras) {
        this.finalizarJuego()
      }
    }
    return res
  }

  atacarCarta (idCartaAtacante: number, idCartaAtacada: number) {
    const res = (this.jugadorActual?.jugador as Jugador).atacarCarta((this.jugadorAnterior?.jugador as Jugador), idCartaAtacante, idCartaAtacada)
    if (typeof res.sinBarreras !== 'undefined') {
      if (res.sinBarreras) {
        this.finalizarJuego()
      }
    }
    return res
  }

  cambiarPosicionBatalla (idCarta: number) {
    return (this.jugadorActual?.jugador as Jugador).cambiarPosicionBatalla(idCarta)
  }

  jugadorEnemigo (jugador: Jugador) {
    return this.jugadoresConectados.filter(j => j.jugador.nombre !== jugador.nombre)[0].jugador
  }
}
