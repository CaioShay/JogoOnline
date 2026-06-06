const { platform } = require('node:os')
const ws = require('ws')

const players = new Map()
const clients = new Set()
let next_id = 1

const wss = new ws.Server(
    {   
        host:'0.0.0.0',
        port:3000
    }
)
console.log('server aberto')

wss.on('connection',(ws)=>{
    ws.id = next_id
    clients.add(ws)

    const player = {
        id:next_id,
        x:0,
        y:0,
        inputs:{},
        color:`rgb(${Math.random()*255},${Math.random()*255},${Math.random()*255})`
    }

    next_id ++

    players.set(ws,player)

    ws.on('message',(msg)=>{
        const player = players.get(ws)

        player.inputs = JSON.parse(msg)
    })

    ws.on('close',()=>{
        console.log('cliente desconectado: ',ws.id)
        clients.delete(ws)
        players.delete(ws)
    })
})

const fps = 24
const Delta_Time = 1000/fps
setInterval(()=>{
    const snapshot = {players:{}}

    for (const player of players.values()){
        const inputs = player.inputs
        const delta_s = 100 / fps

        if (inputs.right > 0){
            player.x += delta_s
        }else if (inputs.right < 0){
            player.x -= delta_s
        }

        if (inputs.up > 0){
            player.y -= delta_s
        }else if (inputs.up < 0){
            player.y += delta_s
        }

        snapshot.players[player.id] = {
            x: player.x,
            y: player.y,
            color:player.color
        }
    }

    const packet = JSON.stringify(snapshot)

    for (const socket of players.keys()){
        socket.send(packet)
    }
},Delta_Time)