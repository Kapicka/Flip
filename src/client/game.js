import GameScene from './scenes/gameScene'
import DummyGameScene from './scenes/dummyGameScene'
import BootScene from './scenes/bootScene'
import MenuScene from './scenes/menuScene'
import WaitingScene from './scenes/waitingScene';
import GameOverScene from './scenes/gameOverScene';
import SingleGameScene from "./scenes/singleGameScene";
import TutorScene from "./scenes/tutorScene";
import TutorialScene from "./scenes/tutorialScene";
import FirstScene from './scenes/firstScene';
import Display from './display'
import Phaser from 'phaser'
import PlayerDisconnectedScene from './scenes/playerDisconnectedScene';

let scenes = []
scenes.push(BootScene)
scenes.push(FirstScene)
scenes.push(MenuScene)
scenes.push(TutorialScene)
scenes.push(GameOverScene)
scenes.push(GameScene)
scenes.push(SingleGameScene)
scenes.push(WaitingScene)
scenes.push(DummyGameScene)
scenes.push(PlayerDisconnectedScene)


// var elem = document.body
// if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
//     if (elem.requestFullscreen) {
//         elem.requestFullscreen();
//         alert('hohoho')
//     } else if (elem.msRequestFullscreen) {
//         elem.msRequestFullscreen();
//         alert('hohoho')
//     } else if (elem.mozRequestFullScreen) {
//         elem.mozRequestFullScreen();
//         alert('hohoho')
//     } else if (elem.webkitRequestFullscreen) {
//         elem.webkitRequestFullscreen();
//         alert('hohoho')
//     }
// } else {
//     if (document.exitFullscreen) {
//         document.exitFullscreen();
//     } else if (document.msExitFullscreen) {
//         document.msExitFullscreen();
//     } else if (document.mozCancelFullScreen) {
//         document.mozCancelFullScreen();
//     } else if (document.webkitExitFullscreen) {
//         document.webkitExitFullscreen();
//     }
// }// async function rotateScreen() {

let canvasWidth = 640
let canvasHeight = 360
Display.init(canvasWidth, canvasHeight)

let gravity = Display.scaleY * 400


let zoom = 1
const config = {
    type: Phaser.WEBGL,
    width: Display.width,
    height: Display.height,
    // scale: {
    //     mode: Phaser.Scale.FIT
    // },

    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: gravity}
        }
    },
    scene: scenes
}

let game = new Phaser.Game(config)
export default game


