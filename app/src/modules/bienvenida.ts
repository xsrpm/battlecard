import { recepcion } from './recepcion'
import { cambiarPantalla } from './utils'

const btnJugar = document.getElementById('btnJugar') as HTMLButtonElement

btnJugar.addEventListener('click', () => {
  cambiarPantalla(recepcion)
})
