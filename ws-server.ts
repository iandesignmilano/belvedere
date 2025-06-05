// web socket
import { WebSocketServer } from 'ws'

// http
import http from 'http'

// express
import express from 'express'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// inis
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const app = express()
const server = http.createServer(app)
const wss = new WebSocketServer({ server })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// connect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

wss.on('connection', () => console.log('Client connesso via WebSocket'))

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// send
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(express.json())

app.post('/notify', (req, res) => {
    const { message } = req.body
    wss.clients.forEach(client => { if (client.readyState === 1) client.send(message) })
    res.status(200).send('Messaggio inviato')
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// server
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

server.listen(3001, () => console.log('WebSocket server attivo sulla porta 3001'))
