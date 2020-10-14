function cambiarPantalla(nueva,actual){
  actual.classList.toggle("oculto")
  nueva.classList.toggle("oculto")
}
const bienvenida=document.querySelector(".bienvenida")
const recepcion=document.querySelector(".recepcion")
const sala=document.querySelector(".sala")

const btnJugar = document.getElementById("btnJugar")
btnJugar.addEventListener("click",()=>{
  cambiarPantalla(recepcion,bienvenida)
})


const socket = new WebSocket("wss://battlecard-api.cemp2703.repl.co/ws");
socket.onopen = e=>{
  console.log("Conexión abierta")
  socket.send("Conexión abierta");
};
socket.onerror= e=>{
  if(!recepcion.disabled){
    btnUnirASala.innerText="Unirse a la Sala"
    btnUnirASala.setAttribute("disabled","false")
  }
  console.log("Error: "+e)
}
socket.onmessage = e=> {
  if(!recepcion.disabled){
    console.log(e.data);
    cambiarPantalla(sala,recepcion)
  }
}
socket.onclose=e=>{}

function status(response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new Error(response.statusText))
  }
}

const btnUnirASala=document.getElementById("btnUnirASala")
const nombreJugador=document.getElementById("nombreJugador")
btnUnirASala.addEventListener("click",()=>{
  //btnUnirASala.innerText="Cargango..."
  //btnUnirASala.setAttribute("disabled","true")
   /*
  fetch('https://battlecard-api.cemp2703.repl.co/api/sala/unirse', {
    mode: 'cors',
    method: 'post',
    body:{'nombreJugador':nombreJugador}
  }).then(status)
  .then(response=> response.json())
  .then(data=>{
    console.log(data)
    btnUnirASala.innerText="Unirse a la Sala"
    btnUnirASala.setAttribute("disabled","false")
    cambiarPantalla(sala,recepcion)
  })
  .catch((error)=> {
    console.log('Request failed', error);
    alert('Request failed: '+error)
    btnUnirASala.innerText="Unirse a la Sala"
    btnUnirASala.setAttribute("disabled","false")
  })
  */
 socket.send(JSON.stringify({'nombreJugador':nombreJugador}));
 
})

