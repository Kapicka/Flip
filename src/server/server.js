const express = require('express')
const initMessenger = require('./messengerServer')
const Bundler = require('parcel-bundler')
const app = express()
const server = require('http').Server(app)
const db = require('./db')
const cors = require('cors')
const option = {}
const file = '../client/index.html'
const bundler = new Bundler(file, option)
const port = process.env.PORT || 8081

app.use(cors())
app.use(express.json())

app.get('/scores/single/', (req, res) => {
    db.single.getGames()
        .then(games => res.json(games))
        .catch(err => console.error(err))
})
app.get('/test/', (req, res) => {
    res.json({ "ok": "OK" })
})
app.get('/scores/multi/', (req, res) => {
    db.multi.getGames()
        .then(games => res.send(games).end())
        .catch(err => console.error(err))
})
app.get('/scores/multi/rank/:score', (req, res) => {
    db.multi.getBestThreeGames()
        .then(games => {
            let ret = games
                .filter(g => g.score > req.params.score)
            res.send(ret).end()
        })
        .catch(err => console.error(err))
})
app.get('/scores/single/rank/:score', (req, res) => {
    db.single.getBestThreeGames()
        .then(games => {
            let ret = games
                .filter(g => g.score > req.params.score)
            res.send(ret).end()
        })
        .catch(err => console.error(err))
})
app.post('/scores/single/', (req, res) => {
    const game = { score: req.body.score, players: [req.body.player] }
    db.single.insertGame(game)
        .then(id => {
            res.json({ "id": id })
        })
        .catch(err => { throw err })
})

app.post('/scores/multi/', (req, res) => {
    const id = req.body.id
    const player = req.body.player
    const score = req.body.score
    console.log('id: ', id, ' player: ', player, ' score: ', score)
    db.multi.gameExist(id)
        .then(exist => {
            if (exist) {
                return db.multi.addPlayer(id, player)
            }
            const game = { "_id": id, "score": score, "players": [player,] }
            return db.multi.insertGame(game)
        })
        .then(id => res
            .json({ "id": id })
            .end())
        .catch(err => { throw err })
})

server.listen(port, () => {
    console.log('server is listenning on port ' + port)
})

app.use(bundler.middleware());
initMessenger(server)


