import Animations from '../animations'
import EnemyFactory from '../enemyFactory'
import PlatformFactory from '../platformFactory'
import Runner from '../runner'
import Textt from '../textt'
import Display from '../display'
import Controller from '../controller'
import ColorManager from "../ColorManager";
import GameInfo from "../gameInfo";

let pos = 0
let colored = false
let onTurn = true
let isDown = false
let step = 1
let scene = undefined
let enemies = []
export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({key: 'tutorialScene'})
    }

    init() {
        EnemyFactory.init(this)
        PlatformFactory.init(this)
        Controller.init(this)
    }

    create() {
        Animations.init(this)
        this.foregroundColor = ColorManager.getRandomColor()
        this.backgroundColor = ColorManager.getRandomColor()
        while (this.foregroundColor === this.backgroundColor) {
            this.backgroundColor = ColorManager.getRandomColor()
        }

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
        //Home button

        let homeButtonX = 30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 4 * scx

        //DUDE POSITION
        let dudeX = x + 30 * scx
        let dudeY = 20 * scy
        let dudeScale = 4 * scx

        //PLATFORM  POSITION
        let platformX = (x - w)
        let platformY = h * (1 - (1 / 4))
        let platformWidth = (w * 3) * scx
        let platformHeight = 10 * scy
        let platformscale = 3 * scx


        let awsomeTextX = 30
        let awsomeTextY = 60 * scy
        let awsomeTextScale = 5 * scx

        let endTextX = 30
        let endTextY = 30 * scy
        let endTextScale = 5 * scx

        let mainTextY = awsomeTextY
        let mainTextX = x + cx
        let mainTextScale = 3 * scx

        let turnTextX = x + cx + 20 * scx
        let turnTextY = cy + 30 * scy
        let turnTextScale = 3 * scx

        let pressOrSwipe = 'Swipe'
        let keyOrNothing = ' '
        if (!Display.mobile) {
            pressOrSwipe = 'Press'
            keyOrNothing = ' key '
        }
        //GROUPS
        this.jumpingAnimals = this.add.group()
        this.enemies = this.add.group()
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

        //Home button
        this.homeButton = this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + fg)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                pos = 0
                scene = undefined
                colored = false
                onTurn = true
                isDown = false
                step = 1
                enemies = []
                this.scene.start('firstScene')
                this.scene.stop('tutorialScene')
            })
        //AWSOME TEXT
        this.awsomeText = new Textt(this, awsomeTextX, awsomeTextY, 'Nadhera', fg, awsomeTextScale)
        this.awsomeText.setVisible(false)
        this.awsomeText.setX(cx - this.awsomeText.width / 2)
        //MAIN TEXT
        this.mainText = new Textt(this, mainTextX, mainTextY, pressOrSwipe + ' up' + keyOrNothing + 'to jump', fg, mainTextScale)
        let textOffsetY = this.mainText.height + 3 * scy
        this.mainText.setX(cx - this.mainText.width / 2)
        //TURN TEXT
        this.turnText = new Textt(this, turnTextX, turnTextY, 'Your turn', fg, awsomeTextScale)
        this.turnText.setVisible(false)
        //END TEXT
        this.endText = new Textt(this, 0, cy, 'You are ready to play!', fg, awsomeTextScale).centerX()
        this.endText.setVisible(false)
        //COLLIDERS AND OVERLAPS
        //platforms and dude

        let stopFlag = true
        this.physics.add.collider(this.platforms, this.dude, (p, d) => {
            p.grounded()
            if (colored && !onTurn && stopFlag) {
                stopFlag = false
                this.time.delayedCall(800, () => {
                    this.dude.jump()
                    this.turnText.setText('Your turn')
                    handleTutorialSteps('jump')
                    stopFlag = true
                    step++
                });
            }
        })

        //platforms object and fallableObjects
        this.physics.add.collider(this.fallableObjects, this.platforms)
        //dude  and enemies
        this.physics.add.overlap(this.dude, this.enemies, (d, e) => {
            if (!e.passed) {
                this.mainText
                e.flipY = true
                this.fallableObjects.remove(e)
                this.enemies.remove(e)
                e.passed = true
                this.awsomeText.setText('Nooo! Try it again.').centerX()
                this.mainText.setVisible(false)
                scene.time.delayedCall(2000, () => {
                    scene.awsomeText.setVisible(false)
                    this.mainText.setVisible(true)
                });
                EnemyFactory.createEnemy(1)
            }
        })
        this.cursors = this.input.keyboard.createCursorKeys();
        scene = this
    }

    update() {
        this.gameObjects.getChildren().forEach(e => {
            if (e.x < 0) {
                e.destroy()
            }
            if (e.x < this.dude.x && !e.passed) {
                this.awsomeText.setText('Well done!').centerX()
                scene.time.delayedCall(2000, () => {
                    scene.awsomeText.setVisible(false)
                    scene.mainText.setVisible(true)
                });
                handleTutorialSteps('multiplayer')
            }
        })
        if (onTurn) {
            let swipe = Controller.getSwipe()
            if (this.cursors.down.isDown || swipe === 'down') {
                if (this.dude.duck()) {
                    handleTutorialSteps('duck')
                    if (colored) {
                        this.turnText.setText('2 player turn')
                    }
                }
            }
            if (this.cursors.up.isDown || swipe === 'up') {
                if (this.dude.jump()) {
                    handleTutorialSteps('jump')
                    if (colored) {
                        this.turnText.setText('2 player turn')
                    }
                }
            }
        }
        if (window.innerWidth < window.innerHeight) {
            document.getElementById('rotateScreen').style.visibility = 'visible'
        } else {
            document.getElementById('rotateScreen').style.visibility = 'hidden'
        }
    }
}

function handleTutorialSteps(action) {
    let pressOrSwipe = 'Swipe'
    let keyOrNothing = ' '
    if (!Display.mobile) {
        pressOrSwipe = 'Press'
        keyOrNothing = ' key'
    }
    if (step === 1 && action === 'jump') {
        let f = function () {
            scene.mainText.setText('When jumping,' + pressOrSwipe + ' down' + keyOrNothing + 'to fall faster')
                .centerX()
        }
        setAwsomeText(scene, f)
    }
    if (step === 2 && action === 'duck') {
        let f = function () {
            scene.mainText.setText('Dont get killed~by enemies!')
                .centerX()
            console.log('step :' + step)
            EnemyFactory.createEnemy(1)
        }
        setAwsomeText(scene, f)
    }
    if (step === 3 && action === 'multiplayer') {
        let t = 'The multiplayer mode is turn based~' +
            'Play when foreground has your color'

        let f = function () {
            colored = true
            scene.mainText.setText(t).centerX()
            scene.turnText.setVisible(true)
        }
        setAwsomeText(scene, f)
    }

    if (((colored && action === 'jump') || colored && action === 'duck')) {
        onTurn = !onTurn
        let fg = scene.foregroundColor
        let bg = scene.backgroundColor
        let tmp = fg
        fg = bg
        bg = tmp
        scene.foregroundColor = fg
        scene.backgroundColor = bg
        scene.dude.play('dude' + scene.dude.anim + fg)
        scene.platforms.getChildren().forEach(p => p.setFrame('dot' + fg))
        scene.cameras.main.setBackgroundColor(bg)
        scene.homeButton.setFrame('homeButton' + fg)
        scene.turnText.setColor(fg)
        scene.mainText.setColor(fg)
        scene.awsomeText.setColor(fg)
        scene.endText.setColor(fg)
    }
    if (step > 5) {
        onTurn = false
        scene.platforms.getChildren().forEach(p => p.destroy())
        scene.dude.destroy()
        scene.mainText.setVisible(false)
        scene.awsomeText.setVisible(false)
        scene.turnText.setVisible(false)
        console.log('wtf!!!!')
        scene.endText.setVisible(true)
    }
}

function setAwsomeText(scene, f) {
    step++
    let awsomeTexts = ['Perfect', 'Good job', 'Awsome', 'You are doing well!']
    let index = Math.floor(setAwsomeText.length * (Math.random() - 0.1))
    if (index < 0) index++
    let t = awsomeTexts[index]
    console.log(t)
    console.log('index', index)
    scene.awsomeText.setText(t)
        .centerX()
    scene.awsomeText.setVisible(true)
    scene.mainText.setVisible(false)
    scene.time.delayedCall(2000, () => {
        scene.awsomeText.setVisible(false)
        scene.mainText.setVisible(true)
        f()
    });
}



