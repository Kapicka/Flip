
import ColorManager from '../colorManager'
import Display from '../display';
import centerSpriteX from '../utils'
import GameInfo from '../gameInfo';
import Textt from '../textt'


let offsetY

let rotated = false
let colorIndex = 0
let time = 0
const colors = ColorManager.getColors()

let mainCamera

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' })
    }

    init() {

    }

    create() {
        //POSITIONS
        let w = Display.gamingArea.width//this.cameras.main.width
        let h = Display.gamingArea.height//this.cameras.main.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w) / 2)
        let y = this.cameras.main.y + ((this.cameras.main.height - h) / 2)
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY

        offsetY = 20 * scy
        //CHOOSABLE COLORS POSITION
        let rectSize = 20 * scy
        let margin = 8 //* scx
        let rectY = y + 150 * scy
        let numOfColumnn = 3
        let firstRectX = x + cx - (((rectSize + margin) * numOfColumnn) / 2) + margin * 2
        let rectX = firstRectX
        let borderColor = 'white'
        //DUDE POSITION
        let dudeY = y + 45 * scy + offsetY
        let dudeX = x//will be centered
        let dudeScale = 5 * scx

        //PLATFORM POSITIONS
        let platformX = 0 // will be centered
        let platformY = y + 100 * scy + offsetY
        let platformScaleX = 400 * scx
        let platformScaleY = 4 * scy

        //MAIN TEXT POSITION
        let mainTextX = x + 190 * scx
        let mainTextY = y + 140 * scy + offsetY
        let mainTextScale = 3 * scx

        //PLAY BUTTON POSITION
        let playButtonX = 0 //will be centerd
        let playButtonY = y + 200 * scy + offsetY
        let playButtonScale = 3 * scx

        //HOMEBUTTON POSITION
        let homeButtonX = 30 * scx
        let homeButtonY = 30 * scy
        let homeButtonScale = 4 * scx

        //
        let chooseX = cx
        let chooseY = mainTextY - 10 * scy//cy  * scy
        let chooseScale = 3 * scx
        let arrowScale = 6 * scx


        colorIndex = Math.floor(Math.random() * colors.length)
        this.fg = colors[colorIndex]
        let clrs = colors.filter(c => c !== this.fg)
        this.bg = clrs[Math.floor(Math.random() * clrs.length)]


        this.cameras.main.setBackgroundColor(this.bg)


        //MAIN TEXT
        this.mainText = new Textt(this, mainTextX, mainTextY, 'CHOOSE YOUR COLOR', this.fg, mainTextScale)
        this.mainText.setX(this.cameras.main.width / 2 - this.mainText.getWidth() / 2)

        //DUDE
        this.dude = this.add.sprite(dudeX, dudeY, 'sprites', 'dude_run_0' + this.fg).setScale(dudeScale)
            .setOrigin(0, 0)

        this.dude.play('duderun' + this.fg).anims
            .setTimeScale(0.7)

        centerSpriteX(this, this.dude)

        //PLATFORM
        this.platform = this.add.sprite(platformX, platformY, 'sprites', 'dot' + this.fg)
            .setOrigin(0, 0)
            .setScale(platformScaleX, platformScaleY)

        centerSpriteX(this, this.platform)

        this.next = () => {
            colorIndex++
            if (colorIndex > colors.length - 1)
                colorIndex = 0
            this.changeColor()
        }
        this.prev = () => {
            colorIndex--
            if (colorIndex < 0)
                colorIndex = colors.length - 1
            this.changeColor()
        }

        this.arrowLeft = this.add.sprite(0, chooseY, 'buttons', 'arrow' + this.fg)
            .setScale(arrowScale)
            .setFlipX(true)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', this.prev)

        this.arrowLeft.setX(this.mainText.x - 35 * scx - this.arrowLeft.width)


        this.arrowRight = this.add.sprite(30 + this.mainText.x + this.mainText.getWidth(), chooseY, 'buttons', 'arrow' + this.fg)
            .setScale(arrowScale)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', this.next)

        //HOMEBUTTON
        this.homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + this.fg)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                GameInfo.prevScene = this.scene.key
            })
        //PLAY BUTTON
        if (this.fg === 'white') {
            borderColor = 'black'
        }
        if (this.fg === 'black') {
            borderColor = 'white'
        }

        const submit = () => {
            GameInfo.prevScene = this.scene.key
            GameInfo.players.localPlayer.color = colors[colorIndex]
            if (GameInfo.mode === 'multi') {
                this.scene.start('waitingScene')
                this.scene.sleep()
            } else if (GameInfo.mode === 'single') {
                this.scene.start('singleGameScene')
                this.scene.sleep()
            }
            this.scene.stop('menuScene')
        }
        this.playButton = this.add.sprite(playButtonX, playButtonY, 'buttons', 'playButton' + this.fg)
            .setScale(playButtonScale)
            .setOrigin(0, 0)
            .setInteractive()
        centerSpriteX(this, this.playButton)
        this.playButton.on('pointerup', submit)



        GameInfo.prevScene = this.scene.key

        this.changeColor = function () {
            this.fg = colors[colorIndex]
            if (this.fg === this.bg) {
                let clrs = colors.filter(c => c !== this.fg)
                this.bg = clrs[Math.floor(clrs.length * Math.random())]
            }

            this.cameras.main.setBackgroundColor(this.bg)
            this.playButton.setFrame('playButton' + this.fg)
            this.homeButton.setFrame('homeButton' + this.fg)
            this.arrowRight.setFrame('arrow' + this.fg)
            this.arrowLeft.setFrame('arrow' + this.fg)
            this.mainText.flipColor(this.fg)
            this.platform.setFrame('dot' + this.fg)
            this.dude.play('duderun' + this.fg)

            this.input.keyboard.on('keydown-SPACE', submit)
            this.input.keyboard.on('keydown-H', this.prev)
            this.input.keyboard.on('keydown-L', this.next)
            this.input.keyboard.on('keydown-LEFT', this.prev)
            this.input.keyboard.on('keydown-RIGHT', this.next)
        }
    }

    update(t, delta) {
        time++
        if (time % 250 === 0) {
            let index = Math.floor((colors.length) * Math.random())
            this.bg = colors.filter(c => c !== this.fg)[index]
            this.cameras.main.setBackgroundColor(this.bg)


        }
    }
}



