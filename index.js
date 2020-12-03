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
          ws.send(data);
        }
      } else {
        ws.send(data);
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
    wsorigen.send(JSON.stringify({ error: resp }));
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
  broadcast(wsorigen, JSON.stringify(res), false);
}

/**
 *
 * @param {WebSocket} wsorigen
 */
function iniciarJuego(wsorigen) {
  const resp = juego.iniciarJuego();
  if (typeof resp.error !== "undefined") {
    wsorigen.send(JSON.stringify(resp));
    return;
  }
  let res = {
    event:"Iniciar juego",
    payload:{
      jugador: {
        barrera: juego.jugadorActual.barrera,
        nDeck: juego.jugadorActual.deck.length,
        mano: juego.jugadorActual.mano,
      },
      jugadorEnemigo: {
        barrera: juego.jugadorAnterior.barrera,
        nDeck: juego.jugadorAnterior.deck.length,
      },
      enTurno: true,
    }
  }
  wsorigen.send(JSON.stringify(res));
  res.payload.enTurno=false
  broadcast(wsorigen,JSON.stringify(res),true);
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
