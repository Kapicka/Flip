
import Phaser from 'phaser'
import Textt from '../Textt'
import Display from '../Display'
import PixelChar from '../PixelFont'
import ColorManager from '../ColorManager'
import KeyEntry from '../KeyEntry'
import Messenger from '../Messenger'
import GameInfo from '../GameInfo'



export default class EnterNameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'enterNameScene' })
    }

    create(data) {
        this.foregroundColor = GameInfo.players.localPlayer.color
        if (GameInfo.mode === 'single') {
            this.backgroudColor = ColorManager.getRandomExcept(this.foregroundColor)
        }
        else {
            this.backgroudColor = GameInfo.players.remotePlayer.color
        }

        const activeColor = ('rgb(198,198,198)')

        this.cameras.main.setBackgroundColor(this.backgroudColor)
        document.body.style.backgroundColor = this.backgroudColor

        const keyEntry = new KeyEntry(this,
            0,
            Display.height / 2, Display.width * 0.8, this.foregroundColor, activeColor)
            .centerX()

        let imageY = 50 * Display.scaleY

        let name = ''
        let blinkingText = 'ENTER NAME'
        let blinkingImage = new Textt(this, 0, imageY, blinkingText, this.foregroundColor, 7)
        blinkingImage.setX(Display.width / 2 - blinkingImage.getWidth() / 2)

        let nameImage = new Textt(this, 0, imageY, name, this.foregroundColor, 7)
            .centerX()

        let firstStroke = true

        keyEntry.on('keydown', char => {
            this.sound.play('confirm')
            if (firstStroke) {
                this.blinking.remove()
                nameImage.setVisible(true)
                blinkingImage.setVisible(false)
                firstStroke = false
                nameImage.centerX()             

            }

            if (name.length < 8) {
                name += char
                nameImage.setText(name)
                nameImage.centerX()
            }
        })
        keyEntry.on('rub', () => {
            if (name.length != 0) {
                name = name.slice(0, name.length - 1)
                nameImage.setText(name)
                nameImage.centerX()
                this.sound.play('confirm')
                return
            }
            this.cameras.main.flash()
        })

        const addGame = () => {
            const player = GameInfo.players.localPlayer
            player.name = name
            const score = GameInfo.score
            let game = {}

            if (GameInfo.mode === 'multi') {
                game = { id: GameInfo.gameId, player: player, score: score }
            }
            if (GameInfo.mode === 'single') {
                game = { player: player, score: score }
            }
            Messenger[GameInfo.mode].addGame(game)
                .then(res => res.json())
                .then(data => {
                    this.scene.start('highScoreScene',
                        {
                            fg: this.foregroundColor,
                            bg: this.backgroudColor,
                            rank: data.rank,
                            id: data.id,
                            mode: GameInfo.mode
                        })
                    this.scene.stop(this)
                })
        }

        keyEntry.on('ok', () => {
            if (name.length) {
                addGame()
                this.sound.play('confirm')
                return
            }
            this.cameras.main.flash()
        })

        keyEntry.on('keychanged', () => {
            this.sound.play('select')

        })


        this.blinking = this.time.addEvent({
            delay: 500,                // ms
            callback: () => { blinkingImage.setVisible(!blinkingImage.visible) },
            loop: true
        })

        this.input.keyboard.on('keydown-J', keyEntry.moveDown)
        this.input.keyboard.on('keydown-K', keyEntry.moveUp)
        this.input.keyboard.on('keydown-L', keyEntry.moveRight)
        this.input.keyboard.on('keydown-H', keyEntry.moveLeft)
        this.input.keyboard.on('keydown-DOWN', keyEntry.moveDown)
        this.input.keyboard.on('keydown-UP', keyEntry.moveUp)
        this.input.keyboard.on('keydown-RIGHT', keyEntry.moveRight)
        this.input.keyboard.on('keydown-LEFT', keyEntry.moveLeft)
        this.input.keyboard.on('keydown-SPACE', keyEntry.submit)
        this.input.keyboard.on('keydown-ENTER', keyEntry.submit)

        let homeButtonX = 30 * Display.scaleX
        let homeButtonY = 30 * Display.scaleX
        let homeButtonScale = 4 * Display.scaleX



        this.homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                this.scene.stop('enterNameScene')

            })
    }
}


function startFirstScene() {
    this.scene.start('firstScene')
    this.scene.stop('enterNameScene')
}
