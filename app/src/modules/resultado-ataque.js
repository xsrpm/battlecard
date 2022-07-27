import { sinBarrerasFlag } from './estadoGlobal'
import { info } from './info'

export const resultadoAtaque = document.querySelector('resultado-ataque')

resultadoAtaque.addEventListener('click', () => {
  resultadoAtaque.setAttribute('mostrar', 'false')
  if (sinBarrerasFlag) {
    info.classList.add('mostrarResultado')
  }
})
