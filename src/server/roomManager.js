
const db = require('./db')
let rooms = []
const Room = require('./room')

let RoomManager = {
    getRoom: function () {
        let room = rooms.find(room => !room.full)
        if (room !== undefined) {
            console.log('there is a free space for you')
            return room
        }
        let id = db.getId()
        console.log('hello this is the brand new room id', id)
        room = new Room(id, 2)
        rooms.push(room)
        return room
    },
    destroyRoom: function (id) {
        rooms = rooms.filter(room => room.id !== id)
    },
    getRooms() {
        return rooms
    }
}

module.exports = RoomManager