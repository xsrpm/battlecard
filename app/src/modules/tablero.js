import { zonaBatallaYo } from '..'
import { habilitacionBotonera, mensajeBotones } from './botonera'
import { setStepAccion } from './estadoGlobal'

export const Estado = {
  NO_HAY_CARTA: 'No hay carta',
  POS_BATALLA_ATAQUE: 'Posición de batalla: Ataque',
  POS_BATALLA_DEF_ARRIBA: 'Posición de batalla: Defensa cara arriba',
  POS_BATALLA_DEF_ABAJO: 'Posición de batalla: Defensa cara abajo',
  YA_ESTA_EN_POSICION_SOLICITADA: 'Ya se está en la posición solicitada',
  ATAQUE_NO_DISPONIBLE: 'Atacar carta no disponible',
  ATAQUE_DISPONIBLE: 'Atacar carta disponible',
  CAMBIO_POS_NO_DISPONIBLE: 'Cambio de posición no disponible',
  CAMBIO_POS_DISPONIBLE: 'Cambio de posición disponible'
}

export function colocarCarta() {
  habilitacionBotonera()
  mensajeBotones.innerText = 'Seleccione ubicación en zona de batalla...'
  for (const celda of zonaBatallaYo.children) {
    if (
      !celda.classList.contains('ataque') &&
        !celda.classList.contains('defensa')
    ) {
      celda.classList.add('seleccionado')
    }
  }
  setStepAccion('COLOCAR SELECCIONAR ZONA BATALLA')
}
