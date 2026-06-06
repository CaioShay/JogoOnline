const ip = prompt('Digite o ip: ')

const socket = new WebSocket(`ws://${ip}:3000`)
let players = []

socket.addEventListener("open", () => {
    console.log("Conectado!");
    requestAnimationFrame(loop)
});

socket.addEventListener('message',(msg)=>{
    players = JSON.parse(msg.data).players
})

const keys = {}

function handle_inputs(){
    let right = 0
    let up = 0

    if (keys['ArrowLeft']){
        right = -1
    }

    if (keys['ArrowRight']){
        right = 1
    }

    if (keys['ArrowDown']){
        up = -1
    }

    if (keys['ArrowUp']){
        up = 1
    }

    const inputs = {
        right: right,
        up: up
    }

    socket.send(JSON.stringify(inputs))
}

document.addEventListener('keydown',(k_ev)=>{
    keys[k_ev.key] = true
    console.log(k_ev.key)
    
    handle_inputs()
})

document.addEventListener('keyup',(k_ev)=>{
    keys[k_ev.key] = false

    handle_inputs()
})

function update(){
    ctx.clearRect(0,0,screen.width,screen.height)

    for(const id in players){
        const player = players[id]
        ctx.fillStyle = player.color
        ctx.fillRect(player.x,player.y,100,100)
    }
}

const screen = document.getElementById('screen')
const ctx = screen.getContext('2d')

screen.width = 800
screen.height = 450

function loop(){
    update()

    requestAnimationFrame(loop)
}