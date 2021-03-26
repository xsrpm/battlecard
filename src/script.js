//VIsual Aplicación y juego

const pantallas = document.querySelectorAll("body > div");
const bienvenida = document.querySelector(".bienvenida");
const recepcion = document.querySelector(".recepcion");
const sala = document.querySelector(".sala");

const juego = document.querySelector(".juego");
const h2 = sala.getElementsByTagName("h2");
const inNombreJugador = document.getElementById("inNombreJugador");
const btnUnirASala = document.getElementById("btnUnirASala");
const btnJugar = document.getElementById("btnJugar");
const btnIniciarJuego = document.getElementById("btnIniciarJuego");
const mensajeBotones = document.getElementById("mensajeBotones");
const btnColocarEnAtaque = document.getElementById("btnColocarEnAtaque");
const btnColocarEnDefensa = document.getElementById("btnColocarEnDefensa");
const btnAtacarCarta = document.getElementById("btnAtacarCarta");
const btnAtacarBarrera = document.getElementById("btnAtacarBarrera");
const btnCambiarPosicion = document.getElementById("btnCambiarPosicion");
const btnCancelar = document.getElementById("btnCancelar");
const btnTerminarTurno = document.getElementById("btnTerminarTurno");
const resultadoAtaque = document.querySelector(".resultadoAtaque");
const manoEnemigo = document.getElementById("manoEnemigo");
const manoYo = document.getElementById("manoYo");
const zonaBatallaYo = document.getElementById("zonaBatallaYo");
const zonaBatallaEnemiga = document.getElementById("zonaBatallaEnemiga");
const barreraYo = document.getElementById("barreraYo");
const barreraEnemiga = document.getElementById("barreraEnemiga");
const jugYo = document.getElementById("jugYo");
const jugEnemigo = document.getElementById("jugEnemigo");

console.log(location.host);
let url = `${process.env.WEBSOCKET_URL}/ws`;

let socket;
let idCartaManoSeleccionada;
let idCartaZBSeleccionada;
let idCartaZBEnemigaSeleccionada;
let cartaManoSeleccionada;
let cartaZBSeleccionana;
let cartaZBEnemigaSeleccionada;
let stepAccion = "STAND BY";
let posicionBatalla;
let message;

//Visual Life Cicle (App)
/**
 *
 * @param {HTMLElement} pantalla
 */
function cambiarPantalla(pantalla) {
  Array.from(pantallas).forEach((p) => {
    p.classList.remove("mostrarPantalla");
  });
  pantalla.classList.add("mostrarPantalla");
}

//Visual Juego

function mostrarEnTurno(objData) {
  if(encuentraError(objData)) return;
  jugEnemigo.classList.remove("jugEnTurno");
  jugEnemigo.classList.remove("jugEnEspera");
  jugYo.classList.remove("jugEnTurno");
  jugYo.classList.remove("jugEnEspera");
  if (objData.payload.jugador.enTurno) {
    jugYo.classList.add("jugEnTurno");
    jugEnemigo.classList.add("jugEnEspera");
  }
  else{
    jugYo.classList.add("jugEnEspera");
    jugEnemigo.classList.add("jugEnTurno");
  }
}

function iniciarTablero(objData) {
  if(encuentraError(objData)) return;
  for (let i = 0; i < objData.payload.jugador.nBarrera; i++) {
    barreraYo.children[i].classList.add("barrera");
  }
  jugYo.children[0].innerText = objData.payload.jugador.nombre;
  jugYo.children[1].children[0].innerText = objData.payload.jugador.nDeck;
  objData.payload.jugador.mano.forEach((c, i) => {
    manoYo.children[i].classList.add("mano");
    manoYo.children[i].children[0].children[0].innerText = c.valor;
    manoYo.children[i].children[0].children[1].innerText = String.fromCharCode(
      c.elemento
    );
  });
  for (let i = 0; i < objData.payload.jugadorEnemigo.nBarrera; i++) {
    barreraEnemiga.children[i].classList.add("barrera");
  }
  jugEnemigo.children[0].innerText = objData.payload.jugadorEnemigo.nombre;
  jugEnemigo.children[1].children[0].innerText =
    objData.payload.jugadorEnemigo.nDeck;
}

function encuentraError(objData){
  if (typeof objData.error !== "undefined") {
    console.log(objData.error);
    alert(objData.error);
    return true;
  }
}

function unirASala(objData) {
  if(encuentraError(objData)) return;
  for (let i = 0; i < objData.payload.jugadores.length; i++) {
    h2[i].innerText = objData.payload.jugadores[i];
  }
  objData.payload.iniciar === true ? (btnIniciarJuego.disabled = false) : "";
  cambiarPantalla(sala);
}

function iniciarJuego(objData) {
  if(encuentraError(objData)) return;
  mostrarEnTurno(objData);
  iniciarTablero(objData);
  cambiarPantalla(juego);
}

function ocultarBotones() {
  btnColocarEnAtaque.classList.add("ocultar");
  btnColocarEnDefensa.classList.add("ocultar");
  btnAtacarCarta.classList.add("ocultar");
  btnAtacarBarrera.classList.add("ocultar");
  btnCambiarPosicion.classList.add("ocultar");
  btnCancelar.classList.add("ocultar");
  //btnTerminarTurno.classList.add("ocultar");
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
  console.log("sended:");
  console.log(message);
}

function colocarCarta() {
  ocultarBotones();
  mensajeBotones.innerText = "Seleccione ubicación en zona de batalla...";
  for (let celda of zonaBatallaYo.children) {
    if (
      !celda.classList.contains("ataque") &&
      !celda.classList.contains("defensa")
    ) {
      celda.classList.add("seleccionado");
    }
  }
  stepAccion = "COLOCAR SELECCIONAR ZONA BATALLA";
  console.log(stepAccion);
}

function terminarTurno(objData){
  if(encuentraError(objData)) return;
  mostrarEnTurno(objData);
}

function seleccionarMano(objData){
  if(encuentraError(objData)) return;
  let {
    existeCarta,
    puedeColocarCarta
  } = objData.payload;
  if(existeCarta){
    ocultarBotones();
    Array.from(manoYo.children).forEach((e) =>
      e.classList.remove("seleccionado")
    );
    cartaManoSeleccionada.classList.add("seleccionado");
    if(puedeColocarCarta === "Posible"){
      btnColocarEnAtaque.classList.remove("ocultar");
      btnColocarEnDefensa.classList.remove("ocultar");
      mensajeBotones.innerText = "Colocar carta en posición...";
    }
    else{
      mensajeBotones.innerText = "No puede colocar mas cartas...";
    }
  }
}

btnJugar.addEventListener("click", () => {
  cambiarPantalla(recepcion);
});
btnUnirASala.addEventListener("click", () => {
  socket = new WebSocket(url);
  socket.onopen = (e) => {
    message = {
      event: "Unir a sala",
      payload: { nombreJugador: inNombreJugador.value },
    };
    sendMessage(message);
  };
  socket.onmessage = (e) => {
    console.log("received:");
    let objData = JSON.parse(e.data);
    console.log(objData);
    switch (objData.event) {
      case "Unir a sala":
        unirASala(objData);
        break;
      case "Iniciar juego":
        iniciarJuego(objData);
        break;
      case "Colocar Carta":
        colocarSeleccionarZonaBatalla(objData);
        break;
      case "Colocar Carta Enemigo":
        colocarSeleccionarZonaBatallaEnemigo(objData);
        break;
      case "Seleccionar Zona Batalla":
        standBySeleccionarZonaBatalla(objData);
        break;
      case "Seleccionar Mano":
        seleccionarMano(objData)
        break;
      case "Terminar Turno":
        terminarTurno(objData)
        break;
    }
  };
  socket.onerror = (e) => {
    if (recepcion.classList.contains("mostrarPantalla")) {
      btnUnirASala.innerText = "Unirse a la Sala";
      btnUnirASala.setAttribute("disabled", "false");
    }
    console.log("Error: " + e);
  };
  socket.onclose = (e) => {
    console.log("close ws" + e);
  };
});
btnIniciarJuego.addEventListener("click", () => {
  message = { event: "Iniciar juego" };
  sendMessage(message);
});
resultadoAtaque.addEventListener("click", () => {
  resultadoAtaque.classList.remove("mostrarResultado");
});
btnColocarEnAtaque.addEventListener("click", () => {
  if (stepAccion === "STAND BY") {
    posicionBatalla = "ATAQUE";
    console.log(posicionBatalla);
    stepAccion = "COLOCAR CARTA";
    colocarCarta();
  }
});
btnColocarEnDefensa.addEventListener("click", () => {
  if (stepAccion === "STAND BY") {
    posicionBatalla = "DEFENSA";
    console.log(posicionBatalla);
    stepAccion = "COLOCAR CARTA";
    colocarCarta();
  }
});
btnAtacarCarta.addEventListener("click", () => {
  stepAccion = "ATACAR CARTA";
  ocultarBotones();
  mensajeBotones.innerText = "Seleccione objetivo...";
});
btnCambiarPosicion.addEventListener("click", () => {});
btnCancelar.addEventListener("click", () => {});
btnTerminarTurno.addEventListener("click", () => {
  message = { event:"Terminar Turno"}
  sendMessage(message)
});

manoYo.addEventListener("click", function (e) {
  /**
   * @type {HTMLElement}
   */
  let target = e.target;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
  idCartaManoSeleccionada = target.dataset.id;
  cartaManoSeleccionada = target
  if (target.classList.contains("mano")) {
    stepAccion = "STAND BY";
    message ={
      event:"Seleccionar Mano",
      payload:{
        idMano: idCartaManoSeleccionada
      }
    }
    sendMessage(message)
  }
});
/**
 *
 * @param {*} data
 */

function colocarSeleccionarZonaBatalla(data) {
  if(encuentraError(data)) return;
  if (data.payload.respuesta === "Carta colocada") {
    ocultarBotones();
    Array.from(manoYo.children).forEach((e) =>
      e.classList.remove("seleccionado")
    );
    Array.from(zonaBatallaYo.children).forEach((e) =>
      e.classList.remove("seleccionado")
    );
    mensajeBotones.innerText = "";
    let manoNumeroCarta =
      manoYo.children[idCartaManoSeleccionada].children[0].children[0]
        .innerText;
    let manoElementoCarta =
      manoYo.children[idCartaManoSeleccionada].children[0].children[1]
        .innerText;
    manoYo.children[idCartaManoSeleccionada].children[0].children[0].innerText =
      "";
    manoYo.children[idCartaManoSeleccionada].children[0].children[1].innerText =
      "";
    manoYo.children[idCartaManoSeleccionada].classList.remove("mano");
    zonaBatallaYo.children[
      idCartaZBSeleccionada
    ].children[0].children[0].innerText = manoNumeroCarta;
    zonaBatallaYo.children[
      idCartaZBSeleccionada
    ].children[0].children[1].innerText = manoElementoCarta;
    if (posicionBatalla === "ATAQUE")
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add("ataque");
    else zonaBatallaYo.children[idCartaZBSeleccionada].classList.add("defensa");
    stepAccion = "STAND BY";
    console.log(stepAccion);
  }
}

function colocarSeleccionarZonaBatallaEnemigo(message) {
  if(encuentraError(message)) return;
  let { posicion, idZonaBatalla, idMano, respuesta,carta } = message.payload
  if (respuesta === "Carta colocada") {
    ocultarBotones();
    manoEnemigo.children[idMano].classList.remove("oculto");
    if (posicion === "ATAQUE"){
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add("ataque");
      let manoNumeroCarta = carta.valor
      let manoElementoCarta = String.fromCharCode(carta.elemento)
      zonaBatallaEnemiga.children[
        idZonaBatalla
      ].children[0].children[0].innerText = manoNumeroCarta;
      zonaBatallaEnemiga.children[
        idZonaBatalla
      ].children[0].children[1].innerText = manoElementoCarta;
    }
    else zonaBatallaEnemiga.children[idZonaBatalla].classList.add("oculto");
    stepAccion = "STAND BY";
    console.log(stepAccion);
  }
}

function standBySeleccionarZonaBatalla(message) {
  if(encuentraError(message)) return;
  let {
    existeCarta,
    puedeAtacarCarta,
    puedeAtacarBarrera,
    puedeCambiarPosicion,
  } = message.payload;
  if (existeCarta) {
    ocultarBotones();
    cartaZBSeleccionada.classList.add("seleccionado");
    Array.from(zonaBatallaYo.children).forEach((e) =>
      e.classList.remove("seleccionado")
    );
    if(puedeAtacarCarta === "Posible" || puedeAtacarCarta === "Posible" || puedeAtacarCarta === "Posible")
      mensajeBotones.innerText = "Seleccione acción";
    if(puedeAtacarCarta === "Posible") btnAtacarCarta.classList.remove("ocultar");
    if(puedeAtacarBarrera === "Posible") btnAtacarBarrera.classList.remove("ocultar");
    if(puedeCambiarPosicion === "Posible") btnCambiarPosicion.classList.remove("ocultar");
  }
}

zonaBatallaYo.addEventListener("click", function (e) {
  let target = e.target;
  if (target.id === this.id) return;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
  idCartaZBSeleccionada = target.dataset.id;
  cartaZBSeleccionada = target;
  if (stepAccion === "COLOCAR SELECCIONAR ZONA BATALLA") {
    if(!target.classList.contains("mano")){
      message = {
        event: "Colocar Carta",
        payload: {
          posicion: posicionBatalla,
          idZonaBatalla: idCartaZBSeleccionada,
          idMano: idCartaManoSeleccionada,
        },
      };
      sendMessage(message);
    }
  } else {
    if (target.classList.contains("mano")) {
      message = {
        event: "Seleccionar Zona Batalla",
        payload: {
          idZonaBatalla: idCartaZBSeleccionada,
        },
      };
    sendMessage(message);
    }
  }
});
zonaBatallaEnemiga.addEventListener("click", function (e) {
  let target = e.target;
  if (target.id === this.id) return;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
});
