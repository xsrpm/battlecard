import { recepcion } from './recepcion'
import { cambiarPantalla } from '../modules/utils'

export const bienvenida = document.getElementById('bienvenida') as HTMLDivElement
const btnJugar = document.getElementById('btnJugar') as HTMLButtonElement

btnJugar.addEventListener('click', () => {
  cambiarPantalla(recepcion)
})
