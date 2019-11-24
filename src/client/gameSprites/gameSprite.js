import Phaser from 'phaser'

export default class GameSprite extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, character, anim, body) {
        let frame = character + '_' + anim + '_' + 0 + scene.foregroundColor
        super(scene, x, y, 'sprites', frame)
        this.character = character
        this.type = 'gameSprite'
        this.anim = anim
        this.color = scene.foregroundColor
        this.prev = {
            anim: anim,
            x: x,
            y: y
        }
        if (body) {
            scene.physics.world.enableBody(this, 0)
            scene.physics.add.existing(this)
        }
        scene.add.existing(this)
    }

    flipColor(color) {
        this.color = color
        this.play(this.character + this.anim + this.color)
        return this
    }
    setAnim(anim) {
        this.anim = anim
        this.play(this.character + this.anim + this.color)
        return this
    }
}


