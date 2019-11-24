import {getGameScenePositions} from "./positions";

export default class Lives extends Phaser.GameObjects.Container {
    constructor(scene, x, y, numOfLives, key, frame, c) {
        super(scene, x, y)
        this.key = key
        this.frame = frame
        let p = getGameScenePositions(scene)
        for (let i = 0; i < numOfLives; i++) {
            let x = this.getBounds().x + this.getBounds().width + p.liveMarginLeft
            let y = this.getBounds().y
            let liveImg = scene.add.image(x, y, key, frame + c)
                .setScale(p.liveScale)
            this.add(liveImg)
        }
        scene.add.existing(this)
    }
    removeLive() {
  
        this.getAt(this.count('visible', true) - 1).setVisible(false)
    }

    addLive() {
        this.getAt(this.count('visible', false) - 1).setVisible(true)
    }

    flipColor(color) {
        this.each((l) => l.setFrame(this.frame + color)
        )
    }
}