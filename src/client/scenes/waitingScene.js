import Textt from "../textt";
import Display from '../display';
import GameInfo from '../gameInfo';
import centerSpriteX from "../utils";
import ColorManager from "../ColorManager";
import Messenger from "../messenger";

let homeButton
let time = 0
let chosenColor
export default class WaitingScene extends Phaser.Scene {
    constructor() {
        super({key: 'waitingScene'})
    }

    preload() {
    }

    create() {

        let repeated = 0
        //POSITIONS
        chosenColor = GameInfo.players.localPlayer.color

        let w = Display.gamingArea.width//this.cameras.main.width
        let h = Display.gamingArea.height//this.cameras.main.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w) / 2)
        let y = this.cameras.main.y + ((this.cameras.main.height - h) / 2)
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY
        //HOMEBUTTON POSITION
        let homeButtonX =  + 30 * scy
        let homeButtonY =  30 * scy
        let homeButtonScale = 3 *scx
        //DUDE POSITION
        let dudeY = y + (cy + 20 * scy)
        let dudeX = x + cx * scx
        let dudeScale = 5 * scx
        console.log('x', dudeY)
        console.log('y', dudeX)
        //MAIN TEXT POSITION
        let mainTextX = x + cx * scx
        let mainTextY = y + 120 * scy
        let mainTextScale = 3 * scx

        //DUDE
        let dude = this.add.sprite(dudeX, dudeY, 'otherSprites', 'dude_stand_0' + chosenColor)
            .play('dudewait' + chosenColor)
            .setScale(dudeScale).setOrigin(0.5, 0.5)
            .on('animationrepeat', function (anim, frame, sprite) {
                repeated++
                if (repeated === 2) {
                    //     repeated = 0
                    //     if (this.flipX) {
                    //         this.setFlipX(false)
                    //     } else {
                    //         this.setFlipX(true)
                    //     }
                    this.play('dudewait' + chosenColor)
                    repeated = 0
                }
            })
        centerSpriteX(this, dude)

        //HOMEBUTTON
        homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + chosenColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                Messenger.socket.disconnect()
                this.scene.start('firstScene')
                this.scene.stop('gameScene')
            })

        //MAIN TEXT
        let mainText = new Textt(this, mainTextX, mainTextY, 'Waiting for 2 dude...', chosenColor, mainTextScale)
        mainText.setX(this.cameras.main.width / 2 - mainText.getWidth() / 2)


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
            let randomColor = ColorManager.getRandomColor()
            while (randomColor === chosenColor) {
                randomColor = ColorManager.getRandomColor()
            }
            this.cameras.main.setBackgroundColor(randomColor)
        }
    }
}
