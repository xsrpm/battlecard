import http from 'http';
import app from './app';

import WebSocket from 'ws'
import { procesarAccion, procesarDesconexion } from './clases/websocket-acciones';

export const server = http.createServer(app);

export const WebSocketServer = new WebSocket.Server({ server })
WebSocketServer.on('connection', (ws: WebSocket) => {
    ws.on('message', (data: any) => {
      procesarAccion(ws, data)
    })
    ws.on('error', function (event: any) {
      console.log(event)
    })
    ws.on('close', (code: number) => {
      procesarDesconexion(ws,code)
    })
  })

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