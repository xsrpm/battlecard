let socket
let url

if (process.env.NODE_ENV !== 'production') {
  url = 'ws://localhost:8080'
} else {
  if (location.protocol === 'http:' && location.hostname === 'localhost') {
    url = `ws://${location.host}/ws`
  } else {
    url = `wss://${location.host}/ws`
  }
}

export function sendMessage(message) {
  socket.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

export function initSocket(onopen, onmessage, onclose, onerror) {
  socket = new WebSocket(url)
  socket.onopen = onopen
  socket.onmessage = onmessage
  socket.onerror = onerror
  socket.onclose = onclose
}
