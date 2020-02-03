import EnemyGenerator from '../EnemyGenerator'
import Runner from '../gameSprites/Runner'
import GameInfo from '../GameInfo'
import Lives from '../Lives'
import Score from '../Score'
import Messenger from '../Messenger'
import SwipeController from '../SwipeController'
import BackgroundObjectGenerator from '../BackgroundObjectGenerator'

import ColorManager from '../ColorManager';
import { getGameScenePositions } from '../Positions';
import Display from '../Display';

/**
 * Herní scéna s logikou pro hru dvou hráčů. 
 */
const bgObjects = ['cloud', 'tree', 'leaftree', 'cloud2', 'mountain', 'hill']
function flipColor(color) {
    let tint = 10
    let rgb = color.substr(4, color.length - 5).split(',').map(n => Number(n) + tint)
    if (rgb[0] > 255 || rgb[1] > 255 || rgb[2] > 255) {
        rgb = rgb.map(c => c -= 2 * tint)
    }
    let hex = Phaser.Display.Color.RGBToString(rgb[0], rgb[1], rgb[2], 0, '0x')
    this.setTintFill(hex)
}
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameScene' })
    }

    create() {

        const p = getGameScenePositions(this)
        this.enemyGenerator = new EnemyGenerator(this)
        this.swipeController = new SwipeController(this, 30)
        this.foregroundColor = GameInfo.players.localPlayer.color
        this.backgroundColor = GameInfo.players.remotePlayer.color
        this.bgoGenerator = new BackgroundObjectGenerator(this)

        document.body.style.backgroundColor = this.backgroundColor


        while (this.foregroundColor === this.backgroundColor) {
            this.backgroundColor = ColorManager.getRandomColor()
        }
        this.cameras.main.setBackgroundColor(this.backgroundColor)
        document.body.style.backgroundColor = this.backgroundColor

        //GROUPS
        this.platforms = this.physics.add.staticGroup()

        this.movableObjects = this.add.group()
        this.gameObjects = this.add.group()
        this.enemies = this.add.group()
        this.platformers = this.add.group()
        this.bgo = this.physics.add.group()


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
        this.runner.lives = 3

        // this.music = this.sound.add('cikcak', {
        //     loop: true
        // }).play()

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

        this.enemyGenerator.on('enemycreated', enemy => {
            Messenger.socket.emit('enemycreated', enemy)
        })

        this.runner.on('killed', () => {

            Messenger.socket.emit('gameover')
            Messenger.socket.removeAllListeners()
            this.scene.start('gameOverScene')
            this.scene.stop('gameScene')
            this.sound.play('gameOver')
            this.sound.play('au')
            Messenger.socket.disconnect()
        })

        this.runner.on('hit', () => {
            this.lives.removeLive()
            this.sound.play('au')
            Messenger.socket.emit('runnerhit')
        })


        this.runner.on('jump', () => this.sound.play('jump'))

        //COLLIDERS AND OVERLAPS
        this.runnerCollider = this.physics.add.collider(this.platforms, this.runner,
            (runner, platforms) => runner.run())
        this.physics.add.collider(this.platformers, this.platforms)
        //dude  and enemies
        this.physics.add.overlap(this.runner, this.enemies, (dude, enemy) => {
            dude.hit()
            this.enemies.remove(enemy)
            this.platformers.remove(enemy)
            Messenger.socket.emit('spriteflip', enemy.id)
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
            document.body.style.backgroundColor = this.backgroundColor
        }


        this.action = (action) => {
            if (GameInfo.onTurn) {
                if (action === 'jump') { this.runner.jump() }
                if (action === 'slide') { this.runner.slide() }
                this.switchTurn()
                Messenger.socket.emit('switchturn')
            }
        }


        this.switchTurn = () => {
            GameInfo.onTurn = !GameInfo.onTurn
            this.flipColor()
        }


        this.input.keyboard.on('keydown-UP', () => this.action('jump'))
        this.input.keyboard.on('keydown-DOWN', () => this.action('slide'))
        this.swipeController.on('up', () => this.action('jump'))
        this.swipeController.on('down', () => this.action('slide'))
        this.input.keyboard.on('keydown-J', () => this.action('slide'))
        this.input.keyboard.on('keydown-K', () => this.action('jump'))


        initSocketEvents(this)
        this.timecount = 0


        let offset = this.cameras.main.width / 4
        for (let i = 0; i < 4; i++) {
            let obj = this.bgoGenerator.generateRandom()
            obj.setX(i * offset)
            // Messenger.socket.emit('bgobjectcreated', {
            //     x: obj.x,
            //     y: obj.y,
            //     key: obj.frame.name,
            //     flipX: obj.flipX,
            //     flipY: obj.flipY,
            //     scale: obj.scaleX,
            //     tint: obj.tnt,
            //     z: obj.z
            // })
        }




    }

    update() {

        //   this.timecount = (this.timecount + 1) % 1


        if (this.runner.y > this.platform.y + this.platform.height) {
            this.runner.setY(this.runner.pivotY)
            this.runner.setVelocityY(0)
        }
        if (this.runner.prev.anim !== this.runner.anim) {

            Messenger.socket.emit('animchanged', { id: this.runner.id, anim: this.runner.anim })
            this.runner.prev.anim = this.runner.anim
        }

        this.enemyGenerator.generateEnemy()

        this.enemies.getChildren().forEach((e, i) => {
            if (e.x < this.runner.x && this.runner.currentState.name !== 'hitState') {
                score(this, e)
            }
        })

        this.movableObjects.getChildren().forEach(mo => {
            if (mo.x < 0) {
                mo.destroy()
                Messenger.socket.emit('enemydestroyd', mo.id)
            }
        })

        // if (this.timecount === 4) {
        let coords = this.movableObjects.getChildren().map(go => {
            return { x: Math.floor(go.x), y: Math.floor(go.y), id: go.id }
        })

        Messenger.socket.emit('coords', coords)

        // }
        if (Math.floor(Math.random() * 150) === 3) {
            let obj = this.bgoGenerator.generateRandom()
            // Messenger.socket.emit('bgobjectcreated', {
            //     x: obj.x,
            //     y: obj.y,
            //     key: obj.texture.firstFrame,
            //     vel: obj.velocityX,
            //     scale: obj.scaleX,
            //     tint: obj.tnt
            // })

        }

        this.bgo.getChildren().forEach(o => {
            if (o.x < 0) { o.destroy() }
        })

    }
}

const score = (scene, e) => {
    scene.enemies.remove(e)
    e.passed = true
    GameInfo.score++
    scene.displayedScore.setScore(GameInfo.score)
    Messenger.socket.emit('score')

}

const initSocketEvents = scene => {
    Messenger.getSocket()
        .on('switchturn', () => {
            scene.switchTurn()
        })
        .on('disconnect', () => {
            scene.scene.start('disconnectScene', { subject: 'server' })
            Messenger.socket.disconnect()
            scene.scene.remove('gameScene')
        })
    Messenger.socket.on('playerdisconnect', () => {
        if (!GameInfo.gameOver) {
            Messenger.socket.disconnect()
            scene.scene.start('disconnectScene', { subject: 'player' })
            scene.scene.stop('gameScene')
        } else {
            scene.sound.play('gameOver')
            this.sound.play('au')
            scene.scene.start('gameOverScene')
            Messenger.socket.removeAllListeners()
            Messenger.socket.disconnect()
            scene.scene.stop('gameScene')
        }
    })
    Messenger.socket.on('disconnect', () => {
        scene.scene.start('disconnectScene', { subject: 'server' })
        Messenger.socket.disconnect()
        scene.scene.stop(scene)


    })
        .on('gameover', (data) => {
            scene.scene.start('gameOverScene',
                { rank: data.rank, id: data.id })
            Messenger.socket.removeAllListeners()
            Messenger.socket.disconnect()
            scene.scene.stop('gameScene')
        })
        .on('action', (action) => {
            if (action === 'slide') { scene.runner.slide() }
            if (action === 'jump') { scene.runner.jump() }

        })
}

