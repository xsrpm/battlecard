
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const Juego = require('./clases/juego.js');
/**
 * @type {Juego}
 */
let juego = new Juego()

const wss = new WebSocket.Server({ port: 8080 });


function broadcast(wsorigen, data) {
  wss.clients.forEach(ws => {
    if (ws !== wsorigen && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

function echo(wsorigen, data) {
  wsorigen.send("Desde el server: " + data)
}
/**
 * 
 * @param {WebSocket} wsorigen 
 * @param {{accion:string,nombreJugador: string}} objData 
 */
function unirASala(wsorigen, objData){
  const resp = juego.unirASala(objData.nombreJugador)
  if (typeof resp.error !== "undefined")
    wsorigen.send(JSON.stringify(resp))
  else {
    wsorigen.jugador = objData.jugador
    delete objData.jugador
    wsorigen.uuid = uuidv4()
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        if (ws === wsorigen) {
          resp.uuid = wsorigen.uuid
          ws.send(JSON.stringify(resp));
        }
        else {
          if (typeof ws.uuid !== 'undefined')
            ws.send(JSON.stringify(resp));
        }
      }
    });
  }
}

/**
 * 
 * @param {WebSocket} wsorigen 
 */
function iniciarJuego(wsorigen){
  const resp = juego.iniciarJuego()
  if (typeof resp.error !== "undefined")
    wsorigen.send(JSON.stringify(resp))
  else {
    wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        if (ws.jugador === juego.jugadorActual) {
          ws.send(JSON.stringify({
            pantalla:juego.pantalla,
            momento:juego.momento,
            jugador:{
              barrera:juego.jugadorActual.barrera,
              nDeck:juego.jugadorActual.deck.length,
              mano:juego.jugadorActual.mano
            },
            jugadorEnemigo:{
              barrera:juego.jugadorAnterior.barrera,
              nDeck:juego.jugadorAnterior.deck.length
            },
            enTurno:true
            }));
        }
        else if(ws.jugador === juego.jugadorAnterior){
          ws.send(JSON.stringify({
            pantalla:juego.pantalla,
            momento:juego.momento,
            jugador:{
              barrera:juego.jugadorAnterior.barrera,
              nDeck:juego.jugadorAnterior.deck.length,
              mano:juego.jugadorAnterior.mano
            },
            jugadorEnemigo:{
              barrera:juego.jugadorActual.barrera,
              nDeck:juego.jugadorActual.deck.length
            },
            enTurno:false
          }));
        }
      }
    });
  }
}

/**
 * 
 * @param {WebSocket} wsorigen 
 * @param {string} data 
 */
function procesarAccion(wsorigen, data) {
  let objData = JSON.parse(data)
  console.log("Pantalla: " + juego.pantalla)

  if (objData.accion === 'Unir A Sala') {
    unirASala(wsorigen, objData)
  }
  else if (objData.accion === 'Iniciar Juego') {
    wss.clients.forEach(ws => {
      if(ws.uuid===objData.uuid)
        iniciarJuego(wsorigen)
    })
  }
}

wss.on('connection', ws => {
  ws.on('message', data => {
    console.log('received: ' + data)
    procesarAccion(ws, data)
  });
});

