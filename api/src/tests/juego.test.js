/* eslint-disable no-undef */
const Juego = require('../clases/juego')
const { Jugador } = require('../clases/jugador')

describe('Juego objeto', () => {
  /**
   * @type {Juego}
   */
  let juego
  beforeEach(() => {
    juego = new Juego()
  })

  describe('crea objeto valido', () => {
    test('exitoso', () => {
      expect(juego.jugador).toEqual([])
      expect(juego.jugadorActual).toBeNull()
      expect(juego.jugadorAnterior).toBeNull()
      expect(juego.idCartaManoSel).toBe(0)
      expect(juego.idCartaZonaBSel).toBe(0)
      expect(juego.idCartaZonaBSelEnemigo).toBe(0)
      expect(juego.pantalla).toBeNull()
      expect(juego.momento).toBeNull()
    })
  })

  describe('obtener estado sala', () => {
    test('abierta', () => {
      expect(juego.estadoSala).toBe('SALA ABIERTA')
    })
    test('cerrada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      expect(juego.estadoSala).toBe('SALA CERRADA')
    })
  })

  describe('obtenerNombreJugadores', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      expect(juego.obtenerNombreJugadores()).toEqual(['Cesar', 'Marco'])
    })
  })

  describe('unir a sala', () => {
    test('sala sin llenar', () => {
      const jug = new Jugador('Cesar')
      const ret = juego.unirASala('Cesar')
      expect(ret).toEqual(jug)
      expect(juego.pantalla).toBe(Juego.Pantalla.EN_SALA_DE_ESPERA)
    })
    test('sala llena', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const ret = juego.unirASala('Krister')
      expect(ret).toBe('Sala llena, no pueden entrar jugadores')
    })
  })

  describe('iniciar juego', () => {
    test('sala iniciada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const res = juego.iniciarJuego()
      expect(res).toBe('JUEGO INICIADO')
      expect(juego.jugador[0].deck.length).toBeGreaterThan(0)
      expect(juego.jugador[1].deck.length).toBeGreaterThan(0)
      expect(juego.jugadorActual).toEqual(juego.jugador[0])
      expect(juego.jugadorAnterior).toEqual(juego.jugador[1])
      expect(juego.pantalla).toBe(Juego.Pantalla.EN_JUEGO)
      expect(juego.estadoSala).toBe('SALA INICIADA')
    })
    test('sala abierta', () => {
      juego.unirASala('Cesar')
      const res = juego.iniciarJuego()
      expect(res).toBe('No se tienen 2 jugadores para empezar')
    })
    test('condición no manejada', () => {
      juego.estadoSala = ''
      const res = juego.iniciarJuego()
      expect(res).toBe('Condición no manejada al iniciarJuego')
    })
  })

  describe('cambiar de jugador actual', () => {
    test('cambio realizado', () => {
      const jug0 = juego.unirASala('Cesar')
      const jug1 = juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.cambioDeJugadorActual()
      expect(juego.jugadorActual).toEqual(jug1)
      expect(juego.jugadorAnterior).toEqual(jug0)
    })
  })

  describe('colocar carta en ataque', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      expect(juego.colocarCartaEnAtaque(0, 0)).toBe('Carta colocada')
    })
  })

  describe('colocar carta en defensa', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      expect(juego.colocarCartaEnDefensa(0, 0)).toBe('Carta colocada')
    })
  })

  describe('atacar Barrera', () => {
    test('barrera destruida', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCartaEnAtaque(0, 0)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.atacarBarrera(0)).toBe(
        'Barrera destruida'
      )
    })
  })

  describe('atacar Carta', () => {
    test('carta atacada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCartaEnAtaque(0, 0)
      juego.cambioDeJugadorActual()
      juego.colocarCartaEnAtaque(0, 0)
      juego.cambioDeJugadorActual()
      expect(juego.atacarCarta(0, 0).estadoAtaque).toBe(
        'Ataque realizado'
      )
    })
  })

  describe('cambiar Posicion de Batalla', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCartaEnAtaque(0, 0)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.cambiarPosicionBatalla(0)).toBe('Posicion cambiada')
    })
  })
})
