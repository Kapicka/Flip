import Animations from '../animations'
import Messenger from '../messenger'
import Display from '../display';
import GameInfo from '../gameInfo';
let pos
let prevpos
let isDown

export default class PauseScene extends Phaser.Scene {
    constructor() {
        super({ key: 'pauseScene' })
    }
    init() {
        GameInfo.currentScene = this
    }
    preload() {

    }

    create() {

        let scaleX = Display.scaleX
        let scaleY = Display.scaleY
        this.add.text(20, 20, 'CAFEE PAUSE')

    }
    update(t, delta) {

        // if (window.innerWidth > window.innerHeight) {
        //     this.scene.switch('gameScene')
        // }
    }
}
