import Display from "./display";

export default class Score {
    constructor(scene, x, y, size) {
        this.scene = scene
        this.maxSize = 5
        this.numbers = []
        for (let i = 0; i < this.maxSize; i++) {
            let num = scene.add.sprite(x, y, 'pixelFont', '0' + scene.foregroundColor).setScale(size)
            num.name = '0'
            this.numbers.push(num)
            x += size * 7;
        }
    }
    flipColor() {
        this.numbers.forEach(n => n.setFrame(n.name + this.scene.foregroundColor))
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
            console.log(this.maxSize - i - 1)
            console.log('setting', ch)
            this.numbers[this.maxSize - i - 1]
                .setFrame(ch + this.scene.foregroundColor)
            this.numbers[this.maxSize - i - 1].name = ch
        }
    }
}

