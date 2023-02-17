import http from 'http';
import WebSocket from 'ws'
import app from './app';

export const server = http.createServer(app);

export const WebSocketServer = new WebSocket.Server({ server })

export function sendMessageToOthers (wsorigen: WebSocket, message: any) {
    WebSocketServer.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        if (ws !== wsorigen) {
          sendMessage(ws, message)
        }
      }
    })
  }
  
  export function cerrarSockets () {
    WebSocketServer.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close()
      }
    })
  }
  
   export function sendMessage (ws: WebSocket, message: any) {
    ws.send(JSON.stringify(message))
    console.log('sended:')
    console.log(message)
  }