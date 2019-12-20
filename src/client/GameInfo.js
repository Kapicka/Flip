let GameInfo = {
    init: function () {
        this.dbId = undefined
        this.score = 0
        this.mode = undefined
        this.master = false
        this.gameOver = false
        this.onTurn = false
        this.players = {
            localPlayer: {
                color: undefined,
                id: undefined,
            },
            remotePlayer: {
                color: undefined,
                id: undefined,
            }
        }
    }
}
export default GameInfo
