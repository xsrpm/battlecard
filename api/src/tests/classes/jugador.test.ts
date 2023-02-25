import {
  MAX_ZONA_BATALLA_CARDS,
  ResultadoAtacarBarrera,
  ResultadoAtacarCarta,
  ResultadoCambiarPosicion,
} from "./../../constants/jugador";
import {
  PosBatalla,
  DispAtaque,
  DispCambio,
} from "./../../constants/celdabatalla";
import { Jugador } from "../../classes/jugador";
import { Carta } from "../../classes/carta";
import { CeldaBatalla } from "../../classes/celdabatalla";
import { Elemento } from "../../constants/carta";
import {
  EstadoCarta,
  ResultadoCogerCarta,
  ResultadoColocarCarta,
  VeredictoAtaque,
} from "../../constants/jugador";

describe("Jugador", () => {
  /**
   * @type {Jugador}
   */
  let jugador: Jugador;
  const nombreJugador = "César";

  const carta = new Carta(7, Elemento.CORAZON);
  beforeEach(() => {
    jugador = new Jugador(nombreJugador);
  });

  describe("crea un objeto", () => {
    test("válido", () => {
      const zonaBatalla = [];
      for (let i = 0; i < 3; i++) {
        zonaBatalla[i] = new CeldaBatalla();
        zonaBatalla[i].carta = null;
      }
      expect(jugador.cartaColocada).toBe(false);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCambiosPosicionesDisponibles).toBe(0);
      expect(jugador.zonaBatalla).toEqual(zonaBatalla);
      expect(jugador.barrera).toEqual([]);
      expect(jugador.mano).toEqual([]);
      expect(jugador.deck).toEqual([]);
      expect(jugador.nTurnos).toBe(0);
      expect(jugador.nombre).toBe(nombreJugador);
      expect(jugador.puedeColocarCartaEnZB).toBe(true);
      expect(jugador.nCartasEnZB).toBe(0);
    });
  });

  describe("no tiene barreras", () => {
    test("válido", () => {
      expect(jugador.sinBarreras()).toBe(true);
    });
  });

  describe("tiene un objeto sin Cartas En Deck", () => {
    test("válido", () => {
      expect(jugador.sinCartasEnDeck()).toBe(true);
    });
  });

  describe("tiene ataques permitidos X Numero de Turnos", () => {
    test("válido", () => {
      jugador.nTurnos++;
      jugador.nTurnos++;
      expect(jugador.ataquesPermitidosXNumTurnos()).toBe(true);
    });
    test("inválido", () => {
      expect(jugador.ataquesPermitidosXNumTurnos()).toBe(false);
    });
  });

  describe("está en Turno", () => {
    test("válido", () => {
      jugador.setEnTurno(true);
      expect(jugador.enTurno).toBe(true);
    });
  });

  describe("inicia turno", () => {
    test("válido", () => {
      jugador.zonaBatalla[1].agregarCarta(carta, PosBatalla.ATAQUE);
      jugador.zonaBatalla[2].agregarCarta(carta, PosBatalla.DEF_ARRIBA);
      jugador.iniciarTurno();
      expect(jugador.zonaBatalla[0].carta).toBeNull();
      expect(jugador.zonaBatalla[1].dispAtaque).toBe(DispAtaque.DISPONIBLE);
      expect(jugador.zonaBatalla[2].dispAtaque).toBe(DispAtaque.NO_DISPONIBLE);
      expect(jugador.nTurnos).toBe(1);
      expect(jugador.nAtaquesDisponibles).toBe(1);
      expect(jugador.nCambiosPosicionesDisponibles).toBe(2);
    });
  });

  describe("coge una carta del deck", () => {
    test("invalido, tiene la mano llena", () => {
      for (let i = 0; i < 5; i++) jugador.mano.push(carta);
      expect(jugador.cogerUnaCartaDelDeck()).toEqual({
        resultado: ResultadoCogerCarta.MANO_LLENA,
      });
    });
    test("inválido, el deck está vacio", () => {
      expect(jugador.cogerUnaCartaDelDeck()).toEqual({
        resultado: ResultadoCogerCarta.DECK_VACIO,
      });
    });
    test("válido", () => {
      jugador.deck.push(carta);
      const res = jugador.cogerUnaCartaDelDeck();
      expect(res.resultado).toBe(ResultadoCogerCarta.EXITO);
      expect(res.carta).toEqual(carta);
    });
  });

  describe("puede colocar cartas", () => {
    test("inválido, ya colocó cartas en este turno", () => {
      jugador.puedeColocarCartaEnZB = false;
      expect(jugador.puedeColocarCartas()).toBe(
        ResultadoColocarCarta.YA_COLOCO_CARTA_EN_ESTE_TURNO
      );
    });
    test("inválido, la zona de batalla está llena", () => {
      jugador.nCartasEnZB = MAX_ZONA_BATALLA_CARDS;
      expect(jugador.puedeColocarCartas()).toBe(
        ResultadoColocarCarta.ZONA_BATALLA_ESTA_LLENA
      );
    });
  });

  describe("puede colocar carta que está en la mano en posición X", () => {
    test("inválido, no se pueden colocar cartas", () => {
      jugador.nCartasEnZB = MAX_ZONA_BATALLA_CARDS;
      expect(jugador.puedeColocarCartaDesdeManoEnPosicion(0)).not.toBe(
        ResultadoColocarCarta.POSIBLE
      );
    });
    test("inválido, no tiene carta en mano en esa posición", () => {
      expect(jugador.puedeColocarCartaDesdeManoEnPosicion(0)).toBe(
        ResultadoColocarCarta.NO_HAY_CARTA_EN_LA_MANO_EN_ESA_POSICION
      );
    });
  });

  describe("posibilidad colocar carta en posición", () => {
    test("inválido, no es posible colocar en esta posición", () => {
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).not.toBe(
        ResultadoColocarCarta.POSIBLE
      );
    });
    test("inválido, posición en zona de batalla está ocupada", () => {
      jugador.mano.push(carta);
      jugador.zonaBatalla[0].agregarCarta(carta, PosBatalla.ATAQUE);
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe(
        ResultadoColocarCarta.POSICION_EN_ZONA_BATALLA_OCUPADA
      );
    });
    test("posible", () => {
      jugador.mano.push(carta);
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe(
        ResultadoColocarCarta.POSIBLE
      );
    });
  });

  describe("coloca Carta", () => {
    test("inválido, no se puede colocar carta", () => {
      jugador.mano.push(carta);
      jugador.zonaBatalla[0].agregarCarta(carta, PosBatalla.ATAQUE);
      expect(jugador.colocarCarta(0, 0, PosBatalla.DEF_ABAJO)).not.toBe(
        ResultadoColocarCarta.POSIBLE
      );
    });
    test("válido, en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.nAtaquesDisponibles = 0;
      jugador.nCartasEnZB = 0;
      expect(jugador.colocarCarta(0, 0, PosBatalla.ATAQUE)).toEqual({
        carta,
        resultado: ResultadoColocarCarta.CARTA_COLOCADA,
      });
      expect(jugador.puedeColocarCartaEnZB).toBe(false);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(jugador.nAtaquesDisponibles).toBe(1);
    });
    test("válido, en posición de defensa", () => {
      jugador.mano.push(carta);
      jugador.nAtaquesDisponibles = 0;
      jugador.nCartasEnZB = 0;
      expect(jugador.colocarCarta(0, 0, PosBatalla.DEF_ABAJO)).toEqual({
        carta,
        resultado: ResultadoColocarCarta.CARTA_COLOCADA,
      });
      expect(jugador.puedeColocarCartaEnZB).toBe(false);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(jugador.nAtaquesDisponibles).toBe(0);
    });
  });

  describe("puede atacar Barreras", () => {
    let jugadorEnemigo: Jugador;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("inválido, no tienes cartas en zona de batalla", () => {
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        ResultadoAtacarBarrera.SIN_CARTAS_EN_ZONA_BATALLA
      );
    });
    test("inválido, hay cartas en zona de batalla enemiga", () => {
      jugador.nCartasEnZB = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        ResultadoAtacarBarrera.HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA
      );
    });
    test("inválido, no le quedan ataques disponibles", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 0;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        ResultadoAtacarBarrera.NO_QUEDAN_ATAQUES_DISPONIBLES
      );
    });
    test("inválido, ", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        ResultadoAtacarBarrera.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        ResultadoAtacarBarrera.POSIBLE
      );
    });
  });

  describe("posible atacar barrera con carta en posición", () => {
    let jugadorEnemigo: Jugador;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("inválido, no puede atacar barreras", () => {
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).not.toBe(
        ResultadoAtacarBarrera.POSIBLE
      );
    });
    test("inválido, no hay carta en tu ubicación de zona de batalla", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(1, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        ResultadoAtacarBarrera.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA
      );
    });
    test("inválido, carta atacante no está en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.DEF_ABAJO);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        ResultadoAtacarBarrera.CARTA_ATACANTE_NO_ESTA_EN_POSICION_ATAQUE
      );
    });
    test("inválido, carta atacante no tiene ataques disponibles", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.NO_DISPONIBLE;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        ResultadoAtacarBarrera.CARTA_ATACANTE_NO_TIENE_ATAQUES_DISPONIBLES
      );
    });
    test("Posible", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        ResultadoAtacarBarrera.POSIBLE
      );
    });
  });

  describe("realizó ataque", () => {
    test("exitoso", () => {
      jugador.nAtaquesDisponibles = 1;
      jugador.ataqueRealizado(0);
      expect(jugador.nAtaquesDisponibles).toBe(0);
    });
  });

  describe("atacó barrera", () => {
    let jugadorEnemigo: Jugador;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });

    test('inválido, no es posible atacar barreras',()=>{
      expect(jugador.atacarBarrera(jugadorEnemigo,0).resultado).not.toBe(
        ResultadoAtacarBarrera.POSIBLE
      );
    })

    test("válido, barrera destruida", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.barrera.push(carta);
      expect(jugador.atacarBarrera(jugadorEnemigo, 0).resultado).toBe(
        ResultadoAtacarBarrera.BARRERA_DESTRUIDA
      );
      expect(jugadorEnemigo.barrera.length).toBe(1);
    });

    test("válido, jugador sin barreras", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      jugadorEnemigo.barrera.push(carta);
      const resp = jugador.atacarBarrera(jugadorEnemigo, 0);
      expect(resp.resultado).toBe(ResultadoAtacarBarrera.BARRERA_DESTRUIDA);
      expect(jugadorEnemigo.barrera.length).toBe(0);
      expect(resp.sinBarreras).toBe(true);
      expect(resp.nombreJugadorDerrotado).toBeDefined();
      expect(resp.nombreJugadorVictorioso).toBeDefined();
    });
  });

  describe("puede atacar cartas", () => {
    let jugadorEnemigo: Jugador;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no, sin cartas en zona de batalla", () => {
      jugador.nTurnos = 3;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        ResultadoAtacarCarta.SIN_CARTAS_EN_ZONA_BATALLA
      );
    });
    test("no, no hay cartas en zona de batalla enemiga", () => {
      jugador.nCartasEnZB = 1;
      jugadorEnemigo.nCartasEnZB = 0;
      jugador.nTurnos = 3;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        ResultadoAtacarCarta.NO_HAY_CARTAS_EN_ZONA_BATALLA_ENEMIGA
      );
    });
    test("no, no le quedan ataques disponibles", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 0;
      jugadorEnemigo.nCartasEnZB = 1;
      jugador.nTurnos = 3;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        ResultadoAtacarCarta.NO_QUEDAN_ATAQUES_DISPONIBLES
      );
    });
    test("no, enemigo no tiene barreras", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      jugador.nTurnos = 3;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        ResultadoAtacarCarta.JUGADOR_ENEMIGO_DEBE_TENER_BARRERAS
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      jugador.nTurnos = 3;
      jugadorEnemigo.barrera.push(carta);
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        ResultadoAtacarCarta.POSIBLE
      );
    });
  });

  describe("posibilidad atacar carta", () => {
    let jugadorEnemigo: Jugador;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no puede atacar cartas", () => {
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).not.toBe(
        ResultadoAtacarCarta.POSIBLE
      );
    });
    test("no hay carta en tu ubicación de zona de batalla", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(1, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugador.nTurnos = 3;
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        ResultadoAtacarCarta.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA
      );
    });
    test("no hay carta en ubicación de zona de batalla enemiga", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.nTurnos = 3;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.colocarCarta(1, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        ResultadoAtacarCarta.NO_HAY_CARTA_EN_UBICACION_EN_ZONA_BATALLA_ENEMIGA
      );
    });
    test("carta atacante no tiene ataques disponibles", () => {
      jugador.nTurnos = 3;
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.NO_DISPONIBLE;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        ResultadoAtacarCarta.CARTA_ATACANTE_NO_TIENE_ATAQUE_DISPONIBLE
      );
    });

    test("carta atacante no está en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.DEF_ABAJO);
      jugador.nTurnos = 3;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        ResultadoAtacarCarta.CARTA_ATACANTE_NO_EN_POSICION_ATAQUE
      );
    });

    test("Posible", () => {
      jugador.mano.push(carta);
      jugador.nTurnos = 3;
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        ResultadoAtacarCarta.POSIBLE
      );
    });
  });

  describe("calculo valor ataque", () => {
    let cartaAtacante;
    let cartaAtacada;
    test("atacante:ESPADA atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Elemento.ESPADA);
      cartaAtacada = new Carta(8, Elemento.TREBOL);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(14);
    });
    test("atacante:TREBOL atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Elemento.TREBOL);
      cartaAtacada = new Carta(8, Elemento.ESPADA);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(14);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:ESPADA atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Elemento.ESPADA);
      cartaAtacada = new Carta(8, Elemento.CORAZON);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(10);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:CORAZON atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Elemento.CORAZON);
      cartaAtacada = new Carta(8, Elemento.ESPADA);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(10);
    });
    test("atacante:COCO atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Elemento.COCO);
      cartaAtacada = new Carta(8, Elemento.TREBOL);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(12);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:TREBOL atacado:COCO", () => {
      cartaAtacante = new Carta(8, Elemento.TREBOL);
      cartaAtacada = new Carta(8, Elemento.COCO);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(12);
    });
    test("atacante:ESPADA atacado:COCO", () => {
      cartaAtacante = new Carta(8, Elemento.ESPADA);
      cartaAtacada = new Carta(8, Elemento.COCO);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(12);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:COCO atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Elemento.COCO);
      cartaAtacada = new Carta(8, Elemento.ESPADA);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(12);
    });
    test("atacante:CORAZON atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Elemento.CORAZON);
      cartaAtacada = new Carta(8, Elemento.TREBOL);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(10);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:TREBOL atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Elemento.TREBOL);
      cartaAtacada = new Carta(8, Elemento.CORAZON);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(10);
    });
    test("atacante:CORAZON atacado:COCO", () => {
      cartaAtacante = new Carta(8, Elemento.CORAZON);
      cartaAtacada = new Carta(8, Elemento.COCO);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:COCO atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Elemento.COCO);
      cartaAtacada = new Carta(8, Elemento.CORAZON);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(8);
    });
  });

  describe("obtener veredicto ataque", () => {
    let cartaAtacante;
    let cartaAtacada;
    test("gana atacante ", () => {
      cartaAtacante = new Carta(12, Elemento.COCO);
      cartaAtacada = new Carta(10, Elemento.CORAZON);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(
        jugador.obtenerVeredictoAtaque(calculoVAtacante, calculoVAtacada)
      ).toBe(VeredictoAtaque.GANA_ATACANTE);
    });
    test("pierde atacante", () => {
      cartaAtacante = new Carta(9, Elemento.CORAZON);
      cartaAtacada = new Carta(8, Elemento.ESPADA);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(
        jugador.obtenerVeredictoAtaque(calculoVAtacante, calculoVAtacada)
      ).toBe(VeredictoAtaque.PIERDE_ATACANTE);
    });
    test("empate", () => {
      cartaAtacante = new Carta(8, Elemento.TREBOL);
      cartaAtacada = new Carta(4, Elemento.COCO);
      const { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(
        jugador.obtenerVeredictoAtaque(calculoVAtacante, calculoVAtacada)
      ).toBe(VeredictoAtaque.EMPATE);
    });
  });

  describe("atacar carta", () => {
    let jugadorEnemigo: Jugador;
    let cartaAtacante, cartaAtacada;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("posible, jugador atacado en posición de ataque - gana atacante", () => {
      cartaAtacante = new Carta(13, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(1, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.GANA_ATACANTE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.DESTRUIDA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.DESTRUIDA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de ataque - pierde atacante", () => {
      cartaAtacante = new Carta(1, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(13, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.PIERDE_ATACANTE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.DESTRUIDA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.ACTIVA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de ataque - empate", () => {
      cartaAtacante = new Carta(1, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(1, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.EMPATE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.DESTRUIDA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.DESTRUIDA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - gana atacante", () => {
      cartaAtacante = new Carta(13, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(1, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.DEF_ABAJO);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.GANA_ATACANTE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.DESTRUIDA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - pierde atacante", () => {
      cartaAtacante = new Carta(1, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(13, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.DEF_ARRIBA);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.PIERDE_ATACANTE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.DESTRUIDA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.ACTIVA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - empate", () => {
      cartaAtacante = new Carta(1, Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = DispAtaque.DISPONIBLE;
      cartaAtacada = new Carta(1, Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.colocarCarta(0, 0, PosBatalla.DEF_ABAJO);
      jugador.nTurnos = 3;
      const resultadoAtaque = jugador.atacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).toBe(VeredictoAtaque.EMPATE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.estadoCartaAtacada).toBe(EstadoCarta.ACTIVA);
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
  });

  describe("puede cambiar posición", () => {
    test("no, sin cartas en zona de batalla", () => {
      expect(jugador.puedeCambiarPosicion()).toBe(
        ResultadoCambiarPosicion.SIN_CARTAS_EN_ZONA_BATALLA
      );
    });
    test("no, sin cambios de posición disponibles", () => {
      jugador.nCartasEnZB = 1;
      expect(jugador.puedeCambiarPosicion()).toBe(
        ResultadoCambiarPosicion.SIN_CAMBIOS_DE_POSICION_DISPONIBLES
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nCambiosPosicionesDisponibles = 1;
      expect(jugador.puedeCambiarPosicion()).toBe(
        ResultadoCambiarPosicion.POSIBLE
      );
    });
  });

  describe("posibilidad cambiar posicion batalla en carta", () => {
    test("no, no puede cambiar posicion cartas", () => {
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).not.toBe(
        ResultadoCambiarPosicion.POSIBLE
      );
    });
    test("no, no hay carta en posicion de batalla indicada", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.colocarCarta(1, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        ResultadoCambiarPosicion.NO_HAY_CARTA_EN_TU_UBICACION_EN_ZONA_BATALLA
      );
    });
    test("no, carta indicada no tiene disponible el cambio de posición", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        ResultadoCambiarPosicion.CARTA_NO_TIENE_DISPONIBLE_CAMBIO_POSICION
      );
    });
    test("posible", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispCambio = DispCambio.DISPONIBLE;
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        ResultadoCambiarPosicion.POSIBLE
      );
    });
  });

  describe("cambiar posicion batalla", () => {
    test("no posible", () => {
      expect(jugador.puedeCambiarPosicion()).not.toBe(
        ResultadoCambiarPosicion.POSIBLE
      );
    });
    test("posicion cambiada, a posición de ataque", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.DEF_ABAJO);
      jugador.zonaBatalla[0].dispCambio = DispCambio.DISPONIBLE;
      expect(jugador.cambiarPosicionBatalla(0).respuesta).toBe(
        ResultadoCambiarPosicion.POSICION_CAMBIADA
      );
      expect(jugador.zonaBatalla[0].posBatalla).toBe(PosBatalla.ATAQUE);
      expect(jugador.zonaBatalla[0].dispCambio).toBe(DispCambio.NO_DISPONIBLE);
      expect(jugador.zonaBatalla[0].dispAtaque).toBe(DispAtaque.DISPONIBLE);
      expect(jugador.nCambiosPosicionesDisponibles).toBe(0);
    });
    test("posicion cambiada, a posición de defensa", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.colocarCarta(0, 0, PosBatalla.ATAQUE);
      jugador.zonaBatalla[0].dispCambio = DispCambio.DISPONIBLE;
      expect(jugador.cambiarPosicionBatalla(0).respuesta).toBe(
        ResultadoCambiarPosicion.POSICION_CAMBIADA
      );
      expect(jugador.zonaBatalla[0].posBatalla).toBe(PosBatalla.DEF_ARRIBA);
      expect(jugador.zonaBatalla[0].dispCambio).toBe(DispCambio.NO_DISPONIBLE);
      expect(jugador.zonaBatalla[0].dispAtaque).toBe(DispAtaque.NO_DISPONIBLE);
      expect(jugador.nCambiosPosicionesDisponibles).toBe(0);
    });
  });

  describe("repartir cartas", () => {
    test("exitoso", () => {
      expect(jugador.barrera.length).toBe(0);
      expect(jugador.mano.length).toBe(0);
      expect(jugador.deck.length).toBe(0);
      jugador.repartirCartas();
      expect(jugador.barrera.length).toBe(5);
      expect(jugador.mano.length).toBe(5);
      expect(jugador.deck.length).toBe(42);
    });
  });
});
