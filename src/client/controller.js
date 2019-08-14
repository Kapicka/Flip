import GameInfo from "./gameInfo";
import GameActions from "./gameActions"
import Messenger from "./messenger"

let pos = 0
let prevpos = 0
let isDown = false
let cursors

const Controller = {
    init: function (scene) {
        cursors = scene.input.keyboard.createCursorKeys();
        this.handleInputMaster = function () {
            if (GameInfo.onTurn) {
                if (scene.input.pointer1.isDown) {
                    if (!isDown) {
                        prevpos = scene.input.pointer1.y
                        pos = scene.input.pointer1.y
                        isDown = true
                    }
                    pos = scene.input.pointer1.y
                }
                else {
                    if (pos + 20 < prevpos  && pos < prevpos) {
                        scene.dude.jump()
                        switchTurn('jump')
                    }
                    if (pos - 20 > prevpos && pos > prevpos) {
                        scene.dude.duck()
                        switchTurn('duck')
                    }
                    pos = 0
                    prevpos = 0
                    isDown = false
                }
                //KEYBOARD
                if (cursors.down.isDown) {
                    switchTurn('duck')
                    scene.dude.duck()
                }
                if (cursors.up.isDown) {
                    scene.dude.jump()
                    switchTurn('jump')
                }
            }
        }

        this.handleInputSlave = function () {
            if (GameInfo.onTurn) {
                if (scene.input.pointer1.isDown) {
                    if (!isDown) {
                        prevpos = scene.input.pointer1.y
                        pos = scene.input.pointer1.y
                        isDown = true
                    }
                    pos = scene.input.pointer1.y
                }
                else {
                    if (pos + 20 < prevpos && pos < prevpos) {
                        switchTurn('jump')
                    }
                    if (pos - 20 > prevpos && pos > prevpos) {
                        switchTurn('duck')
                    }
                    pos = 0
                    prevpos = 0
                    isDown = false
                }
                //KEYBOARD
                if (cursors.down.isDown) {
                    switchTurn('duck')
                }
                if (cursors.up.isDown) {
                    switchTurn('jump')
                    scene.dude.play('dudejump'+scene.foregroundColor)
                }
            }
        }
    }

}


function switchTurn(action) {
    GameInfo.onTurn = false
    GameActions.flipColor()
    Messenger.socket.emit('switchturn', action)
}

export default Controller