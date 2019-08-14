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


        //MAIN TEXT POSITION
        let mainTextX = x + cx
        let mainTextY = 125 * scy
        let mainTextScale = 0

        //DUDE POSITION
        let dudeY = 77 * scy
        let dudeX = cx + 10 * scx

        //PLAY BUTTON POSITION
        let playButtonPossitionX = cx
        let playButtonPossitionY = 200 * scy

        //TUTOR BUTTON POSITION


        let mainText = this.add.image(cx, 60 * scy, 'nadpis')
            .setOrigin(0, 0)
            .setScale(0.3)
        mainText.setX(cx - mainText.width * 0.3 / 2)

        //PLAY BUTTON
        this.add.image(playButtonPossitionX, playButtonPossitionY, 'buttons', 'playButtonrgb(255,255,255)')
            .setScale(3)
            .setScale(2.5)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.switch('menuScene')
                this.scene.sleep()
            })

        //TUTOR BUTTON
        this.add.image(cx, 260 * scy, 'buttons', 'tutorButtonrgb(255,255,255)')
            .setScale(2.5)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.prevScene = this.scene.key
                this.scene.switch('tutorScene')
                this.scene.sleep()
            })
        //DUDE
        this.add.sprite(cx + 10 * scx, 77 * scy, 'sprites', 'dude_run1_rgb(255,255,255')
            .play('dudejumprgb(255,255,255)')
            .setScale(5)
            .setInteractive()


        this.cameras.main.setBackgroundColor(colors[0])
        this.time = 0


    }

    update(t, delta) {
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
