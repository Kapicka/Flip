
import EnemyFactory from '../enemyFactory'
import PlatformFactory from '../platformFactory'
import GameSprite from '../gameSprites/gameSprite'
import FlyingEnemy from '../gameSprites/flyingEnemy'
import Runner from '../gameSprites/runner'
import Textt from '../textt'
import Display from '../display'
import Controller from '../swipeController'
import ColorManager from "../colorManager";
import EnemyGenerator from '../enemyGenerator'
import SwipeController from '../swipeController'
import { getTutorialScenePositions } from '../positions'
const runningEnemies = ['deamon', 'duck', 'shaolin', 'pig', 'dog']
const jumpingEnemies = ['frog']
const flyingEnemies = ['bird']
let onTurn = true




export default class TutorialScene extends Phaser.Scene {
    constructor() {
        super({ key: 'tutorialScene' })
    }
    init() {
        EnemyFactory.init(this)
        PlatformFactory.init(this)
        Controller.init(this)
    }

    create() {

        const enemies = [
            {
                type: 'flying',
                x: 221,
                y: 217
            },
            {
                type: 'running',
                x: 610,
                y: 217
            },
        ].map(e => {
            e.x = Display.scaleX * e.x + Display.width
            e.y = Display.scaleY * e.y
            return e

        })
        const p = getTutorialScenePositions(this)
        this.enemyFactory = new EnemyFactory(this)
        this.enemyGenerator = new EnemyGenerator(this)
        this.swipeController = new SwipeController(this, 30)
        this.foregroundColor = ColorManager.getRandomColor()
        this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)
        this.cameras.main.setBackgroundColor(this.backgroundColor)



        //GROUPS
        this.enemies = this.add.group()
        this.platforms = this.physics.add.staticGroup()
        this.movableObjects = this.add.group()
        this.gameObjects = this.add.group()
        this.platformers = this.add.group()


        //Texts
        //Home button
        this.homeButton = this.add.sprite(p.homeButtonX, p.homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(3 * Display.scaleX)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                this.scene.stop('tutorialScene')
            })
        //AWSOME TEXT
        this.awsomeText = new Textt(this, p.awsomeTextX, p.awsomeTextY, 'AWSOME', this.foregroundColor, p.awsomeTextScale)
            .setVisible(false)
            .centerX()
        //MAIN TEXT
        this.mainText = new Textt(this, p.mainTextX, p.mainTextY, 'MAIN', this.foregroundColor, p.mainTextScale)
            .centerX()
        //TURN TEXT
        this.turnText = new Textt(this, p.turnTextX, p.turnTextY, 'YOUR TURN', this.foregroundColor, p.awsomeTextScale)
            .setVisible(false)
        //END TEXT
        this.endText = new Textt(this, 0, p.endTextY, 'You are ready to play!', this.foregroundColor, p.awsomeTextScale)
            .centerX()
            .setVisible(false)

        //PLATFORMS
        this.platform = this.platforms.create(
            p.platformX,
            p.platformY,
            'sprites',
            'dot' + this.foregroundColor
        )

        this.platform.setOrigin(0, 0)
            .setScale(p.platformWidth, p.platformHeight)
            .refreshBody()

        this.platform.flipColor = function (color) {
            this.setFrame('dot' + color)
        }
        this.gameObjects.add(this.platform)

        //RUNNER
        this.runner = new Runner(this, p.dudeX, p.dudeY, 'jumpingState', true)
            .setScale(p.dudeScale)
            .setAnim('jump')
        this.runner.body.updateBounds()
        this.gameObjects.add(this.runner)
        this.movableObjects.add(this.runner)
        this.runner.lives = 10000



        this.stages = new Stages(this)
        this.currentStage = this.stages['jumpStage']
        this.currentStage.start()


        this.next = (stage) => {
            let text = ['AWSOME', 'GOOD JOB', 'PERFECT', 'WELL DONE', 'SUPER'][Math.floor(Math.random() * 5)]
            this.currentStage = this.stages['emptyStage']
            this.stages['emptyStage'].start()
            this.awsomeText.setText(text)
            this.awsomeText.setVisible(true)
            this.mainText.setVisible(false)
            this.time.delayedCall(2000, () => {
                this.awsomeText.setVisible(false)
                this.mainText.setVisible(true)
                this.currentStage = this.stages[stage]
                this.stages[stage].start()
            })
        }




        this.runner.on('hit', () => this.currentStage.hit())
        this.runner.on('jumpdown', () => this.currentStage.jumpdown())
        this.runner.on('jump', () => this.currentStage.jump())
        this.runner.on('slide', () => this.currentStage.slide())
        this.runner.on('run', () => { this.currentStage.run() })



        this.action = function (action) {
            if (onTurn) {
                if (action === 'up') {
                    this.runner.jump()
                }
                if (action === 'down') {
                    this.runner.slide()

                }
            }
        }

        this.input.keyboard.on('keydown-UP', () => this.action('up'))
        this.input.keyboard.on('keydown-DOWN', () => this.action('down'))
        this.swipeController.on('up', () => this.action('up'))
        this.swipeController.on('down', () => this.action('down'))



        //COLLIDERS AND OVERLAPS
        this.runnerCollider = this.physics.add.collider(this.platforms, this.runner,
            (runner, platforms) => runner.run())
        this.physics.add.collider(this.platformers, this.platforms)

        this.physics.add.overlap(this.runner, this.enemies, (dude, enemy) => {
            this.runner.hit()
            console.log('hhhh')
            this.enemies.remove(enemy)
            enemy.flipY = true
        })




        this.generator = {
            enabled: true,
            generate: () => {
                if (this.generator.enabled) {
                    enemies.forEach(enemy => {
                        createEnemy(this, enemy)
                    })
                }
            },
            start: () => { this.generator.enabled = true },
            stop: () => { this.generator.enabled = false }
        }

        this.enemyFactory.on('enemycreated', enemy => {
            this.movableObjects.add(enemy)
            this.gameObjects.add(enemy)
            this.enemies.add(enemy)
        })

        const flipColor = () => {

            let temp = this.backgroundColor
            this.backgroundColor = this.foregroundColor
            this.foregroundColor = temp

            this.awsomeText.flipColor(this.foregroundColor)
            this.turnText.flipColor(this.foregroundColor)
            this.mainText.flipColor(this.foregroundColor)
            this.homeButton.setFrame('homeButton' + this.foregroundColor)

            this.gameObjects
                .getChildren()
                .forEach(go => go.flipColor(this.foregroundColor))

            this.cameras.main.setBackgroundColor(this.backgroundColor)
        }
        let i = 0

        this.switchTurn = () => {

            onTurn = !onTurn
            flipColor()

            if (onTurn === true) {
                this.turnText.setText('YOUR TURN')


            } if (onTurn === false) {

                this.turnText.setText('PLAYER2 TURN')
                this.turnText.flipColor(this.foregroundColor)

                this.time.delayedCall(2000, () =>
                    this.runner.jump()

                )

            }
        }
    }

    update() {

        this.enemies.getChildren().forEach((e, i) => {
            if (e.x < this.runner.x) {
                this.currentStage.scored()
                this.enemies.remove(e)
            }
        })
        this.movableObjects.getChildren().forEach((e, i) => {
            if (e.x < 0) {
                e.destroy()
                if (!this.enemies.getChildren().length)
                    this.generator.generate()
            }
        })

    }
}


class Stages {
    constructor(scene) {

        let pressOrSwipe = 'SWIPE'
        if (!Display.mobile) { pressOrSwipe = 'PRESS KEY' }

        const emptyF = () => { }
        this.emptyStage = {
            start: emptyF,
            jump: emptyF,
            hit: emptyF,
            slide: emptyF,
            scored: emptyF,
            jumpdown: emptyF,
            run: emptyF
        }

        const jumpStage = {
            name: 'jumpStage',
            start: function () {
                scene.mainText.setText(pressOrSwipe + ' UP TO JUMP')
                scene.mainText.centerX()
            },
            jump: function () { scene.next(this.nextStage) },
            slide: emptyF, jumpdown: emptyF, scored: emptyF, hit: emptyF, run: emptyF
        }
        const slideStage = {
            name: 'slideStage',
            start: function () {
                scene.mainText.setText(pressOrSwipe + ' DOWN TO SLIDE')
                scene.mainText.centerX()
            },
            slide: function () { scene.next(this.nextStage) },
            jump: emptyF, jumpdown: emptyF, scored: emptyF, hit: emptyF, run: emptyF
        }
        const getUpStage = {
            name: 'getUpStage',
            start: function () {
                scene.mainText.setText(pressOrSwipe + ' UP TO RUN AGAIN')
                scene.mainText.centerX()
            },
            run: function () { scene.next(this.nextStage) },
            slide: emptyF, jumpdown: emptyF, scored: emptyF, hit: emptyF, jump: emptyF
        }

        const fallingStage = {
            name: 'fallingStage',
            start: function () {
                scene.mainText.setText('JUMP AND ' + pressOrSwipe + ' DOWN TO FALL FASTER')
                scene.mainText.centerX()
            },
            jumpdown: function () { scene.next(this.nextStage) },
            jump: emptyF, slide: emptyF, scored: emptyF, hit: emptyF, run: emptyF
        }

        const enemyStage = {

            name: 'enemyStage',
            count: 0,
            start: function () {
                scene.mainText.setText('DONT GET KILLED BY ENEMIES!')

                scene.generator.generate()
            },
            scored: function () {
                this.count++
                console.log('count stage5', this.count)
                if (this.count > 2) {
                    scene.generator.stop()
                    scene.next(this.nextStage)

                }
            },
            hit: () => {
                scene.mainText.setText('OH NOO, TRY IT AGAIN!')
                scene.mainText.centerX()
                scene.time.delayedCall(2000, () => scene.mainText.setText('DONT GET KILLED BY ENEMIES!'))
            },
            jump: emptyF, slide: emptyF, jumpdown: emptyF, run: emptyF
        }

        const turnStage = {
            name: 'turnStage',

            step: 0,
            start: function () {
                scene.mainText.setText('THE MULTIPLAYER MODE IS TURN BASED~' +
                    'PLAY WHEN FOREGROUND HAS YOUR COLOR')
                scene.mainText.centerX()
                scene.turnText.setVisible(true)
                this.runnerPrevState = scene.runner.currentState.name

            },

            action: function (state) {
                if (this.runnerPrevState !== 'jumpingState') {
                    scene.switchTurn()
                    this.step++
                    if (this.step > 3) { scene.next(this.nextStage) }
                }
                this.runnerPrevState = state
            },

            jump: function () { this.action('jumpingState') },
            slide: function () { this.action('slidingState') },
            jumpdown: function () { this.action('jumpingState') },
            run: function () { this.action('runningState') },


            scored: emptyF
        }

        const finalStage = {
            name: 'finalStage',
            start: function () {
                scene.turnText.setVisible(false)
                scene.mainText.setVisible(false)
                scene.awsomeText.setVisible(true)
                scene.gameObjects.getChildren().forEach(go => go.setVisible(false))
                scene.awsomeText.setText('YOU ARE READY TO PLAY!')
                scene.awsomeText.centerX()
                scene.awsomeText.setY(Display.height / 2 - 7 * 5 * Display.scaleX)
                scene.awsomeText.setScale(5)

            },
            jump: emptyF, slide: emptyF, scored: emptyF, run: emptyF
        }

        const stages = [jumpStage, slideStage, getUpStage, fallingStage, enemyStage, turnStage, finalStage]
        stages.map((s, i) => {
            if (stages[i + 1] !== undefined)
                s.nextStage = stages[i + 1].name
            return s
        })
            .forEach(stage => this[stage.name] = stage)
    }
}


function createEnemy(scene, enm) {
    let scx = Display.gamingArea.scaleX
    let scy = Display.gamingArea.scaleY
    let x = enm.x * scx
    let y = enm.y * scy
    let enemy
    let enemyScale = 5*scx
    let character

    if (enm.type === 'running') {
        character = getRandomCharacter(runningEnemies)
        enemy = new GameSprite(scene, x, y, character, 'run', true)
        scene.platformers.add(enemy)
    }
    if (enm.type === 'flying') {
        character = getRandomCharacter(flyingEnemies)
        enemy = new FlyingEnemy(scene, x, y, character, 500)
    }

    scene.enemies.add(enemy)
    scene.gameObjects.add(enemy)
    scene.movableObjects.add(enemy)
    enemy.setScale(enemyScale)
        .setVelocityX(-300)
        .setAnim(enemy.anim)
}

function getRandomCharacter(characters) {
    let characterNumber = Math.floor(Math.random() * characters.length)
    return characters[characterNumber]
}