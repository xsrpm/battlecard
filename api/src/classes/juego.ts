import {
  ResultadoAtacarBarrera,
  ResultadoAtacarCarta
} from '../constants/jugador'
import {
  ResultadoIniciarJuego,
  ResultadoSalirDeSala
  , Pantalla, ResultadoUnirASala, Sala
} from '../constants/juego'
import { Jugador } from './jugador'

import { PosBatalla } from '../constants/celdabatalla'

export class Juego {
  jugadores: Jugador[]
  jugadorActual: Jugador | null
  jugadorAnterior: Jugador | null
  idCartaZonaBSel
  idCartaZonaBSelEnemigo
  idCartaManoSel
  estadoSala
  pantalla: string | null
  momento: any

  constructor () {
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

  unirASala (nombreJugador: string) {
    if (this.estadoSala !== Sala.SALA_ABIERTA) {
      return {
        resultado: ResultadoUnirASala.SALA_LLENA_NO_PUEDEN_ENTRAR_JUGADORES
      }
    } else if (nombreJugador === '') { return { resultado: ResultadoUnirASala.NO_INDICO_NOMBRE_JUGADOR } } else if (
      this.jugadores.filter((j) => j.nombre === nombreJugador).length >= 1
    ) { return { resultado: ResultadoUnirASala.NOMBRE_EN_USO } } else {
      const jugador = new Jugador(nombreJugador)
      this.jugadores.push(jugador)
      this.jugadores.length < 2
        ? (this.estadoSala = Sala.SALA_ABIERTA)
        : (this.estadoSala = Sala.SALA_CERRADA)
      this.pantalla = Pantalla.EN_SALA_DE_ESPERA
      return {
        resultado: ResultadoUnirASala.EXITO,
        jugador,
        jugadores: this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === Sala.SALA_CERRADA
      }
    }
  }

  salirDeSala (pJugador: Jugador) {
    const resp = this.jugadores.find((jugador) => jugador === pJugador)
    if (resp == null) {
      return {
        resultado: ResultadoSalirDeSala.NO_ESTA_EN_SALA,
        jugadores: this.obtenerNombreJugadores(),
        iniciar: this.estadoSala === Sala.SALA_CERRADA
      }
    }
    this.jugadores = this.jugadores.filter((jugador) => jugador !== resp)
    this.estadoSala = Sala.SALA_ABIERTA
    return {
      resultado: ResultadoSalirDeSala.SALIO_DE_SALA,
      jugadores: this.obtenerNombreJugadores(),
      iniciar: false
    }
  }

  obtenerNombreJugadores () {
    const jugNames: string[] = []
    for (const jc of this.jugadores) {
      jugNames.push(jc.nombre)
    }
    return jugNames
  }

  iniciarJuego () {
    if (
      this.estadoSala === Sala.SALA_ABIERTA &&
      this.pantalla === Pantalla.EN_SALA_DE_ESPERA
    ) {
      return ResultadoIniciarJuego.NO_SE_TIENEN_2_JUGADORES_PARA_EMPEZAR
    } else {
      // this.estadoSala === Sala.SALA_CERRADA && this.pantalla === Pantalla.EN_SALA_DE_ESPERA
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
    }
  }

  finalizarJuego () {
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
    if ((this.jugadorActual != null) && (this.jugadorAnterior != null)) {
      const jugadorTmp = this.jugadorActual
      this.jugadorActual = this.jugadorAnterior
      this.jugadorAnterior = jugadorTmp
      this.jugadorActual.iniciarTurno()
      this.jugadorActual.setEnTurno(true)
      this.jugadorAnterior.setEnTurno(false)
    }
  }

  cogerUnaCartaDelDeck () {
    return (this.jugadorActual as Jugador).cogerUnaCartaDelDeck()
  }

  terminarTurno () {
    this.cambioDeJugadorActual()
    const res = this.cogerUnaCartaDelDeck()
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

  colocarCarta (idPosZB: number, idCartaMano: number, posBatalla: PosBatalla) {
    return (this.jugadorActual as Jugador).colocarCarta(
      idPosZB,
      idCartaMano,
      posBatalla
    )
  }

  opcionesSeleccionarZonaBatalla (idZonaBatalla: number) {
    return {
      existeCarta: (this.jugadorActual as Jugador).existeCartaEnCeldaBatalla(
        idZonaBatalla
      ),
      puedeAtacarCarta: (this.jugadorActual as Jugador).puedeAtacarCartaDesdeId(
        this.jugadorAnterior as Jugador,
        idZonaBatalla
      ),
      puedeAtacarBarrera: (
        this.jugadorActual as Jugador
      ).posibilidadAtacarBarrera(
        this.jugadorAnterior as Jugador,
        idZonaBatalla
      ),
      puedeCambiarPosicion: (
        this.jugadorActual as Jugador
      ).posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla)
    }
  }

  opcionesSeleccionarMano (idMano: number) {
    return {
      existeCarta: (this.jugadorActual as Jugador).tieneCartaEnManoEnPosicion(
        idMano
      ),
      puedeColocarCarta: (
        this.jugadorActual as Jugador
      ).puedeColocarCartaDesdeManoEnPosicion(idMano)
    }
  }

  atacarBarrera (idCartaAtacante: number) {
    const estadoAtaque = (this.jugadorActual as Jugador).posibilidadAtacarBarrera(
      (this.jugadorAnterior as Jugador),
      idCartaAtacante
    )
    let respAtacarBarrera
    if (estadoAtaque === ResultadoAtacarBarrera.POSIBLE) {
      respAtacarBarrera = (this.jugadorActual as Jugador).atacarBarrera(
        this.jugadorAnterior as Jugador,
        idCartaAtacante
      )
    }
    return {
      estadoAtaque,
      ...respAtacarBarrera
    }
  }

  atacarCarta (idCartaAtacante: number, idCartaAtacada: number) {
    const estadoAtaque = (this.jugadorActual as Jugador).posibilidadAtacarCarta(
      this.jugadorAnterior as Jugador,
      idCartaAtacada,
      idCartaAtacante
    )
    let respAtacarCarta
    if (estadoAtaque === ResultadoAtacarCarta.POSIBLE) {
      respAtacarCarta = (this.jugadorActual as Jugador).atacarCarta(
        this.jugadorAnterior as Jugador,
        idCartaAtacante,
        idCartaAtacada
      )
    }
    return {
      estadoAtaque,
      ...respAtacarCarta
    }
  }

  cambiarPosicionBatalla (idCarta: number) {
    return (this.jugadorActual as Jugador).cambiarPosicionBatalla(idCarta)
  }

  jugadorEnemigo (jugador: Jugador) {
    return this.jugadores.filter((j) => j.nombre !== jugador.nombre)[0]
  }
}
