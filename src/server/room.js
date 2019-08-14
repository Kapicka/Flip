let RoomManager = require('./roomManager')

class Room {
    constructor(id, capacity) {
        this.id = id
        this.capacity = capacity
        this.full = false
        this.players = {}
    }

    addPlayer(id, player) {
        this.players[id] = player
        if (Object.values(this.players).length === this.capacity) {
            this.full = true
        }
    }
}

module.exports = Room