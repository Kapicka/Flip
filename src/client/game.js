
import GameScene from './scenes/GameScene'
import EnterNameScene from './scenes/EnterNameScene'
import DummyGameScene from './scenes/DummyGameScene'
import BootScene from './scenes/BootScene'
import MenuScene from './scenes/MenuScene'
import WaitingScene from './scenes/WaitingScene';
import GameOverScene from './scenes/GameOverScene';
import HighScoreScene from './scenes/HighScoreScene';
import SingleGameScene from "./scenes/SingleGameScene";

import TutorialScene from "./scenes/TutorialScene";
import DisconnectScene from "./scenes/DisconnectScene"
import FirstScene from './scenes/FirstScene';
import Display from './Display'
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
    parent:'canvas-container',
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
