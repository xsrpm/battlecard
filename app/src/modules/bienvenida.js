import { recepcion } from './recepcion'
import { cambiarPantalla } from './utils'

const btnJugar = document.getElementById('btnJugar')

btnJugar.addEventListener('click', () => {
  cambiarPantalla(recepcion)
})
