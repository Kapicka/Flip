import Display from "./Display";

export default class Score {
    constructor(scene, x, y, size, color) {



        this.color = color
        this.scene = scene
        this.maxSize = 5
        this.numbers = []
        for (let i = 0; i < this.maxSize; i++) {
            let num = scene.add.image(x, y, 'pixelFont', '0').setScale(size)
            setColor(num, color)
            num.name = '0'
            this.numbers.push(num)
            x += size * 7;
        }
    }

    flipColor(color) {
        this.color = color
        this.numbers.forEach(n => setColor(n, color))
    }
    getWidth() {
        return this.numbers[this.numbers.length - 1].x - this.numbers[0].x + size * this.numbers[0].width
    }
    setScore(score) {
        let text = score.toString().split('')
        let textLength = text.length
        let index = textLength
        for (let i = 0; i < textLength; i++) {
            let ch = text[textLength - i - 1]
            let num = this.numbers[this.maxSize - i - 1].setFrame(ch)
            setColor(num, this.color)
            num.name = ch
        }
    }
}

let setColor = (sprite, color) => {
    let rgb = color.substr(4, color.length - 5).split(',').map(n => Number(n))
    let hex = Phaser.Display.Color.RGBToString(rgb[0], rgb[1], rgb[2], 0, '0x')
    sprite.setTintFill(hex)

}