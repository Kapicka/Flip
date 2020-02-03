
const bgObjects = ['cloud', 'tree', 'leaftree', 'cloud2', 'mountain', 'cloud']
import Display from './Display'

function flipColor(color) {
    let rgb = color.substr(4, color.length - 5).split(',').map(n => Number(n) + this.tnt)
    if (rgb[0] > 255 || rgb[1] > 255 || rgb[2] > 255) {
        rgb = rgb.map(c => c -= 2 * this.tnt)
    }
    let hex = Phaser.Display.Color.RGBToString(rgb[0], rgb[1], rgb[2], 0, '0x')
    this.setTintFill(hex)
}

var hello = 0

class BackgroundObjectGenerator {
    constructor(scene) {
        this.generate = (x, y, key, z, flipX, flipY, scale) => {
            let bgObject = scene.bgo.create(x, y, 'bg', key)
            bgObject.setScale(scale)
            bgObject.setVelocityX(-50)
            bgObject.body.setAllowGravity(false)
            bgObject.flipColor = flipColor
            bgObject.tnt = Math.floor(Math.random() * 20) + 8
            bgObject.flipColor(scene.backgroundColor)
            bgObject.setOrigin(1, 1)
            bgObject.setDepth(z)
            bgObject.setFlipX(flipX)
            bgObject.setFlipY(flipY)
            bgObject.z = z
            return bgObject
        }

        this.generateRandom = () => {
            let key = bgObjects[Math.floor(Math.random() * bgObjects.length)]
            let x = Display.width * Display.scaleX + 10
            let y = scene.platforms.getChildren()[0].y
            let scale = 5
            let z = -4
            let flipX = false
            let flipY = false
            if (Math.random() > 0.5) { flipX = true }


            if (key === 'cloud' || key === 'cloud2') {
                y = Math.random() * Display.height / 3
                if (Math.random() > 0.5) { flipY = true }
                scale = 5 * Math.random() + 10
                z = -3
            }

            if (key === 'mountain') {
                scale = 12 * Math.random() + 8

            }


            if (key === 'tree' || key === 'leaftree') {
                scale = 7 * Math.random() + 10

                z = -2
            }
            let bgObject = this.generate(x, y, key, z, flipX, flipY, scale)

            return bgObject
        }

    }
}

export default BackgroundObjectGenerator