import { cambiarPantalla } from '../modules/utils'
import { bienvenida } from './bienvenida'

const btnVolverInicio = document.getElementById('btnVolverInicio') as HTMLButtonElement

btnVolverInicio.addEventListener('click', function () {
  cambiarPantalla(bienvenida)
})
