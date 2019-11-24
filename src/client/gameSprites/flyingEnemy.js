import GameSprite from './gameSprite'
export default class FlyingEnemy extends GameSprite {
    constructor(scene, x, y, character) {
        super(scene, x, y, character, 'run', true)
        this.type = 'flyingEnemy'
        this.character = character
        this.body.setAllowGravity(false)

    }
}