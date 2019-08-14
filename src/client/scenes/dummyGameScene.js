import Animations from '../animations'
import ColorManager from '../ColorManager'
import Messenger from '../messenger'
import Score from '../Score'
import Runner from '../runner'
import GameInfo from '../gameInfo'
import GameActions from '../gameActions'
import runnerStates from '../runnerStates'
import Display from '../display'
import Controller from '../controller';


export default class DummyGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'dummyGameScene'})
    }

    init() {
        GameInfo.currentScene = this
        Controller.init(this)
        GameActions.init(this)
    }

    preload() {
    }

    create() {

        // this.add.receangle(0, 0, Display.gamingArea.width, Display.gamingArea.height, 'black').setOrigin(0, 0)
        Animations.init(this)
        this.foregroundColor = GameInfo.players.remotePlayer.color
        this.backgroundColor = GameInfo.players.localPlayer.color

        while (this.foregroundColor === this.backgroundColor) {
            this.foregroundColor = ColorManager.getRandomColor()
        }
        GameInfo.players.remotePlayer.color = this.foregroundColor
        this.cameras.main.setBackgroundColor(this.backgroundColor)


        //STARTING POSITIONS

        let w = Display.gamingArea.width//this.cameras.main.width
        let h = Display.gamingArea.height//this.cameras.main.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((this.cameras.main.width - w))
        let y = this.cameras.main.y
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY
        let widthCrop = Display.widthCrop
        let heightCrop = Display.heightCrop
        let gamingScaleX = Display.gamingArea.scaleX
        let gamingScaleY = Display.gamingArea.scaleY
        let fg = this.foregroundColor

        //DUDE POSITION
        let dudeX = x + 20 * scx
        let dudeY = 20 * scy
        let dudeScale = 4 * scx

        //PLATFORM  POSITION
        let platformX = (x - w)
        let platformY = h * (1 - (1 / 4))
        let platformWidth = (w * 3) * scx
        let platformHeight = 10 * scy
        let platformscale = 3 * scx

        //DISPLAYED LIVES POSSITONS
        let liveMarginLeft = 25 * scx
        let liveX = 30 * scx
        let liveY = 30 * scx
        let liveScale = 3 * scx

        //DISPLAYD SCORE POSITON
        let displayedScoreX = x + w - (liveScale * 15)
        let displayedScoreY = liveY
        let displaydScoreSize = 3 * scx

        //GROUPS
        this.platforms = this.add.group()
        this.enemies = this.add.group()
        this.gameObjects = this.add.group()
        this.movableObjects = this.add.group()
        this.bullets = this.add.group()
        this.lives = this.add.group()

        // PLATFORMS
        let p = this.platforms.create(platformX, platformY, 'sprites', 'dot' + this.foregroundColor)
            .setOrigin(0, 0)
            .setScale(platformWidth, platformHeight)
        // DUDE
        this.dude = this.add.sprite(dudeX, dudeY, 'dude_jump_0' + this.foregroundColor)
            .setOrigin(0, 0)
        this.dude.play('dudejump' + this.foregroundColor)
        this.dude.anim = 'mp'
        this.dude.lives = 3
        this.dude.setScale(dudeScale)
        this.dude.character = 'dude'
        this.dude.id = 'dude'
        this.gameObjects.add(this.dude)


        // DISPLAYED LIVES
        for (let i = 0; i < this.dude.lives; i++) {
            let l = this.lives.create(liveX + liveMarginLeft, liveY, 'sprites', 'live' +
                fg).setScale(liveScale)
            liveMarginLeft += l.width * liveScale + 1 * scx
            l.key = 'live'
        }

        //DISPLAYD SCORE LABLE & VALUE
        this.displaydScore = new Score(this, displayedScoreX - 100, displayedScoreY, displaydScoreSize)
        this.displaydScore.setScore(0)
        Messenger.initGameComunication()
    }

    update() {
        Controller.handleInputSlave()
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
    }
}
