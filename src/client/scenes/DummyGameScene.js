import ColorManager from '../ColorManager'
import Messenger from '../Messenger'
import Display from '../Display';
import GameInfo from '../GameInfo'
import GameSprite from '../gameSprites/GameSprite';
import SwipeController from '../SwipeController'
import { getGameScenePositions } from '../Positions';
import Lives from '../Lives'
import Score from '../Score'
import BackgroundObjectGenerator from '../BackgroundObjectGenerator'


export default class DummyGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'dummyGameScene' })
    }

    create() {

        let p = getGameScenePositions(this)
        this.swipeController = new SwipeController(this, 30)
        this.foregroundColor = GameInfo.players.remotePlayer.color
        this.bgoGenerator = new BackgroundObjectGenerator(this)
        this.backgroundColor = GameInfo.players.localPlayer.color
        document.body.style.backgroundColor = this.backgroundColor

        while (this.foregroundColor === this.backgroundColor) {
            this.foregroundColor = ColorManager.getRandomColor()
        }
        this.cameras.main.setBackgroundColor(this.backgroundColor)
        //GROUPS        
        this.gameObjects = this.add.group()
        this.movableObjects = this.add.group()
        this.platforms = this.add.group()
        this.bgo = this.physics.add.group()


        //PLATFORMS
        this.platform = this.add.image(
            p.platformX,
            p.platformY,
            'sprites',
            'dot' + this.foregroundColor)
        this.platforms.add(this.platform)

        this.platform.setScale(p.platformWidth, p.platformHeight)
            .setOrigin(0, 0)
        this.platform.flipColor = function (color) {
            this.setFrame('dot' + color)
        }

        this.gameObjects.add(this.platform)

        // SCORE
        this.displayedScore = new Score(
            this,
            p.displayedScoreX - 100,
            p.displayedScoreY,
            p.displayedScoreSize,
            this.foregroundColor)
        this.id = 'score'

        // DUDE

        this.runner = new GameSprite(
            this,
            p.dudeX,
            p.dudeY,
            'dude',
            'jump',
            false)

        this.runner.setScale(p.dudeScale)
        this.runner.id = 0
        this.runner.lives = 3
        this.gameObjects.add(this.runner)
        this.movableObjects.add(this.runner)


        //LIVES
        this.lives = new Lives(
            this,
            p.liveX,
            p.liveY,
            this.runner.lives,
            'sprites',
            'live',
            this.foregroundColor)


        const flipColor = () => {
            let temp = this.backgroundColor
            this.backgroundColor = this.foregroundColor
            this.foregroundColor = temp

            this.gameObjects
                .getChildren()
                .forEach(go => go.flipColor(this.foregroundColor))
            this.displayedScore.flipColor(this.foregroundColor)
            this.bgo.getChildren().forEach(bg => bg.flipColor(this.backgroundColor))
            this.lives.flipColor(this.foregroundColor)
            this.cameras.main.setBackgroundColor(this.backgroundColor)
            document.body.style.backgroundColor = this.backgroundColor

        }

        this.switchTurn = () => {
            GameInfo.onTurn = !GameInfo.onTurn
            flipColor()
        }


        const action = action => {
            if (GameInfo.onTurn) {
                Messenger.socket.emit('switchturn')
                Messenger.socket.emit('action', action)
                this.switchTurn()
            }
        }

        this.input.keyboard.on('keydown-DOWN', () => action('slide'))
        this.input.keyboard.on('keydown-UP', () => action('jump'));
        this.swipeController.on('up', () => action('jump'))
        this.swipeController.on('down', () => action('slide'))
        this.input.keyboard.on('keydown-J', () => this.action('slide'))
        this.input.keyboard.on('keydown-K', () => this.action('jump'))

        initSocketEvents(this)

        this.timecount = 0
        this.sumDelta = 0
        this.movementDelta = 0
        this.timeStart = 0
        this.startPos = undefined
        this.currentTime = 0



        let offset = this.cameras.main.width / 4
        for (let i = 0; i < 4; i++) {
            let obj = this.bgoGenerator.generateRandom()
            obj.setX(i * offset)
        }
    }

    update(time, delta) {
        this.tim = time
        if (Math.floor(Math.random() * 150) === 3) {
            let obj = this.bgoGenerator.generateRandom()
        }
        this.bgo.getChildren().forEach(o => {
            if (o.x < 0) { o.destroy() }
        })
    }

}


const initSocketEvents = scene => {
    const socket = Messenger.getSocket()
    const scx = Display.gamingArea.scaleX
    const scy = Display.scaleY
    const gscy = Display.gamingArea.scaleY

    socket.on('enemydestroyd', (id) => {
        console.log('destroyd', id)
        let o = scene.gameObjects
            .getChildren()
            .find(e => e.id === id)
        o.destroy()
    })
        .on('switchturn', () => {
            scene.switchTurn()
        })
        .on('runnerhit', () => {
            this.sound.play('au')  
            scene.lives.removeLive()
            scene.runner.lives--
            scene.runner.play(scene.runner.character + scene.foregroundColor)
        })
        .on('animchanged', (info) => {
            console.log(info, 'info id')
            scene.runner.setAnim(info.anim)
            // this.movableObjects.getChildren()
            //     .find(s => s.id === info.id)
            //     .setAnim(info.anim)
        })
        .on('enemycreated', enemy => {
            let enemyScale = 5 * Display.scaleX
            let enm = new GameSprite(scene, enemy.x * scx, enemy.y * gscy, enemy.character, 'run', false)
            enm.id = enemy.id
            enm.setScale(enemyScale)
            enm.flipColor(scene.foregroundColor)
            enm.setAnim(enm.anim)
            scene.gameObjects.add(enm)
            scene.movableObjects.add(enm)
        })
        .on('coords', coords => {
            // scene.sumDelta += (scene.tm - scene.timeStart)
            // scene.timecount++
            // let avgTime = time.sumDelta / scene.timecount


            coords.forEach(coord => {
                let obj = scene.movableObjects
                    .getChildren()
                    .find(o => o.id == coord.id)
                if (obj !== undefined) {
                    obj.setPosition(coord.x * scx, coord.y * scy)
                }
            })

        })
        .on('spriteflip', id => {
            scene.gameObjects.getChildren()
                .find(go => go.id === id)
                .setFlipY(true)
        })
    // .on('bgobjectcreated', obj => {
    //     scene.bgoGenerator.generate = (
    //         obj.x,
    //         obj.y,
    //         obj.key,
    //         obj.z,
    //         obj.flipX,
    //         obj.flipY,
    //         obj.scale)

    // })





    Messenger.socket.on('playerdisconnect', () => {
        Messenger.socket.disconnect()
        scene.scene.start('disconnectScene', { subject: 'player' })
        scene.scene.stop('dummyGameScene')
    })
    Messenger.socket.on('disconnect', () => {
        scene.scene.start('disconnectScene', { subject: 'server' })
        Messenger.socket.disconnect()
        scene.scene.stop('dummyGameScene')
    })
    Messenger.socket.on('gameover', () => {
        Messenger.socket.removeAllListeners()
        Messenger.socket.disconnect()
        scene.sound.play('gameOver')
        scene.sound.play('au')
        scene.scene.start('gameOverScene')
        scene.scene.stop('dummyGameScene')
    })
        .on('score', () => {
            GameInfo.score++
            scene.displayedScore.setScore(GameInfo.score)

        })
}










