import Animations from '../animations'
import Textt from "../textt";
import Messenger from '../messenger'
import Display from '../display';
import GameInfo from '../gameInfo';


export default class PlayerDisconnectedScene extends Phaser.Scene {
    constructor() {
        super({key: 'playerDisconnectedScene'})
    }

    init() {
    }

    preload() {
    }

    create() {
        console.log(GameInfo.score)
        let w = Display.gamingArea.width
        let h = Display.gamingArea.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w))
        let y = this.cameras.main.y
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY
        let mainTextX = x + 190 * scx
        let mainTextY = y + 125 * scy
        let mainTextScale = 3 * scx
        let fg = GameInfo.players.localPlayer.color

        //HOMEBUTTON POSITION
        let homeButtonX = 30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 3 * scx
        let homeButton = this.add.sprite(homeButtonX, homeButtonY,
            'buttons', 'homeButton' + fg)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                Messenger.socket.disconnect()
                this.scene.start('firstScene')
                this.scene.stop('gameScene')
            })
        let textX = this.cameras.main.x / 2
        let textY = this.cameras.main.y / 2
        let text = new Textt(this, mainTextX, mainTextY, '2 player left...',
            fg, mainTextScale)
    }

    update(t, delta) {
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
    }
}
