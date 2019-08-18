import Display from "./display";

const space = 5
import GameInfo from "./gameInfo";

function setText(scene, x, y, text, color, scale, textt) {
    let textArr = text.split('')
    let cunrentX = x
    for (let i = 0; i < textArr.length; i++) {
        let letter = textArr[i]
        if (letter === '~') {
            y += 9 * scale
            cunrentX = x
        } else if (letter === ' ' || letter === ',') {
            cunrentX += 4 * scale
        } else {
            if (letter === letter.toUpperCase() && isNaN(letter) && letter !== '!' && letter !== 'I' && letter !== '.') {
                letter = letter + '_'
            } else if (letter === '.') {
                letter = 'dot'
            } else if (letter === '!') {
                letter = 'expl'
            } else if (letter === 'I') {
                letter = 'l'
            }
            let lettersprite = scene.add.sprite(cunrentX, y, 'pixelFont', letter + color).setScale(scale).setOrigin(0, 0)
            lettersprite.name = letter
            cunrentX += lettersprite.width * scale + scale
            textt.letters.push(lettersprite)
        }
    }
}

export default class Textt {
    constructor(scene, x, y, text, color, scale) {
        this.letters = []
        this.scene = scene
        this.spaces = 0
        this.text = text
        this.color = color
        this.scale = scale
        this.x = x
        this.y = y
        this.visible = true
        setText(scene, x, y, text, color, scale, this)
        let ll = this.letters[this.letters.length - 1]
        this.width = (ll.width + ll.x) - this.letters[0].x
        return this
    }

    setColor(color) {
        this.letters.forEach(l => l.setFrame(l.name + color))
        this.color = color
    }

    getWidth() {
        let lastX = 0
        let lastWidth = 0

        this.letters.forEach(l => {
            if (l.x > lastX) {
                lastX = l.x
                lastWidth = l.width
            }
        })
        return (lastWidth + lastX) - this.letters[0].x
    }

    centerX() {
        let center = Display.width / 2 - this.getWidth() / 2
        this.setX(center)
        return this
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

    setVisible(visible) {
        this.letters.forEach(l => l.setVisible(visible))
        this.visible = visible
    }

    setText(text) {
        this.letters.forEach(l => l.destroy())
        this.letters = []
        setText(this.scene, this.x, this.y, text, this.color, this.scale, this)
        this.setVisible(this.visible)
        return this
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
