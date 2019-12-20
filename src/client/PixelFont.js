import Phaser from 'phaser'
export default class PixelChar extends Phaser.GameObjects.Image {
    constructor(scene, x, y, char, color) {
        super(scene, x, y, 'pixelFont', characterMap[char] + color)
        this.name = char
        scene.add.existing(this)
    }
    setColor(color) {
        this.setFrame(characterMap[this.name] + color)

    }
}

const letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",]
const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9",]
const characterMap = {}
letters.forEach(l => characterMap[l] = l)
letters.forEach(l => characterMap[l.toUpperCase()] = l.toUpperCase() + "_")
numbers.forEach(n => characterMap[n] = n)
characterMap[">"] = "sqrBracketLeft"
characterMap["<"] = "sqrBracketRight"
characterMap["?"] = "quest"
characterMap["_"] = "_"
characterMap["-"] = "-"
characterMap["!"] = "expl"
characterMap["."] = "dot"
characterMap["I"] = "l"
characterMap["rub"] = "rub"
characterMap["ok"] = "ok"