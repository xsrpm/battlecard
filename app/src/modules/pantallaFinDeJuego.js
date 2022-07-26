import { cambiarPantalla, bienvenida } from './utils'

const btnVolverInicio = document.getElementById('btnVolverInicio')

btnVolverInicio.addEventListener('click', function () {
  cambiarPantalla(bienvenida)
})
