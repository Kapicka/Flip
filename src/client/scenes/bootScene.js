import createAnimations from "../animations";
import Messenger from '../messenger'
/**
 * První scéna hry, v této scéně jsou načteny externí soubory, které 
 * jsou dále ve hře použity
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'bootScene' })
    }
    preload() {
        this.load.atlasXML('sprites',
            require('../assets/sprites.png'),
            require('../assets/sprites.xml'))

        this.load.atlasXML('pixelFont',
            require('../assets/pixelFont.png'),
            require('../assets/pixelFont.xml'))

        this.load.atlasXML('buttons',
            require('../assets/buttons.png'),
            require('../assets/buttons.xml'))
    }
    create() {
        createAnimations(this)
    }

    update(t) {
        this.scene.start('firstScene')
    }

}





