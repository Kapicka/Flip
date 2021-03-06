import EnemyGenerator from '../EnemyGenerator'
import Runner from '../gameSprites/Runner'
import utils from '../utils'
import GameInfo from '../GameInfo'
import Lives from '../Lives'
import Score from '../Score'
import SwipeController from '../SwipeController'
import ColorManager from '../ColorManager';
import BackgroundObjectGenerator from '../BackgroundObjectGenerator'
import { getGameScenePositions } from '../Positions';




export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'singleGameScene' })
    }

    create() {
        const p = getGameScenePositions(this)
        this.enemyGenerator = new EnemyGenerator(this)
        this.bgoGenerator = new BackgroundObjectGenerator(this)
        this.swipeController = new SwipeController(this, 30)
        this.foregroundColor = GameInfo.players.localPlayer.color
        this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)
        document.body.style.backgroundColor = this.backgroundColor
        this.cameras.main.setBackgroundColor(this.backgroundColor)


        //GROUPS
        this.enemies = this.add.group()
        this.platforms = this.physics.add.staticGroup()
        this.movableObjects = this.add.group()
        this.gameObjects = this.add.group()
        this.platformers = this.add.group()
        this.bgo = this.physics.add.group()

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

        this.runner.on('jump', () => this.sound.play('jump'))

        this.runner.on('hit', () => {
            this.lives.removeLive()
            this.sound.play('au')
        })

        // let music = this.sound.add('cikcak', {
        //     loop: true
        // }).play()

        this.runner.on('killed', () => {
            console.log('this is single game scene vole');
            console.log('this je ', this, 'papousku');
            this.scene.start('gameOverScene')
            this.sound.play('gameOver')  
            this.sound.play('au')  

          
            this.scene.stop('singleGameScene')
        })



        //LIVES
        this.lives = new Lives(
            this,
            p.liveX,
            p.liveY,
            this.runner.lives,
            'sprites',
            'live',
            this.foregroundColor)
        this.lives.id = 'lives'


        //DISPLAYED SCORE
        this.displayedScore = new Score(
            this,
            p.displayedScoreX - 100,
            p.displayedScoreY,
            p.displayedScoreSize,
            this.foregroundColor
        )



        //COLLIDERS AND OVERLAPS
        this.runnerCollider = this.physics.add.collider(this.platforms, this.runner,
            (runner, platforms) => runner.run())


        this.physics.add.collider(this.platformers, this.platforms)
        this.physics.add.overlap(this.runner, this.enemies, (dude, enemy) => {
            dude.hit()
            this.enemies.remove(enemy)
            this.platformers.remove(enemy)
            enemy.flipY = true
        })

        this.flipColor = function () {
            let temp = this.backgroundColor
            this.backgroundColor = this.foregroundColor
            document.body.style.backgroundColor = this.backgroundColor
            this.foregroundColor = temp

            this.gameObjects
                .getChildren()
                .forEach(go => go.flipColor(this.foregroundColor))
            this.displayedScore.flipColor(this.foregroundColor)
            this.lives.flipColor(this.foregroundColor)

            this.bgo.getChildren().forEach(bg => bg.flipColor(this.backgroundColor))

            this.cameras.main.setBackgroundColor(this.backgroundColor)
        }


        this.action = (action) => {
            if (action === 'jump') { this.runner.jump() }
            if (action === 'slide') { this.runner.slide() }
        }


        this.input.keyboard.on('keydown-UP', () => this.action('jump'))
        this.input.keyboard.on('keydown-DOWN', () => this.action('slide'))
        this.swipeController.on('up', () => this.action('jump'))
        this.swipeController.on('down', () => this.action('slide'))
        this.input.keyboard.on('keydown-J', () => this.action('slide'))
        this.input.keyboard.on('keydown-K', () => this.action('jump'))



        let offset = this.cameras.main.width / 4
        for (let i = 0; i < 4; i++) {
            let obj = this.bgoGenerator.generateRandom()
            obj.setX(i * offset)
        }
    }



    update() {
        if (this.runner.y > this.platform.y + this.platform.height) {
            this.runner.setY(this.runner.pivotY)
            this.runner.setVelocityY(0)
        }


        if (Math.floor(Math.random() * 150) === 3) {
            this.bgoGenerator.generateRandom()
        }
        this.bgo.getChildren().forEach(o => {
            if (o.x < 0) { o.destroy() }
        })


        this.enemyGenerator.generateEnemy()
        this.enemies.getChildren().forEach((e, i) => {
            if (e.x < this.runner.x && this.runner.currentState.name !== 'hitState') {
                this.enemies.remove(e).passed = true
                GameInfo.score++
                this.displayedScore.setScore(GameInfo.score)

            }
            if (e.x < 0) {
                e.destroy()
            }
        })

    }
}


