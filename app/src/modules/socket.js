let socket

export function sendMessage(message) {
  socket.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

export function initSocket(url, onopen, onmessage, onclose, onerror) {
  socket = new WebSocket(url)
  socket.onopen = onopen
  socket.onmessage = onmessage
  socket.onerror = onerror
  socket.onclose = onclose
}
