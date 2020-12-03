
const pantallas = document.querySelectorAll("body > div");
const bienvenida = document.querySelector(".bienvenida");
const recepcion = document.querySelector(".recepcion");
const sala = document.querySelector(".sala");
const juego = document.querySelector(".juego");
const h2 = sala.getElementsByTagName("h2");

const nombreJugador = document.getElementById("nombreJugador");
const btnUnirASala = document.getElementById("btnUnirASala");
const btnJugar = document.getElementById("btnJugar");
const btnIniciarJuego = document.getElementById("btnIniciarJuego");
const btnColocarEnAtaque = document.getElementById("btnColocarEnAtaque");
const btnColocarEnDefensa = document.getElementById("btnColocarEnDefensa");
const btnAtacarCarta = document.getElementById("btnAtacarCarta");
const btnCambiarPosicion = document.getElementById("btnCambiarPosicion");
const btnTerminarTurno = document.getElementById("btnTerminarTurno");
const resultadoAtaque = document.querySelector(".resultadoAtaque");
const manoYo = document.getElementById("manoYo");
const zonaBatallaYo = document.getElementById("zonaBatallaYo");
const zonaBatallaEnemiga = document.getElementById("zonaBatallaEnemiga");
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

function cambiarPantalla(pantalla) {
  Array.from(pantallas).forEach((p) => {
    p.classList.remove("mostrarPantalla");
  });
  pantalla.classList.add("mostrarPantalla");
}

function enTurno(enTurno) {
  if (enTurno === true) {
    jugYo.classList.remove("jugEnEspera");
    jugYo.classList.add("jugActivo");
    jugEnemigo.classList.remove("jugActivo");
    jugEnemigo.classList.add("jugEnEspera");
  } else {
    jugYo.classList.remove("jugActivo");
    jugYo.classList.add("jugEnEspera");
    jugEnemigo.classList.remove("jugEnEspera");
    jugEnemigo.classList.add("jugActivo");
  }
}

function iniciarTablero(objData) {
  objData.jugador.barrera.forEach((b, i) => {
    zonaBatallaYo.children[i].classList.add("barrera");
  });
  jugYo.children[1].children[0].innerText = objData.nDeck;
  objData.jugador.mano.forEach((c, i) => {
    manoYo.children[i].classList.add("mano");
    manoYo.children[i].children[0].children[0] = c.valor;
    manoYo.children[i].children[0].children[1] = c.elemento;
  });
  objData.jugadorEnemigo.barrera.forEach((b, i) => {
    zonaBatallaEnemiga.children[i].classList.add("barrera");
  });
  jugEnemigo.children[1].children[0].innerText = objData.nDeck;
}

function unirASala(objData) {
  if (typeof objData.error !== "undefined"){ 
    console.log(objData.error);
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
  enTurno(objData.payload.enTurno);
  iniciarTablero(objData);
  cambiarPantalla(juego);
}

btnJugar.addEventListener("click", () => {
  cambiarPantalla(recepcion);
});
btnUnirASala.addEventListener("click", () => {
  socket = new WebSocket(url);
  socket.onopen = (e)=>{
    socket.send(JSON.stringify({ event: "Unir a sala", payload:{nombreJugador: nombreJugador.value }}));
  }
  socket.onmessage = (e) => {
    console.log("received: "+e.data);
    let objData = JSON.parse(e.data);
    switch(objData.event){
      case "Unir a sala":
        unirASala(objData);
      break;
      case "Iniciar juego":
        enJuego(objData);
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
btnColocarEnAtaque.addEventListener("click", () => {});
btnColocarEnDefensa.addEventListener("click", () => {});
btnAtacarCarta.addEventListener("click", () => {});
btnCambiarPosicion.addEventListener("click", () => {});
btnTerminarTurno.addEventListener("click", () => {});
manoYo.addEventListener("click", (e) => {
  let target = e.target;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
});
zonaBatallaYo.addEventListener("click", (e) => {
  let target = e.target;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
});
zonaBatallaEnemiga.addEventListener("click", (e) => {
  let target = e.target;
  while (!target.classList.contains("slot")) target = target.parentElement;
  console.log(target);
});



