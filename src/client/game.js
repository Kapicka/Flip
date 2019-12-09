
import GameScene from './scenes/gameScene'
import EnterNameScene from './scenes/enterNameScene'
import DummyGameScene from './scenes/dummyGameScene'
import BootScene from './scenes/bootScene'
import MenuScene from './scenes/menuScene'
import WaitingScene from './scenes/waitingScene';
import GameOverScene from './scenes/gameOverScene';
import HighScoreScene from './scenes/highScoreScene';
import SingleGameScene from "./scenes/singleGameScene";

import TutorialScene from "./scenes/tutorialScene";
import DisconnectScene from "./scenes/disconnectScene"
import FirstScene from './scenes/firstScene';
import Display from './display'
import Phaser from 'phaser'






let scenes = []
scenes.push(
    BootScene,
    DisconnectScene,
    HighScoreScene,
    EnterNameScene,
    FirstScene,
    MenuScene,
    TutorialScene,
    GameOverScene,
    GameScene,
    SingleGameScene,
    WaitingScene,
    DummyGameScene,

)

const canvasWidth = 640
const canvasHeight = 360
Display.init(canvasWidth, canvasHeight)

const gravity = Display.scaleY * 1300
let scaleOption = Phaser.Scale.FIT
if (Display.mobile) {
    scaleOption = Phaser.Scale.NONE
}

const config = {
    type: Phaser.WEBGL,
    width: Display.width,
    height: Display.height,
    scale: {
        mode: scaleOption
    },
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: gravity }
        }
    },
    scene: scenes
}

let game = new Phaser.Game(config)
