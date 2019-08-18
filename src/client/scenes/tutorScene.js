import Display from "../display";
import Messenger from "../messenger";
import GameInfo from "../gameInfo";
import ColorManager from "../ColorManager";
import Animations from '../Animations'
import Textt from "../textt";


let timer1 = 0
let timer2 = 2
let timer3 = 3
export default class TutorScene extends Phaser.Scene {
    constructor() {
        super({key: 'tutorScene'})
    }

    init() {
        GameInfo.currentScene = this
    }

    preload() {
    }

    create() {

        GameInfo.hasTutorial = true
        Animations.init(this)
        let w = Display.gamingArea.width
        let h = Display.gamingArea.height
        let cx = w / 2
        let cy = h / 2
        let x = this.cameras.main.x + ((Display.width - w))
        let y = this.cameras.main.y
        let scx = Display.gamingArea.scaleX
        let scy = Display.gamingArea.scaleY

        let fg = undefined
        if (GameInfo.inited) {
            fg = GameInfo.players.localPlayer.color
        }
        let bg = ColorManager.getRandomColor()
        console.log(fg)
        if (fg === undefined) {
            fg = ColorManager.getRandomColor()
        }
        console.log('after', fg)
        while (fg === bg) {
            bg = ColorManager.getRandomColor()
        }
        this.cameras.main.setBackgroundColor(bg)

        let enemies = ['deamon', 'duck', 'dog', 'pig', 'shaolin']

        let dudes = this.add.group()
        let platfomrs = this.physics.add.staticGroup()
        let texts = []
        let offsetY = 50 * scy
        let platformWidth = (60 * 3) * scx
        let offsetX = platformWidth / 2 * -1
        let platformHeight = 10 * scy
        let platformLeftX = x + w / 4 + offsetX
        let platformRightX = x + w - w / 4 + offsetX
        let platformTopY = h / 4 + offsetY
        let platformBottomY = h - h / 4 + offsetY

        let dudeLeftX = platformLeftX + platformWidth / 2
        let dudeRightX = platformRightX + platformWidth / 2
        let dudeTopY = platformTopY - 50 * scy
        let dudeBottomY = platformBottomY - 20 * scy
        let dudeScale = 4 * scx

        let textOffset = -100 * scy
        let textLeftX = dudeLeftX
        let textRightX = dudeRightX
        let textTopY = platformTopY + textOffset
        let textBottomY = platformBottomY + textOffset
        let textScale = 2 * scx

        let enemyX = dudeRightX + 30 * scx
        let enemyY = dudeBottomY + 20 * scy

        let homeButtonX = 30 * scy
        let homeButtonY = 30 * scy
        let homeButtonScale = 3 * scx


        let pressvsswipe = 'Press'
        let keyvsnothing = " key"
        if (Display.mobile) {
            pressvsswipe = 'Swipe'
            keyvsnothing = " "
        }
        let jumpingText = pressvsswipe + " up" + keyvsnothing + ' to jump'
        let stage1 = []

        new Textt(this, textLeftX, textTopY, 'Tutorial', fg, 4 * scx)
        new Textt(this, textLeftX, textTopY + 40 * scy, jumpingText, fg, 3 * scx)
        //      new Textt(this, textLeftX, textTopY + 40 * scy, , fg, 3 * scx)

        // let playButton = this.add.sprite(x + w / 2, h / 2 + y, 'buttons',
        //     'playButton' + fg)
        //     .setScale(2 * scx)
        //     .setInteractive()
        //     .on('pointerup', () => {
        //         Messenger.init(this)
        //         this.scene.sleep()
        //
        //     })
        // if (GameInfo.prevScene === 'firstScene') {
        //     playButton.setVisible(false)
        // }
        //
        // this.add.sprite(homeButtonX, homeButtonY, 'buttons', 'homeButton' + fg)
        //     .setScale(homeButtonScale)
        //     .setInteractive()
        //     .on('pointerup', () => {
        //         this.scene.switch('firstScene')
        //         this.scene.sleep()
        //     })
        // //ENEMAK
        // let index = Math.floor(Math.random() * enemies.length - 0.1)
        // let enemyCharacter = enemies[index] + '_run_0' + fg
        // console.log(enemyCharacter)
        // let enemy = this.add.sprite(enemyX, dudeBottomY, 'sprites',
        //     enemyCharacter).setScale(dudeScale)
        // //DUDE TOP LEFT
        // dudes.create(dudeLeftX, dudeTopY, 'sprites', 'dude_jump_0' + fg)
        //     .setScale(dudeScale)
        // //DUDE TOP RIGHT
        // dudes.create(dudeRightX, dudeTopY, 'sprites', 'dude_duck_0' + fg)
        //     .setScale(dudeScale)
        // //DUDE BOTTOM LEFT
        // dudes.create(dudeLeftX, dudeBottomY, 'sprites', 'dude_run_0' + fg)
        //     .setScale(dudeScale)
        // //DUDE BOTTOM RIGHT
        // dudes.create(dudeRightX - 30 * scx, dudeBottomY, 'sprites', 'dude_run_0' + fg)
        //     .setScale(dudeScale)
        // //PLATFORM1
        // platfomrs.create(platformLeftX, platformTopY, 'sprites', 'dot' + fg)
        //     .setScale(platformWidth, platformHeight)
        // //PLATFORM2
        // platfomrs.create(platformRightX, platformTopY, 'sprites', 'dot' + fg)
        //     .setScale(platformWidth, platformHeight)
        // //PLATFORM3
        // platfomrs.create(platformLeftX, platformBottomY, 'sprites', 'dot' + fg)
        //     .setScale(platformWidth, platformHeight)
        // //PLATFORM4
        // platfomrs.create(platformRightX, platformBottomY, 'sprites', 'dot' + fg)
        //     .setScale(platformWidth, platformHeight)
        //
        // let what = 'Press'
        // if (Display.mobile) {
        //     what = 'Swipe'
        // }
        // texts.push(new Textt(this, textLeftX, textTopY, what + ' up to jump', fg, textScale))
        // texts.push(new Textt(this, textRightX, textTopY, what + ' down to fast fall', fg, textScale))
        // texts.push(new Textt(this, textLeftX, textBottomY, 'Play when your color is on ', fg, textScale))
        // texts.push(new Textt(this, textRightX, textBottomY, 'Dont get killed by enemy ', fg, textScale))
        //
        // texts.forEach(t => {
        //     t.setX(t.x - t.width / 2)
        // })
        // platfomrs.getChildren().forEach(p => {
        //     p.setOrigin(0, 0)
        // })
    }
}


