import Display from "./Display";

const space = 5
import PixelChar from "./PixelFont";
import {EventEmitter} from "events";
import ColorManager from "./ColorManager";

export default class Textt extends EventEmitter {
    constructor(scene, x, y, text, color, scale) {
        super()
        this.letters = []
        this.scene = scene
        this.spaces = 0
        this.text = text
        this.color = color
        this.scale = scale
        this.visible = true
        this.area
        this.x = x
        this.width = 0
        this.y = y
        this.visible = true

        setText(scene, x, y, text, color, scale, this)

        return this
    }

    setColor(color) {
        this.letters.forEach(l => l.setFrame(l.name + color))
        this.color = color
    }

    getWidth() {
        let lastLetter = this.letters[this.letters.length - 1]
        return lastLetter.x + (lastLetter.width * this.scale) - this.x
    }


    centerX() {
        if (this.letters.length) {

            let center = Display.width / 2 - this.getWidth() / 2
            this.setX(center)
            this.x = center
        }
        return this
    }

    setX(x) {
        this.letters.forEach(l => {
            const newx = l.x + (x - this.x)
            l.setX(newx)
        })
    }

    setY(y) {
        this.letters.forEach(l => l.setY(y))
    }

    setVisible(visible) {
        this.letters.forEach(l => l.setVisible(visible))
        this.visible = visible
        return this
    }

    setText(text) {
        this.letters.forEach(l => l.destroy())
        this.letters = []
        setText(this.scene, this.x, this.y, text, this.color, this.scale, this)
        this.setVisible(this.visible)
        return this
    }
    getSprites(){
        return this.letters
    }


    flipColor(color) {
        this.letters.forEach(l => l.setColor(color))
        return this
    }

    setDarken(option) {
        if (option) {
            this.letters.forEach(l => l.setTint(0xaaaaaa))
        } else {
            this.letters.forEach(l => l.setTintFill(ColorManager.getHex(this.color)))
        }
        return this
    }

    setInteractive() {
        this.interactiveArea = new Phaser.GameObjects.Zone(this.scene, this.x, this.y, this.getWidth(), 7 * this.scale)
            .setOrigin(0, 0)
            .setInteractive()
        return this
    }

    on(event, action) {
        this.interactiveArea.on(event, action)
    }

    setScale(scale) {
        this.letters.forEach(l =>
            l.setX(l.x + space * scale)
                .setScale(scale, scale)
        )
    }
}


const setText = (scene, x, y, text, color, scale, textt) => {
    let textArr = text.split('')
    let currentX = x
    if (textArr.length !== 0) {
        for (let i = 0; i < textArr.length; i++) {
            let letter = textArr[i]

            if (letter === '~') {
                y += 9 * scale
                currentX = x
            } else if (letter === ' ' || letter === ',') {
                currentX += 4 * scale
            } else {
                let lettersprite = new PixelChar(scene, currentX, y, letter, color).setScale(scale).setOrigin(0, 0)
                currentX += lettersprite.width * scale + scale
                textt.letters.push(lettersprite)
            }
        }

    }


}