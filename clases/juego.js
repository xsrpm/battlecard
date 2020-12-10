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
    /**
     * @type {Jugador}
     */
    this.jugadorVictorioso = null;
    this.idCartaZonaBSel = 0;
    this.idCartaZonaBSelEnemigo = 0;
    this.idCartaManoSel = 0;
    this.pantalla = null;
    this.momento = null;
    this.estadoSala = "SALA ABIERTA"
  }

  obtenerEstadoSala() {
    return this.estadoSala
  }

  obtenerNombreJugadores(){
    let jugNames = []
    for(const j of this.jugador){
      jugNames.push(j.nombre)
    }
    return jugNames
  }
  /**
   *
   * @param {string} nombreJugador
   */
  unirASala(nombreJugador) {
    if (this.estadoSala === "SALA ABIERTA") {
      let jug = new Jugador(nombreJugador);
      this.jugador.push(jug);
      this.jugador.length < 2 ? this.estadoSala = "SALA ABIERTA" : this.estadoSala = "SALA CERRADA"
      this.pantalla = Juego.Pantalla.EN_SALA_DE_ESPERA;
      return jug;
    } else {
      return "Sala llena, no pueden entrar jugadores";
    }
  }

  iniciarJuego() {
    if (this.estadoSala === "SALA CERRADA" &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA) {
      this.estadoSala = "SALA INICIADA"
      this.jugador[0].repartirCartas();
      this.jugador[1].repartirCartas();
      this.jugador[0].iniciarTurno();
      this.jugador[1].iniciarTurno();
      this.jugadorActual = this.jugador[0];
      this.jugadorAnterior = this.jugador[1];
      this.jugadorActual.setearTurno(true);
      this.jugadorAnterior.setearTurno(false);
      this.pantalla = Pantalla.EN_JUEGO;
      return "JUEGO INICIADO";
    } else if(this.estadoSala === "SALA INICIADA" && 
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA){
      return "La sala está iniciandose"
    }
    else if(this.estadoSala === "SALA ABIERTA" &&
    this.pantalla === Pantalla.EN_SALA_DE_ESPERA){
      return "No se tienen 2 jugadores para empezar";
    }
    else{
      return "Condición no manejada al iniciarJuego"
    }
  }

  cambioDeJugadorActual() {
    let jugadorTmp = this.jugadorActual;
    this.jugadorActual = this.jugadorAnterior;
    this.jugadorAnterior = jugadorTmp;
    this.jugadorActual.iniciarTurno()
    this.jugadorActual.setearTurno(true)
    this.jugadorAnterior.setearTurno(false)
    let res = this.jugadorActual.cogerUnaCartaDelDeck()
    if(res === "EXITO"){
      if(this.jugadorActual.sinCartasEnDeck()){
        this.pantalla = Pantalla.FIN_DE_JUEGO
        return "Jugador sin cartas en deck"     //FIN DEL JUEGO AL QUEDARSE SIN CARTAS EN EL DECK
      }
    }
    return res
  }
/**
 * 
 * @param {number} idPosZB 
 * @param {number} idCartaMano 
 */
  colocarCartaEnAtaque(idPosZB, idCartaMano) {
    let respuesta = this.jugadorActual.accionColocarCartaEnAtaque(
      idPosZB,
      idCartaMano
    );
    return respuesta;
  }
/**
 * 
 * @param {number} idPosZB 
 * @param {number} idCartaMano 
 */
  colocarCartaEnDefensa(idPosZB, idCartaMano) {
    let respuesta = this.jugadorActual.accionColocarCartaEnDefensa(
      idPosZB,
      idCartaMano
    );
    return respuesta;
  }

  /**
   * 
   * @param {number} idCartaAtacante 
   */
  atacarBarrera(idCartaAtacante) {
    let res= this.jugadorActual.accionAtacarBarrera(this.jugadorAnterior,idCartaAtacante)
    if(res === "Barrera destruida"){
      if(this.jugadorAnterior.sinBarreras()){
        this.pantalla = Pantalla.FIN_DE_JUEGO
        return "Jugador sin barreras" //FIN DEL JUEGO COMPROBAR QUE TODAVIA TENGA CARTAS DE BARRERA
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
    if(res.estadoBarrera === "DESTRUIDA"){
      if(this.jugadorAnterior.sinBarreras()){
        this.pantalla = Pantalla.FIN_DE_JUEGO
        return "Jugador sin barreras" //FIN DEL JUEGO COMPROBAR QUE TODAVIA TENGA CARTAS DE BARRERA
      }
    }
    return res 
  }

  cambiarPosicionBatalla(idCarta) {
    return this.jugadorActual.cambiarPosicionBatalla(idCarta)
  }
}

module.exports = Juego;
