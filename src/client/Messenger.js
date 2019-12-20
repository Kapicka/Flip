const io = require('socket.io-client')
const host = location.host
const root = 'http://' + host + '/'
console.log('root', root)

const Messenger = {
    socket: undefined,
    multi: {
        addGame: addGameMulti,
        getGames: getGamesMulti,
        getRank: getRankMulti
    },
    single: {
        addGame: addGameSingle,
        getGames: getGamesSingle,
        getRank: getRankSingle
    },
    getSocket: function () {
        if (this.socket === undefined) { throw "socket is not defined" }
        return this.socket
    },
    init: function () {
        this.socket = io(root + 'multiplayer')
    },

}

function getGamesMulti() {
    return getGames('multi')
}
function getGamesSingle() {
    return getGames('single')
}

function getRankSingle(score) {
    return getRank('single', score)
}
function getRankMulti(score) {
    return getRank('multi', score)
}

function getRank(mode, score) {
    return new Promise((res, rej) => {
        const url = root + 'scores/' + mode + "/rank/" + score
        const params = {
            headers: { "content-type": "application/json" },
            method: "get"
        }
        fetch(url, params)
            .then(response => response.json())
            .then(data => res(data.rank))
            .catch(err => rej(err))
    })

}
function getGames(mode) {
    return new Promise((res, rej) => {
        const url = root + 'scores/' + mode
        const params = {
            headers: { "content-type": "application/json" },
            method: "get"
        }
        fetch(url, params)
            .then(games => { res(games.json()) })
            .catch(err => rej(err))
    })
}
function addGameSingle(game) {
    return addGame(game, 'single')
}
function addGameMulti(game) {
    return addGame(game, 'multi')
}
function addGame(game, mode) {
    return new Promise((res, rej) => {
        const url = root + 'scores/' + mode + "/"
        const params = {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(game),
            method: "POST"
        }
        fetch(url, params)
            .then(something => res(something))
            .catch(err => rej(err))
    })
}

module.exports = Messenger







