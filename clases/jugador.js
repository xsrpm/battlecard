/* eslint-disable no-undef */
const Carta = require("./carta.js");
const CeldaBatalla = require("./celdabatalla.js");

const ResultadoCojerUnaCarta = {
  MANO_LLENA: "MANO LLENA",
  DECK_VACIO: "DECK VACIO",
  EXITO: "EXITO",
};
Object.freeze(ResultadoCojerUnaCarta);
const VeredictoAtaque = {
  EMPATE: "EMPATE",
  GANA_ATACANTE: "GANA ATACANTE", //Gana Atacante contra carta en Zona de Batalla
  PIERDE_ATACANTE: "PIERDE ATACANTE", //Pierde Atacante
};
Object.freeze(VeredictoAtaque);
const EstadoCarta = {
  ACTIVA: "ACTIVA", // Carta activa
  DESTRUIDA: "DESTRUIDA", // Carta destruida
};
Object.freeze(EstadoCarta);
class Jugador {
  static get MAX_ZONA_BATALLA_CARDS() {
    return 3;
  }
  static get MAX_BARRERA_CARDS() {
    return 5;
  }
  static get MAX_MANO_CARDS() {
    return 5;
  }
  static get MAX_DECK() {
    return Carta.MAX_VALOR_CARTA * Carta.NUMERO_ELEMENTOS_CARTAS;
  }
  static get ResultadoCojerUnaCarta() {
    return ResultadoCojerUnaCarta;
  }
  static get VeredictoAtaque() {
    return VeredictoAtaque;
  }
  static get EstadoCarta() {
    return EstadoCarta;
  }
  /**
   *
   * @param {string} nombre
   */
  constructor(nombre) {
    this.cartaColocada = false;
    this.nAtaquesDisponibles = 0;
    this.nCambiosPosicionesDisponibles = 0;
    /**
     * @type {Array<CeldaBatalla>}
     */
    this.zonaBatalla = [];
    for (let i = 0; i < Jugador.MAX_ZONA_BATALLA_CARDS; i++) {
      this.zonaBatalla[i] = new CeldaBatalla();
      this.zonaBatalla[i].carta = null;
    }
    /**
     * @type {Array<Carta>}
     */
    this.barrera = [];
    /**
     * @type {Array<Carta>}
     */
    this.mano = [];
    /**
     * @type {Array<Carta>}
     */
    this.deck = [];
    this.nTurnos = 0;
    this.nombre = nombre;
    this.puedeColocarCartaEnZB = true;
    this.nCartasEnZB = 0; // revisa codigo por esto
    this.enTurno = false;
  }
  //region Operaciones (Reglas)

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

  setEnTurno(enTurno) {
    this.enTurno = enTurno;
  }

  iniciarTurno() {
    this.nTurnos++;
    this.nAtaquesDisponibles = 0;
    this.nCambiosPosicionesDisponibles = 0;
    this.cartaColocada = false;
    this.puedeColocarCartaEnZB = true;
    for (let celdaBatalla of this.zonaBatalla) {
      if (celdaBatalla.carta != null) {
        if (
          celdaBatalla.posBatalla === CeldaBatalla.Estado.POS_BATALLA_ATAQUE
        ) {
          celdaBatalla.dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
          this.nAtaquesDisponibles++;
        } else{
          celdaBatalla.dispAtaque = CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
        }
        celdaBatalla.dispCambio = CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE;
        this.nCambiosPosicionesDisponibles++;
      }
    }
  }

  /**
   *  @returns {string}
   */
  cogerUnaCartaDelDeck() {
    if (this.mano.length === Jugador.MAX_MANO_CARDS)
      return { resultado: ResultadoCojerUnaCarta.MANO_LLENA };
    const carta = this.deck.pop();
    if (carta === undefined) {
      //console.log("Fin del Juego!!!");
      //console.log(this.nombre + " se quedó sin cartas en el mazo!!");
      return { resultado: ResultadoCojerUnaCarta.DECK_VACIO };
    } else {
      this.mano.push(carta);
      //console.log("Se coge una carta del deck a la mano");
      return { resultado: ResultadoCojerUnaCarta.EXITO, carta: carta };
    }
  }

  puedeColocarCartaDesdeId(idCartaMano) {
    if (!this.puedeColocarCartaEnZB)
      return "No está habilitado para colocar carta";
    if (!this.existeCartaEnMano(idCartaMano))
      return "No hay carta en la mano para esa posicion";
    return "Posible";
  }

  /**
   * @param {number} idPosZB
   * @param {number} idCartaMano
   * @returns {string}
   */
  posibilidadColocarCartaEnPosicion(idPosZB, idCartaMano) {
    let resp = this.puedeColocarCartaDesdeId(idCartaMano);
    if (resp !== "Posible") return resp;
    if (
      this.zonaBatalla[idPosZB].posBatalla !== CeldaBatalla.Estado.NO_HAY_CARTA
    )
      return "Posición en zona de batalla está ocupada";
    return "Posible";
  }

  /**
   * @param {number} idPosZB
   * @param {number} idCartaMano
   * @param {string} posBatalla
   * @returns {string}
   */
  accionColocarCarta(idPosZB, idCartaMano, posBatalla) {
    let respuesta = this.posibilidadColocarCartaEnPosicion(
      idPosZB,
      idCartaMano
    );
    if (respuesta === "Posible") {
      let carta = this.mano[idCartaMano];
      this.mano.splice(idCartaMano, 1);
      this.puedeColocarCartaEnZB = false;
      if (posBatalla === CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
        this.nAtaquesDisponibles++;
      this.zonaBatalla[idPosZB].agregarCarta(carta, posBatalla);
      this.nCartasEnZB++;
      respuesta = "Carta colocada";
      //console.log("Carta Colocada!!");
    }
    return respuesta;
  }

  /**
   *
   * @param {number} idPosZB
   * @param {number} idCartaMano
   */
  accionColocarCartaEnAtaque(idPosZB, idCartaMano) {
    return this.accionColocarCarta(
      idPosZB,
      idCartaMano,
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    );
  }
  /**
   *
   * @param {number} idPosZB
   * @param {number} idCartaMano
   */
  accionColocarCartaEnDefensa(idPosZB, idCartaMano) {
    return this.accionColocarCarta(
      idPosZB,
      idCartaMano,
      CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
    );
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @returns {string}
   */
  puedeAtacarBarreras(jugadorAtacado) {
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (jugadorAtacado.nCartasEnZB > 0)
      return "Hay cartas en zona de batalla enemiga";
    if (this.nAtaquesDisponibles === 0)
      return "No le quedan ataques disponibles";
    if (this.nTurnos < 2)
      return "Atacantes solo se pueden realizar desde el segundo turno";
    return "Posible";
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacante
   * @returns {string}
   */
  posibilidadAtacarBarrera(jugadorAtacado, idCartaAtacante) {
    let resp = this.puedeAtacarBarreras(jugadorAtacado);
    if (resp !== "Posible") return resp;
    resp = this.existeCartaEnCeldaBatalla(idCartaAtacante);
    if (resp === "No hay carta en tu ubicación de zona de batalla") return resp;
    if (
      this.zonaBatalla[idCartaAtacante].posBatalla !==
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    )
      return "Carta atacante no está en posición de ataque";
    if (
      this.zonaBatalla[idCartaAtacante].dispAtaque ===
      CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
    )
      return "Carta atacante no tiene ataque disponible";
    return "Posible";
  }

  /**
   *
   * @param {number} idCartaAtacante
   */
  ataqueRealizado(idCartaAtacante) {
    this.nAtaquesDisponibles--;
    this.zonaBatalla[idCartaAtacante].ataqueRealizado();
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacante
   */
  accionAtacarBarrera(jugadorAtacado, idCartaAtacante) {
    let respuesta = {};
    respuesta.resultado = this.posibilidadAtacarBarrera(
      jugadorAtacado,
      idCartaAtacante
    );
    if (respuesta.resultado === "Posible") {
      respuesta.idBarreraEliminada = jugadorAtacado.barrera.length - 1;
      jugadorAtacado.barrera.pop();
      this.ataqueRealizado(idCartaAtacante);
      if (jugadorAtacado.sinBarreras()) {
        respuesta.sinBarreras = true;
        respuesta.nombreJugadorDerrotado = jugadorAtacado.nombre;
        respuesta.nombreJugadorVictorioso = this.nombre;
      }
      respuesta.resultado = "Barrera destruida";
    }
    return respuesta;
  }
  /**
   * @param {Jugador} jugadorAtacado
   * @returns {string}
   */
  puedeAtacarCartas(jugadorAtacado) {
    if (this.nTurnos < 2)
      return "Atacantes solo se pueden realizar desde el segundo turno";
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (jugadorAtacado.nCartasEnZB === 0)
      return "No hay cartas en zona de batalla enemiga";
    if (this.nAtaquesDisponibles === 0)
      return "No le quedan ataques disponibles";
    if (jugadorAtacado.barrera.length === 0)
      return "Jugador enemigo debe tener barreras";
    return "Posible";
  }

  /**
   *
   * @param {number} idZonaBatalla
   * @returns
   */

  existeCartaEnCeldaBatalla(idZonaBatalla) {
    return (
      this.zonaBatalla[idZonaBatalla].carta != null &&
      this.zonaBatalla[idZonaBatalla] !== undefined
    );
  }

  /**
   *
   * @param {number} idMano
   * @returns
   */
  existeCartaEnMano(idMano) {
    return this.mano[idMano] !== null && this.mano[idMano] !== undefined;
  }

  /**
   *
   * @param {Jugador} jugadorAtacado
   * @param {number} idZonaBatalla
   * @returns
   */
  puedeAtacarCartaDesdeId(jugadorAtacado, idZonaBatalla) {
    let resp = this.puedeAtacarCartas(jugadorAtacado);
    if (resp !== "Posible") return resp;
    if (this.existeCartaEnCeldaBatalla(idZonaBatalla) !== true)
      return "No hay carta en tu ubicación de zona de batalla";
    if (
      this.zonaBatalla[idZonaBatalla].dispAtaque ===
      CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
    )
      return "Carta atacante no tiene ataque disponible";
    if (
      this.zonaBatalla[idZonaBatalla].posBatalla !==
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    )
      return "Carta atacante no está en posición de ataque";
    return "Posible";
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacada
   * @param {number} idCartaAtacante
   * @returns {string}
   */
  posibilidadAtacarCarta(jugadorAtacado, idCartaAtacada, idCartaAtacante) {
    let resp = this.puedeAtacarCartaDesdeId(jugadorAtacado, idCartaAtacante);
    if (resp !== "Posible") return resp;
    if (jugadorAtacado.zonaBatalla[idCartaAtacada].carta === null)
      return "No hay carta en ubicación de zona de batalla enemiga";
    return "Posible";
  }

  /**
   *
   * @param {Carta} cartaAtacante
   * @param {Carta} cartaAtacada
   * @returns {{number,number}}
   */
  calculoValorAtaque(cartaAtacante, cartaAtacada) {
    let calculoVAtacante = cartaAtacante.valor,
      calculoVAtacada = cartaAtacada.valor,
      bonifCartaAtacante = 0,
      bonifCartaAtacada = 0;

    switch (cartaAtacante.elemento + " " + cartaAtacada.elemento) {
      case Carta.Elemento.ESPADA + " " + Carta.Elemento.TREBOL:
        bonifCartaAtacada = 6;
        calculoVAtacada += bonifCartaAtacada;
        break;
      case Carta.Elemento.TREBOL + " " + Carta.Elemento.ESPADA:
        bonifCartaAtacante = 6;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.ESPADA + " " + Carta.Elemento.CORAZON:
        bonifCartaAtacante = 2;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.CORAZON + " " + Carta.Elemento.ESPADA:
        bonifCartaAtacante = 2;
        calculoVAtacada += bonifCartaAtacante;
        break;
      case Carta.Elemento.COCO + " " + Carta.Elemento.TREBOL:
        bonifCartaAtacante = 4;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.TREBOL + " " + Carta.Elemento.COCO:
        bonifCartaAtacada = 4;
        calculoVAtacada += bonifCartaAtacada;
        break;
      case Carta.Elemento.ESPADA + " " + Carta.Elemento.COCO:
        bonifCartaAtacante = 4;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.COCO + " " + Carta.Elemento.ESPADA:
        bonifCartaAtacada = 4;
        calculoVAtacada += bonifCartaAtacada;
        break;
      case Carta.Elemento.CORAZON + " " + Carta.Elemento.TREBOL:
        bonifCartaAtacante = 2;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.TREBOL + " " + Carta.Elemento.CORAZON:
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

  /**
   *
   * @param {Carta} cartaAtacante
   * @param {Carta} cartaAtacada
   */
  obtenerVeredictoAtaque(calculoVAtacante, calculoVAtacada) {
    if (calculoVAtacante > calculoVAtacada) {
      return VeredictoAtaque.GANA_ATACANTE; //gana
    } else if (calculoVAtacante < calculoVAtacada) {
      return VeredictoAtaque.PIERDE_ATACANTE; //pierde
    } else {
      return VeredictoAtaque.EMPATE; //empata
    }
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacada
   * @param {number} idCartaAtacante
   */
  accionAtacarCarta(jugadorAtacado, idCartaAtacante, idCartaAtacada) {
    //Sistema de produccion
    let rsAtaque = {};
    rsAtaque.estadoAtaque = this.posibilidadAtacarCarta(
      jugadorAtacado,
      idCartaAtacada,
      idCartaAtacante
    );
    if (rsAtaque.estadoAtaque === "Posible") {
      let posicionCartaAtacada;
      rsAtaque.cartaAtacante = this.zonaBatalla[idCartaAtacante].carta;
      rsAtaque.cartaAtacada = jugadorAtacado.zonaBatalla[idCartaAtacada].carta;

      let {
        calculoVAtacante,
        calculoVAtacada,
        bonifCartaAtacante,
        bonifCartaAtacada,
      } = this.calculoValorAtaque(
        rsAtaque.cartaAtacante,
        rsAtaque.cartaAtacada
      );

      rsAtaque.bonifCartaAtacada = bonifCartaAtacada;
      rsAtaque.bonifCartaAtacante = bonifCartaAtacante;

      rsAtaque.veredicto = this.obtenerVeredictoAtaque(
        calculoVAtacante,
        calculoVAtacada
      );

      //Setear resultados

      //Jugador Atacado en defensa cara abajo, se coloca cara arriba.
      if (
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla ===
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      ) {
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla =
          CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA;
      }
      posicionCartaAtacada =
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla;
      //Jugador Atacado al Ataque
      if (posicionCartaAtacada === CeldaBatalla.Estado.POS_BATALLA_ATAQUE) {
        if (rsAtaque.veredicto === VeredictoAtaque.GANA_ATACANTE) {
          //gana atacante
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          rsAtaque.idBarreraEliminada = jugadorAtacado.barrera.length - 1;
          jugadorAtacado.barrera.pop();
          jugadorAtacado.nCartasEnZB--;
          rsAtaque.estadoCartaAtacante = EstadoCarta.ACTIVA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoBarrera = EstadoCarta.DESTRUIDA;
          if (jugadorAtacado.sinBarreras()) {
            rsAtaque.sinBarreras = true;
            rsAtaque.nombreJugadorDerrotado = jugadorAtacado.nombre;
            rsAtaque.nombreJugadorVictorioso = this.nombre;
          }
        } else if (rsAtaque.veredicto === VeredictoAtaque.PIERDE_ATACANTE) {
          //pierde atacante
          this.zonaBatalla[idCartaAtacante].quitarCarta();
          rsAtaque.estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.ACTIVA;
          rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
          this.nCartasEnZB--;
        } else {
          //Empate
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          this.zonaBatalla[idCartaAtacante].quitarCarta();
          rsAtaque.estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
          jugadorAtacado.nCartasEnZB--;
          this.nCartasEnZB--;
        }
      } else if (
        posicionCartaAtacada === CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
      ) {
        //Jugador Atacado a la Defensa
        if (rsAtaque.veredicto === VeredictoAtaque.GANA_ATACANTE) {
          //gana atacante
          jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
          rsAtaque.estadoCartaAtacante = EstadoCarta.ACTIVA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
          jugadorAtacado.nCartasEnZB--;
        } else if (rsAtaque.veredicto === VeredictoAtaque.PIERDE_ATACANTE) {
          //pierde atacante
          this.zonaBatalla[idCartaAtacada].quitarCarta();
          rsAtaque.estadoCartaAtacante = EstadoCarta.DESTRUIDA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.ACTIVA;
          rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
          this.nCartasEnZB--;
        } else {
          //Empate
          rsAtaque.estadoCartaAtacante = EstadoCarta.ACTIVA;
          rsAtaque.estadoCartaAtacada = EstadoCarta.ACTIVA;
          rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
        }
      }
      rsAtaque.estadoAtaque = "Ataque realizado";

      this.ataqueRealizado(idCartaAtacante);
      //console.log(ataqueCartaRealizadoDialogo(rsAtaque));
    }
    return rsAtaque;
  }
  /**
   * @returns {string}
   */
  puedeCambiarPosicion() {
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (this.nCambiosPosicionesDisponibles === 0)
      return "Sin cambios de posición disponibles";
    return "Posible";
  }
  /**
   * @param {number} idZonaBatalla
   * @returns {string}
   */
  posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla) {
    let resp = this.puedeCambiarPosicion();
    if (resp !== "Posible") return resp;
    if (this.zonaBatalla[idZonaBatalla].carta === null)
      return "No hay carta en posición de batalla indicada";
    if (
      this.zonaBatalla[idZonaBatalla].dispCambio ===
      CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
    )
      return "Carta indicada no tiene disponible el cambio de posición";
    return "Posible";
  }

  /**
   * @param {number} idCarta
   */
  cambiarPosicionBatalla(idCarta) {
    let respuesta = this.posibilidadCambiarPosicionBatallaEnCarta(idCarta);
    if (respuesta === "Posible") {
      if (
        this.zonaBatalla[idCarta].posBatalla ===
          CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA ||
        this.zonaBatalla[idCarta].posBatalla ==
          CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      ) {
        this.zonaBatalla[idCarta].posBatalla =
          CeldaBatalla.Estado.POS_BATALLA_ATAQUE;
        this.zonaBatalla[idCarta].dispAtaque =
          CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      } else {
        this.zonaBatalla[idCarta].posBatalla =
          CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA;
        this.zonaBatalla[idCarta].dispAtaque =
          CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
      }
      this.zonaBatalla[idCarta].dispCambio =
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE;
      this.nCambiosPosicionesDisponibles--;
      respuesta = "Posicion cambiada";
      //logger.debug("Cambio de Posición Realizado!!\n");
    }
    return {
      respuesta: respuesta,
      posBatalla: this.zonaBatalla[idCarta].posBatalla,
      carta: this.zonaBatalla[idCarta].carta,
    };
  }

  repartirCartas() {
    //console.log("repartirCartas");
    //console.log("Jugador: " + this.nombre);
    let cartasElegidas = [];
    let n, m, cartasRepartidas;

    for (let i = 0; i < Carta.NUMERO_ELEMENTOS_CARTAS; i++) {
      cartasElegidas.push([]);
      for (let j = 0; j < Carta.MAX_VALOR_CARTA; j++) {
        cartasElegidas[i][j] = false;
      }
    }

    cartasRepartidas = 0;

    while (cartasRepartidas < Jugador.MAX_DECK) {
      n = Math.floor(Math.random() * Carta.NUMERO_ELEMENTOS_CARTAS);
      m = Math.floor(Math.random() * Carta.MAX_VALOR_CARTA);

      if (!cartasElegidas[n][m]) {
        cartasElegidas[n][m] = true;

        cartasRepartidas++;
        let c = new Carta(m + 1, Object.values(Carta.Elemento)[n]);
        if (this.barrera.length < Jugador.MAX_BARRERA_CARDS) {
          this.barrera.push(c);
          //console.log("Barrera: " + c.valor + " " + c.elemento);
        } else if (this.mano.length < Jugador.MAX_MANO_CARDS) {
          this.mano.push(c);
          //console.log("Mano: " + c.valor + " " + c.elemento);
        } else {
          this.deck.push(c);
          //console.log("Deck: " + c.valor + " " + c.elemento);
        }
      }
    }
  }

  //TODO: separar funcionalidades zonabatalla en una clase zonabatalla que herede de la clase Array
}

module.exports = { Jugador };
