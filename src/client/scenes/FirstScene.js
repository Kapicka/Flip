import Textt from '../Textt'
import Display from '../Display';
import ColorManager from '../ColorManager';
import GameInfo from '../GameInfo';
import TextMenu from '../TextMenu';
import { getFirstScenePositions } from '../Positions'

let colors = ColorManager.getColors()

export default class FirstScene extends Phaser.Scene {
    constructor() {
        super({ key: 'firstScene' })
    }
    create() {
        let offset = -25 * Display.gamingArea.scaleY
        this.backgroundColor = ColorManager.getRandomExcept('rgb(255,255,255)')
        this.cameras.main.setBackgroundColor(this.backgroundColor)
        document.body.style.backgroundColor = this.backgroundColor

        const p = getFirstScenePositions(this)

        //NADPIS

        const mainText = new Textt(this, p.flX, p.flY + offset, 'FL', 'rgb(255,255,255)', p.mainTextScale)
        const mainImage = this.add.image(p.iX, p.iY + offset, 'pixelFont', 'l').setScale(p.mainTextScale, 4 * Display.scaleX).setTintFill()
        const pText = new Textt(this, p.pX, p.pY + offset, 'P', 'rgb(255,255,255)', p.mainTextScale)

        //RUNNER
        const runner = this.add.sprite(p.dudeX, p.dudeY + offset, 'sprites', 'dude_run_1rgb(255,255,255)')
            .play('dudejumprgb(255,255,255)')
            .setScale(5 * Display.scaleX)
            .setInteractive()


        const startGame = (mode) => {
            this.sound.play('confirm')
            GameInfo.init()
            GameInfo.mode = mode
            this.scene.start('menuScene')
            this.scene.sleep()
        }

        const startTutorial = () => {
            this.sound.play('confirm')
            this.scene.start('tutorialScene')
            this.scene.sleep()
        }
        const startHelp = () => {
            this.sound.play('confirm')
            let color = ColorManager.getRandomColor()
            this.scene.start('helpScene', {
                bg: color,
                fg: ColorManager.getRandomExcept(color)
            })
            this.scene.sleep()
        }

        const startHighScores = () => {
            this.sound.play('confirm')
            const fg = 'rgb(255,255,255)'
            const bg = ColorManager.getRandomExcept(fg)

            this.scene.start('highScoreScene', {
                fg: fg,
                bg: bg,
                rank: 0,
                mode: 'multi'
            })
            this.scene.sleep()
        }

        const menuItems = [
            { text: '1 PLAYER GAME', action: () => startGame('single') },
            { text: '2 PLAYER GAME', action: () => startGame('multi') },
            { text: 'HIGH SCORES', action: startHighScores },
            { text: 'TUTORIAL', action: startTutorial },
            { text: 'HELP', action: startHelp }
        ]


        const menuConfig = {
            x: p.menuX,
            y: p.menuY + offset,
            color: 'rgb(255,255,255)',
            scale: p.menu,
            mobile: Display.mobile,
            items: menuItems
        }


        let textMenu = new TextMenu(this, menuConfig)

        textMenu.on('selectionchanged', () => this.sound.play('select'))
        this.input.keyboard.on('keydown-J', () => { textMenu.down(); this.sound.play('select') })
        this.input.keyboard.on('keydown-K', () => { textMenu.up(); this.sound.play('select') })
        this.input.keyboard.on('keydown-UP', () => { textMenu.up(); this.sound.play('select') })
        this.input.keyboard.on('keydown-DOWN', () => { textMenu.down(); this.sound.play('select') })
        this.input.keyboard.on('keydown-SPACE', () => textMenu.submit())
        this.input.keyboard.on('keydown-ENTER', () => textMenu.submit())

    }

    update(t, delta) {
        if (Display.mobile) {
            if (window.innerWidth < window.innerHeight) {
                document.getElementById('rotate-screen').style.visibility = 'visible'
            } else {
                document.getElementById('rotate-screen').style.visibility = 'hidden'
            }
        }
        this.time++
        if (this.time > 900) {
            this.time = 0
            this.backgroundColor = ColorManager.getRandomExcept('rgb(255,255,255)')
            this.cameras.main.setBackgroundColor(randomColor)
            document.body.style.backgroundColor = randomColor
        }
    }
}
