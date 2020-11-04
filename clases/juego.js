const Jugador = require('./jugador.js');

const Pantalla = { EN_SALA_DE_ESPERA: "EN SALA DE ESPERA", JUEGO: "JUEGO", FIN_DE_JUEGO: "FIN DE JUEGO" }
Object.freeze(Pantalla)
const Momento = {
    OPCIONES_EN_TURNO: "OPCIONES EN TURNO",//Opciones ofrecidas al jugador en su turno
    //ColocarCarta
    COLOCAR_SELECCIONARMANO: "COLOCAR_SELECCIONARMANO",//Seleccionar Carta en Mano
    COLOCAR_SELECCIONARZONABATALLA: "COLOCAR_SELECCIONARZONABATALLA",//Selecionar posicion en zona de batalla para colocar carta
    COLOCAR_SELECCIONARPOSICIONBATALLA: "COLOCAR_SELECCIONARPOSICIONBATALLA",//Elegir posicion de batalla
    COLOCAR_CARTACOLOCADA: "COLOCAR_CARTACOLOCADA",
    //AtacarCarta
    ATACARCARTA_SELECCIONARZONABATALLA: "ATACARCARTA_SELECCIONARZONABATALLA",//Seleccionar Carta en zona de batalla
    ATACARCARTA_SELECCIONARZONABATALLAE: "ATACARCARTA_SELECCIONARZONABATALLAE",//Seleccionar Carta en zona de batalla enemiga
    ATACARCARTA_ATAQUEREALIZADO: "ATACARCARTA_ATAQUEREALIZADO",//Ataque realizado
    //AtacarBarrera
    ATACARBARRERA_SELECCIONARZONABATALLA: "ATACARBARRERA_SELECCIONARZONABATALLA",
    ATACARBARRERA_ATAQUEREALIZADO: "ATACARBARRERA_ATAQUEREALIZADO",
    //CambioDePosicionDeBatalla
    CAMBIARPOSICIONBATALLA_SELECCIONARZONABATALLA: "CAMBIARPOSICIONBATALLA_SELECCIONARZONABATALLA",
    CAMBIARPOSICIONBATALLA_REALIZADO: "CAMBIARPOSICIONBATALLA_REALIZADO",


    //FINALES
    JUGADORSINCARTASBARRERA: "JUGADORSINCARTASBARRERA",
    JUGADORSINCARTASMAZO: "JUGADORSINCARTASMAZO"
}
Object.freeze(Momento)

class Juego {
    static get Pantalla() { return Pantalla }
    static get Momento() { return Momento }
    constructor() {
        /**
         * @type {Array<Jugador>}
         */
        this.jugador = []
        /**
         * @type {Jugador}
         */
        this.jugadorActual = []
        /**
         * @type {Jugador}
         */
        this.jugadorAnterior = []
        /**
         * @type {Jugador}
         */
        this.jugadorVictorioso = []
        this.idCartaZonaBSel = 0
        this.idCartaZonaBSelEnemigo = 0
        this.idCartaManoSel = 0
        this.pantalla = Pantalla.RECEPCION
        this.momento = Momento.EN_SALA_DE_ESPERA
    }

    añadirJugador(nombre) {
        let jug = new Jugador(nombre)
        this.jugador.push(jug)
        return jug
    }

    unirASala(nombreJugador) {
        if (this.jugador.length < 2) {
            let jug = this.añadirJugador(nombreJugador)
            let jugadorNombre = []
            this.jugador.forEach(j => {
                jugadorNombre.push(j.nombre)
            })
            let start = this.jugador.length === 2;
            this.pantalla = Juego.Pantalla.EN_SALA_DE_ESPERA
            return { pantalla: this.pantalla, jugadorNombre: jugadorNombre,jugador: jug , start: start }
        }
        else {
            return { error: "Sala llena, no pueden entrar jugadores" }
        }
    }

    iniciarJuego() {
        if (this.jugador.length === 2) {
            this.jugador[0].repartirCartas()
            this.jugador[1].repartirCartas()
            this.jugadorActual = this.jugador[0]
            this.jugadorAnterior = this.jugador[1]
            this.pantalla = Pantalla.Juego
            this.momento = Momento.OPCIONESENTURNO
            return {exito:true}
        }
        else {
            return {error:"No se tienen 2 jugadores para empezar"}
        }
    }

    cambioDeJugadorActual() {
        let jugadorTmp = this.jugadorActual
        this.jugadorActual = this.jugadorAnterior
        this.jugadorAnterior = jugadorTmp
        return this.jugadorActual
    }

    iniciarColocarCarta() {
        if (this.jugadorActual.puedeColocarCartaEnZB()) {
            this.momento = Momento.COLOCAR_SELECCIONARMANO
            return {
                pantalla: this.pantalla,
                momento: this.momento,
                jugador: jugador
            }
        }
    }

}

module.exports = Juego 