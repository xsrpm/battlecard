/* eslint-disable no-undef */
const Juego = require("../clases/juego");
const { Jugador } = require("../clases/jugador");

describe("Juego clase", () => {
  test("should ", () => {});
});

describe("Juego objeto", () => {
  /**
   * @type {Juego}
   */
  let juego;
  beforeEach(() => {
    juego = new Juego();
  });

  describe("crea objeto valido", () => {
    test("exitoso", () => {
      expect(juego.jugador).toEqual([]);
      expect(juego.jugadorActual).toBeNull();
      expect(juego.jugadorAnterior).toBeNull();
      expect(juego.jugadorVictorioso).toBeNull();
      expect(juego.idCartaManoSel).toBe(0);
      expect(juego.idCartaZonaBSel).toBe(0);
      expect(juego.idCartaZonaBSelEnemigo).toBe(0);
      expect(juego.pantalla).toBeNull();
      expect(juego.momento).toBeNull();
    });
  });

  describe("obtener estado sala", () => {
    test("abierta", () => {
      expect(juego.obtenerEstadoSala()).toBe("SALA ABIERTA");
    });
    test("cerrada", () => {
      let jug = new Jugador("Cesar");
      juego.jugador.push(jug);
      jug = new Jugador("Marco");
      juego.jugador.push(jug);
      expect(juego.obtenerEstadoSala()).toBe("SALA CERRADA");
    });
  });

  describe("unir a sala", () => {
    test("sala sin llenar", () => {
      let jug = new Jugador("Cesar");
      let ret = juego.unirASala("Cesar");
      expect(ret).toEqual(jug);
      expect(juego.pantalla).toBe(Juego.Pantalla.EN_SALA_DE_ESPERA);
    });
    test("sala llena", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      let ret = juego.unirASala("Krister");
      expect(ret).toBe("Sala llena, no pueden entrar jugadores");
    });
  });

  describe("iniciar juego", () => {
    test("juego iniciado", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      let res = juego.iniciarJuego();
      expect(res).toBe("JUEGO INICIADO");
      expect(juego.jugador[0].deck.length).toBeGreaterThan(0);
      expect(juego.jugador[1].deck.length).toBeGreaterThan(0);
      expect(juego.jugadorActual).toEqual(juego.jugador[0]);
      expect(juego.jugadorAnterior).toEqual(juego.jugador[1]);
      expect(juego.pantalla).toBe(Juego.Pantalla.EN_JUEGO);
    });
    test("sala no tiene 2 jugadores para iniciar", () => {
      juego.unirASala("Cesar");
      let res = juego.iniciarJuego();
      expect(res).toBe("No se tienen 2 jugadores para empezar");
    });
  });

  describe("cambiar de jugador actual", () => {
    test("cambio realizado", () => {
      let jug0 = juego.unirASala("Cesar");
      let jug1 = juego.unirASala("Marco");
      juego.iniciarJuego();
      juego.cambioDeJugadorActual();
      expect(juego.jugadorActual).toEqual(jug1);
      expect(juego.jugadorAnterior).toEqual(jug0);
    });
    test('jugador sin cartas en deck', () => {
      
    });
  });

  describe("colocar carta en ataque", () => {
    test("exitoso", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      juego.iniciarJuego();
      expect(juego.colocarCartaEnAtaque(0, 0)).toBe("Carta colocada");
    });
  });

  describe("colocar carta en defensa", () => {
    test("exitoso", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      juego.iniciarJuego();
      expect(juego.colocarCartaEnDefensa(0, 0)).toBe("Carta colocada");
    });
  });

  describe("atacar Barrera", () => {
    test("barrera destruida", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      juego.iniciarJuego();
      juego.colocarCartaEnAtaque(0, 0);
      juego.cambioDeJugadorActual();
      juego.cambioDeJugadorActual();
      expect(juego.atacarBarrera(0)).toBe(
        "Barrera destruida"
      );
    });
    test('jugador sin barreras', () => {
      
    });
  });

  describe("atacar Carta", () => {
    test("carta atacada", () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      juego.iniciarJuego();
      juego.colocarCartaEnAtaque(0, 0);
      juego.cambioDeJugadorActual();
      juego.colocarCartaEnAtaque(0, 0);
      juego.cambioDeJugadorActual();
      expect(juego.atacarCarta(0,0).estadoAtaque).toBe(
        "Ataque realizado"
      );
    });
    test('jugador sin barreras', () => {
      
    });
  });

  describe('cambiar Posicion de Batalla', () => {
    test('exitoso', () => {
      juego.unirASala("Cesar");
      juego.unirASala("Marco");
      juego.iniciarJuego();
      juego.colocarCartaEnAtaque(0, 0);
      juego.cambioDeJugadorActual();
      juego.cambioDeJugadorActual();
      expect(juego.cambiarPosicionBatalla(0)).toBe("Posicion cambiada")
    });
  });
});
