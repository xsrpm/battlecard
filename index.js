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
 * @param {WebSocket} wsorigen
 * @param {*} data
 * @param {boolean} excludingItself
 */
function broadcast(wsorigen, data, excludingItself) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if (excludingItself) {
        if (ws !== wsorigen) {
          ws.send(JSON.stringify(data));
        }
      } else {
        ws.send(JSON.stringify(data));
      }
    }
  });
}
/**
 * 
 * @param {WebSocket} wsorigen 
 * @param {*} data 
 * @param {Function} callback 
 * @param {boolean} excludingItself 
 */
function broadcast2(wsorigen, data, callback, excludingItself) {
  wss.clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      if(!(excludingItself && ws === wsorigen)){
        callback(ws,data);
      }
    }
  });
}
/**
 *
 * @param {WebSocket} wsorigen
 * @param {*} data
 */
function unirASala(wsorigen, data) {
  let nombreJugador = data.payload.nombreJugador;
  if (typeof nombreJugador === "undefined") {
    wsorigen.send(JSON.stringify({ event:"Unir a sala",error: "nombreJugador is undefined" }));
    wsorigen.close();
    return;
  }
  const resp = juego.unirASala(nombreJugador);
  if(resp === 'Sala llena, no pueden entrar jugadores'){
    wsorigen.send(JSON.stringify({ event:"Unir a sala",error: resp }));
    wsorigen.close();
    return;
  }
  wsorigen.jugador = resp;
  let res = {
    event: "Unir a sala",
    payload: {
      jugadores: juego.obtenerNombreJugadores(),
      iniciar:false
    },
  };
  juego.obtenerEstadoSala() === "SALA CERRADA" ? res.payload.iniciar = true: ""
  broadcast(wsorigen, res, false);
}
/**
 * 
 * @param {WebSocket} ws 
 * @param {*} data
 */
function iniciarJuegoSendData(ws,data){
  if(ws.jugador === juego.jugadorActual){
    data.payload = {
      jugador:{
        barrera: juego.jugadorActual.barrera,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
      },
      jugadorEnemigo : {
        barrera: juego.jugadorAnterior.barrera,
        nDeck: juego.jugadorAnterior.deck.length,
      },
      enTurno:true
    }
  }
  else if(ws.jugador === juego.jugadorAnterior){
    data.payload = {
        jugador:{
          barrera: juego.jugadorAnterior.barrera,
          nDeck: juego.jugadorAnterior.deck.length,
          mano: juego.jugadorAnterior.mano,
        },
        jugadorEnemigo : {
          barrera: juego.jugadorActual.barrera,
          nDeck: juego.jugadorActual.deck.length,
        },
        enTurno:false
      }
  }
  else{
    console.log("Error no gestionado iniciar JuegoDataPorJugador")
    data.error = "Error no gestionado iniciar JuegoDataPorJugador"
  }
  ws.send(JSON.stringify(data))
}

/**
 *
 * @param {WebSocket} wsorigen
 */
function iniciarJuego(wsorigen) {
  const resp = juego.iniciarJuego();
  if (resp !== "JUEGO INICIADO") {
    wsorigen.send(JSON.stringify(resp));
    return;
  }
  let res = {event:"Iniciar juego"}

  broadcast2(wsorigen,res,iniciarJuegoSendData,false);
}

/**
 *
 * @param {WebSocket} ws
 * @param {string} data
 */
function procesarAccion(ws, data) {
  let objData = JSON.parse(data);
  switch (objData.event) {
    case "Unir a sala":
      unirASala(ws, objData);
    break;
    case "Iniciar juego":
      iniciarJuego(ws);
    break;
    default:
      ws.send(JSON.stringify({event:"Hello"}))
    break;
  }
}

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    console.log("received: " + data);
    procesarAccion(ws, data);
  });
  ws.on("close", (code, reason) => {
    console.info(`close ws code:${code}, reason: ${reason}`);
  });
});
