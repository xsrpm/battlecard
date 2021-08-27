const {Jugador} = require("./jugador.js");

const Pantalla = {
  EN_SALA_DE_ESPERA: "EN SALA DE ESPERA",
  EN_JUEGO: "EN JUEGO",
  FIN_DE_JUEGO: "FIN DE JUEGO",
};
Object.freeze(Pantalla);

class Juego {
  static get Pantalla() {
    return Pantalla;
  }
  constructor() {
    /**
     * @type {Array<Jugador>}
     */
    this.jugador = [];
    /**
     * @type {Jugador}
     */
    this.jugadorActual = null;
    /**
     * @type {Jugador}
     */
    this.jugadorAnterior = null;
    this.idCartaZonaBSel = 0;
    this.idCartaZonaBSelEnemigo = 0;
    this.idCartaManoSel = 0;
    this.pantalla = null;
    this.momento = null;
    this.estadoSala = "SALA ABIERTA"
  }

    /**
   *
   * @param {string} nombreJugador
   */
  unirASala(nombreJugador) {
    let rpta = {}
    if(this.estadoSala !== "SALA ABIERTA") rpta.resultado= "Sala llena, no pueden entrar jugadores";
    else if(nombreJugador === "") return "No indicó nombre de jugador"
    else if(this.jugador.filter((j)=> j.nombre === nombreJugador).length >= 1)  rpta.resultado= "Nombre de Usuario/Nick en uso";
    else{
      rpta.resultado= "Exito";
      let jug = new Jugador(nombreJugador);
      this.jugador.push(jug);
      rpta.jugador = jug
      this.jugador.length < 2 ? this.estadoSala = "SALA ABIERTA" : this.estadoSala = "SALA CERRADA"
      this.estadoSala === "SALA CERRADA" ? rpta.iniciar = true : rpta.iniciar = false;
      this.pantalla = Juego.Pantalla.EN_SALA_DE_ESPERA;
      rpta.jugadores = this.obtenerNombreJugadores()
    }
    return rpta;
  }

  obtenerNombreJugadores(){
    let jugNames = []
    for(const j of this.jugador){
      jugNames.push(j.nombre)
    }
    return jugNames
  }

  iniciarJuego() {
    if(this.estadoSala === "SALA ABIERTA" &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA){
      return "No se tienen 2 jugadores para empezar";
    }
    if (this.estadoSala === "SALA CERRADA" &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      this.estadoSala = "SALA INICIADA"
      this.jugador[0].repartirCartas();
      this.jugador[1].repartirCartas();
      this.jugadorActual = this.jugador[0];
      this.jugadorAnterior = this.jugador[1];
      this.jugadorActual.setEnTurno(true);
      this.jugadorAnterior.setEnTurno(false);
      this.jugadorActual.iniciarTurno();
      this.pantalla = Pantalla.EN_JUEGO;
      return "JUEGO INICIADO";
    } 
    else{
      return "Condición no manejada al iniciarJuego"
    }
  }

  finalizarJuego(){
    this.pantalla = Pantalla.FIN_DE_JUEGO
    this.jugador= []
    this.jugadorActual = null;
    this.jugadorAnterior = null;
    this.idCartaZonaBSel = 0;
    this.idCartaZonaBSelEnemigo = 0;
    this.idCartaManoSel = 0;
    this.pantalla = null;
    this.momento = null;
    this.estadoSala = "SALA ABIERTA"
  }

  cambioDeJugadorActual() {
    let jugadorTmp = this.jugadorActual;
    this.jugadorActual = this.jugadorAnterior;
    this.jugadorAnterior = jugadorTmp;
    this.jugadorActual.iniciarTurno()
    this.jugadorActual.setEnTurno(true)
    this.jugadorAnterior.setEnTurno(false)
  }

  terminarTurno(){
    this.cambioDeJugadorActual();
    let res = this.cogerUnaCartaDelDeck()
    res = {
     ...res,
      jugador: {
        enTurno: this.jugadorAnterior.enTurno,
        nDeck: this.jugadorAnterior.deck.length
      },
      jugadorEnemigo: {
        enTurno: this.jugadorActual.enTurno,
        nDeck: this.jugadorActual.deck.length
      }
    };
    if(res.resultado === "DECK VACIO"){
      this.finalizarJuego()
    }
    return res
  }


  cogerUnaCartaDelDeck(){
    let res = this.jugadorActual.cogerUnaCartaDelDeck()
    if(res.resultado === "DECK VACIO"){
      res.nombreJugadorDerrotado = this.jugadorActual.nombre
      res.nombreJugadorVictorioso = this.jugadorAnterior.nombre
    }
    return res
  }
/**
 * 
 * @param {number} idPosZB 
 * @param {number} idCartaMano 
 * @returns String
 */
  colocarCarta(idPosZB, idCartaMano,posCarta) {
    return this.jugadorActual.accionColocarCarta(
      idPosZB,
      idCartaMano,
      posCarta
    );
  }

  opcionesSeleccionarZonaBatalla(idZonaBatalla){
    return {
      existeCarta: this.jugadorActual.existeCartaEnCeldaBatalla(idZonaBatalla),
      puedeAtacarCarta:this.jugadorActual.puedeAtacarCartaDesdeId(this.jugadorAnterior,idZonaBatalla),
      puedeAtacarBarrera:this.jugadorActual.posibilidadAtacarBarrera(this.jugadorAnterior,idZonaBatalla),
      puedeCambiarPosicion:this.jugadorActual.posibilidadCambiarPosicionBatallaEnCarta(idZonaBatalla)
    }
  }

  opcionesSeleccionarMano(idMano){
    return {
      existeCarta: this.jugadorActual.tieneCartaEnMano(idMano),
      puedeColocarCarta:this.jugadorActual.puedeColocarCartaDesdeId(idMano)
    } 
  }

  /**
   * 
   * @param {number} idCartaAtacante 
   */
  atacarBarrera(idCartaAtacante) {
    let res= this.jugadorActual.accionAtacarBarrera(this.jugadorAnterior,idCartaAtacante)
    if(typeof res.sinBarreras !== "undefined"){
      if(res.sinBarreras){
        this.finalizarJuego()
      }
    }
    return res
  }
/**
 * 
 * @param {number} idCartaAtacante 
 * @param {number} idCartaAtacada 
 */
  atacarCarta(idCartaAtacante,idCartaAtacada) {
    let res = this.jugadorActual.accionAtacarCarta(this.jugadorAnterior,idCartaAtacante,idCartaAtacada)
    if(typeof res.sinBarreras !== "undefined"){
      if(res.sinBarreras){
        this.finalizarJuego()
      }
    }
    return res 
  }

  cambiarPosicionBatalla(idCarta) {
    return this.jugadorActual.cambiarPosicionBatalla(idCarta)
  }

  jugadorEnemigo(jugador){
    return this.jugador.filter(j => j.nombre !== jugador.nombre)[0]
  }
}

module.exports = Juego;
