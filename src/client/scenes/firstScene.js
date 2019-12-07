import Textt from '../textt'
import Display from '../display';
import ColorManager from '../colorManager';
import GameInfo from "../gameInfo";
import TextMenu from '../textMenu';
import { getFirstScenePositions } from '../positions'

let colors = ColorManager.getColors()

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({ key: 'firstScene' })
    }
    create() {


        this.backgroundColor = ColorManager.getRandomExcept('rgb(255,255,255)')
        this.cameras.main.setBackgroundColor(this.backgroundColor)

        const p = getFirstScenePositions(this)

        //NADPIS
        new Textt(this, p.flX, p.flY, 'FL', "rgb(255,255,255)", p.mainTextScale)
        this.add.image(p.iX, p.iY, 'pixelFont', 'lrgb(255,255,255)').setScale(p.mainTextScale, 4 * Display.scaleX)
        new Textt(this, p.pX, p.pY, 'P', "rgb(255,255,255)", p.mainTextScale)

        //RUNNER
        this.add.sprite(p.dudeX, p.dudeY, 'sprites', 'dude_run_1rgb(255,255,255)')
            .play('dudejumprgb(255,255,255)')
            .setScale(5)
            .setInteractive()


        const startGame = (mode) => {
            GameInfo.init()
            GameInfo.mode = mode
            this.scene.start('menuScene')
            this.scene.sleep()
        }

        const startTutorial = () => {
            this.scene.start('tutorialScene')
            this.scene.sleep()
        }

        const startHighScores = () => {
            const fg = 'rgb(255,255,255)'
            const bg = ColorManager.getRandomExcept('fg')

            this.scene.start('highScoreScene', {
                fg: fg,
                bg: bg,
                rank: 0,
                mode: 'multi'
            })
            this.scene.sleep()
        }

        const menuItems = [
            { text: "1 PLAYER GAME", action: () => startGame('single') },
            { text: "2 PLAYER GAME", action: () => startGame('multi') },
            { text: "HIGH SCORES", action: startHighScores },
            { text: "TUTORIAL", action: startTutorial }
        ]


        const menuConfig = {
            x: p.menuX,
            y: p.menuY,
            color: 'rgb(255,255,255)',
            scale: p.menu,
            mobile: Display.mobile,
            items: menuItems
        }
        let textMenu = new TextMenu(this, menuConfig)

        this.input.keyboard.on('keydown-J', () => textMenu.down())
        this.input.keyboard.on('keydown-K', () => textMenu.up())
        this.input.keyboard.on('keydown-UP', () => textMenu.up())
        this.input.keyboard.on('keydown-DOWN', () => textMenu.down())
        this.input.keyboard.on('keydown-SPACE', () => textMenu.submit())
        this.input.keyboard.on('keydown-ENTER', () => textMenu.submit())

    }

    update(t, delta) {
        if (Display.mobile) {
            if (window.innerWidth < window.innerHeight) {
                document.getElementById('rotateScreen').style.visibility = 'visible'
            } else {
                document.getElementById('rotateScreen').style.visibility = 'hidden'
            }
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
