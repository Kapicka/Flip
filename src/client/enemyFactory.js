import Display from './display'
import Messenger from './messenger'
import GameInfo from "./gameInfo";

let nextId = 0
const EnemyFactory = {
    init: function (scene) {
        this.runningEnemies = ['deamon', 'duck', 'shaolin', 'pig', 'dog']
        this.jumpingEnemies = ['frog']
        this.flyingEnemies = ['bird']
        this.platformTypes = ['gapPlatform', 'bigPlatform']
        this.velocity = 150


        this.createEnemy = (level) => {
            let sceneWidth = scene.cameras.main.width
            let leftSideX = scene.cameras.main.x
            let scx = Display.gamingArea.scaleX
            let scy = Display.gamingArea.scaleY
            let enemyScale = 5 * scx
            let rightSideX = leftSideX + sceneWidth
            let enemyNumber = Math.floor(Math.random() * level + 1)
            if (enemyNumber === 0) enemyNumber++
            let velocity = this.velocity// level * 200 * Display.scaleX //mělo by to tak být...
            let direction = GameInfo.direction
            let cameraY = scene.cameras.main.y
            let x = Display.gamingArea.width
            let y = 15 * Display.gamingArea.scaleY

            let characterNumber = undefined
            let enemy = undefined
            let character
            let flip = true
            if (direction === 'left') {
                velocity *= -1
                x = rightSideX
                flip = false
            }
            switch (enemyNumber) {
                case 1:
                    characterNumber = Math.floor(Math.random() * this.runningEnemies.length)
                    character = this.runningEnemies[characterNumber]
                    enemy = scene.physics.add.sprite(x, 90 * scy, 'sprites', character + '_run_0' + scene.foregroundColor)
                        .setVelocityX(velocity)
                    scene.fallableObjects.add(enemy)
                    break;
                case 2:
                    characterNumber = Math.floor(Math.random() * this.jumpingEnemies.length)
                    character = this.jumpingEnemies[characterNumber]
                    enemy = scene.physics.add.sprite(x, y, 'sprites', character + '_run_0' + scene.foregroundColor)
                        .setVelocityX(velocity / 2)
                    scene.physics.add.overlap(enemy, scene.platforms,
                        (e, p) => {
                            e.play('frog' + 'run' + scene.foregroundColor)
                            e.setVelocityY(-250 * scy)
                            e.play('frog' + 'jump' + scene.foregroundColor)
                        })
                    scene.jumpingAnimals.add(enemy)
                    break;
                case 3:
                    characterNumber = Math.floor(Math.random() * this.flyingEnemies.length)
                    character = this.flyingEnemies[characterNumber]
                    enemy = scene.physics.add.sprite(x, y + 30 * scy, 'sprites', character + '_run_0' + scene.foregroundColor)
                        .setVelocityX(velocity / 3)
                    scene.game.events.on('step', (time, delta) => {
                        enemy.setY(80 * scy + (Math.sin(time / 400) * 55 * scy))
                    })
                    break;
            }
            scene.enemies.add(enemy)
            scene.gameObjects.add(enemy)
            scene.movableObjects.add(enemy)
            enemy.setScale(enemyScale)
            enemy.setFlipX(flip)
            enemy.passed = false
            enemy.id = 'enemy' + nextId
            nextId++
            enemy.character = character
            enemy.anim = 'run'
            enemy.play(character + enemy.anim + scene.foregroundColor)

            if (GameInfo.mode === 'multi') {
                Messenger.socket.emit('enemycreated', {
                    id: enemy.id,
                    character: enemy.character,
                    x: enemy.x,
                    y: enemy.y
                })
            }
            return enemy
        }
    }
}
export default EnemyFactory