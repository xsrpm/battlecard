const bienvenida=document.getElementById("bienvenida")
const sala=document.getElementById("sala")
function cambiarPantalla(nueva,actual){
  nueva.classList.toggle("ocultar")
  actual.classList.toggle("ocultar")
}
const btnJugar = document.getElementById("btnJugar")
btnJugar.addEventListener("click",()=>{
  cambiarPantalla(bienvenida,sala)
})