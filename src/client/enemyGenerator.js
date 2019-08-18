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
        let ret = false

        this.generateEnemy = function () {
            maxEnemies = GameInfo.level
            numOfEnemies = scene.enemies.getChildren().length
            enemyMargin = Math.random() * 100 + 120 * scx

            if (numOfEnemies) {
                let lastEnemyX = scene.enemies.getChildren()[scene.enemies.getChildren().length - 1].x
                if (numOfEnemies < maxEnemies) {
                    if (GameInfo.direction === 'left' && w - lastEnemyX > enemyMargin) {
                        ret = EnemyFactory.createEnemy(maxEnemies)
                    } else if (GameInfo.direction === 'right' && lastEnemyX > enemyMargin) {
                        ret = EnemyFactory.createEnemy(maxEnemies)
                    }
                }
            } else {
                ret = EnemyFactory.createEnemy(maxEnemies)
            }
            return ret
        }
    }
}

export default EnemyGenerator