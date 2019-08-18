import Animations from '../animations'
import Score from '../Score'
import EnemyFactory from '../enemyFactory'
import EnemyGenerator from '../enemyGenerator'
import PlatformFactory from '../platformFactory'
import Runner from '../runner'
import GameInfo from '../gameInfo'
import GameActions from '../gameActions'
import Display from '../display'
import Controller from '../controller'
import ColorManager from "../ColorManager";

let pos = 0
let isDown = false
export default class SingleGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'singleGameScene'})
    }

    init() {
        GameInfo.currentScene = this
        EnemyFactory.init(this)
        EnemyGenerator.init(this)
        PlatformFactory.init(this)
        GameActions.init(this)
        Controller.init(this)
    }


    create() {
        Animations.init(this)
        this.foregroundColor = GameInfo.players.localPlayer.color
        this.backgroundColor = ColorManager.getRandomColor()
        while (this.foregroundColor === this.backgroundColor) {
            this.backgroundColor = ColorManager.getRandomColor()
        }
        GameInfo.players.remotePlayer.color = this.backgroundColor

        this.cameras.main.setBackgroundColor(this.backgroundColor)


        //STARTING POSITIONS
        let w = Display.gamingArea.width
        let h = Display.gamingArea.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((Display.width - w))
        let y = this.cameras.main.y
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY
        let fg = this.foregroundColor

        //DUDE POSITION
        let dudeX = x + 40 * scx
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

        //SCORE POSITON
        let displayedScoreX = x + w - (liveScale * 15)
        let displayedScoreY = liveY
        let displaydScoreSize = 3 * scx

        //GROUPS
        this.jumpingAnimals = this.add.group()
        this.lives = this.add.group()
        this.enemies = this.add.group()
        this.bullets = this.physics.add.group()
        this.platforms = this.physics.add.staticGroup()
        this.gameObjects = this.add.group()
        this.movableObjects = this.add.group()
        this.fallableObjects = this.add.group()


        // PLATFORMS
        let p = this.platforms.create(platformX, platformY, 'sprites', 'dot' + fg)
            .setOrigin(0, 0)
            .setScale(platformWidth, platformHeight)
            .refreshBody()
        // DUDE
        this.dude = new Runner(this, dudeX, dudeY, 'dude')
            .setScale(dudeScale).setOrigin(0, 0)

        liveMarginLeft = 0
        for (let i = 0; i < this.dude.lives; i++) {
            let l = this.lives.create(liveX + liveMarginLeft, liveY, 'sprites', 'live' +
                fg).setScale(liveScale)
            liveMarginLeft += l.width * liveScale + scx
            l.key = 'live'
        }
        //DISPLAYED SCORE
        this.displaydScore = new Score(this, displayedScoreX - 100, displayedScoreY, displaydScoreSize)
        this.displaydScore.setScore(0)

        //COLLIDERS AND OVERLAPS
        //platforms and dude
        this.physics.add.collider(this.platforms, this.dude, (p, d) => {
            p.grounded()
        })
        //platforms object and fallableObjects
        this.physics.add.collider(this.fallableObjects, this.platforms)
        //dude  and enemies
        this.physics.add.overlap(this.dude, this.enemies, (d, e) => {
            if (this.lives.getChildren().length > 0) {
                if (!e.passed) {
                    e.flipY = true
                    this.fallableObjects.remove(e)
                    this.enemies.remove(e)
                    d.lives--
                    this.lives.getChildren().pop().destroy()
                    e.passed = true
                }
            } else {
                GameInfo.currentScene.scene.start('gameOverScene', 'koko')
                GameInfo.currentScene.scene.stop('singleGameScene')
            }
        })

        this.cursors = this.input.keyboard.createCursorKeys();
    }


    update() {
        this.jumpingAnimals.getChildren().forEach(e => {
                let vel = e.body.velocity.y
                if (vel > 0 && e.anim != 'run') {
                    e.anim = 'run'
                    e.play(e.character + e.anim + this.foregroundColor)
                } else if (vel < 0 && e.anim != 'jump') {
                    e.anim = 'jump'
                    e.play(e.character + e.anim + this.foregroundColor)
                }
            }
        )

        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }

        EnemyGenerator.generateEnemy()

        let CWidth = Display.width
        let movableObjectsPos = {}


        let swipe = Controller.getSwipe()
        if (this.cursors.down.isDown || swipe === 'down') {
            this.dude.duck()
        }
        if (this.cursors.up.isDown || swipe === 'up') {
            this.dude.jump()
        }


        this.enemies.getChildren().forEach((e, i) => {
            let direction = GameInfo.direction
            if (direction === 'left') {
                if (e.x < this.dude.x && !e.passed) {
                    scoreUp(this, e)
                }
                if (e.x < 0) {
                    destroyEnemy(e)
                }
            }
            if (direction === 'right') {
                if (e.x > this.dude.x && !e.passed) {
                    scoreUp(this, e)
                }
                if (e.x > CWidth) {
                    destroyEnemy(e)
                }
            }
        })
    }
}

function destroyEnemy(e) {
    e.destroy()
}

function scoreUp(scene, e) {
    let scx = Display.scaleX
    let scy = Display.scaleY

    e.passed = true
    GameInfo.score++
    GameInfo.passedEnemies++
    scene.displaydScore.setScore(GameInfo.score)

    if (GameInfo.passedEnemies > 2 * GameInfo.level) {
        GameInfo.passedEnemies = 0
        GameInfo.levelUp()
        EnemyFactory.velocity *= 1.5
    }
}

