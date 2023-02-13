
const pantallas = document.querySelectorAll('body > div')

export function cambiarPantalla(pantalla: HTMLElement) {
  Array.from(pantallas).forEach((p) => {
    p.classList.remove('mostrarPantalla')
  })
  pantalla.classList.add('mostrarPantalla')
}
