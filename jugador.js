const Carta = require('./carta.js');
const CeldaBatalla = require('./celdaBatalla.js');

const ResultadoCojerUnaCarta = { MANOLLENA: "MANOLLENA", DECKVACIO: "DECKVACIO", EXITO: "EXITO"};
Object.freeze(ResultadoCojerUnaCarta);
const PosBatalla = {
    NOHAYCARTA:"NOHAYCARTA", // No hay carta
    ATAQUE:"ATAQUE", // Ataque
    DEFCARAARRIBA:"DEFCARAARRIBA", // Defensa boca arriba
    DEFCARAABAJO:"DEFCARAABAJO" // Defensa boca abajo
}
Object.freeze(PosBatalla);
const DispAtaque ={
    NODISPONIBLE:"NODISPONIBLE", // No Disponible para atacar con esta carta
    DISPONIBLE:"DISPONIBLE" // Disponible para atacar con esta carta
}
Object.freeze(DispAtaque);
const DispCambio ={
    NODISPONIBLE:"NODISPONIBLE", // No Disponible para cambiar de posicion
    DISPONIBLE:"DISPONIBLE" // Disponible para cambiar de posicion
}
Object.freeze(DispCambio);
const VeredictoAtaque= {
    NOSECUMPLENCOND: "NOSECUMPLENCOND", //-1: No se cumplen las condiciones de ataque
    EMPATE:"EMPATE", 
    GANAATACANTE:"GANAATACANTE",  //Gana Atacante contra carta en Zona de Batalla
    PIERDEATACANTE:"PIERDEATACANTE", //Pierde Atacante
    BARRERADESTRUIDA:"BARRERADESTRUIDA", //Destruye una barrera
    ENEMIGOSINBARRERA:"ENEMIGOSINBARRERA" //Termina el juego porque enemigo se quedo sin cartas de barrera (Termino 2)
}
Object.freeze(VeredictoAtaque);
const EstadoCarta={
    ACTIVA:"ACTIVA", // Carta activa
    DESTRUIDA:"DESTRUIDA" // Carta destruida
}
Object.freeze(EstadoCarta);

class ResultadoAtaque
{
    constructor(){
        this.cartaAtacante=null;
        this.cartaAtacada=null;
        this.posicionCartaAtacada=Jugador.PosBatalla.NOHAYCARTA;
        this.veredicto=VeredictoAtaque.NOSECUMPLENCOND;
        this.estadoCartaAtacante=Jugador.EstadoCarta.DESTRUIDA;
        this.estadoCartaAtacada=Jugador.EstadoCarta.DESTRUIDA;
        this.estadoBarrera=Jugador.EstadoCarta.DESTRUIDA;
    }
}


class Jugador {
    static get MAXZONABATALLACARDS() { return 3};
    static get MAXBARRERACARDS() { return 5};
    static get MAXMANOCARDS() { return 5};
    static get MAXDECK(){ return Carta.MAXVALORCARTA*Carta.NUMEROELEMENTOSCARTAS};
    static get ResultadoCojerUnaCarta() { return ResultadoCojerUnaCarta; };
    static get PosBatalla() { return PosBatalla; };
    static get DispAtaque() { return DispAtaque; };
    static get DispCambio() { return DispCambio; };
    static get VeredictoAtaque() { return VeredictoAtaque; };
    static get EstadoCarta() { return EstadoCarta; };
    constructor(nombre,uuid) {
        this.cartaColocada=false
        this.nAtaquesDisponibles = 0;
        this.nCambiosPosicionesDisponibles = 0;
        this.zonaBatalla=[];
        for(let i=0;i<Jugador.MAXZONABATALLACARDS;i++){
            this.zonaBatalla[i]= new CeldaBatalla();
            this.zonaBatalla[i].carta = null;
        }
        this.barrera=[];
        this.mano=[];
        this.deck=[];
        this.nTurnos=0;
        this.nombre=nombre;
        this.uuid=uuid;
        this.puedeColocarCartaEnZB=true;
        this.nCartasEnZB=0; // revisa codigo por esto
    }
    //region Operaciones (Reglas)

    iniciarTurno(){
        this.nTurnos++;
        nAtaquesDisponibles=0;
        nCambiosPosicionesDisponibles=0;
        for(let celdaBatalla of this.zonaBatalla){
            if(celdaBatalla.carta !=null){
                if(celdaBatalla.posBatalla === CeldaBatalla.PosBatalla.ATAQUE)
                    celdaBatalla.dispAtaque = CeldaBatalla.DispAtaque.DISPONIBLE;
                else
                    celdaBatalla.dispAtaque = CeldaBatalla.DispAtaque.NODISPONIBLE;
                celdaBatalla.dispCambio = CeldaBatalla.DispCambio.DISPONIBLE;
                nAtaquesDisponibles++;
				nCambiosPosicionesDisponibles++;
            }
        }
        cartaColocada=false;
    }

    /**
     *  @returns {string}
     */
    cogerUnaCartaDelDeck(){
        if(this.mano.length===Jugador.MAXMANOCARDS)
            return ResultadoCojerUnaCarta.MANOLLENA;
        const carta = this.deck.pop();
        if(carta=== undefined){
            console.log("Fin del Juego!!!");
        	console.log(this.nombre+" se quedó sin cartas en el mazo!!");
			return ResultadoCojerUnaCarta.DECKVACIO;
        }
        else{
            this.mano.push(carta);
			console.log("Se coge una carta del deck a la mano");
			return ResultadoCojerUnaCarta.EXITO;
		}
    }
    /**
     * @param {number} idCartaZB 
     * @param {number} idCartaMano
     * @returns {boolean}
     */
    posibilidadColocarCartaEnPosicion(idCartaZB,idCartaMano){
        if( ! this.puedeColocarCartaEnZB)
            return false;
        if(this.mano[idCartaMano] === null || this.mano[idCartaMano] === undefined)
            return false;
        if(this.zonaBatalla[idCartaZB].posCarta !== this.posCarta.NOHAYCARTA)
            return false;
        return true;
    }

    /**
     * @param {number} idCartaZB 
     * @param {number} idCartaMano 
     * @param {string} posCarta
     * @returns {boolean}
     */
    accionColocarCarta(idCartaZB,idCartaMano,posCarta){
		let respuesta = false;
		if(posibilidadColocarCartaEnPosicion(idCartaZB,idCartaMano)){
            let carta=this.mano[idCartaMano];
            this.mano.splice(idCartaMano, 1);
            this.zonaBatalla[idCartaZB].carta=carta;
            this.zonaBatalla[idCartaZB].posCarta=posCarta;
            this.puedeColocarCartaEnZB=false;
			if(posCarta === Jugador.PosBatalla.ATAQUE) {
				this.zonaBatalla[idCartaZB].dispAtaque = Jugador.DispAtaque.DISPONIBLE;
				this.zonaBatalla[idCartaZB].dispCambio = Jugador.DispCambio.NODISPONIBLE;
				nAtaquesDisponibles++;
			}
			else {
				this.zonaBatalla[idCartaZB].dispAtaque = Jugador.DispAtaque.NODISPONIBLE;
				this.zonaBatalla[idCartaZB].dispCambio = Jugador.DispCambio.NODISPONIBLE;
            }
            this.nCartasEnZB++;
			respuesta=true;
        	console.log("Carta Colocada!!");
		}
		return respuesta;
	}

    /**
     * @param {Jugador} jugadorAtacado
     * @returns {boolean}
     */
    puedeAtacarBarreras(jugadorAtacado){
		if(this.nCartasEnZB === 0)
			return false;
		if(jugadorAtacado.nCartasEnZB > 0)
			return false;
		if(this.nAtaquesDisponibles === 0)
			return false;
		if(nTurnos === 1)
			return false;
		return true;
    }
    /**
     * @param {Jugador} jugadorAtacado 
     * @param {number} idCartaAtacante 
     * @returns {boolean}
     */
    posibilidadAtacarBarrera(jugadorAtacado,idCartaAtacante) {
		if(!puedeAtacarBarreras(jugadorAtacado))
            return false;
        if(this.zonaBatalla[idCartaAtacante] === null)
            return false;
		if(this.zonaBatalla[idCartaAtacante].posBatalla != ZonaBatalla.PosBatalla.ATAQUE)
			return false;
		if(this.zonaBatalla[idCartaAtacante].dispAtaque != ZonaBatalla.DispAtaque.DISPONIBLE)
			return false;
		return true;
    }
    /**
     * @param {Jugador} jugadorAtacado 
     * @param {number} idCartaAtacante
     * @returns {string}
     */
    accionAtacarBarrera(jugadorAtacado,idCartaAtacante){
		let respuesta=VeredictoAtaque.NOSECUMPLENCOND;
		if( posibilidadAtacarBarrera(jugadorAtacado,idCartaAtacante) ){
            jugadorAtacado.barrera.pop();
            this.zonaBatalla.nAtaquesDisponibles--;
			if(jugadorAtacado.barrera.length >  0){
				respuesta=VeredictoAtaque.BARRERADESTRUIDA;
	        	console.log("Ataque Realizado!!");
	        	console.log("Barrera Destruida");
			}
			else{
				respuesta= VeredictoAtaque.ENEMIGOSINBARRERA;
				console.log("Fin del Juego!!!\n");
				console.log(jugadorAtacado.nombre+" se quedó sin barreras!!\n");
            }
            this.ZBatalla[idCartaAtacante].dispAtaque = ZonaBatalla.DispAtaque.NODISPONIBLE;
            this.ZBatalla[idCartaAtacante].dispCambio = ZonaBatalla.DispCambio.NODISPONIBLE;
		}
		return respuesta;
    }
    /**
     * @param {Jugador} jugadorAtacado
     * @returns {boolean}
     */
    puedeAtacarCartas(jugadorAtacado) {
		if(this.zonaBatalla.nCartasEnZB === 0) 
			return false;
		if(jugadorAtacado.zonaBatalla.nCartasEnZB === 0) 
			return false;
		if(this.zonaBatalla.nAtaquesDisponibles === 0)
			return false;
		if(this.nTurnos === 1)
			return false;
		return true;
    }
    /**
     * @param {Jugador} jugadorAtacado 
     * @param {number} idCartaAtacada 
     * @param {number} idCartaAtacante
     * @returns {boolean}
     */
    posibilidadAtacarCarta(jugadorAtacado,idCartaAtacada,idCartaAtacante){
		if(!puedeAtacarCartas(jugadorAtacado))
			return false;
		if (this.zonaBatalla[idCartaAtacante] === null)
			return false;
		if (jugadorAtacado.ZBatalla[idCartaAtacada] === null)
			return false;
		if(this.zonaBatalla[idCartaAtacante].posBatalla != ZonaBatalla.PosBatalla.ATAQUE)
			return false;
		if(this.zonaBatalla[idCartaAtacante].dispAtaque != ZonaBatalla.DispAtaque.DISPONIBLE)
			return false;
		return true;
    }
    /**
     * @param {ResultadoAtaque} resATK
     * @returns {string}
     */
    ataqueCartaRealizadoDialogo(resATK) {
    	let resp="";
    	resp+="Ataque Realizado!!\n";
        if(resATK.veredicto === Jugador.VeredictoAtaque.GANAATACANTE)
        	resp+="Victoria!!\n";
        else if(resATK.veredicto === Jugador.VeredictoAtaque.PIERDEATACANTE)
        	resp+="Derrota!!\n";
        else if(resATK.veredicto === Jugador.VeredictoAtaque.EMPATE)
        	resp+="Empate!!\n";
        resp+="     Tu Carta     |        Enemigo         \n";
        resp+= resATK.cartaAtacante.valor+" ("+resATK.cartaAtacante.elemento+") " +
                "(Al Ataque)"+
                "  |   " +
                resATK.cartaAtacada.valor+" ("+resATK.cartaAtacada.elemento+") "+
                (resATK.posicionCartaAtacada === Jugador.PosBatalla.ATAQUE? "(Al Ataque)" : "(A la Defensa) ") +"\n";
        if(resATK.estadoBarrera === Jugador.EstadoCarta.DESTRUIDA)
            resp+="Barrera enemiga destruida\n";
        if(resATK.estadoCartaAtacante === Jugador.EstadoCarta.DESTRUIDA)
            resp+="Tu Carta en Zona de Batalla ha sido destruida\n";
        if(resATK.estadoCartaAtacada === Jugador.EstadoCarta.DESTRUIDA)
            resp+="Carta enemiga en Zona de Batalla destruida\n";
        return resp;
    }

    /**
     * @param {Jugador} jugadorAtacado 
     * @param {number} idCartaAtacada 
     * @param {number} idCartaAtacante
     * @returns {ResultadoAtaque}
     */
    accionAtacarCarta(jugadorAtacado,idCartaAtacada,idCartaAtacante){//Sistema de produccion
		let rsAtaque = new ResultadoAtaque();
		rsAtaque.veredicto = VeredictoAtaque.NOSECUMPLENCOND;
		rsAtaque.estadoBarrera = EstadoCarta.ACTIVA;
		let cartaAtacante = null;
		let cartaAtacada = null;

		if( posibilidadAtacarCarta(jugadorAtacado,idCartaAtacada,idCartaAtacante) ){

			//Jugador Atacado en defensa cara abajo, se revela la carta.
			if(jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla === PosBatalla.DEFCARAABAJO){
				jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla = PosBatalla.DEFCARAARRIBA;
			}

			cartaAtacante = this.zonaBatalla[idCartaAtacante];
			cartaAtacada = jugadorAtacado.zonaBatalla[idCartaAtacada];
			rsAtaque.cartaAtacante = cartaAtacante;
			rsAtaque.cartaAtacada = cartaAtacada;

			if(rsAtaque.cartaAtacante.valor > rsAtaque.cartaAtacada.valor ){
				rsAtaque.veredicto = VeredictoAtaque.GANAATACANTE;//gana
				rsAtaque.estadoCartaAtacante = EstadoCarta.ACTIVA;
                rsAtaque.estadoCartaAtacada = EstadoCarta.DESTRUIDA;
			}
			else if(rsAtaque.cartaAtacante.valor  < rsAtaque.cartaAtacada.valor){
				rsAtaque.veredicto = VeredictoAtaque.PIERDEATACANTE;//pierde
				rsAtaque.estadoCartaAtacante = EstadoCarta.DESTRUIDA;
                rsAtaque.estadoCartaAtacada = EstadoCarta.ACTIVA;
			}
			else{
				rsAtaque.veredicto = VeredictoAtaque.EMPATE;//empata
			}

			//Jugador Atacado al Ataque
			if(jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla == PosBatalla.ATAQUE){
				rsAtaque.posicionCartaAtacada = PosBatalla.ATAQUE;
				if(rsAtaque.veredicto === VeredictoAtaque.GANAATACANTE){
					jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
                    jugadorAtacado.Barrera.pop();
                    jugadorAtacado.nCartasEnZB--;
					rsAtaque.estadoBarrera = EstadoCarta.DESTRUIDA;
					if(jugadorAtacado.Barrera.length === 0){
						rsAtaque.veredicto = VeredictoAtaque.ENEMIGOSINBARRERA;
					}
				}
				else if(rsAtaque.veredicto === VeredictoAtaque.PIERDEATACANTE){//pierde atacante
                    this.zonaBatalla[idCartaAtacante].quitarCarta();
                    this.nCartasEnZB--;
				}
				else{//Empate
					jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
					this.zonaBatalla[idCartaAtacante].quitarCarta();
					rsAtaque.estadoCartaAtacante = EstadoCarta.DESTRUIDA;
                    rsAtaque.estadoCartaAtacada = EstadoCarta.DESTRUIDA;
                    jugadorAtacado.nCartasEnZB--;
                    this.nCartasEnZB--;
				}
			}
			else if(jugadorAtacado.zonaBatalla[idCartaAtacada].posBatalla === PosBatalla.DEFCARAARRIBA ){//Jugador Atacado a la Defensa
				rsAtaque.posicionCartaAtacada = PosBatalla.DEFCARAARRIBA;
				if(rsAtaque.veredicto === VeredictoAtaque.GANAATACANTE){//gana atacante
                    jugadorAtacado.zonaBatalla[idCartaAtacada].quitarCarta();
                    jugadorAtacado.nCartasEnZB--;
				}
				else if(rsAtaque.veredicto === VeredictoAtaque.PIERDEATACANTE){//pierde atacante
                    this.zonaBatalla[idCartaAtacada].quitarCarta();
                    this.nCartasEnZB--;
				}
				else{//Empate
					rsAtaque.estadoCartaAtacante = EstadoCarta.ACTIVA;
					rsAtaque.estadoCartaAtacada = EstadoCarta.ACTIVA;
				}
			}
			
			this.nAtaquesDisponibles--;

			this.zonaBatalla[idCartaAtacante].dispAtaque = DispAtaque.NODISPONIBLE;
            this.zonaBatalla[idCartaAtacante].dispCambio = DispCambio.NODISPONIBLE;
		}
		console.log(ataqueCartaRealizadoDialogo(rsAtaque));
		return rsAtaque;
    }
    /**
     * @returns {boolean}
     */
	puedeCambiarPosicion(){
		if( this.nCartasEnZB === 0)
			return false;
		if(this.nCambiosPosicionesDisponibles === 0)
			return false;
		if(this.nAtaquesDisponibles === 0)
			return false;
		return true;
    }
    /**
     * @param {number} idCartaZBJAct
     * @returns {boolean}
     */
    posibilidadCambiarPosicionBatallaEnCarta(idCartaZBJAct){
		if(! puedeCambiarPosicion())
			return false;
		if(this.zonaBatalla[idCartaZBJAct] === null)
			return false;
		if(this.zonaBatalla[idCartaZBJAct].dispCambio === DispCambio.NODISPONIBLE)
			return false;
		return true;
	}
    
    /**
     * @param {number} idCartaZBJAct
     * @returns {boolean}
     */
    cambiarPosicionBatalla(idCartaZBJAct){
		let respuesta = false;
		if(posibilidadCambiarPosicionBatallaEnCarta(idCartaZBJAct)){
			if( this.zonaBatalla[idCartaZBJAct].posBatalla === PosBatalla.DEFCARAARRIBA ||
                this.zonaBatalla[idCartaZBJAct].posBatalla == PosBatalla.DEFCARAABAJO){
                this.zonaBatalla[idCartaZBJAct].posBatalla = PosBatalla.ATAQUE;
				this.zonaBatalla[idCartaZBJAct].dispCambio = DispCambio.NODISPONIBLE;
				this.zonaBatalla[idCartaZBJAct].dispAtaque = DispAtaque.DISPONIBLE;
				this.nCambiosPosicionesDisponibles--;
				respuesta = true;
			}
			else if(this.zonaBatalla[idCartaZBJAct].posBatalla === PosBatalla.ATAQUE){
				this.zonaBatalla[idCartaZBJAct].posBatalla = PosBatalla.DEFCARAARRIBA;
				this.zonaBatalla[idCartaZBJAct].dispCambio = DispCambio.NODISPONIBLE;
				this.zonaBatalla[idCartaZBJAct].dispAtaque = DispAtaque.NODISPONIBLE;
				nCambiosPosicionesDisponibles--;
				respuesta = true;
            }
            logger.debug("Cambio de Posición Realizado!!\n");
		}
		return respuesta;
    }
    
    repartirCartas(){
    	console.log("repartirCartas");
    	console.log("Jugador: "+this.nombre);
    	let cartasElegidas =[];
        let n,m,cartasRepartidas;

        for(let i=0;i<Carta.NUMEROELEMENTOSCARTAS;i++){
            cartasElegidas.push([]);
            for(let j=0;j<Carta.MAXVALORCARTA;j++){
            	cartasElegidas[i][j] = false;
            }
        }

        cartasRepartidas=0;
        
        while(cartasRepartidas < this.MAXDECK ){
            n=Math.floor(Math.random()*Carta.NUMEROELEMENTOSCARTAS);
            m=Math.floor(Math.random()*Carta.MAXVALORCARTA);

            if(!cartasElegidas[n][m]){
            	cartasElegidas[n][m]=true;

                cartasRepartidas++;
                let c=new Carta(m+1,Object.values(Carta.Elemento)[n]);
                if(this.barrera.length<this.MAXBARRERACARDS){
                    this.barrera.push(c);
                    console.log("Barrera: "+c.valor+" "+c.elemento);
                }
                else if(this.mano.length<this.MAXMANOCARDS){
                    this.mano.push(c);
                    console.log("Mano: "+c.valor+" "+c.elemento);
                }
                else{
                    this.deck.push(c);
                    console.log("Deck: "+c.valor+" "+c.elemento);
                }

            }
        }
    }

    //TODO: general esta clase basada en las clases: Jugador, ZonaBatalla y VectorCartas,
    // luego se vera si separar funcionalidades en mas clases.
    //no es necesalio implementar metodos clone(), tambpoco equals en las subsiguientes clases.
}

module.exports = Jugador