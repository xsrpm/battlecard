import { cambiarPantalla, bienvenida } from './utils'

const btnVolverInicio = document.getElementById('btnVolverInicio') as HTMLButtonElement

btnVolverInicio.addEventListener('click', function () {
  cambiarPantalla(bienvenida)
})
