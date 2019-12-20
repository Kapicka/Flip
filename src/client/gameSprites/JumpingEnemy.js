import GameSprite from './GameSprite'

export default class JumpingEnemy extends GameSprite {
    constructor(scene, x, y, character, platforms) {
        super(scene, x, y, character, 'run', true)
        this.type = 'jumpingEnemy'
        this.character = character
        scene.physics.add.overlap(this, scene.platforms, (e, p) => {
            e.play(character + 'run' + scene.foregroundColor)
            e.setVelocityY(-250)
            e.flipColor(scene.backgroundColor)
            e.play(character + 'jump' + scene.foregroundColor)
        })
    }
}


