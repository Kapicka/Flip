let score = 0
let level = 1
let maxLevel = 3

let GameInfo = {
    inited: false,
    init: function (sc) {
        this.currentScene = sc
        this.prevScene = 'menuScene'
        this.score = 0
        this.onTurn = false
        this.master = false
        this.hasTutorial = false
        this.passedEnemies = 0
        this.players = {}
        this.players.localPlayer = {}
        this.players.remotePlayer = {}
        this.players.localPlayer.ready = false
        this.players.remotePlayer.ready = false
        this.players.remotePlayer.connected = false

        this.level = 3
        this.direction = 'left'
        this.levelUp = function () {
            console.log('LEVEL UP IN HERE BITCHES ', GameInfo.level)
            if (this.level < maxLevel) {
                this.level++
                console.log('level upped')
            }
        }
        console.log('GameInfo initialized')
        this.inited = true
    }
}

export default GameInfo