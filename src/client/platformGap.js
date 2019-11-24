import GameSprite from "./gameSprites/gameSprite"
import getScenePositions from "./positions"

export default class PlarformGap extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, width, color) {
        super(scene, x, y, 'sprites', 'dot' + color)
        let p = getScenePositions(scene)
        this.prev = {
            x: x,
            y: y
        }
        scene.physics.world.enableBody(this, 0)
        this.body.setAllowGravity(false)
        scene.physics.add.existing(this)
        scene.add.existing(this)
        this.setScale(width, p.platformHeight)
    }
    flipColor(color) {
        this.setFrame('dot' + color)

    }
}