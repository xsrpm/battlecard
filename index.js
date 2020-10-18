
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
      let jug=juego.añadirJugador(objData.nombreJugador,uuidv4())
      wsorigen.jugador = jug
      let jugadorNombre = []
      juego.jugador.forEach(j=>{
        jugadorNombre.push(j.nombre)
      })
      wss.clients.forEach(ws=> {
        if (ws === wsorigen && ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({pantalla:juego.pantalla,momento:juego.momento,uuid:jug.uuid,jugadorNombre:jugadorNombre}));
        }
        else if(ws.readyState === WebSocket.OPEN){
          if(typeof ws.jugador !== 'undefined')
            ws.send(JSON.stringify({pantalla:juego.pantalla,momento:juego.momento,jugadorNombre:jugadorNombre}));
        }
      });
    }
  }

}

wss.on('connection', ws => {
  ws.on('message', data =>  {
    console.log('received: '+data)
    procesarAccion(ws,data)
  });
});


/**
 * Se podría quitar el atributo jugador de ws y en su lugar agregar un atributo uuid al registrar un jugador a la sala,
 *  de manera que uuid haga una referencia al dispositivo cliente, pero no tenga relación con las clases backend (por no ser necesario)
 * Al mismo tiempo quitar el atributo uuid de la clase jugador.
 */