import Animations from '../animations'
import ColorManager from '../ColorManager'
import Messenger from '../messenger'
import Display from '../display';
import centerSpriteX from '../utils'
import GameInfo from '../gameInfo';
import Textt from '../textt'

let offsetY
let arrowLeft
let arrowRight
let rotated = false
let colorIndex
let time = 0
let bg
let fg
let rectangle
let borderColor = 'white'
let playButton
let platform
let mainText = undefined
let dude = undefined
let homeButton = undefined
let colors = ColorManager.getColors()
let mainCamera

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({key: 'menuScene'})
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
        let homeButtonX = 30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 4 * scx

        //
        let chooseX = cx
        let chooseY = mainTextY - 10 * scy//cy  * scy
        let chooseScale = 3 * scx
        let arrowScale = 6 * scx


        //Colors
        bg = ColorManager.getRandomColor()
        colorIndex = Math.floor(Math.random() * colors.length - 1)
        if (colorIndex === -1) colorIndex = 0
        let fg = colors[colorIndex]
        //MAIN TEXT
        mainText = new Textt(this, mainTextX, mainTextY, 'Choose your color', fg, mainTextScale)
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)
        //DUDE
        dude = this.add.sprite(dudeX, dudeY, 'sprites', 'dude_run_0' + fg).setScale(dudeScale)
            .setOrigin(0, 0)
        // dude.play('duderun' + fg)
        dude.play('duderun' + fg)
            .anims.setTimeScale(0.7)
        centerSpriteX(this, dude)

        //PLATFORM
        platform = this.add.sprite(platformX, platformY, 'sprites', 'dot' + fg).setOrigin(0, 0)
            .setScale(platformScaleX, platformScaleY)
        centerSpriteX(this, platform)
        //

        arrowLeft = this.add.sprite(0, chooseY, 'buttons', 'arrow' + fg)
            .setScale(arrowScale)
            .setFlipX(true)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', () => {
                colorIndex--
                if (colorIndex < 0)
                    colorIndex = colors.length - 1
                console.log(colors[colorIndex])
                changeColor()
            })
        arrowLeft.setX(mainText.x - 35 * scx - arrowLeft.width)
        // rectangle = this.add.sprite(chooseX, chooseY, 'buttons', 'color' + fg)
        //     .setScale(chooseScale)
        arrowRight = this.add.sprite(30 + mainText.x + mainText.getWidth(), chooseY, 'buttons', 'arrow' + fg)
            .setScale(arrowScale)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', () => {
                colorIndex++
                console.log(colors[colorIndex])
                if (colorIndex > colors.length - 1)
                    colorIndex = 0
                changeColor()
            })

        //HOMEBUTTON
        homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + fg)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                GameInfo.prevScene = this.scene.key
            })
        //PLAY BUTTON
        if (fg === 'white') {
            borderColor = 'black'
        }
        if (fg === 'black') {
            borderColor = 'white'
        }

        playButton = this.add.sprite(playButtonX, playButtonY, 'buttons', 'playButton' + fg)
            .setScale(playButtonScale)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.prevScene = this.scene.key
                GameInfo.players.localPlayer = {color: colors[colorIndex]}

                if (GameInfo.mode === 'multi') {
                    Messenger.init(this)
                } else if (GameInfo.mode === 'single') {
                    this.scene.start('singleGameScene')
                    this.scene.sleep()
                }
            })
        centerSpriteX(this, playButton)


        // ColorManager.getColors().forEach((c, i) => {
        //     if (i % 3 === 0) {
        //         rectX = firstRectX
        //         rectY += scy * rectSize + margin
        //     }
        //     let r = this.add.sprite(rectX, rectY, 'buttons', 'color' + c)
        //         .setScale(1.5 * scx)
        //     r.color = c
        //     r.setInteractive()
        //     r.on('pointerup', () => {
        //         fg = r.color
        //         changeColor(fg)
        //         playButton.setFrame('playButton' + fg)
        //         homeButton.setFrame('homeButton' + fg)
        //         mainText.flipColor(fg)
        //         platform.setFrame('dot' + fg)
        //         dude.play('duderun' + fg)
        //     })
        //     rectX += scx * (margin + rectSize)
        // })
        GameInfo.prevScene = this.scene.key

    }

    update(t, delta) {
        time++
        while (bg === colors[colorIndex]) {
            bg = ColorManager.getRandomColor()
            this.cameras.main.setBackgroundColor(bg)
        }
        if (time % 250 === 0) {
            let randomColor = ColorManager.getRandomColor()
            this.cameras.main.setBackgroundColor(randomColor)
            bg = randomColor
        }
        if (Display.mobile) {
            if (window.innerWidth < window.innerHeight) {
                document.getElementById('rotateScreen').style.visibility = 'visible'
            } else {
                document.getElementById('rotateScreen').style.visibility = 'hidden'
            }
        }
    }
}

function changeColor() {
    fg = colors[colorIndex]
    playButton.setFrame('playButton' + fg)
    homeButton.setFrame('homeButton' + fg)
    arrowRight.setFrame('arrow' + fg)
    arrowLeft.setFrame('arrow' + fg)
    mainText.flipColor(fg)
    platform.setFrame('dot' + fg)
    dude.play('duderun' + fg)
}

