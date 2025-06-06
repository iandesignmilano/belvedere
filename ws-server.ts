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
const wss = new WebSocketServer({ server, path: '/ws' })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// connect
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

wss.on('connection', (ws) => {
    console.log('Client connesso via WebSocket')
    ws.on('message', (msg) => console.log('Messaggio ricevuto:', msg.toString()))
    ws.on('close', () => console.log('Client disconnesso'))
})

server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => wss.emit('connection', ws, request))
    } else socket.destroy()
})

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

server.listen(3002, () => console.log('WebSocket attiva sulla porta 3002'))
