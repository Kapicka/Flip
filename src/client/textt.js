const space = 5
import GameInfo from "./gameInfo";


export default class Textt {
    constructor(scene, x, y, text, color, scale) {
        this.letters = []
        this.spaces = 0
        this.text = text
        this.scale = scale
        this.x = x
        this.y = y

        let textArr = text.split('')

        let cunrentX = x
        for (let i = 0; i < textArr.length; i++) {
            let letter = textArr[i]
            if (letter === ' ') {
                x += 4 * scale
            } else {
                if (letter === letter.toUpperCase() && isNaN(letter) && letter !== '.') {
                    letter = letter + '_'
                } else if (letter === '.') {
                    letter = 'dot'
                }
                let letterSprite = scene.add.sprite(x, y, 'pixelFont', letter + color).setScale(scale).setOrigin(0, 0)
                letterSprite.name = letter
                x += letterSprite.width * scale + scale
                this.letters.push(letterSprite)
            }
        }
        let ll = this.letters[this.letters.length - 1]
        this.width = (ll.width + ll.x) - this.letters[0].x
    }

    getWidth() {
        let lastL = this.letters[this.letters.length - 1]
        return (lastL.width + lastL.x) - this.letters[0].x
    }

    setX(x) {
        this.x = x
        let positions = []
        let tempX = x
        for (let i = 1; i < this.letters.length; i++) {
            let prevLetter = this.letters[i - 1]
            let currentLetter = this.letters[i]
            tempX += (currentLetter.x - prevLetter.x)
            positions.push(tempX)
        }
        this.letters[0].setX(x)
        for (let i = 1; i < this.letters.length; i++) {
            this.letters[i].setX(positions[i - 1])
        }
    }

    setText(text) {
        text.split('').forEach(l => {
            if (l === ' ') {
            } else {
                if (l === l.toUpperCase()) {
                    l = l + '_'
                }
                this.letters.push(scene.add.sprite(x + margin, y, 'pixieFont', l))
            }
        })
    }

    flipColor(color) {
        this.letters.forEach(l => l.setFrame(l.name + color))

    }

    setScale(scale) {
        this.letters.forEach(l =>
            l.setX(l.x + space * scale)
                .setScale(scale, scale)
        )
    }
}
