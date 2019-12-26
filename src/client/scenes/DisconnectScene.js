import createAnimations from '../animations';
import GameInfo from '../GameInfo';
import { getDisconnectScenePosition } from '../Positions'
import Textt from '../Textt'
import Display from '../Display'
import TextMenu from '../TextMenu';
import ColorManager from '../ColorManager';





export default class DisconnectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'disconnectScene' })

    }

    create(data) {

        if (GameInfo.players !== undefined) {
            this.foregroundColor = GameInfo.players.localPlayer.color
            this.backgroundColor = GameInfo.players.remotePlayer.color
        }

        if (this.foregroundColor === undefined) {
            this.foregroundColor = ColorManager.getRandomColor()
            this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)
        }
        document.body.style.backgroundColor = this.backgroundColor   

        this.cameras.main.setBackgroundColor(this.backgroundColor)

        const p = getDisconnectScenePosition(this)
        let mainText = 'CONNECTION~    LOST'
        let secondaryText = 'COME BACK LATER'

        if (data.subject === 'player') {
            mainText = '   PLAYER 2~DISCONNECTED'
            secondaryText = 'NEW GAME'
        }

        new Textt(this, p.mainTextX, p.mainTextY, mainText, this.foregroundColor, p.mainTextScale)
            .centerX()


        const newGame = () => {
            GameInfo.score = 0
            GameInfo.players.remotePlayer = undefined
            this.scene.start('waitingScene')
            this.scene.stop('disconnectScene')
        }

        let config = {
            x: p.secondaryTextX,
            y: p.secondaryTextY,
            color: this.foregroundColor,
            scale: p.secondaryTextScale,
            mobile: Display.mobile,
            items: [{ text: 'NEW GAME', action: newGame }]

        }

        const second = new TextMenu(this, config)

        // let second = new Textt(this, p.secondaryTextX, p.secondaryTextY, secondaryText, this.foregroundColor, p.secondaryTextScale)
        //     .centerX()


        let homeButtonScale = 4 * Display.scaleX
        this.homeButton = this.add.sprite(p.homeButtonX, p.homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                this.scene.stop('disconnectScene')
            })
    }

}
