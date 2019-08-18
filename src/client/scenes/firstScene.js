import Animations from '../animations'
import Display from '../display';
import ColorManager from '../ColorManager';
import GameInfo from "../gameInfo";

let colors = ColorManager.getColors()

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({key: 'firstScene'})
    }

    init() {
    }

    preload() {
    }

    create() {
        let w = Display.gamingArea.width//this.cameras.main.width
        let h = Display.gamingArea.height//this.cameras.main.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w) / 2)
        let y = this.cameras.main.y + ((this.cameras.main.height - h) / 2)
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY

        let offsetY = 50 * scy


        //MAIN TEXT POSITION
        let mainTextX = x + cx + 70 * scx
        let mainTextY = 60 * scy
        let mainTextScale = 0

        //DUDE POSITION
        let dudeY = 77 * scy
        let dudeX = x + cx + 10 * scx

        //SINGLE PLAYER BUTTON POSITION
        let onePlayerButtonX = x + cx
        let onePlayerButtonY = 200 * scy
        //PLAY BUTTON POSITION
        //MULTIPLAYER BUTTON POSITION
        let twoPlayerButtonX = onePlayerButtonX
        let twoPlayerButtonY = onePlayerButtonY + offsetY
        //TUTORIAL BUTTON POSITION
        let tutorialButtonX = onePlayerButtonX
        let tutorialButtonY = twoPlayerButtonY + offsetY


        let mainText = this.add.image(mainTextX, mainTextY, 'nadpis')
            .setOrigin(0, 0)
            .setScale(0.3)
        mainText.setX(x + cx - mainText.width * 0.3 / 2)

        this.add.image(onePlayerButtonX, onePlayerButtonY, 'buttons', 'onePlayerButtonrgb(255,255,255)')
            .setScale(3)
            .setScale(2.5)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.mode = 'single'
                this.scene.start('menuScene')
                this.scene.sleep()
            })
        //SINGLE BUTTON
        this.add.image(twoPlayerButtonX, twoPlayerButtonY, 'buttons', 'twoPlayerButtonrgb(255,255,255)')
            .setScale(3)
            .setScale(2.5)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.mode = 'multi'
                this.scene.start('menuScene')
                this.scene.sleep()
            })

        //TUTOR BUTTON
        this.add.image(tutorialButtonX, tutorialButtonY, 'buttons', 'tutorialButtonrgb(255,255,255)')
            .setScale(2.5)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.prevScene = this.scene.key
                GameInfo.mode = 'single'
                this.scene.start('tutorialScene')
                this.scene.sleep()
            })
        //DUDE
        this.add.sprite(dudeX, dudeY, 'sprites', 'dude_run_1rgb(255,255,255)')
            .play('dudejumprgb(255,255,255)')
            .setScale(5)
            .setInteractive()


        this.cameras.main.setBackgroundColor(colors[0])
        this.time = 0


    }

    update(t, delta) {
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
        this.time++
        if (this.time > 900) {
            this.time = 0
            let randomColor = colors[Math.floor(Math.random() * colors.length - 1)]
            let randomColor2 = colors[Math.floor(Math.random() * colors.length - 1)]
            while (randomColor === randomColor2) {
                randomColor2 = colors[Math.floor(Math.random() * colors.length - 1)]
            }
            this.cameras.main.setBackgroundColor(randomColor)
        }
    }
}
