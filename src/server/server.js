//const io = require('socket.io')()
const RoomManager = require('./roomManager')
const express = require('express')
const Bundler = require('parcel-bundler')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {serveClient: false})
const file = '../client/index.html'
const option = {}
const bundler = new Bundler(file, option)
server.listen(8081, function () {
    console.log("server na trati")
})
app.use(bundler.middleware());
// app.use('/', express.static('./dist/'))
io.on('connection', socket => {
    socket.emit('handshake', socket.id)

    socket.on('playerInfo', (player) => {
        let room = RoomManager.getRoom()
        room.addPlayer(socket.id, player)
        socket.join(room.id)
        console.log('user joined room ' + room.id)

        if (room.full) {
            console.log('Go!')
            io.to(room.id).emit('playersInfo', room.players)
            io.to(room.id).emit('startgame', {})
        } else {
            console.log('servrer: first player connected')

            socket.emit('firstplayer', {})
        }

        socket.on('animchanged', (animInfo) => {
            socket.to(room.id).emit('animchanged', animInfo)
        })
        socket.on('gameover', () => {
            socket.to(room.id).emit('gameover')
            RoomManager.destroyRoom(room.id)
        })
        socket.on('gamePaused', () => {
            socket.to(room.id).emit('gamePaused')
        })
        socket.on('gameResumed', () => {
            socket.to(room.id).emit('gameResumed')
        })
        socket.on('scoreup', () => {
            socket.to(room.id).emit('scoreup')
        })
        socket.on('enemycreated', (enemy) => {
            socket.to(room.id).emit('enemycreated', enemy)
        })
        socket.on('enemycoords', (enemycoords) => {
            socket.to(room.id).emit('enemycoords', enemycoords)
        })
        socket.on('enemydestroyd', id => {
            socket.to(room.id).emit('enemydestroyd', id)
        })
        socket.on('doomed', (enemyId) => {
            socket.to(room.id).emit('doomed', enemyId)
        })
        socket.on('jump', (enemyId) => {
            socket.to(room.id).emit('doomed', 'jump')
        })
        socket.on('duck', (enemyId) => {
            socket.to(room.id).emit('doomed', 'duck')
        })
        socket.on('shoot', (enemyId) => {
            socket.to(room.id).emit('doomed', 'shoot')
        })

        socket.on('gameover', () => {
            socket.to(room.id).emit('gameover')
        })

        socket.on('dudemoved', (cords) => {
            socket.to(room.id).emit('dudemoved', cords)
        })
        socket.on('disconnect', () => {
            socket.to(room.id).emit('leave', socket.id)
            if (RoomManager.destroyRoom(room.id)) {
                console.log('Room ' + room.id + 'destroyd')
            }

        })
        socket.on('switchturn', (action) => {
            socket.to(room.id).emit('switchturn', action)
        })


    })
})

