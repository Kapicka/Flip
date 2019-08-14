import GameInfo from './gameInfo'
import ColorManager from './ColorManager';


const GameActions = {
    init: function () {
        this.flipDirection = () => {
            if (GameInfo.direction === 'left') {
                GameInfo.direction = 'right'
            } else if (GameInfo.direction === 'right') {
                GameInfo.direction = 'left'
            }
            scene.gameObjects.getChildren().forEach(go => {
                go.x = GameInfo.currentScene.cameras.main.width - go.x
                go.setVelocityX(go.body.velocity.x * -1)
                go.passed = false
                go.setFlipX(!go.flipX)
            })
        }

        this.flipColor = () => {
            let scene = GameInfo.currentScene
            let temp = scene.foregroundColor
            scene.foregroundColor = scene.backgroundColor
            scene.backgroundColor = temp

            scene.platforms.getChildren().forEach(p => p.setFrame('dot' + scene.foregroundColor))
            scene.displaydScore.flipColor(scene.foregroundColor)
            scene.lives.getChildren().forEach(l => {
                l.setFrame(l.key + scene.foregroundColor)
            })

            scene.gameObjects.getChildren().forEach(go => {
                let animToplay = go.character + 'run' + scene.foregroundColor
                go.play(animToplay)
            })

            scene.dude.play('dude' + scene.dude.anim + scene.foregroundColor)
            scene.cameras.main.setBackgroundColor(scene.backgroundColor)
        }

    }
}
export default GameActions