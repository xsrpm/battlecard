const express = require('express')
var bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid');
const app = express()
const port = 3000

let jugadores=[]

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/api/sala/unirse', (req, res) => {
  console.log(req.body.nombreJugador)
  let uuidGen = uuidv4()
  if(jugadores.length<2){
    jugadores.push({id:uuidGen,nombre:req.body.nombreJugador})
    res.status(201).json({idJugador:uuidGen,message:"Usuarío ingresó a sala"})
  }
  else{
    res.status(403).json({mensaje:"La sala está llena"})
  }
})

app.get('/api/sala/jugadores/', (req, res) => {
  res.json(jugadores)
})

app.put('/api/sala/reabrir', (req, res) => {
  jugadores=[]
  res.json({message:"Sala reabierta"})
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
