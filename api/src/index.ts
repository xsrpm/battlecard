import express from 'express'
import cors from 'cors'
import {WebSocketServer} from './clases/websocket-acciones'

const app = express()
app.use(cors())
app.use(express.static('./public'))

const port = process.env.PORT ?? 8080
const server = app.listen(port, () => {
  console.log(`Iniciado en http://localhost:${port}`)
})

server.on('upgrade', (request, socket, head) => {
  WebSocketServer.handleUpgrade(request, socket, head, function done(ws){
    WebSocketServer.emit('connection', ws, request)
  })
})
