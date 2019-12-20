
class Room {
    constructor(id, capacity) {
        this.id = id
        this.capacity = capacity
        this.full = false
        this.players = []
    }

    addPlayer(player) {
        console.log('player from room', player)
        if (!this.full) {
            this.players.push(player)
            if (this.players.length === this.capacity) {
                this.full = true
            }
            return true
        }
        return false
    }
}

module.exports = Room