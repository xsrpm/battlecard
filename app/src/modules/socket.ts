import { WebsocketEvent } from '../../../shared/types/response'

let socket: WebSocket
let url = import.meta.env.VITE_WEBSOCKET_URL_BACKEND +"/ws"

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
