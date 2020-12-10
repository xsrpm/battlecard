
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
const btnCambiarPosicion = document.getElementById("btnCambiarPosicion");
const btnCancelar = document.getElementById("btnCancelar");
const btnTerminarTurno = document.getElementById("btnTerminarTurno");
const resultadoAtaque = document.querySelector(".resultadoAtaque");
const manoYo = document.getElementById("manoYo");
const zonaBatallaYo = document.getElementById("zonaBatallaYo");
const zonaBatallaEnemiga = document.getElementById("zonaBatallaEnemiga");
const barreraYo = document.getElementById("barreraYo");
const barreraEnemiga = document.getElementById("barreraEnemiga");
const jugYo = document.getElementById("jugYo");
const jugEnemigo = document.getElementById("jugEnemigo");

//'localhost'
//console.log(location.host);
let url = "ws://localhost:8080/ws"
/*
  location.host == "127.0.0.1:8080"
    ? "ws://localhost:8080/ws"
    : "ws://battlecard-api.cemp2703.repl.co/ws";
*/
let socket;
let idCartaManoSeleccionada
let idCartaZBSeleccionada
let idCartaZBEnemigaSeleccionada
let stepAccion = ""
let posicionBatalla

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

function mostrarEnTurno(objData) {
  if(objData.payload.jugador.enTurno){
    jugYo.classList.remove("jugEnEspera");
    jugYo.classList.add("jugEnTurno");
    jugEnemigo.classList.remove("jugEnTurno");
    jugEnemigo.classList.add("jugEnEspera");
  }
  if (objData.payload.jugadorEnemigo.enTurno){
    jugYo.classList.remove("jugEnTurno");
    jugYo.classList.add("jugEnEspera");
    jugEnemigo.classList.remove("jugEnEspera");
    jugEnemigo.classList.add("jugEnTurno");
  }

/*
  if (enTurno === true) {
    jugYo.classList.remove("jugEnEspera");
    jugYo.classList.add("jugEnTurno");
    jugEnemigo.classList.remove("jugEnTurno");
    jugEnemigo.classList.add("jugEnEspera");
  } else {
    jugYo.classList.remove("jugEnTurno");
    jugYo.classList.add("jugEnEspera");
    jugEnemigo.classList.remove("jugEnEspera");
    jugEnemigo.classList.add("jugEnTurno");
  }
  */
}

function iniciarTablero(objData) {
  objData.payload.jugador.barrera.forEach((b, i) => {
    barreraYo.children[i].classList.add("barrera");
  });
  jugYo.children[0].innerText = objData.payload.jugador.nombre
  jugYo.children[1].children[0].innerText = objData.payload.jugador.nDeck;
  objData.payload.jugador.mano.forEach((c, i) => {
    manoYo.children[i].classList.add("mano");
    manoYo.children[i].children[0].children[0].innerText = c.valor;
    manoYo.children[i].children[0].children[1].innerText = String.fromCharCode(c.elemento);
  });
  objData.payload.jugadorEnemigo.barrera.forEach((b, i) => {
    barreraEnemiga.children[i].classList.add("barrera");
  });
  jugEnemigo.children[0].innerText = objData.payload.jugadorEnemigo.nombre
  jugEnemigo.children[1].children[0].innerText = objData.payload.jugadorEnemigo.nDeck;
}

function unirASala(objData) {
  if (typeof objData.error !== "undefined"){ 
    console.log(objData.error);
    alert(objData.error)
    return;
  }
  for (let i = 0; i < objData.payload.jugadores.length; i++) {
    h2[i].innerText = objData.payload.jugadores[i];
  }
  objData.payload.iniciar === true? btnIniciarJuego.disabled = false : ""
  cambiarPantalla(sala);
}

function iniciarJuego(objData) {
  if (typeof objData.error !== "undefined") {
    console.log(objData.error);
    return;
  }
  mostrarEnTurno(objData);
  iniciarTablero(objData);
  cambiarPantalla(juego);
}

/**
 * 
 * @param {string} accion 
 */
function setStepAction(step){
  btnColocarEnAtaque.classList.add("ocultar")
  btnColocarEnDefensa.classList.add("ocultar")
  btnAtacarCarta.classList.add("ocultar")
  btnCambiarPosicion.classList.add("ocultar")
  btnCancelar.classList.add("ocultar")
  btnTerminarTurno.classList.add("ocultar")
  switch(step){
    case "COLOCAR SELECCIONAR MANO":
      Array.from(manoYo.children).forEach(e => e.classList.remove("seleccionado"))
      btnColocarEnAtaque.classList.remove("ocultar")
      btnColocarEnDefensa.classList.remove("ocultar")
      mensajeBotones.innerText="Colocar carta en posición...";
      stepAccion = "COLOCAR ELEGIR POSICION"
    break;
    case "COLOCAR ELEGIR POSICION":
      mensajeBotones.innerText="Seleccione ubicación en zona de batalla...";
      for(let celda of zonaBatallaYo.children){
        if(!celda.classList.contains("ataque") && !celda.classList.contains("defensa")){
          celda.classList.add("disponible")
        }
      }
      stepAccion = "COLOCAR SELECCIONAR ZONA BATALLA"
    break;
    case "COLOCAR SELECCIONAR ZONA BATALLA":
      Array.from(manoYo.children).forEach(e => e.classList.remove("seleccionado"))
      Array.from(zonaBatallaYo.children).forEach(e => e.classList.remove("disponible"))
      mensajeBotones.innerText="";
    break;
  }
}


btnJugar.addEventListener("click", () => {
  cambiarPantalla(recepcion);
});
btnUnirASala.addEventListener("click", () => {
  socket = new WebSocket(url);
  socket.onopen = (e)=>{
    socket.send(JSON.stringify({ event: "Unir a sala", payload:{nombreJugador: inNombreJugador.value }}));
  }
  socket.onmessage = (e) => {
    console.log("received: "+e.data);
    let objData = JSON.parse(e.data);
    switch(objData.event){
      case "Unir a sala":
        unirASala(objData);
      break;
      case "Iniciar juego":
        iniciarJuego(objData);
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
  socket.send(JSON.stringify({ event: "Iniciar juego"}));
});
resultadoAtaque.addEventListener("click", () => {
  resultadoAtaque.classList.remove("mostrarResultado");
});
btnColocarEnAtaque.addEventListener("click", () => {
  if(stepAccion === "COLOCAR ELEGIR POSICION"){
    posicionBatalla = "ATAQUE";
    setStepAction(stepAccion)
  }
});
btnColocarEnDefensa.addEventListener("click", () => {
  if(stepAccion === "COLOCAR ELEGIR POSICION"){
    posicionBatalla = "DEFENSA"
    setStepAction(stepAccion)
  }
});
btnAtacarCarta.addEventListener("click", () => {});
btnCambiarPosicion.addEventListener("click", () => {});
btnCancelar.addEventListener("click",()=>{})
btnTerminarTurno.addEventListener("click", () => {});

manoYo.addEventListener("click", function(e) {
  /**
   * @type {HTMLElement}
   */
  let target = e.target;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
  if(target.classList.contains("mano")){
   setStepAction("COLOCAR SELECCIONAR MANO")
   target.classList.add("seleccionado")
   idCartaSeleccionada = target.dataset.id
  }
});
zonaBatallaYo.addEventListener("click", function (e) {
  let target = e.target;
  if(target.id === this.id) return
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target)
  if(stepAccion === "COLOCAR SELECCIONAR ZONA BATALLA"){
    setStepAction(stepAccion)
  }
});
zonaBatallaEnemiga.addEventListener("click", function (e) {
  let target = e.target;
  if(target.id === this.id) return
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
});



