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
const btnIniciarJuego = document.getElementById("btnIniciarJuego")
const btnColocarEnAtaque = document.getElementById("btnColocarEnAtaque")
const btnColocarEnDefensa = document.getElementById("btnColocarEnDefensa")
const btnAtacarCarta = document.getElementById("btnAtacarCarta")
const btnCambiarPosicion = document.getElementById("btnCambiarPosicion")
const btnTerminarTurno = document.getElementById("btnTerminarTurno")
const resultadoAtaque = document.querySelector(".resultadoAtaque")
const manoYo = document.getElementById("manoYo")
const zonaBatallaYo = document.getElementById("zonaBatallaYo")
const zonaBatallaEnemiga = document.getElementById("zonaBatallaEnemiga")

function cambiarPantalla(pantalla){
  Array.from(pantallas).forEach(p=>{
    p.classList.remove("mostrarPantalla")
  })
  pantalla.classList.add("mostrarPantalla")
}

btnJugar.addEventListener("click",()=>{
  cambiarPantalla(recepcion)
})
btnUnirASala.addEventListener("click",()=>{
  socket.send(JSON.stringify({"accion":"Unir A Sala","nombreJugador":nombreJugador.value}));
})
btnIniciarJuego.addEventListener("click",()=>{
  socket.send(JSON.stringify({"accion":"Iniciar Juego"}))
})
resultadoAtaque.addEventListener("click",()=>{
  resultadoAtaque.classList.remove("mostrarResultado")
})
btnColocarEnAtaque.addEventListener("click",()=>{

})
btnColocarEnDefensa.addEventListener("click",()=>{

})
btnAtacarCarta.addEventListener("click",()=>{

})
btnCambiarPosicion.addEventListener("click",()=>{

})
btnTerminarTurno.addEventListener("click",()=>{

})
manoYo.addEventListener("click",(e)=>{
  let target = e.target
  while(!target.classList.contains("slot")) target=target.parentElement
  console.log(target)
})
zonaBatallaYo.addEventListener("click",(e)=>{
  let target = e.target
  while(!target.classList.contains("slot")) target=target.parentElement
  console.log(target)
})
zonaBatallaEnemiga.addEventListener("click",(e)=>{
  let target = e.target
  while(!target.classList.contains("slot")) target=target.parentElement
  console.log(target)
})

//'localhost'
let url = location.host == '' ?
  'ws://localhost:8080/ws' : 'ws://battlecard-api.cemp2703.repl.co/ws'

let uuid
let socket = new WebSocket(url);
socket.onopen = e=>{
  socket.send(JSON.stringify({mensaje:"Abriendo socket"}));
};
socket.onerror= e=>{
  if(recepcion.classList.contains("mostrarPantalla")){
    btnUnirASala.innerText="Unirse a la Sala"
    btnUnirASala.setAttribute("disabled","false")
  }
  console.log("Error: "+e)
}
socket.onmessage = e=> {
  let objData = JSON.parse(e.data)
  console.log(objData)
  if(objData.pantalla === Pantalla.EN_SALA_DE_ESPERA){
    if(typeof objData.error !== 'undefined')
      console.log(objData.error)
    else{
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
}
socket.onclose=e=>{
  console.log("Cerrando socket "+e);
}



/*Se podría abrir la conexión con el socket server al hacer click en el boton unir a la sala*/
/* se cerraba el socket al colocarlo dentro del evento click */