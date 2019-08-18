import Phaser from 'phaser'
import runnerStates from './runnerStates'
import Messenger from './messenger';

export default class Runner extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, sprite) {
        super(scene, x, y, 'sprites', sprite + '_run_0' + scene.foregroundColor)
        this.scene = scene
        runnerStates.init(this, scene)
        this.states = runnerStates.states
        this.stat = this.states['jumpingState']
        this.onTurn = false
        this.character = sprite
        this.lives = 3
        this.anim = 'jump'
        this.id = 'dude'
        this.prev = {}
        this.prev.anim = 'jump'
        this.prevY = y
        scene.physics.world.enableBody(this, 0)
        scene.add.existing(this)
        scene.gameObjects.add(this)

    }

    playy() {

        this.play()

    }

    grounded() {
        return this.stat.grounded()
    }

    jump() {
        return this.stat.jump()
    }

    shoot() {
    }

    duck() {
        return this.stat.duck()
    }

    switchColor() {
        this.play(this.character + this.anim + this.scene.foregroundColor)
    }
}

