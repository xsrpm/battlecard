import { nombreJugadorDerrotado, nombreJugadorVictorioso } from '../modules/estadoGlobal'
import { cambiarPantalla } from '../modules/utils'
import { bienvenida } from './bienvenida'

const btnVolverInicio = document.getElementById('btnVolverInicio') as HTMLButtonElement
export const finDeJuego = document.getElementById('finDeJuego') as HTMLDivElement

btnVolverInicio.addEventListener('click', function () {
  cambiarPantalla(bienvenida)
})

export function terminarJuego() {
  finDeJuego.children[0].children[1].innerHTML = nombreJugadorVictorioso
  finDeJuego.children[1].children[1].innerHTML = nombreJugadorDerrotado
  cambiarPantalla(finDeJuego)
}
