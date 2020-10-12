const bienvenida=document.querySelector(".bienvenida")
const recepcion=document.querySelector(".recepcion")
const sala=document.querySelector(".sala")
function cambiarPantalla(nueva,actual){
  actual.classList.toggle("oculto")
  nueva.classList.toggle("oculto")
}
const btnJugar = document.getElementById("btnJugar")
btnJugar.addEventListener("click",()=>{
  cambiarPantalla(recepcion,bienvenida)
})
const btnUnirASala=document.getElementById("btnUnirASala")
btnUnirASala.addEventListener("click",()=>{
  cambiarPantalla(sala,recepcion)
})