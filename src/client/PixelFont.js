import Phaser from 'phaser'
export default class PixelChar extends Phaser.GameObjects.Image {
    constructor(scene, x, y, char, color) {
        super(scene, x, y, 'pixelFont', characterMap[char])
        this.name = char
        this.setColor(color)
        scene.add.existing(this)
    }
    setColor(color) {
        let rgb = color.substr(4, color.length - 5).split(',').map(n => Number(n))      
        let hex = Phaser.Display.Color.RGBToString(rgb[0], rgb[1], rgb[2], 0, '0x')       
        this.setTintFill(hex)

    }
}

const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',]
const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9',]
const characterMap = {}
letters.forEach(l => characterMap[l] = l)
letters.forEach(l => characterMap[l.toUpperCase()] = l.toUpperCase() + '_')
numbers.forEach(n => characterMap[n] = n)
characterMap['>'] = 'closedSharpBracket'
characterMap['<'] = 'openSharpBracket'
characterMap['?'] = 'quest'
characterMap[')'] = 'closedRoundedBracket'
characterMap['.'] = 'dot'
characterMap[','] = 'comma'
characterMap[';'] = 'semicolon'
characterMap['('] = 'openRoundedBracket'
characterMap['_'] = '_'
characterMap['-'] = '-'
characterMap['!'] = 'expl'
characterMap['.'] = 'dot'
characterMap['I'] = 'l'
characterMap['rub'] = 'rub'
characterMap['ok'] = 'ok'