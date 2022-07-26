import { cambiarPantalla } from './utils'
import { nombreJugadorVictorioso, nombreJugadorDerrotado } from './estadoGlobal'
export const btnFinDeJuego = document.getElementById('btnFinDeJuego')

export const finDeJuego = document.getElementById('finDeJuego')

btnFinDeJuego.addEventListener('click', function () {
  finDeJuego.children[0].children[1].innerText = nombreJugadorVictorioso
  finDeJuego.children[1].children[1].innerText = nombreJugadorDerrotado
  cambiarPantalla(finDeJuego)
})
