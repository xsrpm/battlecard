
import { ResultadoColocarCarta, ResultadoAtacarBarrera, ResultadoAtacarCarta, ResultadoCambiarPosicion, ResultadoCogerCarta } from './../../constants/jugador';
import { ResultadoIniciarJuego, ResultadoSalirDeSala, ResultadoUnirASala } from './../../constants/juego';
import { PosBatalla } from './../../constants/celdabatalla';
import { Juego } from '../../classes/juego'
import { Pantalla, Sala } from '../../constants/juego';
import { Jugador } from '../../classes/jugador';

describe('Juego objeto', () => {
  let juego: Juego
  beforeEach(() => {
    juego = new Juego()
  })

  describe('crea objeto valido', () => {
    test('exitoso', () => {
      expect(juego.jugadores).toEqual([])
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
    test('inválido, no indicó nombre de jugador', () => {
      expect(juego.unirASala('').resultado).toBe(ResultadoUnirASala.NO_INDICO_NOMBRE_JUGADOR)
    })
    test('inválido, nombre de jugador en uso', () => {
      juego.unirASala('César')
      expect(juego.unirASala('César').resultado).toBe(ResultadoUnirASala.NOMBRE_EN_USO)
    })
    test('válido, sala sin llenar', () => {
      juego.unirASala('Cesar')
      expect(juego.estadoSala).toBe(Sala.SALA_ABIERTA)
    })
    test('válido, sala llena', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const resp = juego.unirASala('Krister')
      expect(resp.resultado).toBe('Sala llena, no pueden entrar jugadores')
      expect(juego.estadoSala).toBe(Sala.SALA_CERRADA)
    })
  })

  describe('salir de sala',()=>{
    test('válido, sala abierta', ()=>{
      const resp1 = juego.unirASala('Cesar')
      const resp2 = juego.unirASala('Marco')
      const {resultado, jugadores, iniciar} = juego.salirDeSala(resp1.jugador as Jugador)
      expect(resultado).toBe(ResultadoSalirDeSala.SALIO_DE_SALA)
      expect(jugadores).toEqual([resp2.jugador?.nombre])
      expect(iniciar).toBe(false)
    })

    test('fallida cuando jugador no está en sala',()=>{
      const resp1 = juego.unirASala('Cesar')
      const resp2 = juego.unirASala('Marco')
      const jugador = new Jugador('Krister')
      const {resultado, jugadores, iniciar} = juego.salirDeSala(jugador)
      expect(resultado).toBe(ResultadoSalirDeSala.NO_ESTA_EN_SALA)
      expect(jugadores).toEqual([resp1.jugador?.nombre, resp2.jugador?.nombre])
      expect(iniciar).toBe(true)
    })

  })

  describe('iniciar juego', () => {
    test('sala iniciada', () => {
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      const res = juego.iniciarJuego()
      expect(res).toBe('JUEGO INICIADO')
      expect(juego.jugadores[0].deck.length).toBeGreaterThan(0)
      expect(juego.jugadores[1].deck.length).toBeGreaterThan(0)
      expect(juego.jugadorActual).toEqual(juego.jugadores[0])
      expect(juego.jugadorAnterior).toEqual(juego.jugadores[1])
      expect(juego.pantalla).toBe(Pantalla.EN_JUEGO)
      expect(juego.estadoSala).toBe(Sala.SALA_INICIADA)
    })
    test('sala abierta', () => {
      juego.unirASala('Cesar')
      const res = juego.iniciarJuego()
      expect(res).toBe(ResultadoIniciarJuego.NO_SE_TIENEN_2_JUGADORES_PARA_EMPEZAR)
    })

  })

  describe('finalizar juego',()=>{
    test('válido',()=>{
      juego.finalizarJuego()
      expect(juego.jugadores).toEqual([])
      expect(juego.jugadorActual).toEqual(null)
      expect(juego.jugadorAnterior).toEqual(null)
      expect(juego.idCartaZonaBSel).toBe(0)
      expect(juego.idCartaZonaBSelEnemigo).toBe(0)
      expect(juego.idCartaManoSel).toBe(0)
      expect(juego.pantalla).toEqual(null)
      expect(juego.momento).toEqual(null)
      expect(juego.estadoSala).toBe(Sala.SALA_ABIERTA)
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
      expect(juego.atacarCarta(0, 0).estadoAtaque).toBe(ResultadoAtacarCarta.POSIBLE)
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

  describe('coger una carta del deck',()=>{
    test('deck no vacío',()=>{
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego()
      const res = juego.cogerUnaCartaDelDeck()
      expect(res.resultado).not.toBe(ResultadoCogerCarta.DECK_VACIO)
    })
    test('deck vacío', ()=>{
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego();
      juego.colocarCarta(0,0,PosBatalla.ATAQUE);
      (juego.jugadorActual as Jugador).deck = [];
      (juego.jugadorAnterior as Jugador).deck = []
      const res = juego.cogerUnaCartaDelDeck()
      expect(res.resultado).toBe(ResultadoCogerCarta.DECK_VACIO)
    })
  })

  describe('terminar turno',()=>{
    test('válido, ',()=>{
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego();
      juego.terminarTurno()
    })
  })
  
  describe('lista opciones de seleccionar zona de batalla',()=>{
    test('válido',()=>{
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego();
      const resp = juego.opcionesSeleccionarZonaBatalla(0)
      expect(resp.existeCarta).toBe(false)
      expect(resp.puedeAtacarBarrera).toBe(ResultadoAtacarBarrera.SIN_CARTAS_EN_ZONA_BATALLA)
      expect(resp.puedeAtacarCarta).toBe(ResultadoAtacarCarta.ATAQUES_SOLO_SE_REALIZAN_EN_SEGUNDO_TURNO)
      expect(resp.puedeCambiarPosicion).toBe(ResultadoCambiarPosicion.SIN_CARTAS_EN_ZONA_BATALLA)
    })
  })

  describe('lista opciones de seleccionar mano',()=>{
    test('válido', ()=>{
      juego.unirASala('Cesar')
      juego.unirASala('Marco')
      juego.iniciarJuego();
      const resp = juego.opcionesSeleccionarMano (0)
      expect(resp.existeCarta).toBe(true)
      expect(resp.puedeColocarCarta).toBe(ResultadoColocarCarta.POSIBLE)
    })
  })

  describe('devuelve la referencia a su jugador enemigo / contrincante',()=>{
    test('válido',()=>{
      const jug1 = juego.unirASala('Cesar')
      const jug2 = juego.unirASala('Marco')
      juego.iniciarJuego();
      expect(juego.jugadorEnemigo((jug1?.jugador as Jugador) )).toEqual(jug2.jugador)
    })
  })
})


