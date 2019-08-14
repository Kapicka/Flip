import Animations from "../animations";
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({key: 'bootScene'})
    }

    init() {
    }

    preload() {
        this.load.atlasXML('sprites', require('../assets/sprites.png'), require('../assets/sprites.xml'))
        this.load.atlasXML('pixelFont', require('../assets/pixelFont.png'), require('../assets/pixelFont.xml'))
        this.load.atlasXML('buttons', require('../assets/buttons.png'), require('../assets/buttons.xml'))
        this.load.svg('nadpis', require('../assets/nadpis.svg'))

    }

    create() {
        Animations.init(this)
    }

    update(t) {
        // this.scene.start('menuScene')
        this.scene.start('menuScene')

    }
}

