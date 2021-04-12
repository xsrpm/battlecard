/* eslint-disable no-undef */
const {Jugador} = require("../clases/jugador");
const Carta = require("../clases/carta");
const CeldaBatalla = require("../clases/celdaBatalla/");

describe("Jugador clase", () => {
  test("tiene propiedades estaticas válidas", () => {
    expect(Jugador.MAX_BARRERA_CARDS).toBe(5);
    expect(Jugador.MAX_MANO_CARDS).toBe(5);
    expect(Jugador.MAX_ZONA_BATALLA_CARDS).toBe(3);
    expect(Jugador.MAX_DECK).toBe(
      Carta.MAX_VALOR_CARTA * Carta.NUMERO_ELEMENTOS_CARTAS
    );
    expect(Jugador.ResultadoCojerUnaCarta.DECK_VACIO).toBe("DECK VACIO");
    expect(Jugador.ResultadoCojerUnaCarta.EXITO).toBe("EXITO");
    expect(Jugador.VeredictoAtaque.EMPATE).toBe("EMPATE");
    expect(Jugador.VeredictoAtaque.GANA_ATACANTE).toBe("GANA ATACANTE");
    expect(Jugador.VeredictoAtaque.PIERDE_ATACANTE).toBe("PIERDE ATACANTE");
    expect(Jugador.EstadoCarta.ACTIVA).toBe("ACTIVA");
    expect(Jugador.EstadoCarta.DESTRUIDA).toBe("DESTRUIDA");
  });
});

describe("Jugador objeto", () => {
  /**
   * @type {Jugador}
   */
  let jugador;
  let nombreJugador = "César";

  let carta = new Carta(7, Carta.Elemento.CORAZON);
  beforeEach(() => {
    jugador = new Jugador(nombreJugador);
  });

  describe('crear un objeto válido', () => {
    test("exitoso", () => {
      let zonaBatalla = [];
      for (let i = 0; i < 3; i++) {
        zonaBatalla[i] = new CeldaBatalla();
        zonaBatalla[i].carta = null;
      }
      expect(jugador.cartaColocada).toBe(false);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCambiosPosicionesDisponibles).toBe(0);
      /**
       * @type {Array<CeldaBatalla>}
       */
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

  describe('sin barreras', () => {
    test("válido",()=>{
      expect(jugador.sinBarreras()).toBe(true)
    })
  });

  describe('sin Cartas En Deck', () => {
    test("válido",()=>{
      expect(jugador.sinCartasEnDeck()).toBe(true)
    })
  });

  describe('ataques permitidos X Numero de Turnos', () => {
    test("válido",()=>{
      jugador.nTurnos++;
      jugador.nTurnos++;
      expect(jugador.ataquesPermitidosXNumTurnos()).toBe(true)
    })
    describe('ataques permitidos X Numero de Turnos', () => {
      test("inválido",()=>{
        expect(jugador.ataquesPermitidosXNumTurnos()).toBe(false)
      })
    })
  });

  describe('set En Turno', () => {
    test("válido",()=>{
      jugador.setEnTurno(true)
      expect(jugador.enTurno).toBe(true)
    })
  });

  test("inicia turno válido", () => {
    jugador.zonaBatalla[1].agregarCarta(
      carta,
      CeldaBatalla.Estado.POS_BATALLA_ATAQUE
    );
    jugador.zonaBatalla[2].agregarCarta(
      carta,
      CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
    );
    jugador.iniciarTurno();
    expect(jugador.zonaBatalla[0].carta).toBeNull();
    expect(jugador.zonaBatalla[1].dispAtaque).toBe(
      CeldaBatalla.Estado.ATAQUE_DISPONIBLE
    );
    expect(jugador.zonaBatalla[2].dispAtaque).toBe(
      CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
    );
    expect(jugador.nTurnos).toBe(1);
    expect(jugador.nAtaquesDisponibles).toBe(1);
    expect(jugador.nCambiosPosicionesDisponibles).toBe(2);
  });

  describe("coge una carta del deck", () => {
    test("mano llena", () => {
      for (let i = 0; i < 5; i++) jugador.mano.push(carta);
      expect(jugador.cogerUnaCartaDelDeck()).toBe("MANO LLENA");
    });
    test("deck vacio", () => {
      expect(jugador.cogerUnaCartaDelDeck()).toBe("DECK VACIO");
    });
    test("válido", () => {
      jugador.deck.push(carta);
      expect(jugador.cogerUnaCartaDelDeck()).toBe("EXITO");
      expect(jugador.mano[0]).toEqual(carta);
    });
  });
  
  describe("posibilidad colocar carta en posicion", () => {
    test("no está habilitado para colocar carta", () => {
      jugador.puedeColocarCartaEnZB = false;
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe(
        "No está habilitado para colocar carta"
      );
    });
    test("no, no hay carta en la mano para esa posicion", () => {
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe(
        "No hay carta en la mano para esa posicion"
      );
    });
    test("no, posición en zona de batalla está ocupada", () => {
      jugador.mano.push(carta);
      jugador.zonaBatalla[0].agregarCarta(
        carta,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe(
        "Posición en zona de batalla está ocupada"
      );
    });
    test("posible", () => {
      jugador.mano.push(carta);
      expect(jugador.posibilidadColocarCartaEnPosicion(0, 0)).toBe("Posible");
    });
  });
  describe("accion Colocar Carta", () => {
    test("carta colocada, en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.nAtaquesDisponibles = 0;
      jugador.nCartasEnZB = 0;
      expect(
        jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      ).toBe("Carta colocada");
      expect(jugador.puedeColocarCartaEnZB).toBe(false);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(jugador.nAtaquesDisponibles).toBe(1);
    });
    test("carta colocada, en otras posiciones", () => {
      jugador.mano.push(carta);
      jugador.nAtaquesDisponibles = 0;
      jugador.nCartasEnZB = 0;
      expect(
        jugador.accionColocarCarta(
          0,
          0,
          CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
        )
      ).toBe("Carta colocada");
      expect(jugador.puedeColocarCartaEnZB).toBe(false);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(jugador.nAtaquesDisponibles).toBe(0);
    });
    test("no posible", () => {
      expect(
        jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      ).not.toBe("Carta colocada");
    });
  });

  describe("puede Atacar Barreras", () => {
    let jugadorEnemigo;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no, sin cartas en zona de batalla", () => {
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        "Sin cartas en zona de batalla"
      );
    });
    test("no, hay cartas en zona de batalla enemiga", () => {
      jugador.nCartasEnZB = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        "Hay cartas en zona de batalla enemiga"
      );
    });
    test("no, no le quedan ataques disponibles", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 0;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe(
        "No le quedan ataques disponibles"
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      expect(jugador.puedeAtacarBarreras(jugadorEnemigo)).toBe("Posible");
    });
  });

  describe("posibilidad de Atacar Barrera carta en posicion", () => {
    let jugadorEnemigo;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no puede atacar barreras", () => {
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).not.toBe(
        "Posible"
      );
    });
    test("no hay carta en tu ubicación de zona de batalla", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(1, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        "No hay carta en tu ubicación de zona de batalla"
      );
    });
    test("carta atacante no está en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      );
      jugador.nAtaquesDisponibles = 1;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        "Carta atacante no está en posición de ataque"
      );
    });
    test("carta atacante no tiene ataques disponibles", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque =
        CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        "Carta atacante no tiene ataque disponible"
      );
    });
    test("Posible", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      expect(jugador.posibilidadAtacarBarrera(jugadorEnemigo, 0)).toBe(
        "Posible"
      );
    });
  });

  describe('ataque ha sido realizado', () => {
    test("exitoso", () => {
      jugador.nAtaquesDisponibles = 1;
      jugador.ataqueRealizado(0);
      expect(jugador.nAtaquesDisponibles).toBe(0);
    });
  });

  describe("accion atacar barrera", () => {
    let jugadorEnemigo;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });

    test("No Posible", () => {
      expect(jugador.accionAtacarBarrera(jugadorEnemigo)).not.toBe("Posible");
    });

    test("barrera destruida", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.barrera.push(carta);
      expect(jugador.accionAtacarBarrera(jugadorEnemigo, 0)).toBe(
        "Barrera destruida"
      );
      expect(jugadorEnemigo.barrera.length).toBe(1);
    });
  });
  
  describe("puede atacar cartas", () => {
    let jugadorEnemigo;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no, sin cartas en zona de batalla", () => {
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        "Sin cartas en zona de batalla"
      );
    });
    test("no, no hay cartas en zona de batalla enemiga", () => {
      jugador.nCartasEnZB = 1;
      jugadorEnemigo.nCartasEnZB = 0;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        "No hay cartas en zona de batalla enemiga"
      );
    });
    test("no, no le quedan ataques disponibles", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 0;
      jugadorEnemigo.nCartasEnZB = 1;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        "No le quedan ataques disponibles"
      );
    });
    test("no, enemigo no tiene barreras", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe(
        "Jugador enemigo debe tener barreras"
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.nCartasEnZB = 1;
      jugadorEnemigo.barrera.push(carta);
      expect(jugador.puedeAtacarCartas(jugadorEnemigo)).toBe("Posible");
    });
  });

  describe("posibilidad atacar carta", () => {
    let jugadorEnemigo;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no puede atacar cartas", () => {
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).not.toBe(
        "Posible"
      );
    });
    test("no hay carta en tu ubicación de zona de batalla", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(1, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        "No hay carta en tu ubicación de zona de batalla"
      );
    });
    test("no hay carta en ubicación de zona de batalla enemiga", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.accionColocarCarta(
        1,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        "No hay carta en ubicación de zona de batalla enemiga"
      );
    });
    test("carta atacante no está en posición de ataque", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      );
      jugador.nAtaquesDisponibles = 1;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        "Carta atacante no está en posición de ataque"
      );
    });
    test("carta atacante no tiene ataques disponibles", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque =
        CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        "Carta atacante no tiene ataque disponible"
      );
    });
    test("Posible", () => {
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.nAtaquesDisponibles = 1;
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      jugadorEnemigo.mano.push(carta);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.posibilidadAtacarCarta(jugadorEnemigo, 0, 0)).toBe(
        "Posible"
      );
    });
  });

  describe("calculo valor ataque", () => {
    let cartaAtacante;
    let cartaAtacada;
    test("atacante:ESPADA atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.ESPADA);
      cartaAtacada = new Carta(8, Carta.Elemento.TREBOL);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(14);
    });
    test("atacante:TREBOL atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.TREBOL);
      cartaAtacada = new Carta(8, Carta.Elemento.ESPADA);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(14);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:ESPADA atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.ESPADA);
      cartaAtacada = new Carta(8, Carta.Elemento.CORAZON);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(10);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:CORAZON atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.CORAZON);
      cartaAtacada = new Carta(8, Carta.Elemento.ESPADA);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(10);
    });
    test("atacante:COCO atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.COCO);
      cartaAtacada = new Carta(8, Carta.Elemento.TREBOL);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(12);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:TREBOL atacado:COCO", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.TREBOL);
      cartaAtacada = new Carta(8, Carta.Elemento.COCO);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(12);
    });
    test("atacante:ESPADA atacado:COCO", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.ESPADA);
      cartaAtacada = new Carta(8, Carta.Elemento.COCO);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(12);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:COCO atacado:ESPADA", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.COCO);
      cartaAtacada = new Carta(8, Carta.Elemento.ESPADA);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(12);
    });
    test("atacante:CORAZON atacado:TREBOL", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.CORAZON);
      cartaAtacada = new Carta(8, Carta.Elemento.TREBOL);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(10);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:TREBOL atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.TREBOL);
      cartaAtacada = new Carta(8, Carta.Elemento.CORAZON);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(10);
    });
    test("atacante:CORAZON atacado:COCO", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.CORAZON);
      cartaAtacada = new Carta(8, Carta.Elemento.COCO);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
        cartaAtacante,
        cartaAtacada
      );
      expect(calculoVAtacante).toBe(8);
      expect(calculoVAtacada).toBe(8);
    });
    test("atacante:COCO atacado:CORAZON", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.COCO);
      cartaAtacada = new Carta(8, Carta.Elemento.CORAZON);
      let { calculoVAtacante, calculoVAtacada } = jugador.calculoValorAtaque(
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
      cartaAtacante = new Carta(12, Carta.Elemento.COCO);
      cartaAtacada = new Carta(10, Carta.Elemento.CORAZON);
      expect(jugador.obtenerVeredictoAtaque(cartaAtacante, cartaAtacada)).toBe(
        "GANA ATACANTE"
      );
    });
    test("pierde atacante", () => {
      cartaAtacante = new Carta(9, Carta.Elemento.CORAZON);
      cartaAtacada = new Carta(8, Carta.Elemento.ESPADA);
      expect(jugador.obtenerVeredictoAtaque(cartaAtacante, cartaAtacada)).toBe(
        "PIERDE ATACANTE"
      );
    });
    test("empate", () => {
      cartaAtacante = new Carta(8, Carta.Elemento.TREBOL);
      cartaAtacada = new Carta(4, Carta.Elemento.COCO);
      expect(jugador.obtenerVeredictoAtaque(cartaAtacante, cartaAtacada)).toBe(
        "EMPATE"
      );
    });
  });

  describe("accion atacar carta", () => {
    let jugadorEnemigo;
    let cartaAtacante, cartaAtacada;
    beforeEach(() => {
      jugadorEnemigo = new Jugador("Enemigo");
    });
    test("no posible", () => {
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.veredicto).not.toBe("Ataque realizado");
    });
    test("posible, jugador atacado en posición de ataque - gana atacante", () => {
      cartaAtacante = new Carta(13, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(1, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(
        Jugador.VeredictoAtaque.GANA_ATACANTE
      );
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.DESTRUIDA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de ataque - pierde atacante", () => {
      cartaAtacante = new Carta(1, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(13, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(
        Jugador.VeredictoAtaque.PIERDE_ATACANTE
      );
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de ataque - empate", () => {
      cartaAtacante = new Carta(1, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(1, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(Jugador.VeredictoAtaque.EMPATE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - gana atacante", () => {
      cartaAtacante = new Carta(13, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(1, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(
        Jugador.VeredictoAtaque.GANA_ATACANTE
      );
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - pierde atacante", () => {
      cartaAtacante = new Carta(1, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(13, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(
        Jugador.VeredictoAtaque.PIERDE_ATACANTE
      );
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(0);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.DESTRUIDA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
    test("posible, jugador atacado en posición de defensa - empate", () => {
      cartaAtacante = new Carta(1, Carta.Elemento.COCO);
      jugador.mano.push(cartaAtacante);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispAtaque = CeldaBatalla.Estado.ATAQUE_DISPONIBLE;
      cartaAtacada = new Carta(1, Carta.Elemento.CORAZON);
      jugadorEnemigo.barrera.push(carta);
      jugadorEnemigo.mano.push(cartaAtacada);
      jugadorEnemigo.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      );
      let resultadoAtaque = jugador.accionAtacarCarta(jugadorEnemigo, 0, 0);
      expect(resultadoAtaque.estadoAtaque).toBe("Ataque realizado")
      expect(resultadoAtaque.veredicto).toBe(Jugador.VeredictoAtaque.EMPATE);
      expect(resultadoAtaque.cartaAtacante).toEqual(cartaAtacante);
      expect(jugador.nAtaquesDisponibles).toBe(0);
      expect(jugador.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoCartaAtacante).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(resultadoAtaque.estadoCartaAtacada).toBe(
        Jugador.EstadoCarta.ACTIVA
      );
      expect(jugadorEnemigo.nCartasEnZB).toBe(1);
      expect(resultadoAtaque.estadoBarrera).toBe(Jugador.EstadoCarta.ACTIVA);
      expect(resultadoAtaque.cartaAtacada).toEqual(cartaAtacada);
    });
  });

  describe("puede cambiar posicion", () => {
    test("no, sin cartas en zona de batalla", () => {
      expect(jugador.puedeCambiarPosicion()).toBe(
        "Sin cartas en zona de batalla"
      );
    });
    test("no, sin cambios de posición disponibles", () => {
      jugador.nCartasEnZB = 1;
      expect(jugador.puedeCambiarPosicion()).toBe(
        "Sin cambios de posición disponibles"
      );
    });
    test("posible", () => {
      jugador.nCartasEnZB = 1;
      jugador.nCambiosPosicionesDisponibles = 1;
      expect(jugador.puedeCambiarPosicion()).toBe("Posible");
    });
  });

  describe("posibilidad cambiar posicion batalla en carta", () => {
    test("no, no puede cambiar posicion cartas", () => {
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).not.toBe(
        "Posible"
      );
    });
    test("no, no hay carta en posicion de batalla indicada", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.accionColocarCarta(1, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        "No hay carta en posición de batalla indicada"
      );
    });
    test("no, carta indicada no tiene disponible el cambio de posición", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        "Carta indicada no tiene disponible el cambio de posición"
      );
    });
    test("posible", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispCambio =
        CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE;
      expect(jugador.posibilidadCambiarPosicionBatallaEnCarta(0)).toBe(
        "Posible"
      );
    });
  });

  describe("cambiar posicion batalla", () => {
    test("no posible", () => {
      expect(jugador.puedeCambiarPosicion()).not.toBe("Posible");
    });
    test("posicion cambiada, a posición de ataque", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.accionColocarCarta(
        0,
        0,
        CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO
      );
      jugador.zonaBatalla[0].dispCambio =
        CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE;
      expect(jugador.cambiarPosicionBatalla(0)).toBe("Posicion cambiada");
      expect(jugador.zonaBatalla[0].posBatalla).toBe(
        CeldaBatalla.Estado.POS_BATALLA_ATAQUE
      );
      expect(jugador.zonaBatalla[0].dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      );
      expect(jugador.zonaBatalla[0].dispAtaque).toBe(
        CeldaBatalla.Estado.ATAQUE_DISPONIBLE
      );
      expect(jugador.nCambiosPosicionesDisponibles).toBe(0);
    });
    test("posicion cambiada, a posición de defensa", () => {
      jugador.nCambiosPosicionesDisponibles = 1;
      jugador.mano.push(carta);
      jugador.accionColocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE);
      jugador.zonaBatalla[0].dispCambio =
        CeldaBatalla.Estado.CAMBIO_POS_DISPONIBLE;
      expect(jugador.cambiarPosicionBatalla(0)).toBe("Posicion cambiada");
      expect(jugador.zonaBatalla[0].posBatalla).toBe(
        CeldaBatalla.Estado.POS_BATALLA_DEF_ARRIBA
      );
      expect(jugador.zonaBatalla[0].dispCambio).toBe(
        CeldaBatalla.Estado.CAMBIO_POS_NO_DISPONIBLE
      );
      expect(jugador.zonaBatalla[0].dispAtaque).toBe(
        CeldaBatalla.Estado.ATAQUE_NO_DISPONIBLE
      );
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
