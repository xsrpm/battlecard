// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../src/script.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//VIsual Aplicación y juego
var pantallas = document.querySelectorAll("body > div");
var bienvenida = document.querySelector(".bienvenida");
var recepcion = document.querySelector(".recepcion");
var sala = document.querySelector(".sala");
var juego = document.querySelector(".juego");
var h2 = sala.getElementsByTagName("h2");
var inNombreJugador = document.getElementById("inNombreJugador");
var btnUnirASala = document.getElementById("btnUnirASala");
var btnJugar = document.getElementById("btnJugar");
var btnIniciarJuego = document.getElementById("btnIniciarJuego");
var mensajeBotones = document.getElementById("mensajeBotones");
var btnColocarEnAtaque = document.getElementById("btnColocarEnAtaque");
var btnColocarEnDefensa = document.getElementById("btnColocarEnDefensa");
var btnAtacarCarta = document.getElementById("btnAtacarCarta");
var btnAtacarBarrera = document.getElementById("btnAtacarBarrera");
var btnCambiarPosicion = document.getElementById("btnCambiarPosicion");
var btnCancelar = document.getElementById("btnCancelar");
var btnTerminarTurno = document.getElementById("btnTerminarTurno");
var resultadoAtaque = document.querySelector(".resultadoAtaque");
var manoEnemigo = document.getElementById("manoEnemigo");
var manoYo = document.getElementById("manoYo");
var zonaBatallaYo = document.getElementById("zonaBatallaYo");
var zonaBatallaEnemiga = document.getElementById("zonaBatallaEnemiga");
var barreraYo = document.getElementById("barreraYo");
var barreraEnemiga = document.getElementById("barreraEnemiga");
var jugYo = document.getElementById("jugYo");
var jugEnemigo = document.getElementById("jugEnemigo");
console.log(location.host);
var url = "".concat("ws://localhost:8080", "/ws");
var socket;
var idCartaManoSeleccionada;
var idCartaZBSeleccionada;
var idCartaZBEnemigaSeleccionada;
var cartaManoSeleccionada;
var cartaZBSeleccionana;
var cartaZBEnemigaSeleccionada;
var stepAccion = "STAND BY";
var posicionBatalla;
var message; //Visual Life Cicle (App)

/**
 *
 * @param {HTMLElement} pantalla
 */

function cambiarPantalla(pantalla) {
  Array.from(pantallas).forEach(function (p) {
    p.classList.remove("mostrarPantalla");
  });
  pantalla.classList.add("mostrarPantalla");
} //Visual Juego


function mostrarEnTurno(objData) {
  if (encuentraError(objData)) return;
  jugEnemigo.classList.remove("jugEnTurno");
  jugEnemigo.classList.remove("jugEnEspera");
  jugYo.classList.remove("jugEnTurno");
  jugYo.classList.remove("jugEnEspera");

  if (objData.payload.jugador.enTurno) {
    jugYo.classList.add("jugEnTurno");
    jugEnemigo.classList.add("jugEnEspera");
  } else {
    jugYo.classList.add("jugEnEspera");
    jugEnemigo.classList.add("jugEnTurno");
  }
}

function iniciarTablero(objData) {
  if (encuentraError(objData)) return;

  for (var i = 0; i < objData.payload.jugador.nBarrera; i++) {
    barreraYo.children[i].classList.add("barrera");
  }

  jugYo.children[0].innerText = objData.payload.jugador.nombre;
  jugYo.children[1].children[0].innerText = objData.payload.jugador.nDeck;
  objData.payload.jugador.mano.forEach(function (c, i) {
    manoYo.children[i].classList.add("mano");
    manoYo.children[i].children[0].children[0].innerText = c.valor;
    manoYo.children[i].children[0].children[1].innerText = String.fromCharCode(c.elemento);
  });

  for (var _i = 0; _i < objData.payload.jugadorEnemigo.nBarrera; _i++) {
    barreraEnemiga.children[_i].classList.add("barrera");
  }

  jugEnemigo.children[0].innerText = objData.payload.jugadorEnemigo.nombre;
  jugEnemigo.children[1].children[0].innerText = objData.payload.jugadorEnemigo.nDeck;
}

function encuentraError(objData) {
  if (typeof objData.error !== "undefined") {
    console.log(objData.error);
    alert(objData.error);
    return true;
  }
}

function unirASala(objData) {
  if (encuentraError(objData)) return;

  for (var i = 0; i < objData.payload.jugadores.length; i++) {
    h2[i].innerText = objData.payload.jugadores[i];
  }

  objData.payload.iniciar === true ? btnIniciarJuego.disabled = false : "";
  cambiarPantalla(sala);
}

function iniciarJuego(objData) {
  if (encuentraError(objData)) return;
  mostrarEnTurno(objData);
  iniciarTablero(objData);
  cambiarPantalla(juego);
}

function ocultarBotones() {
  btnColocarEnAtaque.classList.add("ocultar");
  btnColocarEnDefensa.classList.add("ocultar");
  btnAtacarCarta.classList.add("ocultar");
  btnAtacarBarrera.classList.add("ocultar");
  btnCambiarPosicion.classList.add("ocultar");
  btnCancelar.classList.add("ocultar"); //btnTerminarTurno.classList.add("ocultar");
}

function sendMessage(message) {
  socket.send(JSON.stringify(message));
  console.log("sended:");
  console.log(message);
}

function colocarCarta() {
  ocultarBotones();
  mensajeBotones.innerText = "Seleccione ubicación en zona de batalla...";

  var _iterator = _createForOfIteratorHelper(zonaBatallaYo.children),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var celda = _step.value;

      if (!celda.classList.contains("ataque") && !celda.classList.contains("defensa")) {
        celda.classList.add("disponible");
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  stepAccion = "COLOCAR SELECCIONAR ZONA BATALLA";
  console.log(stepAccion);
}

function terminarTurno(objData) {
  if (encuentraError(objData)) return;
  mostrarEnTurno(objData);
}

btnJugar.addEventListener("click", function () {
  cambiarPantalla(recepcion);
});
btnUnirASala.addEventListener("click", function () {
  socket = new WebSocket(url);

  socket.onopen = function (e) {
    message = {
      event: "Unir a sala",
      payload: {
        nombreJugador: inNombreJugador.value
      }
    };
    sendMessage(message);
  };

  socket.onmessage = function (e) {
    console.log("received:");
    var objData = JSON.parse(e.data);
    console.log(objData);

    switch (objData.event) {
      case "Unir a sala":
        unirASala(objData);
        break;

      case "Iniciar juego":
        iniciarJuego(objData);
        break;

      case "Colocar Carta":
        colocarSeleccionarZonaBatalla(objData);
        break;

      case "Colocar Carta Enemigo":
        colocarSeleccionarZonaBatallaEnemigo(objData);
        break;

      case "Seleccionar Zona Batalla":
        standBySeleccionarZonaBatalla(objData);
        break;

      case "Terminar Turno":
        terminarTurno(objData);
        break;
    }
  };

  socket.onerror = function (e) {
    if (recepcion.classList.contains("mostrarPantalla")) {
      btnUnirASala.innerText = "Unirse a la Sala";
      btnUnirASala.setAttribute("disabled", "false");
    }

    console.log("Error: " + e);
  };

  socket.onclose = function (e) {
    console.log("close ws" + e);
  };
});
btnIniciarJuego.addEventListener("click", function () {
  message = {
    event: "Iniciar juego"
  };
  sendMessage(message);
});
resultadoAtaque.addEventListener("click", function () {
  resultadoAtaque.classList.remove("mostrarResultado");
});
btnColocarEnAtaque.addEventListener("click", function () {
  if (stepAccion === "STAND BY") {
    posicionBatalla = "ATAQUE";
    console.log(posicionBatalla);
    stepAccion = "COLOCAR CARTA";
    colocarCarta();
  }
});
btnColocarEnDefensa.addEventListener("click", function () {
  if (stepAccion === "STAND BY") {
    posicionBatalla = "DEFENSA";
    console.log(posicionBatalla);
    stepAccion = "COLOCAR CARTA";
    colocarCarta();
  }
});
btnAtacarCarta.addEventListener("click", function () {
  stepAccion = "ATACAR CARTA";
  ocultarBotones();
  mensajeBotones.innerText = "Seleccione objetivo...";
});
btnCambiarPosicion.addEventListener("click", function () {});
btnCancelar.addEventListener("click", function () {});
btnTerminarTurno.addEventListener("click", function () {
  message = {
    event: "Terminar Turno"
  };
  sendMessage(message);
});
manoYo.addEventListener("click", function (e) {
  /**
   * @type {HTMLElement}
   */
  var target = e.target;

  while (!target.classList.contains("slot")) {
    target = target.parentElement;
  }

  console.log(target);

  if (target.classList.contains("mano")) {
    ocultarBotones();
    Array.from(manoYo.children).forEach(function (e) {
      return e.classList.remove("seleccionado");
    });
    btnColocarEnAtaque.classList.remove("ocultar");
    btnColocarEnDefensa.classList.remove("ocultar");
    mensajeBotones.innerText = "Colocar carta en posición...";
    target.classList.add("seleccionado");
    idCartaManoSeleccionada = target.dataset.id;
  }
});
/**
 *
 * @param {*} data
 */

function colocarSeleccionarZonaBatalla(data) {
  if (encuentraError(data)) return;

  if (data.payload.respuesta === "Carta colocada") {
    ocultarBotones();
    Array.from(manoYo.children).forEach(function (e) {
      return e.classList.remove("seleccionado");
    });
    Array.from(zonaBatallaYo.children).forEach(function (e) {
      return e.classList.remove("disponible");
    });
    mensajeBotones.innerText = "";
    var manoNumeroCarta = manoYo.children[idCartaManoSeleccionada].children[0].children[0].innerText;
    var manoElementoCarta = manoYo.children[idCartaManoSeleccionada].children[0].children[1].innerText;
    manoYo.children[idCartaManoSeleccionada].children[0].children[0].innerText = "";
    manoYo.children[idCartaManoSeleccionada].children[0].children[1].innerText = "";
    manoYo.children[idCartaManoSeleccionada].classList.remove("mano");
    zonaBatallaYo.children[idCartaZBSeleccionada].children[0].children[0].innerText = manoNumeroCarta;
    zonaBatallaYo.children[idCartaZBSeleccionada].children[0].children[1].innerText = manoElementoCarta;
    if (posicionBatalla === "ATAQUE") zonaBatallaYo.children[idCartaZBSeleccionada].classList.add("ataque");else zonaBatallaYo.children[idCartaZBSeleccionada].classList.add("defensa");
    stepAccion = "STAND BY";
    console.log(stepAccion);
  }
}

function colocarSeleccionarZonaBatallaEnemigo(message) {
  if (encuentraError(message)) return;
  var _message$payload = message.payload,
      posicion = _message$payload.posicion,
      idZonaBatalla = _message$payload.idZonaBatalla,
      idMano = _message$payload.idMano,
      respuesta = _message$payload.respuesta,
      carta = _message$payload.carta;

  if (respuesta === "Carta colocada") {
    ocultarBotones();
    manoEnemigo.children[idMano].classList.remove("oculto");

    if (posicion === "ATAQUE") {
      zonaBatallaEnemiga.children[idZonaBatalla].classList.add("ataque");
      var manoNumeroCarta = carta.valor;
      var manoElementoCarta = String.fromCharCode(carta.elemento);
      zonaBatallaEnemiga.children[idZonaBatalla].children[0].children[0].innerText = manoNumeroCarta;
      zonaBatallaEnemiga.children[idZonaBatalla].children[0].children[1].innerText = manoElementoCarta;
    } else zonaBatallaEnemiga.children[idZonaBatalla].classList.add("oculto");

    stepAccion = "STAND BY";
    console.log(stepAccion);
  }
}

function standBySeleccionarZonaBatalla(message) {
  if (encuentraError(message)) return;
  var _message$payload2 = message.payload,
      existeCarta = _message$payload2.existeCarta,
      puedeAtacarCarta = _message$payload2.puedeAtacarCarta,
      puedeAtacarBarrera = _message$payload2.puedeAtacarBarrera,
      puedeCambiarPosicion = _message$payload2.puedeCambiarPosicion;

  if (existeCarta) {
    ocultarBotones();
    cartaZBSeleccionada.classList.add("seleccionado");
    Array.from(zonaBatallaYo.children).forEach(function (e) {
      return e.classList.remove("seleccionado");
    });
    if (puedeAtacarCarta === "Posible" || puedeAtacarCarta === "Posible" || puedeAtacarCarta === "Posible") mensajeBotones.innerText = "Seleccione acción";
    if (puedeAtacarCarta === "Posible") btnAtacarCarta.classList.remove("ocultar");
    if (puedeAtacarBarrera === "Posible") btnAtacarBarrera.classList.remove("ocultar");
    if (puedeCambiarPosicion === "Posible") btnCambiarPosicion.classList.remove("ocultar");
  }
}

zonaBatallaYo.addEventListener("click", function (e) {
  var target = e.target;
  if (target.id === this.id) return;

  while (!target.classList.contains("slot")) {
    target = target.parentElement;
  }

  console.log(target);
  idCartaZBSeleccionada = target.dataset.id;
  cartaZBSeleccionada = target;

  if (stepAccion === "COLOCAR SELECCIONAR ZONA BATALLA") {
    message = {
      event: "Colocar Carta",
      payload: {
        posicion: posicionBatalla,
        idZonaBatalla: idCartaZBSeleccionada,
        idMano: idCartaManoSeleccionada
      }
    };
    sendMessage(message);
  } else {
    message = {
      event: "Seleccionar Zona Batalla",
      payload: {
        idZonaBatalla: idCartaZBSeleccionada
      }
    };
    sendMessage(message);
  }
});
zonaBatallaEnemiga.addEventListener("click", function (e) {
  var target = e.target;
  if (target.id === this.id) return;

  while (!target.classList.contains("slot")) {
    target = target.parentElement;
  }

  console.log(target);
});
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57623" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../src/script.js"], null)
//# sourceMappingURL=/script.58844512.js.map