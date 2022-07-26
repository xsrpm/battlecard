
const pantallas = document.querySelectorAll('body > div')
export const bienvenida = document.getElementById('bienvenida')

/**
 *
 * @param {HTMLElement} pantalla
 */
export function cambiarPantalla(pantalla) {
  Array.from(pantallas).forEach((p) => {
    p.classList.remove('mostrarPantalla')
  })
  pantalla.classList.add('mostrarPantalla')
}
