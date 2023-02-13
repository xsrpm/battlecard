import { sinBarrerasFlag } from './estadoGlobal'
import { info } from '../components/info'

export const resultadoAtaque = document.querySelector('resultado-ataque') as HTMLDivElement

resultadoAtaque.addEventListener('click', () => {
  resultadoAtaque.setAttribute('mostrar', 'false')
  if (sinBarrerasFlag) {
    info.classList.add('mostrarResultado')
  }
})
