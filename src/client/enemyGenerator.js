import GameInfo from './gameInfo'
import EnemyFactory from './enemyFactory'
import Display from './display';




const EnemyGenerator = {
    init: function (scene) {
        let w = scene.cameras.main.width
        let maxEnemies = GameInfo.level
        let numOfEnemies = 0
        let enemyMargin = 0
        let scx = Display.scaleX

        this.generateEnemy = function () {
            maxEnemies = GameInfo.level
            numOfEnemies = scene.enemies.getChildren().length
            enemyMargin = Math.random() * 50 + 50 * scx

            if (scene.enemies.getChildren().length) {
                let lastEnemyX = scene.enemies.getChildren()[scene.enemies.getChildren().length - 1].x
                if (numOfEnemies < maxEnemies) {
                    if (GameInfo.direction === 'left' && w - lastEnemyX > enemyMargin) {
                        EnemyFactory.createEnemy()
                    }
                    else if (GameInfo.direction === 'right' && lastEnemyX > enemyMargin) {
                        EnemyFactory.createEnemy()
                    }
                }
            }
            else {
                EnemyFactory.createEnemy()
                console.log('ENEMY RELIEST')
            }
        }
    }
}

export default EnemyGenerator