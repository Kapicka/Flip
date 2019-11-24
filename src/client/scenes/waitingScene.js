import Textt from "../textt";
import Display from '../display';
import GameInfo from '../gameInfo';
import centerSpriteX from "../utils";
import ColorManager from "../colorManager";
import Messenger from "../messenger";


let time = 0
let chosenColor
export default class WaitingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'waitingScene' })
    }

    inti() {
    }

    create() {
        let repeated = 0
        //POSITIONS
        chosenColor = GameInfo.players.localPlayer.color
        this.colors = ColorManager.getColors()

        let w = Display.gamingArea.width//this.cameras.main.width
        let h = Display.gamingArea.height//this.cameras.main.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w) / 2)
        let y = this.cameras.main.y + ((this.cameras.main.height - h) / 2)
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY
        //HOMEBUTTON POSITION
        let homeButtonX = +30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 3 * scx
        //DUDE POSITION
        let dudeY = y + (cy + 20 * scy)
        let dudeX = x + cx * scx
        let dudeScale = 5 * scx
        //MAIN TEXT POSITION
        let mainTextX = x + cx * scx
        let mainTextY = y + 120 * scy
        let mainTextScale = 3 * scx

        let index = Math.floor(Math.random() * this.colors.length - 1)
        let randomColor = this.colors.filter(c => c !== chosenColor)[index]
        this.cameras.main.setBackgroundColor(randomColor)

        //DUDE
        let dude = this.add.sprite(dudeX, dudeY, 'otherSprites', 'dude_stand_0' + chosenColor)
            .play('dudewait' + chosenColor)
            .setScale(dudeScale).setOrigin(0.5, 0.5)
            .on('animationrepeat', function (anim, frame, sprite) {
                repeated++
                if (repeated === 2) {
                    this.play('dudewait' + chosenColor)
                    repeated = 0
                }
            })
        centerSpriteX(this, dude)

        //HOMEBUTTON
        this.homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + chosenColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                socket.emit('gameover')
                socket.disconnect()
                this.scene.start('firstScene')
            })

        //MAIN TEXT
        let mainText = new Textt(this, mainTextX, mainTextY, 'WAITING FOR PLAYER 2', chosenColor, mainTextScale)
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)

        Messenger.init()
        const socket = Messenger.getSocket()

        socket.on('handshake', (id) => {
            let local = GameInfo.players.localPlayer
            GameInfo.players.localPlayer.id = id
            socket.emit('playerInfo', { id: id, color: local.color })

            socket.on('firstplayer', () => {
                GameInfo.master = true
                GameInfo.onTurn = true
            })
            socket.on('startgame', (room) => {
                const localId = GameInfo.players.localPlayer.id
                const remotePlayer = room.players.find(p => p.id !== localId)
                console.log('players ', room.players)
                console.log('localId', localId)
                console.log('remote players', remotePlayer)

                GameInfo.gameId = room.id
                GameInfo.players.remotePlayer = remotePlayer
                if (remotePlayer.color === GameInfo.players.localPlayer.color) {
                    remotePlayer.color = ColorManager.getRandomExcept(GameInfo.players.localPlayer.color)
                }
                console.log('ajaj', GameInfo.master)

                if (GameInfo.master) {
                    this.scene.start('gameScene')
                    this.scene.stop('waitingScene')
                } else {
                    this.scene.start('dummyGameScene')
                    this.scene.stop('waitingScene')
                }
            })

        })
    }

    update(t, delta) {
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
        time++
        if (time > 250) {
            time = 0
            let index = Math.floor(Math.random() * this.colors.length - 1)
            let randomColor = this.colors.filter(c => c !== chosenColor)[index]
            this.cameras.main.setBackgroundColor(randomColor)
        }
    }
}
