import Display from './Display'
import Phaser from 'phaser'
import PixelChar from './PixelFont'
import ColorManager from './ColorManager'
import EventEmitter from 'events'


export default class KeyEntry extends EventEmitter { //extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, fg, bg) {
        super()
        this.keyMap = getKeyMap()
        this.width = width
        this.keyMap['T'].down = 'ok'
        this.keyMap['S'].down = 'ok'
        this.keyMap['R'].down = 'rub'
        this.width = width
        this.keyMap['ok'].up = 'T'
        this.keyMap['ok'].down = 'J'
        let self = this
        this.keyImages = createGraphics(scene, this, x, y, width, fg, bg)
        this.currentKey = this.keyImages['B']
        setActiveChar(this, 'B', fg, bg)

        this.submit = () => {

            self.currentKey.emit('pointerdown')
        }
        this.moveUp = function () {
            let upKey = self.keyMap[self.currentKey.name].up
            setActiveChar(self, upKey, fg, bg)
        }
        this.moveDown = function () {
            let downKey = self.keyMap[self.currentKey.name].down
            setActiveChar(self, downKey, fg, bg)
        }
        this.moveLeft = function () {
            let leftKey = self.keyMap[self.currentKey.name].left
            setActiveChar(self, leftKey, fg, bg)
        }
        this.moveRight = function () {
            let rightKey = self.keyMap[self.currentKey.name].right
            setActiveChar(self, rightKey, fg, bg)
        }
        this.write = function () {
            key = self.currentKey.name
            self.emit('write', key)
        }
        this.centerX = function () {

            const center = Display.width / 2 - this.width / 2

            Object.values(this.keyImages).forEach(img => {
                let newx = img.x + (center - x)

                img.setX(newx)
                img.hitArea.setX(newx)
            })
            return this
        }
    }
}


const keys = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
    ['U', 'V', 'W', 'X', 'Y', 'Z', 'rub', 'ok']
]



function getKeyMap() {
    return keys.map((row, y) => row.map((key, x) => getKey(x, y, row, key)))
        .reduce((acc, curr) => acc.concat(curr), [])
        .reduce((acc, curr) => { acc[curr.name] = curr; return acc }, {})
}

function getKey(x, y, keyRow, key) {
    let n = getNeighbors(x, y, keyRow)
    const ret = {
        name: key,
        up: n.upNode,
        down: n.downNode,
        left: n.leftNode,
        right: n.rightNode
    }
    return ret
}

function getNeighbors(x, y, keyRow) {
    let lastNodeX = keyRow.length - 1
    let keysLength = keys.length - 1

    let upNode = undefined
    let downNode = undefined
    let leftNode = undefined
    let rightNode = undefined

    if (y - 1 >= 0)
        upNode = keys[y - 1][x] // getKey(x, y)
    if (y + 1 <= keysLength) {
        downNode = keys[y + 1][x]
    }
    if (x - 1 >= 0)
        leftNode = keys[y][x - 1]
    if (x + 1 <= lastNodeX)
        rightNode = keys[y][x + 1]


    if (upNode === undefined) {
        upNode = keys[keysLength][x]
        if (upNode === undefined)
            upNode === keys[keysLength][lastNodeX]
    }

    if (downNode === undefined) {
        downNode = keys[0][x]
        if (downNode === undefined)
            downNode === keys[0][lastNodeX]
    }

    if (leftNode === undefined) {
        leftNode = keys[y][lastNodeX]
    }

    if (rightNode === undefined) {
        rightNode = keys[y][0]
    }
    return {
        leftNode, downNode, upNode, rightNode
    }
}

function createGraphics(scene, container, contx, conty, width, fg, bg) {
    const activeColor = fg
    const normalColor = bg
    const fontScale = width / 90
    const fontHeight = 7 * fontScale
    const fontWidth = 5 * fontScale
    const marginY = fontHeight * 1.1
    const marginX = width / 10 //fontWidth * 2 + fontWidth / 2

    let k = keys.map((row, y) =>
        row.map((char, x) => {
            let ch = new PixelChar(
                scene,
                contx + x * marginX,
                conty + y * marginY,
                char,
                normalColor)
                .setOrigin(0, 0)
                .setScale(fontScale, fontScale)
            ch.hitArea = new Phaser.GameObjects.Zone(scene, x, y, fontWidth * 1.5, fontHeight)
            ch.setInteractive()
                .on('pointerover', function () {
                    setActiveChar(container, this.name, fg, bg)
                })
            return ch
        })
    ).reduce((acc, curr) => acc.concat(curr))
    k.filter(key => key.name !== 'ok' && key.name !== 'rub')
        .forEach(key => key.on('pointerdown',
            function () { container.emit('keydown', key.name) }))
    k = k.reduce((acc, curr) => { acc[curr.name] = curr; return acc }, {})

    let ok = k['ok']
    let rub = k['rub']
    ok.setX(ok.x + fontWidth * 2)
    // rub.setX(this.width)
    ok.on('pointerdown', () => { container.emit('ok') })
    rub.on('pointerdown', () => { container.emit('rub') })

    return k

}


function setActiveChar(container, key, fg, bg) {
    container.currentKey.setColor(bg)
    let k = container.keyImages[key]
    k.setColor(fg)
    container.currentKey = k

}



function writeChar() {
    this.setColor(activeColor)


}



