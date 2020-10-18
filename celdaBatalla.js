const PosBatalla = {
    NOHAYCARTA: "No hay carta", // No hay carta
    ATAQUE: "Ataque", // Ataque
    DEFCARAARRIBA: "Defensa cara arriba", // Defensa boca arriba
    DEFCARAABAJO: "Defensa cara abajo" // Defensa boca abajo
};
Object.freeze(PosBatalla);

const DispAtaque = {
    NODISPONIBLE:"No Disponible", // No Disponible para atacar con esta carta
    DISPONIBLE: "Disponible" // Disponible para atacar con esta carta
}
Object.freeze(DispAtaque);

const DispCambio = {
    NODISPONIBLE:"No Disponible", // No Disponible para cambiar de posicion
    DISPONIBLE: "Disponible" // Disponible para cambiar de posicion
}
Object.freeze(DispCambio);

class CeldaBatalla{
    static get PosBatalla() {return PosBatalla;};
    static get DispAtaque() {return DispAtaque;};
    static get DispCambio() {return DispCambio;};

    constructor() {
        this.posBatalla = CeldaBatalla.PosBatalla.NOHAYCARTA;
        this.dispAtaque = CeldaBatalla.DispAtaque.NODISPONIBLE;
        this.dispCambio = CeldaBatalla.DispCambio.NODISPONIBLE;
        this.carta= null;
    }

    quitarCarta(){
        this.carta=null;
        this.dispAtaque = CeldaBatalla.DispAtaque.NODISPONIBLE;
        this.dispCambio = CeldaBatalla.DispCambio.NODISPONIBLE;
        this.posBatalla = CeldaBatalla.PosBatalla.NOHAYCARTA;
	}
}

module.exports = CeldaBatalla;