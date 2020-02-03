import createAnimations from '../animations';
import { getHighScoreScenePositions } from '../Positions'
import Textt from '../Textt'
import Display from '../Display'
import Messenger from '../Messenger'
import HighScore from '../highScore'
import ColorManager from '../ColorManager'



export default class HelpScene extends Phaser.Scene {
    constructor() {
        super({ key: 'helpScene' })
    }

    create() {
        createAnimations(this)
        const p = getHighScoreScenePositions(this)
        this.foregroundColor = ColorManager.getRandomColor()
        this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)
        this.cameras.main.setBackgroundColor(this.backgroundColor)
        document.body.style.backgroundColor = this.backgroundColor

        let scy = Display.gamingArea.scaleY
        let scx = Display.scaleX

        const centerSprite = (sprite) => {
            let sceneWidth = this.cameras.main.width
            sprite.width = sprite.width * sprite._scaleX
            let spriteWidth = sprite.width
            sprite.setX((sceneWidth / 2) - (spriteWidth / 2))
        }


        const rulesText = 'The goal of the game is to stay alive by jumping~over and sliding under the enemies that are~moving towards you. When you crash into them,~you lose one of your three lives.~~In multiplayer mode, you and the other dude are~playing together. Each time you make any aciton~(jump, slide etc.) the game flips and the other~player is on the turn. Color of the foreground~indicates who is playing. For example if you choose~yellow color you are on the trun only~when the foreground color is yellow.'
        //  const controlTextMobile = 'RUNNING~————~Swipe up to jump~Swipe down to slide~~SLIDING~————~Swipe up to run~~JUMPING~————~swipe down to fall faster'

        const controlTextPC = '~ACTION         CONDITION        KEY~-------------------------------------------------~JUPM           RUNNING         UP, SPACE, K~~SLIDE           RUNNING         DOWN, J~~RUN            SLIDING           UP, SPACE, K~~FAST FALL     JUMPING          DOWN, J'
        const controlTextMobile = '~ACTION         CONDITION        KEY~-------------------------------------------------~JUPM           RUNNING         SWIPE UP~~SLIDE           RUNNING         SWIPE DOWN~~RUN            SLIDING           SWIPE UP~~FAST FALL     JUMPING          SWIPE DOWN'

        let controlText = controlTextPC

        if (Display.mobile) {
            controlText = controlTextMobile
        }
        // this.add.image(500 * scx, 50, 'sprites', 'dude_run_0' + this.foregroundColor).setScale(3 * scx)
        // this.add.image(500 * scx, 100, 'sprites', 'dude_slide_0' + this.foregroundColor).setScale(3 * scx)
        // this.add.image(500 * scx, 150, 'sprites', 'dude_jump_0' + this.foregroundColor).setScale(3 * scx)

        // let control = new Textt(this, 10 * scx, 50 * scy, controlTextMobile, this.foregroundColor, 2.5 * scx)
        // control.setVisible(false)



        const titleText = new Textt(this, 0, 20 * scy, 'RULES', this.foregroundColor, 4).centerX()
        const mainText = new Textt(this, 50 * scx, 70 * scy, rulesText, this.foregroundColor, 2.5 * scy)
       



        const controlButton = new Textt(this, p.nextX, 20 * scy, 'CONTROL', this.foregroundColor, 2 * scx)
            .setInteractive()
            .setDarken(true)

        const rulesButton = new Textt(this, p.prevX + 30 * scx, 20 * scy, 'RULES', this.foregroundColor, 2 * scx)
            .setInteractive()


        const showControl = () => {
            this.sound.play('select')
            titleText.setText('CONTROL')
                .centerX()
            mainText.setText(controlText)
            rulesButton.setDarken(true)
            controlButton.setDarken(false)

        }
        const showRules = () => {
            this.sound.play('select')

            titleText.setText('RULES')
                .centerX()
            mainText.setText(rulesText)
            rulesButton.setDarken(false)
            controlButton.setDarken(true)

        }




        controlButton.on('pointerdown', showControl)
        rulesButton.on('pointerdown', showRules)


        this.add.sprite(p.homeButtonX, p.homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(p.homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.sound.play('select')
                this.scene.start('firstScene')
                this.scene.stop('tutorialScene')
            })


    }


    update(t) {

    }

}






