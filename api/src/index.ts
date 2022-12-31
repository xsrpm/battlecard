import express, { Request } from 'express'
import cors from 'cors'
import { WebSocketServer } from './clases/websocket-acciones'

const app = express()
app.use(cors())
app.use(express.static('./public'))

const port = process.env.PORT ?? 8080
const server = app.listen(port, () => {
  console.log(`Iniciado en http://localhost:${port}`)
})

server.on('upgrade', (request: Request, socket: any, head: any) => {
  WebSocketServer.handleUpgrade(request, socket, head, (socket: any) => {
    WebSocketServer.emit('connection', socket, request)
  })
})
