import { Carta } from "./carta";
import { CeldaBatalla } from "./celdabatalla";

export const ResultadoCojerUnaCarta = {
  MANO_LLENA: "MANO LLENA",
  DECK_VACIO: "DECK VACIO",
  EXITO: "EXITO",
};
Object.freeze(ResultadoCojerUnaCarta);
const VeredictoAtaque = {
  EMPATE: "EMPATE",
  GANA_ATACANTE: "GANA ATACANTE", // Gana Atacante contra carta en Zona de Batalla
  PIERDE_ATACANTE: "PIERDE ATACANTE", // Pierde Atacante
};
Object.freeze(VeredictoAtaque);
const EstadoCarta = {
  ACTIVA: "ACTIVA", // Carta activa
  DESTRUIDA: "DESTRUIDA", // Carta destruida
};
Object.freeze(EstadoCarta);

type RptaAccionColocarCarta = {
  resultado : string,
  carta?: Carta
}

type RptaAccionAtacarBarrera ={
  resultado: string,
  idBarreraEliminada?: number,
  sinBarreras?:boolean, 
  nombreJugadorDerrotado?:string,
  nombreJugadorVictorioso?:string
}

type RptaCalculoValorAtaque = {
  calculoVAtacante:number,
  calculoVAtacada:number,
  bonifCartaAtacante:number,
  bonifCartaAtacada:number
}

type RptaAccionAtacarCarta = {
  estadoAtaque: string,
  cartaAtacante?: Carta,
  cartaAtacada?: Carta,
  bonifCartaAtacante?:number,
  bonifCartaAtacada?:number,
  veredicto?:string,
  idBarreraEliminada?:number
  estadoCartaAtacante?: string,
  estadoCartaAtacada?:string,
  estadoBarrera?:string,
  sinBarreras?:boolean,
  nombreJugadorDerrotado?:string,
  nombreJugadorVictorioso?:string
}

export interface RptaCogerUnaCartaDelDeck{
  resultado: string,
  carta?: Carta
}

export class Jugador {
  cartaColocada;
  nAtaquesDisponibles;
  nCambiosPosicionesDisponibles;
  zonaBatalla: Array<CeldaBatalla>;
  barrera: Array<Carta>;
  mano: Array<Carta>;
  deck: Array<Carta>;
  nTurnos;
  nombre;
  puedeColocarCartaEnZB
  nCartasEnZB
  enTurno
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
  constructor(nombre: string) {
    this.cartaColocada = false;
    this.nAtaquesDisponibles = 0;
    this.nCambiosPosicionesDisponibles = 0;
    this.zonaBatalla = [];
    this.barrera = [];
    for (let i = 0; i < Jugador.MAX_ZONA_BATALLA_CARDS; i++) {
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

  setEnTurno(enTurno:boolean) {
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
        if (
          celdaBatalla.posBatalla === CeldaBatalla.Estado.POS_BATALLA_ATAQUE
        ) {
          celdaBatalla.dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
          this.nAtaquesDisponibles++;
        } else {
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
  cogerUnaCartaDelDeck(): RptaCogerUnaCartaDelDeck {
    if (this.mano.length === Jugador.MAX_MANO_CARDS) {
      return { resultado: ResultadoCojerUnaCarta.MANO_LLENA };
    }
    const carta = this.deck.pop();
    if (carta === undefined) {
      return { resultado: ResultadoCojerUnaCarta.DECK_VACIO };
    } else {
      this.mano.push(carta);
      return { resultado: ResultadoCojerUnaCarta.EXITO, carta };
    }
  }

  puedeColocarCartas() {
    if (!this.puedeColocarCartaEnZB) {
      return "Ya colocó cartas en este turno";
    }
    if (this.nCartasEnZB === Jugador.MAX_ZONA_BATALLA_CARDS) {
      return "La zona de batalla está llena";
    }
    return "Posible";
  }

  puedeColocarCartaDesdeId(idCartaMano:number) {
    const resp = this.puedeColocarCartas();
    if (resp !== "Posible") return resp;
    if (!this.tieneCartaEnMano(idCartaMano)) {
      return "No hay carta en la mano para esa posicion";
    }
    return "Posible";
  }

  /**
   * @param {number} idPosZB
   * @param {number} idCartaMano
   * @returns {string}
   */
  posibilidadColocarCartaEnPosicion(idPosZB:number, idCartaMano:number) {
    const resp = this.puedeColocarCartaDesdeId(idCartaMano);
    if (resp !== "Posible") return resp;
    if (this.tieneCartaColocada(idPosZB)) {
      return "Posición en zona de batalla está ocupada";
    }
    return "Posible";
  }

  /**
   * @param {number} idPosZB
   * @param {number} idCartaMano
   * @param {string} posBatalla
   * @returns {string}
   */
  accionColocarCarta(idPosZB:number, idCartaMano:number, posBatalla:string) : RptaAccionColocarCarta  {
    let resultado = this.posibilidadColocarCartaEnPosicion(
      idPosZB,
      idCartaMano
    );
    let carta: Carta 
    if (resultado === "Posible") {
      carta = this.mano[idCartaMano];
      this.mano.splice(idCartaMano, 1);
      this.puedeColocarCartaEnZB = false;
      if (posBatalla === CeldaBatalla.Estado.POS_BATALLA_ATAQUE) {
        this.nAtaquesDisponibles++;
      }
      this.zonaBatalla[idPosZB].agregarCarta(carta, posBatalla);
      this.nCartasEnZB++;
      resultado = "Carta colocada";
      return {
        resultado, carta
      }
    }
    else{
      return {resultado}
    }
   
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @returns {string}
   */
  puedeAtacarBarreras(jugadorAtacado: Jugador) {
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (jugadorAtacado.nCartasEnZB > 0) {
      return "Hay cartas en zona de batalla enemiga";
    }
    if (this.nAtaquesDisponibles === 0) {
      return "No le quedan ataques disponibles";
    }
    if (this.nTurnos < 2) {
      return "Ataques solo se pueden realizar desde el segundo turno";
    }
    return "Posible";
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacante
   * @returns {string}
   */
  posibilidadAtacarBarrera(jugadorAtacado: Jugador, idCartaAtacante: number) {
    const resp = this.puedeAtacarBarreras(jugadorAtacado);
    if (resp !== "Posible") return resp;
    if (!this.existeCartaEnCeldaBatalla(idCartaAtacante))
      return "No hay carta en tu ubicación de zona de batalla";
    if (
      this.zonaBatalla[idCartaAtacante].posBatalla !==
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    ) {
      return "Carta atacante no está en posición de ataque";
    }
    if (
      this.zonaBatalla[idCartaAtacante].dispAtaque ===
      CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
    ) {
      return "Carta atacante no tiene ataque disponible";
    }
    return "Posible";
  }

  /**
   *
   * @param {number} idCartaAtacante
   */
  ataqueRealizado(idCartaAtacante: number) {
    this.nAtaquesDisponibles--;
    this.zonaBatalla[idCartaAtacante].ataqueRealizado();
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacante
   */
  accionAtacarBarrera(jugadorAtacado: Jugador, idCartaAtacante:number): RptaAccionAtacarBarrera {
    let resultado = this.posibilidadAtacarBarrera(
      jugadorAtacado,
      idCartaAtacante
    );
    if (resultado === "Posible") {
      let idBarreraEliminada = jugadorAtacado.barrera.length - 1;
      let sinBarreras = false
      let nombreJugadorDerrotado =undefined
      let nombreJugadorVictorioso = undefined
      jugadorAtacado.barrera.pop();
      this.ataqueRealizado(idCartaAtacante);
      if (jugadorAtacado.sinBarreras()) {
        sinBarreras = true;
        nombreJugadorDerrotado = jugadorAtacado.nombre;
        nombreJugadorVictorioso = this.nombre;
      }
      return{
        resultado: "Barrera destruida",idBarreraEliminada, sinBarreras, nombreJugadorDerrotado, nombreJugadorVictorioso
      }
    }
    else{
      return {
        resultado
      }
    }
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @returns {string}
   */
  puedeAtacarCartas(jugadorAtacado: Jugador) {
    if (this.nTurnos < 2) {
      return "Atacantes solo se pueden realizar desde el segundo turno";
    }
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (jugadorAtacado.nCartasEnZB === 0) {
      return "No hay cartas en zona de batalla enemiga";
    }
    if (this.nAtaquesDisponibles === 0) {
      return "No le quedan ataques disponibles";
    }
    if (jugadorAtacado.barrera.length === 0) {
      return "Jugador enemigo debe tener barreras";
    }
    return "Posible";
  }

  /**
   *
   * @param {number} idZonaBatalla
   * @returns
   */

  existeCartaEnCeldaBatalla(idZonaBatalla:number) {
    return (
      this.zonaBatalla[idZonaBatalla] &&
      this.zonaBatalla[idZonaBatalla].carta !== null
    );
  }

  /**
   *
   * @param {number} idPosicionMano
   * @returns
   */
  tieneCartaEnMano(idPosicionMano: number) {
    return (
      this.mano[idPosicionMano] !== null &&
      this.mano[idPosicionMano] !== undefined
    );
  }

  tieneCartaColocada(idPosicionManoZB: number) {
    return this.zonaBatalla[idPosicionManoZB].carta !== null;
  }

  /**
   *
   * @param {Jugador} jugadorAtacado
   * @param {number} idZonaBatalla
   * @returns
   */
  puedeAtacarCartaDesdeId(jugadorAtacado: Jugador, idZonaBatalla: number): string {
    const resp = this.puedeAtacarCartas(jugadorAtacado);
    if (resp !== "Posible") return resp;
    if (this.existeCartaEnCeldaBatalla(idZonaBatalla) !== true) {
      return "No hay carta en tu ubicación de zona de batalla";
    }
    if (
      this.zonaBatalla[idZonaBatalla].dispAtaque ===
      CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
    ) {
      return "Carta atacante no tiene ataque disponible";
    }
    if (
      this.zonaBatalla[idZonaBatalla].posBatalla !==
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    ) {
      return "Carta atacante no está en posición de ataque";
    }
    return "Posible";
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacada
   * @param {number} idCartaAtacante
   * @returns {string}
   */
  posibilidadAtacarCarta(jugadorAtacado: Jugador, idCartaAtacada: number, idCartaAtacante: number) {
    const resp: string = this.puedeAtacarCartaDesdeId(jugadorAtacado, idCartaAtacante);
    if (resp !== "Posible") return resp;
    if (jugadorAtacado.zonaBatalla[idCartaAtacada].carta === null) {
      return "No hay carta en ubicación de zona de batalla enemiga";
    }
    return "Posible";
  }

  /**
   *
   * @param {Carta} cartaAtacante
   * @param {Carta} cartaAtacada
   * @returns {RptaCalculoValorAtaque}
   */
  calculoValorAtaque(cartaAtacante: Carta, cartaAtacada: Carta): RptaCalculoValorAtaque {
    let calculoVAtacante = cartaAtacante.valor ;
    let calculoVAtacada = cartaAtacada.valor;
    let bonifCartaAtacante = 0;
    let bonifCartaAtacada = 0;

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
      case Carta.Elemento.CORAZON + " " + Carta.Elemento.TREBOL:
        bonifCartaAtacante = 2;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.CORAZON + " " + Carta.Elemento.ESPADA:
        bonifCartaAtacante = 2;
        calculoVAtacada += bonifCartaAtacante;
        break;
      case Carta.Elemento.COCO + " " + Carta.Elemento.TREBOL:
      case Carta.Elemento.ESPADA + " " + Carta.Elemento.COCO:
        bonifCartaAtacante = 4;
        calculoVAtacante += bonifCartaAtacante;
        break;
      case Carta.Elemento.TREBOL + " " + Carta.Elemento.COCO:
      case Carta.Elemento.COCO + " " + Carta.Elemento.ESPADA:
        bonifCartaAtacada = 4;
        calculoVAtacada += bonifCartaAtacada;
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
   * @param {number} calculoVAtacante
   * @param {number} calculoVAtacada
   */
  obtenerVeredictoAtaque(calculoVAtacante:number, calculoVAtacada:number) {
    if (calculoVAtacante > calculoVAtacada) {
      return VeredictoAtaque.GANA_ATACANTE; // gana
    } else if (calculoVAtacante < calculoVAtacada) {
      return VeredictoAtaque.PIERDE_ATACANTE; // pierde
    } else {
      return VeredictoAtaque.EMPATE; // empata
    }
  }

  /**
   * @param {Jugador} jugadorAtacado
   * @param {number} idCartaAtacada
   * @param {number} idCartaAtacante
   */
  accionAtacarCarta(jugadorAtacado: Jugador, idCartaAtacante: number, idCartaAtacada:number) : RptaAccionAtacarCarta {
    // Sistema de produccion
    let estadoAtaque = this.posibilidadAtacarCarta(
      jugadorAtacado,
      idCartaAtacada,
      idCartaAtacante
    );

    if (estadoAtaque === "Posible") {
      let veredicto: string
      let idBarreraEliminada= 0
      let estadoCartaAtacante = EstadoCarta.ACTIVA
      let estadoCartaAtacada = EstadoCarta.ACTIVA
      let estadoBarrera = EstadoCarta.ACTIVA
      let sinBarreras = false
      let nombreJugadorDerrotado =""
      let nombreJugadorVictorioso =""
      let cartaAtacante = this.zonaBatalla[idCartaAtacante].carta ?? new Carta(0,Carta.Elemento.COCO);
      let cartaAtacada = jugadorAtacado.zonaBatalla[idCartaAtacada].carta ?? new Carta(0,Carta.Elemento.COCO);
      const {
        calculoVAtacante,
        calculoVAtacada,
        bonifCartaAtacante,
        bonifCartaAtacada,
      } = this.calculoValorAtaque(cartaAtacante,cartaAtacada);

      veredicto = this.obtenerVeredictoAtaque(
        calculoVAtacante,
        calculoVAtacada
      );

      // Setear resultados

      // Jugador Atacado en defensa cara abajo, se coloca cara arriba.
      if (
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla ===
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      ) {
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla =
          CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA;
      }
      const posicionCartaAtacada =
        jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla;

      // Jugador Atacado al Ataque
      if (posicionCartaAtacada === CeldaBatalla.Estado.POS_BATALLA_ATAQUE) {
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
      } else if (
        posicionCartaAtacada === CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
      ) {
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
      estadoAtaque = "Ataque realizado";

      this.ataqueRealizado(idCartaAtacante);
      return {
        cartaAtacante ,
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
        estadoAtaque
      }
    }
    else{
      return {
        estadoAtaque
      }
    }

  }

  /**
   * @returns {string}
   */
  puedeCambiarPosicion() {
    if (this.nCartasEnZB === 0) return "Sin cartas en zona de batalla";
    if (this.nCambiosPosicionesDisponibles === 0) {
      return "Sin cambios de posición disponibles";
    }
    return "Posible";
  }

  /**
   * @param {number} idZonaBatalla
   * @returns {string}
   */
  posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla:number) {
    const resp = this.puedeCambiarPosicion();
    if (resp !== "Posible") return resp;
    if (this.zonaBatalla[idZonaBatalla].carta === null) {
      return "No hay carta en posición de batalla indicada";
    }
    if (
      this.zonaBatalla[idZonaBatalla].dispCambio ===
      CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
    ) {
      return "Carta indicada no tiene disponible el cambio de posición";
    }
    return "Posible";
  }

  /**
   * @param {number} idCarta
   */
  cambiarPosicionBatalla(idCarta:number) {
    let respuesta = this.posibilidadCambiarPosicionBatallaEnCarta(idCarta);
    if (respuesta === "Posible") {
      if (
        this.zonaBatalla[idCarta].posBatalla ===
          CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA ||
        this.zonaBatalla[idCarta].posBatalla ===
          CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      ) {
        this.zonaBatalla[idCarta].posBatalla =
          CeldaBatalla.Estado.POS_BATALLA_ATAQUE;
        this.zonaBatalla[idCarta].dispAtaque =
          CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
        this.nAtaquesDisponibles++;
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
    }
    return {
      respuesta,
      posBatalla: this.zonaBatalla[idCarta].posBatalla,
      carta: this.zonaBatalla[idCarta].carta,
    };
  }

  repartirCartas() {
    const cartasElegidas:Array<Array<boolean>> = [];
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
        const c = new Carta(m + 1, Object.values(Carta.Elemento)[n]);
        if (this.barrera.length < Jugador.MAX_BARRERA_CARDS) {
          this.barrera.push(c);
        } else if (this.mano.length < Jugador.MAX_MANO_CARDS) {
          this.mano.push(c);
        } else {
          this.deck.push(c);
        }
      }
    }
  }
}
