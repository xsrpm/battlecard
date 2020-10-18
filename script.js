const Pantalla = { EN_SALA_DE_ESPERA: "EN SALA DE ESPERA", JUEGO: "JUEGO", FIN_DE_JUEGO: "FIN DE JUEGO"}
Object.freeze(Pantalla)
const DialogoJuego = {
    EN_SALA_DE_ESPERA: "EN SALA DE ESPERA",
    JUEGO: "JUEGO",
    FIN_DE_JUEGO: "FIN DE JUEGO",
    OPCIONES_EN_TURNO:"OPCIONES EN TURNO",

    SELECCIONAR_MANO:"SELECCIONAR_MANO",
    SELECCIONAR_ZONABATALLA:"SELECCIONAR_ZONABATALLA",
    SELECCIONAR_POSICIONBATALLA:"SELECCIONAR_POSICIONBATALLA",
    SELECCIONAR_POSICIONBATALLAE:"SELECCIONAR_POSICIONBATALLAE",

    CARTA_COLOCADA:"CARTA_COLOCADA",
    ATAQUE_CARTA_REALIZADO:"ATAQUE_CARTA_REALIZADO",
    ATAQUE_BARRERA_REALIZADO:"ATAQUE_BARRERA_REALIZADO",
    CAMBIODEPOSICION_REALIZADO:"CAMBIODEPOSICION_REALIZADO",
    //FINALES
    JUGADORSINCARTASBARRERA:"JUGADORSINCARTASBARRERA",
    JUGADORSINCARTASMAZO:"JUGADORSINCARTASMAZO",
}

const pantallas = document.querySelectorAll("body > div")
const bienvenida=document.querySelector(".bienvenida")
const recepcion=document.querySelector(".recepcion")
const sala=document.querySelector(".sala")
const h2 = sala.getElementsByTagName("h2")

const nombreJugador=document.getElementById("nombreJugador")
const btnUnirASala=document.getElementById("btnUnirASala")
const btnJugar = document.getElementById("btnJugar")

let uuid

function cambiarPantalla(pantalla){
  Array.from(pantallas).forEach(p=>{
    p.style.zIndex=0
  })
  pantalla.style.zIndex=1
}

btnJugar.addEventListener("click",()=>{
  cambiarPantalla(recepcion)
})
btnUnirASala.addEventListener("click",()=>{
  socket.send(JSON.stringify({"accion":"Unir A Sala","nombreJugador":nombreJugador.value}));
})

let url = location.host == 'localhost' ?
  'ws://localhost:8080/ws' : 'ws://battlecard-api.cemp2703.repl.co/ws'


const socket = new WebSocket(url);
socket.onopen = e=>{
  socket.send(JSON.stringify({mensaje:"Abriendo socket"}));
};
socket.onerror= e=>{
  if(!recepcion.disabled){
    btnUnirASala.innerText="Unirse a la Sala"
    btnUnirASala.setAttribute("disabled","false")
  }
  console.log("Error: "+e)
}
socket.onmessage = e=> {
  let objData = JSON.parse(e.data)
  console.log(objData)
  if(objData.pantalla === Pantalla.EN_SALA_DE_ESPERA){
    for(let i=0;i<objData.jugadorNombre.length;i++){
      h2[i].innerText= objData.jugadorNombre[i]
    }
    if(typeof objData.uuid !== 'undefined'){
      uuid = objData.uuid
      console.log(uuid)
      cambiarPantalla(sala)  
    }
  }
}
socket.onclose=e=>{
  console.log("Cerrando socket "+e);
}



/*Se podría abrir la conexión con el socket server al hacer click en el boton unir a la sala*/