
import { btnAtacarBarrera, btnAtacarCarta, btnCambiarPosicion, btnColocarEnAtaque, btnColocarEnDefensa, btnFinDeJuego, btnTerminarTurno, habilitacionBotonera, mensajeBotones } from './botonera.js'
import { idCartaZBSeleccionada, juegoFinalizado, message, nombreJugadorDerrotado, posicionBatalla, setIdCartaZBSeleccionada, setJuegoFinalizado, setNombreJugadorDerrotado, setNombreJugadorVictorioso, setSinBarrerasFlag, setStepAccion, sinBarrerasFlag, stepAccion } from './estadoGlobal'
import { info } from './info'
import { encuentraError } from './juego'
import { resultadoAtaque } from './resultado-ataque'
import { sendMessage } from './socket'

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

let idCartaManoSeleccionada
let cartaZBSeleccionada
let cartaManoSeleccionada
let idCartaZBEnemigaSeleccionada

export const jugDown = document.getElementById('jugDown')
export const jugUp = document.getElementById('jugUp')
export const zonaBatallaEnemiga = document.getElementById('zonaBatallaEnemiga')
export const barreraEnemiga = document.getElementById('barreraEnemiga')
export const manoEnemigo = document.getElementById('manoEnemigo')
export const zonaBatallaYo = document.getElementById('zonaBatallaYo')
export const manoYo = document.getElementById('manoYo')
export const barreraYo = document.getElementById('barreraYo')

export function colocarCarta () {
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

export function mostrarJugadorEnTurno () {
  if (encuentraError()) return
  if (message.payload.jugador.enTurno) {
    jugDown.setAttribute('en-turno', 'true')
    jugUp.setAttribute('en-turno', 'false')
  } else {
    jugUp.setAttribute('en-turno', 'true')
    jugDown.setAttribute('en-turno', 'false')
  }
  jugDown.querySelector("span[slot='nCartas']").textContent =
        message.payload.jugador.nDeck
  jugUp.querySelector("span[slot='nCartas']").textContent =
        message.payload.jugadorEnemigo.nDeck
}

zonaBatallaYo.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  if (jugDown.getAttribute('en-turno') === 'false') return
  let target = e.target
  while (!target.classList.contains('slot') && target.id !== zonaBatallaYo.getAttribute('id')) target = target.parentElement
  setIdCartaZBSeleccionada(target.dataset.id)
  cartaZBSeleccionada = target
  if (stepAccion === 'COLOCAR SELECCIONAR ZONA BATALLA') {
    if (
      !(
        target.classList.contains('ataque') ||
          target.classList.contains('defensa') ||
          target.classList.contains('oculto')
      )
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log(target)
      sendMessage({
        event: 'Colocar Carta',
        payload: {
          posicion: posicionBatalla,
          idZonaBatalla: idCartaZBSeleccionada,
          idMano: idCartaManoSeleccionada
        }
      })
    }
  } else {
    if (
      target.classList.contains('ataque') ||
        target.classList.contains('defensa') ||
        target.classList.contains('oculto')
    ) {
      setStepAccion('SELECCIONAR ZONA BATALLA')
      console.log('stepAccion: ' + stepAccion)
      console.log(target)

      sendMessage({
        event: 'Seleccionar Zona Batalla',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada
        }
      })
    }
  }
})

export function standBySeleccionarZonaBatalla () {
  if (encuentraError()) return
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

export function seleccionarMano () {
  if (encuentraError()) return
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

export function mostrarCartaCogida () {
  if (encuentraError()) return
  const { carta, resultado } = message.payload
  if (resultado === 'EXITO') {
    if (typeof carta !== 'undefined') {
      manoYo.children[4].children[0].innerText = carta.valor
      manoYo.children[4].children[1].innerText = String.fromCharCode(
        carta.elemento
      )
      manoYo.children[4].classList.add('mano')
    } else {
      manoEnemigo.children[4].classList.add('oculto')
    }
  } else if (resultado === 'DECK VACIO') {
    setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
    setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
    info.children[0].innerText = `${nombreJugadorDerrotado} se ha quedado sin cartas para tomar del deck`
    btnFinDeJuego.classList.remove('ocultar')
    btnTerminarTurno.classList.add('ocultar')
    info.classList.add('mostrarResultado')
  } else {
    console.log('MANO LLENA')
  }
}

export function atacarCarta () {
  if (encuentraError()) return
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
    bonifCartaAtacada
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    resultadoAtaque.querySelector("span[slot='valor-atacante']").textContent =
        cartaAtacante.valor
    resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ).textContent = String.fromCharCode(cartaAtacante.elemento)
    resultadoAtaque.querySelector("span[slot='valor-atacado']").textContent =
        cartaAtacada.valor
    resultadoAtaque.querySelector("span[slot='elemento-atacado']").textContent =
        String.fromCharCode(cartaAtacada.elemento)
    resultadoAtaque.querySelector("span[slot='resultado']").textContent =
        veredicto
    resultadoAtaque.querySelector("span[slot='bonus-atacante']").textContent =
        '+' + bonifCartaAtacante
    resultadoAtaque.querySelector("span[slot='bonus-atacado']").textContent =
        '+' + bonifCartaAtacada
    if (estadoBarrera === 'DESTRUIDA') {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = 'Barrera destruida'
      barreraEnemiga.children[idBarreraEliminada].classList.remove('barrera')
      setSinBarrerasFlag(message.payload.sinBarreras)
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
        setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
        info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        setJuegoFinalizado(true)
      }
    } else {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerText = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerText = ''
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[0].innerText = ''
      zonaBatallaEnemiga.children[
        idCartaZBEnemigaSeleccionada
      ].children[1].innerText = ''
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
        ].children[0].innerText = cartaAtacada.valor
        zonaBatallaEnemiga.children[
          idCartaZBEnemigaSeleccionada
        ].children[1].innerText = String.fromCharCode(cartaAtacada.elemento)
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
  /**
     * @type {HTMLElement}
     */
  let target = e.target
  while (!target.classList.contains('slot')) target = target.parentElement
  idCartaManoSeleccionada = target.dataset.id
  cartaManoSeleccionada = target
  if (target.classList.contains('mano')) {
    setStepAccion('SELECCIONAR MANO')
    console.log('stepAccion: ' + stepAccion)
    console.log(target)
    sendMessage({
      event: 'Seleccionar Mano',
      payload: {
        idMano: idCartaManoSeleccionada
      }
    })
  }
})

export function colocarSeleccionarZonaBatalla () {
  if (encuentraError()) return
  if (message.payload.resultado === 'Carta colocada') {
    habilitacionBotonera()
    quitarSeleccionEnCartas()
    const manoNumeroCarta =
        manoYo.children[idCartaManoSeleccionada].children[0].innerText
    const manoElementoCarta =
        manoYo.children[idCartaManoSeleccionada].children[1].innerText
    const ULTIMA_CARTA = 4
    message.payload.mano.forEach((c, i) => {
      manoYo.children[i].children[0].innerText = c.valor
      manoYo.children[i].children[1].innerText = String.fromCharCode(c.elemento)
    })
    manoYo.children[ULTIMA_CARTA].children[0].innerText = ''
    manoYo.children[ULTIMA_CARTA].children[1].innerText = ''
    manoYo.children[ULTIMA_CARTA].classList.remove('mano')
    zonaBatallaYo.children[idCartaZBSeleccionada].children[0].innerText =
        manoNumeroCarta
    zonaBatallaYo.children[idCartaZBSeleccionada].children[1].innerText =
        manoElementoCarta
    if (posicionBatalla === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('ataque')
    } else {
      zonaBatallaYo.children[idCartaZBSeleccionada].classList.add('defensa')
    }
    setStepAccion('STAND BY')
    console.log('CARTA COLOCADA')
  }
}

export function colocaCartaOtroJugador () {
  if (encuentraError()) return
  const { posicion, idZonaBatalla, idMano, resultado, carta } = message.payload
  if (resultado === 'Carta colocada') {
    habilitacionBotonera()
    manoEnemigo.children[idMano].classList.remove('oculto')
    if (posicion === Estado.POS_BATALLA_ATAQUE) {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('ataque')
      const manoNumeroCarta = carta.valor
      const manoElementoCarta = String.fromCharCode(carta.elemento)
      zonaBatallaEnemiga.children[idZonaBatalla].children[0].innerText =
          manoNumeroCarta
      zonaBatallaEnemiga.children[idZonaBatalla].children[1].innerText =
          manoElementoCarta
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add('oculto')
    }
    setStepAccion('STAND BY')
    console.log('CARTA COLOCADA POR ENEMIGO')
  }
}

export function atacanTuCarta () {
  if (encuentraError()) return
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
    bonifCartaAtacada
  } = message.payload
  if (estadoAtaque === 'Ataque realizado') {
    resultadoAtaque.querySelector("span[slot='valor-atacante']").textContent =
        cartaAtacante.valor
    resultadoAtaque.querySelector(
      "span[slot='elemento-atacante']"
    ).textContent = String.fromCharCode(cartaAtacante.elemento)
    resultadoAtaque.querySelector("span[slot='valor-atacado']").textContent =
        cartaAtacada.valor
    resultadoAtaque.querySelector("span[slot='elemento-atacado']").textContent =
        String.fromCharCode(cartaAtacada.elemento)
    resultadoAtaque.querySelector("span[slot='resultado']").textContent =
        veredicto
    resultadoAtaque.querySelector("span[slot='bonus-atacante']").textContent =
        '+' + bonifCartaAtacante
    resultadoAtaque.querySelector("span[slot='bonus-atacado']").textContent =
        '+' + bonifCartaAtacada
    if (estadoBarrera === 'DESTRUIDA') {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = 'Barrera destruida'
      barreraYo.children[idBarreraEliminada].classList.remove('barrera')
      setSinBarrerasFlag(message.payload.sinBarreras)
      if (sinBarrerasFlag) {
        setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
        setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
        info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
        btnFinDeJuego.classList.remove('ocultar')
        btnTerminarTurno.classList.add('ocultar')
        setJuegoFinalizado(true)
      }
    } else {
      resultadoAtaque.querySelector(
        "span[slot='detalle-resultado']"
      ).textContent = ''
    }
    if (estadoCartaAtacante === 'DESTRUIDA') {
      zonaBatallaEnemiga.children[idCartaAtacante].children[0].innerText = ''
      zonaBatallaEnemiga.children[idCartaAtacante].children[1].innerText = ''
      zonaBatallaEnemiga.children[idCartaAtacante].classList.remove('ataque')
    }
    if (estadoCartaAtacada === 'DESTRUIDA') {
      zonaBatallaYo.children[idCartaAtacada].children[0].innerText = ''
      zonaBatallaYo.children[idCartaAtacada].children[1].innerText = ''
      zonaBatallaYo.children[idCartaAtacada].classList.remove(
        'ataque',
        'defensa',
        'oculto'
      )
    }
    resultadoAtaque.setAttribute('mostrar', 'true')
  }
}

export function atacarBarrera () {
  if (encuentraError()) return
  const { resultado, idBarreraEliminada } = message.payload
  if (resultado === 'Barrera destruida') {
    barreraEnemiga.children[idBarreraEliminada].classList.remove('barrera')
    setSinBarrerasFlag(message.payload.sinBarreras)
    habilitacionBotonera()
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
      setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
      info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      setJuegoFinalizado(true)
    } else {
      info.children[0].innerText = 'Barrera destruida'
    }
    zonaBatallaYo.children[idCartaZBSeleccionada].classList.remove(
      'seleccionado'
    )
    info.classList.add('mostrarResultado')
  }
}

export function atacanTuBarrera () {
  if (encuentraError()) return
  const { resultado, idBarreraEliminada } = message.payload
  if (resultado === 'Barrera destruida') {
    barreraYo.children[idBarreraEliminada].classList.remove('barrera')
    setSinBarrerasFlag(message.payload.sinBarreras)
    if (sinBarrerasFlag) {
      setNombreJugadorDerrotado(message.payload.nombreJugadorDerrotado)
      setNombreJugadorVictorioso(message.payload.nombreJugadorVictorioso)
      info.children[0].innerText = `${nombreJugadorDerrotado} se ha queda sin barreras`
      btnFinDeJuego.classList.remove('ocultar')
      btnTerminarTurno.classList.add('ocultar')
      setJuegoFinalizado(true)
    } else {
      info.children[0].innerText = 'Barrera destruida'
    }
    info.classList.add('mostrarResultado')
  }
}

zonaBatallaEnemiga.addEventListener('click', function (e) {
  if (juegoFinalizado) return
  let target = e.target
  while (!target.classList.contains('slot') && target.id !== zonaBatallaEnemiga.getAttribute('id')) target = target.parentElement
  if (stepAccion === 'ATACAR CARTA SELECCIONAR ZB ENEMIGA') {
    if (
      target.classList.contains('ataque') ||
        target.classList.contains('defensa') ||
        target.classList.contains('oculto')
    ) {
      console.log('stepAccion: ' + stepAccion)
      console.log('target: ' + target)
      idCartaZBEnemigaSeleccionada = target.dataset.id
      sendMessage({
        event: 'Atacar Carta',
        payload: {
          idZonaBatalla: idCartaZBSeleccionada,
          idZonaBatallaEnemiga: idCartaZBEnemigaSeleccionada
        }
      })
    }
  }
})

export function cambiarPosicion () {
  if (encuentraError()) return
  const { respuesta, posBatalla } = message.payload
  if (stepAccion !== 'CAMBIAR POSICION') {
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

export function cambiaPosicionEnemigo () {
  if (encuentraError()) return
  const { respuesta, posBatalla, idZonaBatalla, carta } = message.payload
  if (respuesta === 'Posicion cambiada') {
    zonaBatallaEnemiga.children[idZonaBatalla].children[0].innerText =
        carta.valor
    zonaBatallaEnemiga.children[idZonaBatalla].children[1].innerText =
        String.fromCharCode(carta.elemento)
    if (posBatalla === 'Posición de batalla: Ataque') {
      zonaBatallaEnemiga.children[idZonaBatalla].className = 'slot ataque'
    } else {
      zonaBatallaEnemiga.children[idZonaBatalla].className = 'slot defensa'
    }
  }
}
