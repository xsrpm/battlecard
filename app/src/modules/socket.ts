import { WebsocketEvent } from '../../../shared/types/response'

let socket: WebSocket
let url: string

if (process.env.NODE_ENV !== 'production') {
  url = 'ws://localhost:8080'
} else {
  if (location.protocol === 'http:' && location.hostname === 'localhost') {
    url = `ws://${location.host}/ws`
  } else {
    url = `wss://${location.host}/ws`
  }
}

export function sendMessage(message: WebsocketEvent) {
  socket.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

export function initSocket(onopen: () => any, onmessage: (e: any) => void, onclose: (e: any) => void, onerror: (e: any) => void) {
  socket = new WebSocket(url)
  socket.onopen = onopen
  socket.onmessage = onmessage
  socket.onerror = onerror
  socket.onclose = onclose
}
