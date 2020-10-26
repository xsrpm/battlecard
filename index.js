
const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const Juego = require('./juego.js');
/**
 * @type {Juego}
 */
let juego = new Juego()

const wss = new WebSocket.Server({ port: 8080 });

/**
 * @param {WebSocket} wsorigen 
 * @param {Object} data 
 */
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

function unirASala(wsorigen, objData){
  const resp = juego.unirASala(objData)
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

function iniciarJuego(){
  juego.iniciarJuegoNuevo()
}

function procesarAccion(wsorigen, data) {
  let objData = JSON.parse(data)
  console.log("Pantalla: " + juego.pantalla)

  if (objData.accion === 'Unir A Sala') {
    unirASala(wsorigen, objData)
  }
  else if (objData.accion === 'Iniciar Juego') {
    iniciarJuego(wsorigen, objData)
  }
}

wss.on('connection', ws => {
  ws.on('message', data => {
    console.log('received: ' + data)
    procesarAccion(ws, data)
  });
});

