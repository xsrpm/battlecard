import server from './server/websocket-acciones'
import { info } from './utils/logger'

const port = process.env.PORT ?? 8080

server.listen(port, () => {
  info(`Iniciado en http://localhost:${port}`)
})
