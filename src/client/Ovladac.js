let posY = 0
let prevposY = 0
let posX = 0
let prevposX = 0
let isDown = false
let cursors
let tolerance = 40
const Ovladac = {
    init: function (scene) {
        cursors = scene.input.keyboard.createCursorKeys();
        this.getSwipe = function () {
            let ret = 'nothing'
            if (scene.input.pointer1.isDown) {
                if (!isDown) {
                    prevposY = scene.input.pointer1.y
                    prevposX = scene.input.pointer1.x
                    posY = scene.input.pointer1.y
                    posX = scene.input.pointer1.x
                    isDown = true
                }
                posY = scene.input.pointer1.y
            } else {

                if (posY + tolerance < prevposY && posY < prevposY) {
                    //swipe nahoru
                    return 'up'
                }
                if (posY - tolerance > prevposY && posY > prevposY) {
                    //swipe dolu
                    return 'down'
                }
                if (posX + tolerance < prevposX && posX < prevposX) {
                    //swipe doprava
                    return 'left'
                }
                if (posX - tolerance > prevposX && posX > prevposX) {
                    //swipe doleva
                    return 'right'
                }
                posY = 0
                prevposY = 0
                isDown = false
                return 'nothing'
            }
        }
    }
}
export default Ovladac