import Animations from '../animations'
import ColorManager from '../ColorManager'
import Messenger from '../messenger'
import Display from '../display';
import centerSpriteX from '../utils'
import GameInfo from '../gameInfo';
import Textt from '../textt'
import Ovladac from "../Ovladac";


let rotated = false
let time = 0
let backgroundColor
let borderColor = 'white'
let chosenColor
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
        GameInfo.init(this)
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

        //CHOOSABLE COLORS POSITION
        let rectSize = 20 * scy
        let margin = 8 //* scx
        let rectY = y + 150 * scy
        let numOfColumnn = 3
        let firstRectX = x + cx - (((rectSize + margin) * numOfColumnn) / 2) + margin * 2
        let rectX = firstRectX
        let borderColor = 'white'
        //DUDE POSITION
        let dudeY = y + 45 * scy
        let dudeX = x//will be centered
        let dudeScale = 5 * scx

        //PLATFORM POSITIONS
        let platformX = 0 // will be centered
        let platformY = y + 100 * scy
        let platformScaleX = 400 * scx
        let platformScaleY = 4 * scy

        //MAIN TEXT POSITION
        let mainTextX = x + 190 * scx
        let mainTextY = y + 125 * scy
        let mainTextScale = 3 * scx

        //PLAY BUTTON POSITION
        let playButtonX = 0 //will be centerd
        let playButtonY = y + 280 * scy
        let playButtonScale = 2 * scx

        //HOMEBUTTON POSITION
        let homeButtonX = 30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 3 * scx

        //Colors
        backgroundColor = ColorManager.getRandomColor()
        chosenColor = ColorManager.getRandomColor()
        while (backgroundColor === chosenColor) {
            backgroundColor = ColorManager.getRandomColor()
        }
        console.log('bg color', backgroundColor)
        console.log('fg color', chosenColor)
        mainCamera = this.cameras.main
        mainCamera.setBackgroundColor(ColorManager.getHex(backgroundColor))

        //MAIN TEXT
        mainText = new Textt(this, mainTextX, mainTextY, 'Choose your color', chosenColor, mainTextScale)
        console.log('width', mainText.getWidth())
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)
        //DUDE
        dude = this.add.sprite(dudeX, dudeY, 'sprites', 'dude_run0' + chosenColor).setScale(dudeScale)
            .setOrigin(0, 0)
        // dude.play('duderun' + chosenColor)
        dude.play('duderun' + chosenColor)
            .anims.setTimeScale(0.7)
        centerSpriteX(this, dude)

        //PLATFORM
        platform = this.add.sprite(platformX, platformY, 'sprites', 'dot' + chosenColor).setOrigin(0, 0)
            .setScale(platformScaleX, platformScaleY)
        centerSpriteX(this, platform)


        //HOMEBUTTON
        homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + chosenColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                GameInfo.prevScene = this.scene.key
            })
        //PLAY BUTTON
        if (chosenColor === 'white') {
            borderColor = 'black'
        }
        if (chosenColor === 'black') {
            borderColor = 'white'
        }

        playButton = this.add.sprite(playButtonX, playButtonY, 'buttons', 'playButton' + chosenColor)
            .setScale(playButtonScale)
            .setOrigin(0, 0)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.prevScene = this.scene.key
                GameInfo.players.localPlayer = {color: chosenColor}
                if (GameInfo.hasTutorial) {
                    Messenger.init(this)
                } else {
                    this.scene.switch('tutorScene')
                    this.scene.sleep()
                }
            })
        centerSpriteX(this, playButton)


        ColorManager.getColors().forEach((c, i) => {
            if (i % 3 === 0) {
                rectX = firstRectX
                rectY += scy * rectSize + margin
            }
            let r = this.add.sprite(rectX, rectY, 'buttons', 'color' + c)
                .setScale(1.5 * scx)
            r.color = c
            r.setInteractive()
            r.on('pointerup', () => {
                chosenColor = r.color
                changeColor(chosenColor)
                playButton.setFrame('playButton' + chosenColor)
                homeButton.setFrame('homeButton' + chosenColor)
                mainText.flipColor(chosenColor)
                platform.setFrame('dot' + chosenColor)
                dude.play('duderun' + chosenColor)
            })
            rectX += scx * (margin + rectSize)
        })
        GameInfo.prevScene = this.scene.key
        GameInfo.players.localPlayer = {color: chosenColor}
        Messenger.init(this)

    }

    update(t, delta) {

        time++
        if (time > 250) {
            time = 0
            let randomColor = ColorManager.getRandomColor()
            while (randomColor === chosenColor) {
                randomColor = ColorManager.getRandomColor()
            }
            console.log('random color', randomColor)
            console.log('fg color', chosenColor)
            this.cameras.main.setBackgroundColor(randomColor)
            backgroundColor = randomColor
        }
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
    }
}

function changeColor(chosenColor) {
    if (chosenColor === 'rgb(255,255,255') {
        borderColor = 'black'
    }
    if (chosenColor === 'rgb(0,0,0)') {
        borderColor = 'white'
    }
    if (chosenColor === backgroundColor) {
        backgroundColor = getRandomBg()
        mainCamera.setBackgroundColor(backgroundColor)
    }
}

function swipe() {

}


function getRandomBg(bg, ch) {
    while (bg === ch) {
        bg = ColorManager.getRandomColor()
    }
    return bg
}

