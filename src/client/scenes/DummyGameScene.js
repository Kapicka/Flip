import ColorManager from '../ColorManager'
import Messenger from '../Messenger'
import Display from "../Display";
import GameInfo from '../GameInfo'
import GameSprite from "../gameSprites/GameSprite";
import SwipeController from '../SwipeController'
import {getGameScenePositions} from "../Positions";
import Lives from '../Lives'
import Score from '../score'


export default class DummyGameScene extends Phaser.Scene {
    constructor() {
        super({key: 'dummyGameScene'})
    }

    create() {

        let p = getGameScenePositions(this)
        this.swipeController = new SwipeController(this, 30)
        this.foregroundColor = GameInfo.players.remotePlayer.color
        this.backgroundColor = GameInfo.players.localPlayer.color

        while (this.foregroundColor === this.backgroundColor) {
            this.foregroundColor = ColorManager.getRandomColor()
        }
        this.cameras.main.setBackgroundColor(this.backgroundColor)
        //GROUPS        
        this.gameObjects = this.add.group()
        this.movableObjects = this.add.group()


        //PLATFORMS
        this.platform = this.add.image(
            p.platformX,
            p.platformY,
            'sprites',
            'dot' + this.foregroundColor)

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
        this.runner.id = 'dude'
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

            this.lives.flipColor(this.foregroundColor)
            this.cameras.main.setBackgroundColor(this.backgroundColor)
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
    }

}


function initSocketEvents(scene) {
    const socket = Messenger.getSocket()
    const scx = Display.gamingArea.scaleX
    const scy = Display.scaleY
    const gscy = Display.gamingArea.scaleY


    socket.on('enemydestroyd', (id) => {
        scene.gameObjects
            .getChildren()
            .find(e => e.id === id)
            .destroy()
    })
        .on('switchturn', () => {
            scene.switchTurn()
        })
        .on('runnerhit', () => {
            scene.lives.removeLive()
            scene.runner.lives--
            scene.runner.play(scene.runner.character + scene.foregroundColor)
        })
        .on('animchanged', (info) => {
            scene.gameObjects
                .getChildren()
                .find(s => s.id === info.id)
                .setAnim(info.anim)
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
        .on('objectmoved', info => {
            let obj = scene.movableObjects
                .getChildren()
                .find(o => o.id === info.id)
            if (obj !== undefined) {
                obj.setPosition(info.x * scx, info.y * gscy)
            }
        })
        .on('spriteflip', id => {
            scene.gameObjects.getChildren()
                .find(go => go.id === id)
                .setFlipY(true)
        })
    Messenger.socket.on('playerdisconnect', () => {
        Messenger.socket.disconnect()
        scene.scene.start('disconnectScene', {subject: 'player'})
        scene.scene.stop('dummyGameScene')
    })
    Messenger.socket.on('disconnect', () => {
        scene.scene.start('disconnectScene', {subject: 'server'})
        Messenger.socket.disconnect()
        scene.scene.stop('dummyGameScene')
    })
    Messenger.socket.on('gameover', () => {
        Messenger.socket.removeAllListeners()
        Messenger.socket.disconnect()
        scene.scene.start('gameOverScene')
        scene.scene.stop('dummyGameScene')
    })
        .on('score', () => {
            GameInfo.score++
            scene.displayedScore.setScore(GameInfo.score)

        })
}










