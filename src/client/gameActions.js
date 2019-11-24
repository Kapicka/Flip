import GameInfo from './gameInfo'
import ColorManager from './colorManager';
import Messenger from "./messenger";

const GameActions = {
    init: function () {
        this.switchTurn = function () {
          
        }

        this.flipColor = function () {
            let scene = GameInfo.currentScene
            let temp = scene.foregroundColor
            scene.backgroundColor = scene.foregroundColor
            scene.foregroundColor = foregroundColor

            scene.gameObjects.getChildren().forEach(go => {
                go.flipColor()
            })
            scene.cameras.main.setBackgroundColor(scene.backgroundColor)
            scene.cameras.main.setBackgroundColor(scene.backgroundColor)
        }

    }
}
export default GameActions