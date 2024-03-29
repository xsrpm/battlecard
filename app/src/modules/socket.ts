import { type WebsocketEvent } from '../../../api/src/response'

const VITE_WEBSOCKET_URL_BACKEND: string = import.meta.env.VITE_WEBSOCKET_URL_BACKEND
let socket: WebSocket
const url = `${VITE_WEBSOCKET_URL_BACKEND}/ws`

export function sendMessage (message: WebsocketEvent): void {
  socket.send(JSON.stringify(message))
  console.log('sended:')
  console.log(message)
}

export function initSocket (onopen: () => any, onmessage: (e: any) => void, onclose: (e: any) => void, onerror: (e: any) => void): void {
  socket = new WebSocket(url)
  socket.onopen = onopen
  socket.onmessage = onmessage
  socket.onerror = onerror
  socket.onclose = onclose
}

export function encuentraError (message: WebsocketEvent): boolean {
  if (typeof message.error !== 'undefined') {
    console.log(message.error)
    window.alert(message.error)
    return true
  }
  return false
}
