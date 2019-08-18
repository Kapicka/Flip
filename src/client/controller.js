import GameInfo from "./gameInfo";
import GameActions from "./gameActions"
import Messenger from "./messenger"

let pos = 0
let prevpos = 0
let isDown = false

const Controller = {
    init: function (scene) {
        this.getSwipe = function () {
            if (scene.input.pointer1.isDown) {
                if (!isDown) {
                    prevpos = scene.input.pointer1.y
                    pos = scene.input.pointer1.y
                    isDown = true
                }
                pos = scene.input.pointer1.y
            } else {
                let ret = 'nothingTriggered'
                if (pos + 20 < prevpos && pos < prevpos) {
                    ret = 'up'
                }
                if (pos - 20 > prevpos && pos > prevpos) {
                    ret = 'down'
                }
                pos = 0
                prevpos = 0
                isDown = false
                return ret
            }
        }
    }
}

export default Controller