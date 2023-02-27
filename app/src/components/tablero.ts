import { ColocarCartaResponse, ColocarCartaOtroJugadorResponse, SeleccionarZonaBatallaResponse, SeleccionarManoResponse, AtacarCartaResponse, AtacarBarreraResponse, CambiarPosicionResponse, TerminarTurnoResponse } from '../../../api/src/response'
import { Carta } from '../../../api/src/types'
import { btnAtacarBarrera, btnAtacarCarta, btnCambiarPosicion, btnColocarEnAtaque, btnColocarEnDefensa, btnFinDeJuego, btnTerminarTurno, habilitacionBotonera, mensajeBotones } from './botonera'
import { idCartaZBSeleccionada, juegoFinalizado, posicionBatalla, setIdCartaZBSeleccionada, setJuegoFinalizado, setNombreJugadorDerrotado, setNombreJugadorVictorioso, setSinBarrerasFlag, setStepAccion, sinBarrerasFlag, stepAccion } from '../modules/estadoGlobal'
import { info } from './info'
import { resultadoAtaque } from './resultado-ataque2'
import { encuentraError } from '../modules/socket'
import { atacarCarta, colocarCartaEnZonaBatallaDesdeMano, seleccionarCeldaEnZonaBatalla, seleccionarMano } from '../modules/socket-messages'
import { STEP_ACTION } from '../constants/stepAction'

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

let idCartaManoSeleccionada: number
let cartaZBSeleccionada: HTMLElement
let cartaManoSeleccionada: HTMLElement
let idCartaZBEnemigaSeleccionada: number

export const jugDown = document.getElementById('jugDown') as HTMLDivElement
export const jugUp = document.getElementById('jugUp') as HTMLElement
export const zonaBatallaEnemiga = document.getElementById('zonaBatallaEnemiga') as HTMLDivElement
export const barreraEnemiga = document.getElementById('barreraEnemiga') as HTMLDivElement
export const manoEnemigo = document.getElementById('manoEnemigo') as HTMLDivElement
export const zonaBatallaYo = document.getElementById('zonaBatallaYo') as HTMLDivElement
export const manoYo = document.getElementById('manoYo') as HTMLDivElement
export const barreraYo = document.getElementById('barreraYo') as HTMLDivElement

export function colocarCarta () {
  habilitacionBotonera()
  mensajeBotones.innerText = 'Seleccione ubicación en zona de batalla...'
  for (const celda of zonaBatallaYo.children) {
    if (
      !(celda as HTMLDivElement).classList.contains('ataque') &&
        !(celda as HTMLDivElement).classList.contains('defensa')
    ) {
      celda.classList.add('seleccionado')
    }
  }
  setStepAccion(STEP_ACTION.COLOCAR_SELECCIONAR_ZONA_BATALLA)
}

export function mostrarJugadorEnTurno (message: TerminarTurnoResponse) {
  const { jugador, jugadorEnemigo } = message.payload
  if (jugador.enTurno) {
    jugDown.setAttribute('en-turno', 'true')
    jugUp.setAttribute('en-turno', 'false')
  } else {
    jugUp.setAttribute('en-turno', 'true')
    jugDown.setAttribute('en-turno', 'false')
  }
  (jugDown.querySelector("span[slot='nCartas']") as HTMLHeadingElement).textContent =
        jugador.nDeck.toString();
  (jugUp.querySelector("span[slot='nCartas']") as HTMLHeadingElement).textContent =
        jugadorEnemigo.nDeck.toString()
}

zonaBatallaYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugDown.getAttribute('en-turno') === 'false') return
  let target = e.target as HTMLElement
  while (!target.classList.contains('slot') && target.id !== zonaBatallaYo.getAttribute('id')) target = target.parentElement as HTMLElement
  setIdCartaZBSeleccionada(Number(target.dataset.id))
  cartaZBSeleccionada = target
  if (stepAccion === STEP_ACTION.COLOCAR_SELECCIONAR_ZONA_BATALLA) {
    if (
      !(
        target.classList.contains('ataque') ||
          target.classList.contains('defensa') ||
          target.classList.contains('oculto')
      )
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log(target)
      colocarCartaEnZonaBatallaDesdeMano(idCartaManoSeleccionada)
    }
  } else {
    if (
      target.classList.contains('ataque') ||
        target.classList.contains('defensa') ||
        target.classList.contains('oculto')
    ) {
      setStepAccion(STEP_ACTION.SELECCIONAR_ZONA_BATALLA)
      console.log('stepAccion: ' + stepAccion)
      console.log(target)
      seleccionarCeldaEnZonaBatalla()
    }
  }
})

export function seleccionarZonaBatallaResponse (message: SeleccionarZonaBatallaResponse) {
  if (encuentraError(message)) return
  const {
    existeCarta,
    puedeAtacarCarta,
    puedeAtacarBarrera,
    puedeCambiarPosicion
  } = message.payload
  if (existeCarta) {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    cartaZBSeleccionada.classList.add('seleccionado')
    if (
      puedeAtacarCarta === 'Posible' ||
        puedeAtacarBarrera === 'Posible' ||
        puedeCambiarPosicion === 'Posible'
    ) {
      mensajeBotones.innerText = 'Seleccione acción'
    } else mensajeBotones.innerText = 'No acciones disponibles'
    if (puedeAtacarCarta === 'Posible') {
      btnAtacarCarta.classList.remove('ocultar')
    }
    if (puedeAtacarBarrera === 'Posible') {
      btnAtacarBarrera.classList.remove('ocultar')
    }
    if (puedeCambiarPosicion === 'Posible') {
      btnCambiarPosicion.classList.remove('ocultar')
    }
  }
}

export function quitarSeleccionEnCartas () {
  Array.from(manoYo.children).forEach((e) => e.classList.remove('seleccionado'))
  Array.from(zonaBatallaYo.children).forEach((e) =>
    e.classList.remove('seleccionado')
  )
}

export function seleccionarManoResponse (message: SeleccionarManoResponse) {
  if (encuentraError(message)) return
  const { existeCarta, puedeColocarCarta } = message.payload
  if (existeCarta) {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    cartaManoSeleccionada.classList.add('seleccionado')
    if (puedeColocarCarta === 'Posible') {
      btnColocarEnAtaque.classList.remove('ocultar')
      btnColocarEnDefensa.classList.remove('ocultar')
      mensajeBotones.innerText = 'Colocar carta en posición...'
    } else {
      mensajeBotones.innerText = puedeColocarCarta
    }
  }
}

export function mostrarCartaCogida (message: TerminarTurnoResponse) {
  if (encuentraError(message)) return
  const { carta, resultado, nombreJugadorDerrotado, nombreJugadorVictorioso } = message.payload
  if (resultado === 'EXITO') {
    if (typeof carta !== 'undefined') {
      manoYo.children[4].children[0].innerHTML = carta.valor.toString()
      manoYo.children[4].children[1].innerHTML = String.fromCharCode(
        carta.elemento as any
      )
      manoYo.children[4].classList.add('mano')
    } else {
      manoEnemigo.children[4].classList.add('oculto')
    }
  } else if (resultado === 'DECK VACIO') {
    setNombreJugadorDerrotado(nombreJugadorDerrotado as string)
    setNombreJugadorVictorioso(nombreJugadorVictorioso as string)
    info.children[0].innerHTML = `${nombreJugadorDerrotado as string} se ha quedado sin cartas para tomar del deck`
    btnFinDeJuego.classList.remove('ocultar')
    btnTerminarTurno.classList.add('ocultar')
    info.classList.add('mostrarResultado')
  } else {
    console.log('MANO LLENA')
  }
}

export function atacarCartaResponse (message: AtacarCartaResponse) {
  if (encuentraError(message)) return
  const {
    estadoAtaque,
    cartaAtacante,
    cartaAtacada,
    veredicto,
    estadoCartaAtacante,
    estadoCartaAtacada,
    estadoBarrera,
    idBarreraEliminada,
    bonifCartaAtacante,
    bonifCartaAtacada,
    sinBarreras,
    nombreJugadorDerrotado,
    nombreJugadorVictorioso
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    (resultadoAtaque.querySelector("span[slot='valor-atacante']") as HTMLSpanElement).textContent = (cartaAtacante as Carta).valor.toString();
    (resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ) as HTMLSpanElement).textContent = String.fromCharCode(cartaAtacante?.elemento as any);
    (resultadoAtaque.querySelector("span[slot='valor-atacado']") as HTMLSpanElement).textContent =
        (cartaAtacada as Carta).valor.toString();
    (resultadoAtaque.querySelector("span[slot='elemento-atacado']") as HTMLSpanElement).textContent =
        String.fromCharCode(cartaAtacada?.elemento as any);
    (resultadoAtaque.querySelector("span[slot='resultado']") as HTMLSpanElement).textContent =
        veredicto as string;
    (resultadoAtaque.querySelector("span[slot='bonus-atacante']") as HTMLSpanElement).textContent =
        `+${(bonifCartaAtacante as number).toString()}`;
    (resultadoAtaque.querySelector("span[slot='bonus-atacado']") as HTMLSpanElement).textContent =
        `+${(bonifCartaAtacada as number).toString()}`
    if (estadoBarrera === 'DESTRUIDA') {
      (resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ) as HTMLSpanElement).textContent = 'Barrera destruida'
      barreraEnemiga.children[idBarreraEliminada as number].classList.remove('barrera')
      setSinBarrerasFlag(sinBarreras as boolean)
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(nombreJugadorDerrotado as string)
        setNombreJugadorVictorioso(nombreJugadorVictorioso as string)
        info.children[0].innerHTML = `${nombreJugadorDerrotado as string} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        setJuegoFinalizado(true)
      }
    } else {
      (resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ) as HTMLSpanElement).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerHTML = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerHTML = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[0].innerHTML = ''
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[1].innerHTML = ''
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].classList.remove('ataque', 'defensa', 'oculto')
    } else {
      if (
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].classList.contains('oculto')
      ) {
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].classList.remove('oculto')
        zonaBatallaEnemiga.children[idCartaZBEnemigaSeleccionada].classList.add(
          'defensa'
        )
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].children[0].innerHTML = (cartaAtacada as Carta).valor.toString()
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].children[1].innerHTML = String.fromCharCode(cartaAtacada?.elemento as any)
      }
    }
    zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove(
      'seleccionado'
    )
    mensajeBotones.innerText = ''
    resultadoAtaque.setAttribute('mostrar', 'true')
  }
}

manoYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugDown.getAttribute('en-turno') === 'false') return
  let target = e.target as HTMLElement
  while (!target.classList.contains('slot')) target = target.parentElement as HTMLElement
  idCartaManoSeleccionada = Number(target.dataset.id)
  cartaManoSeleccionada = target
  if (target.classList.contains('mano')) {
    setStepAccion(STEP_ACTION.SELECCIONAR_MANO)
    console.log('stepAccion: ' + stepAccion)
    console.log(target)
    seleccionarMano(idCartaManoSeleccionada)
  }
})

export function colocarCartaResponse (message: ColocarCartaResponse) {
  if (encuentraError(message)) return
  const { resultado, mano } = message.payload
  if (resultado === 'Carta colocada') {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    const manoNumeroCarta =
        manoYo.children[idCartaManoSeleccionada].children[0].innerHTML
    const manoElementoCarta =
        manoYo.children[idCartaManoSeleccionada].children[1].innerHTML
    const ULTIMA_CARTA = 4
    mano.forEach((c: Carta, i: number) => {
      manoYo.children[i].children[0].innerHTML = c.valor.toString()
      manoYo.children[i].children[1].innerHTML = String.fromCharCode(c.elemento as any)
    })
    manoYo.children[ULTIMA_CARTA].children[0].innerHTML = ''
    manoYo.children[ULTIMA_CARTA].children[1].innerHTML = ''
    manoYo.children[ULTIMA_CARTA].classList.remove('mano')
    zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerHTML =
        manoNumeroCarta
    zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerHTML =
        manoElementoCarta
    if (posicionBatalla === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('ataque')
    } else {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('defensa')
    }
    setStepAccion(STEP_ACTION.STAND_BY)
    console.log('CARTA COLOCADA')
  }
}

export function colocaCartaOtroJugadorResponse (message: ColocarCartaOtroJugadorResponse) {
  if (encuentraError(message)) return

  const { posicion, idZonaBatalla, idMano, resultado, carta } = message.payload
  if (resultado === 'Carta colocada') {
    habilitacionBotonera()
    manoEnemigo.children[idMano].classList.remove('oculto')
    if (posicion === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('ataque')
      zonaBatallaEnemiga.children[idZonaBatalla].children[0].innerHTML = carta.valor.toString()
      zonaBatallaEnemiga.children[idZonaBatalla].children[1].innerHTML = String.fromCharCode(carta.elemento as any)
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('oculto')
    }
    setStepAccion(STEP_ACTION.STAND_BY)
    console.log('CARTA COLOCADA POR ENEMIGO')
  }
}

export function atacanTuCartaResponse (message: AtacarCartaResponse) {
  if (encuentraError(message)) return
  const {
    estadoAtaque,
    cartaAtacante,
    cartaAtacada,
    veredicto,
    estadoCartaAtacante,
    estadoCartaAtacada,
    estadoBarrera,
    idBarreraEliminada,
    idCartaAtacante,
    idCartaAtacada,
    bonifCartaAtacante,
    bonifCartaAtacada,
    sinBarreras,
    nombreJugadorDerrotado,
    nombreJugadorVictorioso
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    (resultadoAtaque.querySelector("span[slot='valor-atacante']") as HTMLSpanElement).textContent =
        (cartaAtacante as Carta).valor.toString();
    (resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ) as HTMLSpanElement).textContent = String.fromCharCode(cartaAtacante?.elemento as any);
    (resultadoAtaque.querySelector("span[slot='valor-atacado']") as HTMLSpanElement).textContent =
        (cartaAtacada as Carta).valor.toString();
    (resultadoAtaque.querySelector("span[slot='elemento-atacado']") as HTMLSpanElement).textContent =
        String.fromCharCode(cartaAtacada?.elemento as any);
    (resultadoAtaque.querySelector("span[slot='resultado']") as HTMLSpanElement).textContent =
        veredicto as string;
    (resultadoAtaque.querySelector("span[slot='bonus-atacante']") as HTMLSpanElement).textContent =
        `+${(bonifCartaAtacante as number).toString()}`;
    (resultadoAtaque.querySelector("span[slot='bonus-atacado']") as HTMLDivElement).textContent = `+${(bonifCartaAtacada as number).toString()}`
    if (estadoBarrera === 'DESTRUIDA') {
      (resultadoAtaque.querySelector("span[slot='detalle-resultado']") as HTMLDivElement).textContent = 'Barrera destruida'
      barreraYo.children[idBarreraEliminada as number].classList.remove('barrera')
      setSinBarrerasFlag(sinBarreras as boolean)
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(nombreJugadorDerrotado as string)
        setNombreJugadorVictorioso(nombreJugadorVictorioso as string)
        info.children[0].innerHTML = `${nombreJugadorDerrotado as string} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        setJuegoFinalizado(true)
      }
    } else {
      (resultadoAtaque.querySelector("span[slot='detalle-resultado']") as HTMLDivElement).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[idCartaAtacante as number].children[0].innerHTML = ''
      zonaBatallaEnemiga.children[idCartaAtacante as number].children[1].innerHTML = ''
      zonaBatallaEnemiga.children[idCartaAtacante as number].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaAtacada as number].children[0].innerHTML = ''
      zonaBatallaYo.children[idCartaAtacada as number].children[1].innerHTML = ''
      zonaBatallaYo.children[idCartaAtacada as number].classList.remove(
        'ataque',
        'defensa',
        'oculto'
      )
    }
    resultadoAtaque.setAttribute('mostrar', 'true')
  }
}

export function atacarBarreraResponse (message: AtacarBarreraResponse) {
  if (encuentraError(message)) return
  const { resultado, idBarreraEliminada, nombreJugadorDerrotado, nombreJugadorVictorioso, sinBarreras } = message.payload
  if (resultado === 'Barrera destruida' && idBarreraEliminada != null && sinBarreras != null && nombreJugadorDerrotado != null && nombreJugadorVictorioso != null) {
    barreraEnemiga.children[idBarreraEliminada].classList.remove('barrera')
    setSinBarrerasFlag(sinBarreras)
    habilitacionBotonera()
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(nombreJugadorDerrotado)
      setNombreJugadorVictorioso(nombreJugadorVictorioso)
      info.children[0].innerHTML = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      setJuegoFinalizado(true)
    } else {
      info.children[0].innerHTML = 'Barrera destruida'
    }
    zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove(
      'seleccionado'
    )
    info.classList.add('mostrarResultado')
  }
}

export function atacanTuBarreraResponse (message: AtacarBarreraResponse) {
  if (encuentraError(message)) return
  const { resultado, idBarreraEliminada, sinBarreras, nombreJugadorDerrotado, nombreJugadorVictorioso } = message.payload
  if (resultado === 'Barrera destruida' && idBarreraEliminada != null && sinBarreras != null && nombreJugadorDerrotado != null && nombreJugadorVictorioso != null) {
    barreraYo.children[idBarreraEliminada].classList.remove('barrera')
    setSinBarrerasFlag(sinBarreras)
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(nombreJugadorDerrotado)
      setNombreJugadorVictorioso(nombreJugadorVictorioso)
      info.children[0].innerHTML = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      setJuegoFinalizado(true)
    } else {
      info.children[0].innerHTML = 'Barrera destruida'
    }
    info.classList.add('mostrarResultado')
  }
}

zonaBatallaEnemiga.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  let target = e.target as HTMLElement
  while (!target.classList.contains('slot') && target.id !== zonaBatallaEnemiga.getAttribute('id')) target = (target.parentElement as HTMLElement)
  if (stepAccion === STEP_ACTION.ATACAR_CARTA_SELECCIONAR_ZB_ENEMIGA) {
    if (
      target.classList.contains('ataque') ||
      target.classList.contains('defensa') ||
      target.classList.contains('oculto')
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log('target: ', target)
      idCartaZBEnemigaSeleccionada = Number(target.dataset.id)
      atacarCarta(idCartaZBEnemigaSeleccionada)
    }
  }
})

export function cambiarPosicionResponse (message: CambiarPosicionResponse) {
  if (encuentraError(message)) return
  const { respuesta, posBatalla } = message.payload
  if (stepAccion !== STEP_ACTION.CAMBIAR_POSICION) {
    return
  }
  if (respuesta === 'Posicion cambiada') {
    if (posBatalla === 'Posición de batalla: Ataque') {
      zonaBatallaYo.children[idCartaZBSeleccionada].className = 'slot ataque'
    } else {
      zonaBatallaYo.children[idCartaZBSeleccionada].className = 'slot defensa'
    }
  }
}

export function cambiaPosicionEnemigoResponse (message: CambiarPosicionResponse) {
  if (encuentraError(message)) return
  const { respuesta, posBatalla, idZonaBatalla, carta } = message.payload
  if (respuesta === 'Posicion cambiada') {
    zonaBatallaEnemiga.children[idZonaBatalla as number].children[0].innerHTML =
        (carta as Carta).valor.toString()
    zonaBatallaEnemiga.children[idZonaBatalla as number].children[1].innerHTML =
        String.fromCharCode((carta as Carta).elemento as any)
    if (posBatalla === 'Posición de batalla: Ataque') {
      zonaBatallaEnemiga.children[idZonaBatalla as number].className = 'slot ataque'
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla as number].className = 'slot defensa'
    }
  }
}
