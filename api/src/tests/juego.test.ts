import { expect, describe, test, beforeEach } from '@jest/globals'
import { CeldaBatalla } from '../clases/celdabatalla'
import { Juego } from '../clases/juego'

describe('Juego objeto', () => {
  /**
   * @type {Juego}
   */
  let juego: Juego
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
      juego.unirASala('Cesar')
      expect(juego.estadoSala).toBe('SALA ABIERTA')
    })
    test('sala llena', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const resp = juego.unirASala('Krister')
      expect(resp.resultado).toBe('Sala llena, no pueden entrar jugadores')
      expect(juego.estadoSala).toBe('SALA CERRADA')
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
      const resp0 = juego.unirASala('Cesar')
      const resp1 = juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.cambioDeJugadorActual()
      expect(juego.jugadorActual).toEqual(resp1.jugador)
      expect(juego.jugadorAnterior).toEqual(resp0.jugador)
    })
  })

  describe('colocar carta en ataque', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      expect(juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE).resultado).toBe('Carta colocada')
    })
  })

  describe('colocar carta en defensa', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      expect(juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_DEF_ABAJO).resultado).toBe('Carta colocada')
    })
  })

  describe('atacar Barrera', () => {
    test('barrera destruida', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.atacarBarrera(0).resultado).toBe('Barrera destruida')
    })
  })

  describe('atacar Carta', () => {
    test('carta atacada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      juego.cambioDeJugadorActual()
      juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      juego.cambioDeJugadorActual()
      expect(juego.atacarCarta(0, 0).estadoAtaque).toBe('Ataque realizado')
    })
  })

  describe('cambiar Posicion de Batalla', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, CeldaBatalla.Estado.POS_BATALLA_ATAQUE)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.cambiarPosicionBatalla(0).respuesta).toBe('Posicion cambiada')
    })
  })
})
