import { ResultadoColocarCarta, ResultadoAtacarBarrera, ResultadoAtacarCarta, ResultadoCambiarPosicion } from './../constants/jugador';
import { ResultadoIniciarJuego } from './../constants/juego';
import { expect, describe, test, beforeEach } from '@jest/globals'
import { PosBatalla } from './../constants/celdabatalla';
import { Juego } from '../clases/juego'
import { Pantalla, Sala } from '../constants/juego';

describe('Juego objeto', () => {
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
      expect(juego.estadoSala).toBe(Sala.SALA_ABIERTA)
    })
    test('cerrada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      expect(juego.estadoSala).toBe(Sala.SALA_CERRADA)
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
      expect(juego.estadoSala).toBe(Sala.SALA_ABIERTA)
    })
    test('sala llena', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const resp = juego.unirASala('Krister')
      expect(resp.resultado).toBe('Sala llena, no pueden entrar jugadores')
      expect(juego.estadoSala).toBe(Sala.SALA_CERRADA)
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
      expect(juego.pantalla).toBe(Pantalla.EN_JUEGO)
      expect(juego.estadoSala).toBe(Sala.SALA_INICIADA)
    })
    test('sala abierta', () => {
      juego.unirASala('Cesar')
      const res = juego.iniciarJuego()
      expect(res).toBe(ResultadoIniciarJuego.NO_SE_TIENEN_2_JUGADORES_PARA_EMPEZAR)
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
      expect(juego.colocarCarta(0, 0, PosBatalla.ATAQUE).resultado).toBe(ResultadoColocarCarta.CARTA_COLOCADA)
    })
  })

  describe('colocar carta en defensa', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      expect(juego.colocarCarta(0, 0, PosBatalla.DEF_ABAJO).resultado).toBe(ResultadoColocarCarta.CARTA_COLOCADA)
    })
  })

  describe('atacar Barrera', () => {
    test('barrera destruida', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, PosBatalla.ATAQUE)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.atacarBarrera(0).resultado).toBe(ResultadoAtacarBarrera.BARRERA_DESTRUIDA)
    })
  })

  describe('atacar Carta', () => {
    test('carta atacada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, PosBatalla.ATAQUE)
      juego.cambioDeJugadorActual()
      juego.colocarCarta(0, 0, PosBatalla.ATAQUE)
      juego.cambioDeJugadorActual()
      expect(juego.atacarCarta(0, 0).estadoAtaque).toBe(ResultadoAtacarCarta.ATAQUE_REALIZADO)
    })
  })

  describe('cambiar Posicion de Batalla', () => {
    test('exitoso', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      juego.colocarCarta(0, 0, PosBatalla.ATAQUE)
      juego.cambioDeJugadorActual()
      juego.cambioDeJugadorActual()
      expect(juego.cambiarPosicionBatalla(0).respuesta).toBe(ResultadoCambiarPosicion.POSICION_CAMBIADA)
    })
  })
})
