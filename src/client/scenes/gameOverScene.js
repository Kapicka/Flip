import Display from '../display'
import Textt from "../textt"
import ColorManager from "../ColorManager"
import Messenger from '../messenger'
import GameInfo from '../gameInfo';
import centerSpriteX from "../utils";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({key: 'gameOverScene'})
    }

    init() {
    }

    preload() {
    }

    create() {
        let w = Display.gamingArea.width
        let h = Display.gamingArea.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w) / 2)
        let y = this.cameras.main.y + ((this.cameras.main.height - h) / 2)
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY

        let fg = GameInfo.players.localPlayer.color//'rgb(255,255,255)'//GameInfo.players.localPlayer.color
        let bg = GameInfo.players.remotePlayer.color
        while (fg === bg) {
            bg = ColorManager.getRandomColor()
        }
        this.cameras.main.setBackgroundColor(bg)

        let mainTextX = 0 //
        let mainTextY = y + 110 * scy
        let mainTextScale = 4 * scx

        let scoreTextX = 0
        let scoreTextY = mainTextY + 40 * scy

        let againButtonX = 0
        let againButtonY = scoreTextY + 70 * scy

        let homeButtonX = 30 * scy
        let homeButtonY = againButtonY
        let homeButtonScale = 5 * scx

        let homeButton = this.add.sprite(homeButtonX, homeButtonY,
            'buttons', 'homeButton' + fg)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.score = 0
                GameInfo.level = 1
                if (GameInfo.mode === 'multi') {
                    Messenger.socket.disconnect()
                    this.scene.stop('gameScene')
                    this.scene.stop('dummyGameScene')
                } else if (GameInfo.mode === 'multi') {
                    this.scene.stop('singeGameScene')
                }
                this.scene.start('firstScene')
            })

        let scoreY = y + 155 * scy
        let textX = this.cameras.main.x / 2
        let textY = this.cameras.main.y / 2
        let mainText = new Textt(this, mainTextX, mainTextY, 'Game Over', fg, mainTextScale)
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)
        let scoreText = new Textt(this, scoreTextX, scoreTextY, 'Score ' + GameInfo.score, fg, mainTextScale)

        let againButton = this.add.sprite(againButtonX, againButtonY, 'buttons', 'againButton' + fg)
            .setScale(4 * scx)
            .setInteractive()
            .on('pointerup', () => {
                GameInfo.score = 0
                GameInfo.level = 1
                if (GameInfo.mode === 'multi') {
                    Messenger.socket.disconnect()
                    Messenger.socket.disconnect()
                    let color = GameInfo.players.localPlayer.color
                    GameInfo.init(this)
                    GameInfo.players.localPlayer = {color: color}
                    Messenger.init(this)
                } else if (GameInfo.mode === 'single') {
                    this.scene.start('singleGameScene')
                }
            })
        againButton.width = againButton.width * 3 * scx
        let buttonsWidth = againButton.width + homeButton.width + 20 * scx
        againButton.setX(x + cx - buttonsWidth)
        homeButton.setX(x + cx + buttonsWidth)


        scoreText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)
    }

    update(t, delta) {
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
    }
}
