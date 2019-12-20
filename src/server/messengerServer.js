
const Room = require('./Room')
const RoomManager = require('./RoomManager')
const db = require('./Db')


module.exports = function initMessenger(server) {
    const io = require('socket.io')(server, { serveClient: false })
    const multiNsp = io.of('/multiplayer');

    //MULTIPLAYER 
    multiNsp.on('connection', socket => {
        socket.emit('handshake', socket.id)
        socket.on('playerInfo', player => {
            let room = RoomManager.getRoom()
            room.gameOver = false
            room.addPlayer(player)
            socket.join(room.id)
            if (room.full) {
                console.log('Go!')
                multiNsp.to(room.id).emit('startgame', room)
            } else {
                console.log('servrer: first player connected')
                socket.emit('firstplayer', {})
            }
            socket.on('animchanged', animInfo => {
                socket.to(room.id).emit('animchanged', animInfo)
            })
            socket.on('gameover', (score) => {
                socket.to(room.id).emit('gameover')
                room.gameOver = true
            })

            socket.on('gamePaused', () => {
                socket.to(room.id).emit('gamePaused')
            })
            socket.on('gameResumed', () => {
                socket.to(room.id).emit('gameResumed')
            })
            socket.on('score', () => {
                socket.to(room.id).emit('score')
            })
            socket.on('enemycreated', enemy => {
                socket.to(room.id).emit('enemycreated', enemy)
            })
            socket.on('enemiescreated', enemies => {
                socket.to(room.id).emit('enemiescreated', enemies)
            })
            socket.on('spriteflip', id => {
                socket.to(room.id).emit('spriteflip', id)
            })
            socket.on('enemycoords', enemycoords => {
                socket.to(room.id).emit('enemycoords', enemycoords)
            })
            socket.on('enemydestroyd', id => {
                socket.to(room.id).emit('enemydestroyd', id)
            })
            socket.on('runnerhit', () => {
                socket.to(room.id).emit('runnerhit')
            })
            socket.on('isbest', score => {

                db.multi.sendBetterGames(score, io, room.id)
            })
            socket.on('objectmoved', info => {
                socket.to(room.id).emit('objectmoved', info)
            })
            socket.on('disconnect', (info) => {
                if (!room.gameOver) {
                    socket.to(room.id).emit('playerdisconnect', socket.id)
                }
                if (RoomManager.destroyRoom(room.id)) {
                    console.log('Room ' + room.id + 'destroyd')
                }
            })
            socket.on('action', action => {
                socket.to(room.id).emit('action', action)
            })
            socket.on('switchturn', () => {
                socket.to(room.id).emit('switchturn')
            })
            socket.on('highscores', () => {
                db.multi.getGames()
                    .then(games => socket.emit('highscores', games))
                    .catch(err => { throw err })
            })
            socket.on('updatename', info => {
                console.log('trying to update', info)
                db.multi.updateName(info.id, info.name, info.master)
            })
        })
    })



}

