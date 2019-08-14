let rooms = {}
let roomId = 0
const Room = require('./room')

function addRoom() {
    rooms.roomId = new Room(roomId, 2)
    roomId++
}
let RoomManager = {
    getRoom: function () {
        for (let id in rooms) {
            if (!rooms[id].full) {
                rooms[id].full = true
                return rooms[id]
            }
        }
        rooms.roomId = new Room(roomId, 2)
        roomId++
        return rooms.roomId
    },
    destroyRoom: function (id) {
        delete rooms[id]
    }
}

module.exports = RoomManager