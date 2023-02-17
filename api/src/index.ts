import server from './server/websocket-acciones'

const port = process.env.PORT ?? 8080

server.listen(port,()=>{
  console.log(`Iniciado en http://localhost:${port}`)
})
