import Display from './display';
import GameInfo from './gameInfo'
import GameActions from './gameActions';

const Messenger = {
    init: function (scene) {
        GameInfo.CurrentScene = scene
        this.socket = io('localhost:8081')
        this.socket.on('handshake', (localId) => {
            GameInfo.players.localPlayer.id = localId
            this.socket.emit('playerInfo', GameInfo.players.localPlayer)

            this.socket.on('playersInfo', players => {
                let localId = GameInfo.players.localPlayer.id
                for (let key in players) {
                    if (key != localId) {
                        GameInfo.players.remotePlayer = players[key]
                        GameInfo.players.remotePlayer.connected = true
                    }
                }
            })
            this.socket.on('firstplayer', () => {
                GameInfo.players.localPlayer.master = true
                GameInfo.onTurn = true
                GameInfo.CurrentScene.scene.start('waitingScene')
            })
            this.socket.on('gamePaused', () => {
                GameInfo.prevScene = 'gameScene'
                GameInfo.currentScene.scene.setVisible(false)
                GameInfo.CurrentScene.scene.switch('pauseScene')
            })
            this.socket.on('gameResumed', () => {
                GameInfo.currentScene.scene.setVisible(true)
                GameInfo.CurrentScene.scene.switch('gameScene')

            })
            this.socket.on('startgame', () => {
                if (GameInfo.players.localPlayer.master) {
                    GameInfo.CurrentScene.scene.start('gameScene')
                    GameInfo.CurrentScene.scene.stop('waitingScene')
                } else {
                    GameInfo.CurrentScene.scene.start('dummyGameScene')
                }
            })
        })
    },

    initGameComunication: function () {
        this.socket.on('enemydestroyd', (id) => {
            GameInfo.currentScene.movableObjects.getChildren().forEach(e => {
                if (e.id === id) {
                    e.destroy()
                }
            })
        })
        this.socket.on('enemycoords', enemies => {
            let leftOffset = Display.width - Display.gamingArea.width
            GameInfo.currentScene.movableObjects.getChildren().forEach(mo => {
                for (let enemyId in enemies) {
                    if (mo.id === enemyId) {
                        mo.x = leftOffset + enemies[enemyId].x * Display.gamingArea.scaleX
                        mo.y = enemies[enemyId].y * Display.gamingArea.scaleY
                    }
                }
            })
        })
        this.socket.on('enemycreated', enemy => {
            let x = (Display.width - Display.gamingArea.width)
            let enm = GameInfo.currentScene.add.sprite(x + enemy.x, enemy.y, enemy.character + '_run_0' + GameInfo.CurrentScene.foregroundColor)
                .play(enemy.character + 'run' + GameInfo.currentScene.foregroundColor
                ).setFlipX(enemy.fliped)
            enm.setScale(5 * Display.gamingArea.scaleX)
            enm.id = enemy.id
            enm.character = enemy.character
            GameInfo.currentScene.gameObjects.add(enm)
            GameInfo.currentScene.movableObjects.add(enm)
        })
        this.socket.on('doomed', (enemyId) => {
            GameInfo.currentScene.lives.getChildren().pop().destroy()
            GameInfo.currentScene.movableObjects.getChildren().forEach(e => {
                if (e.id === enemyId) {
                    e.setFlipY(true)
                }
            })

        })
        this.socket.on('animchanged', (info) => {
            let sc = GameInfo.currentScene
            let sprites = sc.gameObjects.getChildren()

            for (let i = 0; i < sprites.length - 1; i++) {

                if (info.id === sprites[i].id) {

                    let s = sprites[i].character
                    let fg = sc.foregroundColor
                    let a = info.anim

                    sprites[i].anim = a
                    sprites[i].play(s + a + fg)

                }
            }
        })
        this.socket.on('dudemoved', (runnerCoords) => {
            console.log('to nic to jen tak')
            // GameInfo.currentScene.dude.setX(runnerCoords.x * Display.gamingArea.scaleX + (Display.width - Display.gamingArea.width))
            GameInfo.currentScene.dude.setY(runnerCoords.y * Display.gamingArea.scaleY)
        })
        this.socket.on('gameover', () => {

            Messenger.socket.disconnect()
            GameInfo.currentScene.scene.start('gameOverScene', 'koko')

        })
        this.socket.on('switchturn', (action) => {
            GameInfo.onTurn = true
            if (GameInfo.players.localPlayer.master) {
                if (action === 'jump')
                    GameInfo.currentScene.dude.jump()
                if (action === 'shoot')
                    GameInfo.currentScene.dude.shoot()
                if (action === 'duck')
                    GameInfo.currentScene.dude.duck()
            }
            GameActions.flipColor()
        })

        this.socket.on('leave', (playerId) => {
            Messenger.socket.disconnect()
            GameInfo.players.remotePlayer.connected = false
            GameInfo.currentScene.scene.start('playerDisconnectedScene')
            GameInfo.currentScene.scene.stop('gameScene')
        })
        this.socket.on('scoreup', () => {
            GameInfo.score++
            GameInfo.currentScene.displaydScore.setScore(GameInfo.score)
        })
    }
}


export default Messenger