
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
function broadcast(wsorigen,data){
  wss.clients.forEach(ws=> {
    if (ws !== wsorigen && ws.readyState === WebSocket.OPEN) {
      ws.send(data);
    }
  });
}

function echo(wsorigen,data){
  wsorigen.send("Desde el server: "+data)
}

function procesarAccion(wsorigen,data){
  let objData = JSON.parse(data)
  console.log("accion: "+objData.accion)
  console.log("Pantalla: "+juego.pantalla)
  
  if(juego.pantalla === Juego.Pantalla.EN_SALA_DE_ESPERA){
    if(objData.accion === 'Unir A Sala'){
      if(juego.jugador.length<2){
        let jug=juego.añadirJugador(objData.nombreJugador)
        wsorigen.jugador = jug
        wsorigen.uuid=uuidv4()
        let jugadorNombre = []
        juego.jugador.forEach(j=>{
          jugadorNombre.push(j.nombre)
        })
        wss.clients.forEach(ws=> {
          if (ws === wsorigen && ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({pantalla:juego.pantalla,momento:juego.momento,uuid:wsorigen.uuid,jugadorNombre:jugadorNombre}));
          }
          else if(ws.readyState === WebSocket.OPEN){
            if(typeof ws.jugador !== 'undefined')
              ws.send(JSON.stringify({pantalla:juego.pantalla,momento:juego.momento,jugadorNombre:jugadorNombre}));
          }
        });
      }
      else{
        wsorigen.send(JSON.stringify({"error":"Sala llena, no pueden entrar jugadores"}))
      }
    }
  }

}

wss.on('connection', ws => {
  ws.on('message', data =>  {
    console.log('received: '+data)
    procesarAccion(ws,data)
  });
});

