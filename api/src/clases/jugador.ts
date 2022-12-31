
import {
  EstadoCarta,
  MAX_BARRERA_CARDS,
  MAX_DECK,
  ResultadoAtacarBarrera,
  ResultadoAtacarCarta,
  ResultadoCambiarPosicion,
  ResultadoColocarCarta,
} from "./../constants/jugador";
import {
  PosBatalla,
  DispAtaque,
  DispCambio,
} from "./../constants/celdabatalla";
import { Carta } from "./carta";
import { CeldaBatalla } from "./celdabatalla";
import { Jugador as IJugador } from "../types";
import {
  Elemento,
  MAX_VALOR_CARTA,
  NUMERO_ELEMENTOS_CARTAS,
} from "../constants/carta";
import {
  MAX_MANO_CARDS,
  MAX_ZONA_BATALLA_CARDS,
  ResultadoCogerCarta,
  VeredictoAtaque,
} from "../constants/jugador";
import { RptaAtacarBarrera } from '../response';

interface RptaColocarCarta {
  resultado: string;
  carta?: Carta;
}

interface RptaCalculoValorAtaque {
  calculoVAtacante: number;
  calculoVAtacada: number;
  bonifCartaAtacante: number;
  bonifCartaAtacada: number;
}

interface RptaAtacarCarta {
  estadoAtaque: string;
  cartaAtacante?: Carta;
  cartaAtacada?: Carta;
  bonifCartaAtacante?: number;
  bonifCartaAtacada?: number;
  veredicto?: string;
  idBarreraEliminada?: number;
  estadoCartaAtacante?: string;
  estadoCartaAtacada?: string;
  estadoBarrera?: string;
  sinBarreras?: boolean;
  nombreJugadorDerrotado?: string;
  nombreJugadorVictorioso?: string;
}

export interface RptaCogerUnaCartaDelDeck {
  resultado: ResultadoCogerCarta;
  carta?: Carta;
}

export interface RptaCambiarPosicion {
  respuesta: string;
  posBatalla: string;
  carta: Carta | null;
}

export class Jugador implements IJugador {
  cartaColocada;
  nAtaquesDisponibles;
  nCambiosPosicionesDisponibles;
  zonaBatalla: CeldaBatalla[];
  barrera: Carta[];
  mano: Carta[];
  deck: Carta[];
  nTurnos;
  nombre;
  puedeColocarCartaEnZB;
  nCartasEnZB;
  enTurno;

  /**
   *
   * @param {string} nombre
   */
  constructor(nombre: string) {
    this.cartaColocada = false;
    this.nAtaquesDisponibles = 0;
    this.nCambiosPosicionesDisponibles = 0;
    this.zonaBatalla = [];
    this.barrera = [];
    for (let i = 0; i < MAX_ZONA_BATALLA_CARDS; i++) {
      this.zonaBatalla[i] = new CeldaBatalla();
      this.zonaBatalla[i].carta = null;
    }
    this.mano = [];
    this.deck = [];
    this.nTurnos = 0;
    this.nombre = nombre;
    this.puedeColocarCartaEnZB = true;
    this.nCartasEnZB = 0;
    this.enTurno = false;
  }
  // region Operaciones (Reglas)

  estadoActual() {
    return {
      zonaBatalla: this.zonaBatalla,
      deck: this.deck,
      mano: this.mano,
      barrera: this.barrera,
      nTurnos: this.nTurnos,
      enTurno: this.enTurno,
      nombre: this.nombre,
    };
  }

  sinBarreras() {
    return this.barrera.length === 0;
  }

  sinCartasEnDeck() {
    return this.deck.length === 0;
  }

  ataquesPermitidosXNumTurnos() {
    return this.nTurnos > 1;
  }

  setEnTurno(enTurno: boolean) {
    this.enTurno = enTurno;
  }

  iniciarTurno() {
    this.nTurnos++;
    this.nAtaquesDisponibles = 0;
    this.nCambiosPosicionesDisponibles = 0;
    this.cartaColocada = false;
    this.puedeColocarCartaEnZB = true;
    for (const celdaBatalla of this.zonaBatalla) {
      if (celdaBatalla.carta !== null) {
        if (celdaBatalla.posBatalla === PosBatalla.ATAQUE) {
          celdaBatalla.dispAtaque = DispAtaque.DISPONIBLE;
          this.nAtaquesDisponibles++;
        } else {
          celdaBatalla.dispAtaque = DispAtaque.NO_DISPONIBLE;
        }
        celdaBatalla.dispCambio = DispCambio.DISPONIBLE;
        this.nCambiosPosicionesDisponibles++;
      }
    }
  }

  cogerUnaCartaDelDeck(): RptaCogerUnaCartaDelDeck {
    if (this.mano.length === MAX_MANO_CARDS) {
      return { resultado: ResultadoCogerCarta.MANO_LLENA };
    }
    const carta = this.deck.pop();
    if (carta === undefined) {
      return { resultado: ResultadoCogerCarta.DECK_VACIO };
    } else {
      this.mano.push(carta);
      return { resultado: ResultadoCogerCarta.EXITO, carta };
    }
  }

  puedeColocarCartas() {
    if (!this.puedeColocarCartaEnZB) {
      return ResultadoColocarCarta.YA_COLOCO_CARTA_EN_ESTE_TURNO;
    }
    if (this.nCartasEnZB === MAX_ZONA_BATALLA_CARDS) {
      return ResultadoColocarCarta.ZONA_BATALLA_ESTA_LLENA;
    }
    return ResultadoColocarCarta.POSIBLE;
  }

  puedeColocarCartaDesdeId(idCartaMano: number) {
    const resp = this.puedeColocarCartas();
    if (resp !== ResultadoColocarCarta.POSIBLE) return resp;
    if (!this.tieneCartaEnMano(idCartaMano)) {
      return ResultadoColocarCarta.NO_HAY_CARTA_EN_LA_MANO_EN_ESA_POSICION;
    }
    return ResultadoColocarCarta.POSIBLE;
  }

  posibilidadColocarCartaEnPosicion(idPosZB: number, idCartaMano: number) {
    const resp = this.puedeColocarCartaDesdeId(idCartaMano);
    if (resp !== ResultadoColocarCarta.POSIBLE) return resp;
    if (this.tieneCartaColocada(idPosZB)) {
      return ResultadoColocarCarta.POSICION_EN_ZONA_BATALLA_OCUPADA;
    }
    return ResultadoColocarCarta.POSIBLE;
  }

  colocarCarta(
    idPosZB: number,
    idCartaMano: number,
    posBatalla: PosBatalla
  ): RptaColocarCarta {
    let resultado = this.posibilidadColocarCartaEnPosicion(
      idPosZB,
      idCartaMano
    );
    let carta: Carta;
    if (resultado === ResultadoColocarCarta.POSIBLE) {
      carta = this.mano[idCartaMano];
      this.mano.splice(idCartaMano, 1);
      this.puedeColocarCartaEnZB = false;
      if (posBatalla === PosBatalla.ATAQUE) {
        this.nAtaquesDisponibles++;
      }
      this.zonaBatalla[idPosZB].agregarCarta(carta, posBatalla);
      this.nCartasEnZB++;
      resultado = ResultadoColocarCarta.CARTA_COLOCADA;
      return {
        resultado,
        carta,
      };
    } else {
      return { resultado };
    }
  }

  puedeAtacarBarreras(jugadorAtacado: Jugador) {
    if (this.nCartasEnZB === 0)
      return ResultadoAtacarBarrera.SIN_CARTAS_EN_ZONA_BATALLA;
    if (jugadorAtacado.nCartasEnZB > 0) {
      return ResultadoAtacarBarrera.HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA;
    }
    if (this.nAtaquesDisponibles === 0) {
      return ResultadoAtacarBarrera.NO_QUEDAN_ATAQUES_DISPONIBLES;
    }
    if (this.nTurnos < 2) {
      return ResultadoAtacarBarrera.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO;
    }
    return ResultadoAtacarBarrera.POSIBLE;
  }

  posibilidadAtacarBarrera(jugadorAtacado: Jugador, idCartaAtacante: number) {
    const resp = this.puedeAtacarBarreras(jugadorAtacado);
    if (resp !== ResultadoAtacarBarrera.POSIBLE) return resp;
    if (!this.existeCartaEnCeldaBatalla(idCartaAtacante)) {
      return ResultadoAtacarBarrera.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA;
    }
    if (this.zonaBatalla[idCartaAtacante].posBatalla !== PosBatalla.ATAQUE) {
      return ResultadoAtacarBarrera.CARTA_ATACANTE_NO_ESTA_EN_POSICION_ATAQUE;
    }
    if (
      this.zonaBatalla[idCartaAtacante].dispAtaque === DispAtaque.NO_DISPONIBLE
    ) {
      return ResultadoAtacarBarrera.CARTA_ATACANTE_NO_TIENE_ATAQUES_DISPONIBLES;
    }
    return ResultadoAtacarBarrera.POSIBLE;
  }

  ataqueRealizado(idCartaAtacante: number) {
    this.nAtaquesDisponibles--;
    this.zonaBatalla[idCartaAtacante].ataqueRealizado();
  }

  atacarBarrera(
    jugadorAtacado: Jugador,
    idCartaAtacante: number
  ): RptaAtacarBarrera {
    const resultado = this.posibilidadAtacarBarrera(
      jugadorAtacado,
      idCartaAtacante
    );
    if (resultado === ResultadoAtacarBarrera.POSIBLE) {
      const idBarreraEliminada = jugadorAtacado.barrera.length - 1;
      let sinBarreras = false;
      let nombreJugadorDerrotado;
      let nombreJugadorVictorioso;
      jugadorAtacado.barrera.pop();
      this.ataqueRealizado(idCartaAtacante);
      if (jugadorAtacado.sinBarreras()) {
        sinBarreras = true;
        nombreJugadorDerrotado = jugadorAtacado.nombre;
        nombreJugadorVictorioso = this.nombre;
      }
      return {
        resultado: ResultadoAtacarBarrera.BARRERA_DESTRUIDA,
        idBarreraEliminada,
        sinBarreras,
        nombreJugadorDerrotado,
        nombreJugadorVictorioso,
      };
    } else {
      return {
        resultado,
      };
    }
  }

  puedeAtacarCartas(jugadorAtacado: Jugador) {
    if (this.nTurnos < 2) {
      return ResultadoAtacarCarta.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO;
    }
    if (this.nCartasEnZB === 0)
      return ResultadoAtacarCarta.SIN_CARTAS_EN_ZONA_BATALLA;
    if (jugadorAtacado.nCartasEnZB === 0) {
      return ResultadoAtacarCarta.NO_HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA;
    }
    if (this.nAtaquesDisponibles === 0) {
      return ResultadoAtacarCarta.NO_QUEDAN_ATAQUES_DISPONIBLES;
    }
    if (jugadorAtacado.barrera.length === 0) {
      return ResultadoAtacarCarta.JUGADOR_ENEMIGO_DEBE_TENER_BARRERAS;
    }
    return ResultadoAtacarCarta.POSIBLE;
  }

  existeCartaEnCeldaBatalla(idZonaBatalla: number) {
    return this.zonaBatalla[idZonaBatalla]?.carta !== null;
  }

  tieneCartaEnMano(idPosicionMano: number) {
    return (
      this.mano[idPosicionMano] !== null &&
      this.mano[idPosicionMano] !== undefined
    );
  }

  tieneCartaColocada(idPosicionManoZB: number) {
    return this.zonaBatalla[idPosicionManoZB].carta !== null;
  }

  puedeAtacarCartaDesdeId(
    jugadorAtacado: Jugador,
    idZonaBatalla: number
  ) {
    const resp = this.puedeAtacarCartas(jugadorAtacado);
    if (resp !== ResultadoAtacarCarta.POSIBLE) return resp;
    if (!this.existeCartaEnCeldaBatalla(idZonaBatalla)) {
      return ResultadoAtacarCarta.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA
    }
    if (
      this.zonaBatalla[idZonaBatalla].dispAtaque === DispAtaque.NO_DISPONIBLE
    ) {
      return ResultadoAtacarCarta.CARTA_ATACANTE_NO_TIENE_ATAQUE_DISPONIBLE
    }
    if (this.zonaBatalla[idZonaBatalla].posBatalla !== PosBatalla.ATAQUE) {
      return ResultadoAtacarCarta.CARTA_ATACANTE_NO_EN_POSICION_ATAQUE
    }
    return ResultadoAtacarCarta.POSIBLE;
  }

  posibilidadAtacarCarta(
    jugadorAtacado: Jugador,
    idCartaAtacada: number,
    idCartaAtacante: number
  ) {
    const resp = this.puedeAtacarCartaDesdeId(
      jugadorAtacado,
      idCartaAtacante
    );
    if (resp !== ResultadoAtacarCarta.POSIBLE) return resp;
    if (jugadorAtacado.zonaBatalla[idCartaAtacada].carta === null) {
      return ResultadoAtacarCarta.NO_HAY_CARTA_EN_UBICACION_EN_ZONA_BATALLA_ENEMIGA;
    }
    return ResultadoAtacarCarta.POSIBLE;
  }

  calculoValorAtaque(
    cartaAtacante: Carta,
    cartaAtacada: Carta
  ): RptaCalculoValorAtaque {
    let calculoVAtacante = cartaAtacante.valor;
    let calculoVAtacada = cartaAtacada.valor;
    let bonifCartaAtacante = 0;
    let bonifCartaAtacada = 0;

    switch (cartaAtacante.elemento + " " + cartaAtacada.elemento) {
      case Elemento.ESPADA + " " + Elemento.TREBOL:
        bonifCartaAtacada = 6;
        calculoVAtacada += bonifCartaAtacada;
        break;
      case Elemento.TREBOL + " " + Elemento.ESPADA:
        bonifCartaAtacante = 6;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Elemento.ESPADA + " " + Elemento.CORAZON:
      case Elemento.CORAZON + " " + Elemento.TREBOL:
        bonifCartaAtacante = 2;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Elemento.CORAZON + " " + Elemento.ESPADA:
        bonifCartaAtacante = 2;
        calculoVAtacada += bonifCartaAtacante;
        break;
      case Elemento.COCO + " " + Elemento.TREBOL:
      case Elemento.ESPADA + " " + Elemento.COCO:
        bonifCartaAtacante = 4;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Elemento.TREBOL + " " + Elemento.COCO:
      case Elemento.COCO + " " + Elemento.ESPADA:
        bonifCartaAtacada = 4;
        calculoVAtacada += bonifCartaAtacada;
        break;
      case Elemento.TREBOL + " " + Elemento.CORAZON:
        bonifCartaAtacada = 2;
        calculoVAtacada += bonifCartaAtacada;
        break;
    }
    return {
      calculoVAtacante,
      calculoVAtacada,
      bonifCartaAtacante,
      bonifCartaAtacada,
    };
  }

  obtenerVeredictoAtaque(calculoVAtacante: number, calculoVAtacada: number) {
    if (calculoVAtacante > calculoVAtacada) {
      return VeredictoAtaque.GANA_ATACANTE; // gana
    } else if (calculoVAtacante < calculoVAtacada) {
      return VeredictoAtaque.PIERDE_ATACANTE; // pierde
    } else {
      return VeredictoAtaque.EMPATE; // empata
    }
  }

  atacarCarta(
    jugadorAtacado: Jugador,
    idCartaAtacante: number,
    idCartaAtacada: number
  ): RptaAtacarCarta {
    // Sistema de produccion
    let estadoAtaque = this.posibilidadAtacarCarta(
      jugadorAtacado,
      idCartaAtacada,
      idCartaAtacante
    );

    if (estadoAtaque === ResultadoAtacarCarta.POSIBLE) {
      let idBarreraEliminada = 0;
      let estadoCartaAtacante = EstadoCarta.ACTIVA;
      let estadoCartaAtacada = EstadoCarta.ACTIVA;
      let estadoBarrera = EstadoCarta.ACTIVA;
      let sinBarreras = false;
      let nombreJugadorDerrotado = "";
      let nombreJugadorVictorioso = "";
      const cartaAtacante =
        this.zonaBatalla[idCartaAtacante].carta ?? new Carta(0, Elemento.COCO);
      const cartaAtacada =
        jugadorAtacado.zonaBatalla[idCartaAtacada].carta ??
        new Carta(0, Elemento.COCO);
      const {
        calculoVAtacante,
        calculoVAtacada,
        bonifCartaAtacante,
        bonifCartaAtacada,
      } = this.calculoValorAtaque(cartaAtacante, cartaAtacada);

      const veredicto = this.obtenerVeredictoAtaque(
        calculoVAtacante,
        calculoVAtacada
      );

      // Setear resultados

      // Jugador Atacado en defensa cara abajo, se coloca cara arriba.
      if (
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla ===
        PosBatalla.DEF_ABAJO
      ) {
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla =
          PosBatalla.DEF_ARRIBA;
      }
      const posicionCartaAtacada =
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla;

      // Jugador Atacado al Ataque
      if (posicionCartaAtacada === PosBatalla.ATAQUE) {
        if (veredicto === VeredictoAtaque.GANA_ATACANTE) {
          // gana atacante
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          idBarreraEliminada = jugadorAtacado.barrera.length - 1;
          jugadorAtacado.barrera.pop();
          jugadorAtacado.nCartasEnZB--;
          estadoCartaAtacante = EstadoCarta.ACTIVA;
          estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          estadoBarrera = EstadoCarta.DESTRUIDA;
          if (jugadorAtacado.sinBarreras()) {
            sinBarreras = true;
            nombreJugadorDerrotado = jugadorAtacado.nombre;
            nombreJugadorVictorioso = this.nombre;
          }
        } else if (veredicto === VeredictoAtaque.PIERDE_ATACANTE) {
          // pierde atacante
          this.zonaBatalla[idCartaAtacante].quitarCarta();
          estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          estadoCartaAtacada = EstadoCarta.ACTIVA;
          estadoBarrera = EstadoCarta.ACTIVA;
          this.nCartasEnZB--;
        } else {
          // Empate
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          this.zonaBatalla[idCartaAtacante].quitarCarta();
          estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          estadoBarrera = EstadoCarta.ACTIVA;
          jugadorAtacado.nCartasEnZB--;
          this.nCartasEnZB--;
        }
      } else if (posicionCartaAtacada === PosBatalla.DEF_ARRIBA) {
        // Jugador Atacado a la Defensa
        if (veredicto === VeredictoAtaque.GANA_ATACANTE) {
          // gana atacante
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          estadoCartaAtacante = EstadoCarta.ACTIVA;
          estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          estadoBarrera = EstadoCarta.ACTIVA;
          jugadorAtacado.nCartasEnZB--;
        } else if (veredicto === VeredictoAtaque.PIERDE_ATACANTE) {
          // pierde atacante
          this.zonaBatalla[idCartaAtacante].quitarCarta();
          estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          estadoCartaAtacada = EstadoCarta.ACTIVA;
          estadoBarrera = EstadoCarta.ACTIVA;
          this.nCartasEnZB--;
        } else {
          // Empate
          estadoCartaAtacante = EstadoCarta.ACTIVA;
          estadoCartaAtacada = EstadoCarta.ACTIVA;
          estadoBarrera = EstadoCarta.ACTIVA;
        }
      }
      estadoAtaque = ResultadoAtacarCarta.ATAQUE_REALIZADO;

      this.ataqueRealizado(idCartaAtacante);
      return {
        cartaAtacante,
        cartaAtacada,
        veredicto,
        idBarreraEliminada,
        estadoCartaAtacante,
        estadoCartaAtacada,
        estadoBarrera,
        sinBarreras,
        bonifCartaAtacante,
        bonifCartaAtacada,
        nombreJugadorDerrotado,
        nombreJugadorVictorioso,
        estadoAtaque,
      };
    } else {
      return {
        estadoAtaque,
      };
    }
  }

  puedeCambiarPosicion() {
    if (this.nCartasEnZB === 0) return ResultadoCambiarPosicion.SIN_CARTAS_EN_ZONA_BATALLA;
    if (this.nCambiosPosicionesDisponibles === 0) {
      return ResultadoCambiarPosicion.SIN_CAMBIOS_DE_POSICION_DISPONIBLES;
    }
    return ResultadoCambiarPosicion.POSIBLE;
  }

  posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla: number) {
    const resp = this.puedeCambiarPosicion();
    if (resp !== ResultadoCambiarPosicion.POSIBLE) return resp;
    if (this.zonaBatalla[idZonaBatalla].carta === null) {
      return ResultadoCambiarPosicion.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA;
    }
    if (
      this.zonaBatalla[idZonaBatalla].dispCambio === DispCambio.NO_DISPONIBLE
    ) {
      return ResultadoCambiarPosicion.CARTA_NO_TIENE_DISPONIBLE_CAMBIO_POSICION;
    }
    return ResultadoCambiarPosicion.POSIBLE;
  }

  cambiarPosicionBatalla(idCarta: number) {
    let respuesta = this.posibilidadCambiarPosicionBatallaEnCarta(idCarta);
    if (respuesta === ResultadoCambiarPosicion.POSIBLE) {
      if (
        this.zonaBatalla[idCarta].posBatalla === PosBatalla.DEF_ARRIBA ||
        this.zonaBatalla[idCarta].posBatalla === PosBatalla.DEF_ABAJO
      ) {
        this.zonaBatalla[idCarta].posBatalla = PosBatalla.ATAQUE;
        this.zonaBatalla[idCarta].dispAtaque = DispAtaque.DISPONIBLE;
        this.nAtaquesDisponibles++;
      } else {
        this.zonaBatalla[idCarta].posBatalla = PosBatalla.DEF_ARRIBA;
        this.zonaBatalla[idCarta].dispAtaque = DispAtaque.NO_DISPONIBLE;
      }
      this.zonaBatalla[idCarta].dispCambio = DispCambio.NO_DISPONIBLE;
      this.nCambiosPosicionesDisponibles--;
      respuesta = ResultadoCambiarPosicion.POSICION_CAMBIADA;
    }
    return {
      respuesta,
      posBatalla: this.zonaBatalla[idCarta].posBatalla,
      carta: this.zonaBatalla[idCarta].carta,
    };
  }

  repartirCartas() {
    const cartasElegidas: boolean[][] = [];
    let n, m, cartasRepartidas;

    for (let i = 0; i < NUMERO_ELEMENTOS_CARTAS; i++) {
      cartasElegidas.push([]);
      for (let j = 0; j < MAX_VALOR_CARTA; j++) {
        cartasElegidas[i][j] = false;
      }
    }

    cartasRepartidas = 0;

    while (cartasRepartidas < MAX_DECK) {
      n = Math.floor(Math.random() * NUMERO_ELEMENTOS_CARTAS);
      m = Math.floor(Math.random() * MAX_VALOR_CARTA);

      if (!cartasElegidas[n][m]) {
        cartasElegidas[n][m] = true;

        cartasRepartidas++;
        const c = new Carta(m + 1, Object.values(Elemento)[n]);
        if (this.barrera.length < MAX_BARRERA_CARDS) {
          this.barrera.push(c);
        } else if (this.mano.length < MAX_MANO_CARDS) {
          this.mano.push(c);
        } else {
          this.deck.push(c);
        }
      }
    }
  }
}
