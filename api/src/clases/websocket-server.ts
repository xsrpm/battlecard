import WebSocket, { Server  } from "ws"

export const wss = new Server({ noServer: true });

export function sendMessage(ws:WebSocket, message: any) {
    ws.send(JSON.stringify(message));
    console.log("sended:");
    console.log(message);
  }
  
  export function sendMessageToOthers(wsorigen:WebSocket, message: any) {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        if (ws !== wsorigen) {
          sendMessage(ws, message);
        }
      }
    });
  }

  export function cerrarSockets() {
    wss.clients.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    });
  }
