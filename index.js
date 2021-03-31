/* eslint-disable no-undef */
/* eslint-disable no-console */
const WebSocket = require("ws");
const Juego = require("./clases/juego.js");
/**
 * @type {Juego}
 */
let juego = new Juego();

const wss = new WebSocket.Server({ port: 8080 });

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function sendMessage(ws, message) {
  ws.send(JSON.stringify(message));
  console.log("sended:");
  console.log(message);
}

/**
 *
 * @param {WebSocket} wsorigen
 * @param {*} message
 */
function sendMessageToOthers(wsorigen, message) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (!(ws === wsorigen)) {
        sendMessage(ws, message);
      }
    }
  });
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function unirASala(ws, message) {
  let nombreJugador = message.payload.nombreJugador;
  if (typeof nombreJugador === "undefined") {
    message.error = "nombreJugador is undefined";
    sendMessage(ws, message);
    ws.close();
    return;
  }
  const resp = juego.unirASala(nombreJugador);
  if (resp === "Sala llena, no pueden entrar jugadores") {
    message.error = resp;
    sendMessage(ws, message);
    ws.close();
    return;
  }
  ws.jugador = resp;
  message.payload = {
    jugadores: juego.obtenerNombreJugadores(),
    iniciar: false,
  };
  juego.obtenerEstadoSala() === "SALA CERRADA"
    ? (message.payload.iniciar = true)
    : "";
  sendMessage(ws, message);
  sendMessageToOthers(ws, message);
}
/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function iniciarJuego(ws, message) {
  const resp = juego.iniciarJuego();
  if (resp !== "JUEGO INICIADO") {
    message.payload = {
      respuesta: resp,
    };
    sendMessage(ws, message);
    ws.close();
    return;
  }

  if (ws.jugador === juego.jugadorActual) {
    message.payload = {
      jugador: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
        enTurno: juego.jugadorActual.enTurno,
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        enTurno: juego.jugadorAnterior.enTurno,
      },
    };
    sendMessage(ws, message);
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        mano: juego.jugadorAnterior.mano,
        enTurno: juego.jugadorAnterior.enTurno,
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        enTurno: juego.jugadorActual.enTurno,
      },
    };
    sendMessageToOthers(ws, message);
  } else {
    message.payload = {
      jugador: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        mano: juego.jugadorAnterior.mano,
        enTurno: juego.jugadorAnterior.enTurno,
      },
      jugadorEnemigo: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        enTurno: juego.jugadorActual.enTurno,
      },
    };
    sendMessage(ws, message);
    message.payload = {
      jugador: {
        nombre: juego.jugadorActual.nombre,
        nBarrera: juego.jugadorActual.barrera.length,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
        enTurno: juego.jugadorActual.enTurno,
      },
      jugadorEnemigo: {
        nombre: juego.jugadorAnterior.nombre,
        nBarrera: juego.jugadorAnterior.barrera.length,
        nDeck: juego.jugadorAnterior.deck.length,
        enTurno: juego.jugadorAnterior.enTurno,
      },
    };
    sendMessageToOthers(ws, message);
  }
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */

function colocarCarta(ws, message) {
  if (accionAutorizada(ws, message) === false) return;
  let posicion, idZonaBatalla, idMano, resp;
  ({ posicion, idZonaBatalla, idMano } = message.payload);
  if (posicion === "ATAQUE") {
    resp = juego.colocarCartaEnAtaque(idZonaBatalla, idMano);
    message.payload.carta =
      juego.jugadorActual.zonaBatalla[idZonaBatalla].carta;
  } else {
    resp = juego.colocarCartaEnDefensa(idZonaBatalla, idMano);
  }
  message.payload.respuesta = resp;
  message.payload.mano = juego.jugadorActual.mano
  sendMessage(ws, message);
  delete message.payload.mano
  message.event = "Coloca Carta Otro Jugador";
  message.payload.posicion = posicion;
  message.payload.idZonaBatalla = idZonaBatalla;
  let ULTIMA_CARTA = 4
  message.payload.idMano = ULTIMA_CARTA;
  sendMessageToOthers(ws, message);
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function seleccionarZonaBatalla(ws, message) {
  if (accionAutorizada(ws, message) === false) return;
  let idZonaBatalla = message.payload.idZonaBatalla;
  message.payload = juego.opcionesSeleccionarZonaBatalla(idZonaBatalla);
  sendMessage(ws, message);
}

/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 */
function terminarTurno(ws, message) {
  if (accionAutorizada(ws, message) === false) return;
  let res = juego.cambioDeJugadorActual();
  message.payload = {
    jugador: {
      enTurno: juego.jugadorAnterior.enTurno,
      nDeck: juego.jugadorAnterior.deck.length
    },
    jugadorEnemigo: {
      enTurno: juego.jugadorActual.enTurno,
      nDeck: juego.jugadorActual.deck.length
    },
    cogerCarta: res.resultado
  };
  sendMessage(ws, message);
  message.payload.jugador = {
    enTurno: juego.jugadorActual.enTurno,
    nDeck: juego.jugadorActual.deck.length
  }
  message.payload.jugadorEnemigo = {
    enTurno: juego.jugadorAnterior.enTurno,
    nDeck: juego.jugadorAnterior.deck.length
  }
  if (res.resultado === "EXITO") message.payload.carta = res.carta;
  sendMessageToOthers(ws, message);
}
/**
 *
 * @param {WebSocket} ws
 * @param {*} message
 * @param {*} callback
 */
function accionAutorizada(ws, message) {
  if (ws.jugador === juego.jugadorActual) {
    return true;
  }
  message.error = "Usuario no está autorizado a realizar acción";
  sendMessage(ws, message);
  return false;
}

function seleccionarMano(ws,message){
  if (accionAutorizada(ws, message) === false) return;
  let idMano = message.payload.idMano
  message.payload =  juego.opcionesSeleccionarMano(idMano)
  sendMessage(ws,message)
}

function atacarCarta(ws,message){
  if (accionAutorizada(ws, message) === false) return;
  let {idZonaBatalla,idZonaBatallaEnemiga} = message.payload
  let res = juego.atacarCarta(idZonaBatalla,idZonaBatallaEnemiga)
  message.payload = res
  if(res.estadoBarrera === "DESTRUIDA"){
    if(juego.jugadorAnterior.sinBarreras()){
      this.pantalla = Pantalla.FIN_DE_JUEGO
      //FIN DEL JUEGO COMPROBAR QUE TODAVIA TENGA CARTAS DE BARRERA
    }
  }
  sendMessage(ws,message)
  message.event ="Atacan Tu Carta"
  message.payload.idCartaAtacante = idZonaBatalla
  message.payload.idCartaAtacada = idZonaBatallaEnemiga
  sendMessageToOthers(ws,message)
}

/**
 *
 * @param {WebSocket} ws
 * @param {string} data
 */
function procesarAccion(ws, message) {
  let objMessage = JSON.parse(message);
  console.log("received:");
  console.log(objMessage);
  switch (objMessage.event) {
    case "Unir a sala":
      unirASala(ws, objMessage);
      break;
    case "Iniciar juego":
      iniciarJuego(ws, objMessage);
      break;
    case "Colocar Carta":
      colocarCarta(ws, objMessage);
      break;
    case "Seleccionar Zona Batalla":
      seleccionarZonaBatalla(ws, objMessage);
      break;
    case "Seleccionar Mano":
      seleccionarMano(ws, objMessage);
      break;
    case "Atacar Carta":
      atacarCarta(ws,objMessage)
      break;
    case "Terminar Turno":
      terminarTurno(ws, objMessage);
      break;
    default:
      sendMySelf(ws, { event: "Hello" });
      break;
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    procesarAccion(ws, data);
  });
  ws.on("error", function (event) {
    console.log(event);
  });
  ws.on("close", (code, reason) => {
    console.info(`close ws code:${code}, reason: ${reason}`);
  });
});
