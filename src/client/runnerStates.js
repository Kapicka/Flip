import Display from "./display";
import Messenger from "./messenger";
import GameInfo from "./gameInfo";

const runnerStates = {
    states: {},
    init: function (runner, scene) {
        console.log('runner na zacatku', runner)

        function jump() {
            runner.stat = runner.states['jumpingState']
            runner.prev.anim = runner.anim
            runner.anim = 'jump'
            runner.setVelocityY(-350 * Display.gamingArea.scaleY)
            let anim = runner.character + runner.anim + scene.foregroundColor
            runner.play(anim)
            if (GameInfo.mode === 'multi') {
                Messenger.socket.emit('animchanged', {id: runner.id, anim: runner.anim})
            }
            return true
        }

        function grounded() {
            runner.stat = runner.states['runningState']
            runner.setState('runningState')
        }

        function run() {
            runner.prev.anim = runner.anim
            runner.anim = 'run'
            let anim = runner.character + runner.anim + scene.foregroundColor
            runner.play(anim)
            runner.stat = runner.states['runningState']
            if (GameInfo.mode === 'multi') {
                if (GameInfo.mode === 'multi') {
                    Messenger.socket.emit('animchanged', {id: runner.id, anim: runner.anim})
                }
            }
            return true
        }

        function emptyf() {
            return false
        }

//RUNNING STATE
        this.states.runningState = {
            duck: emptyf, run: emptyf, grounded: emptyf, jump
        }
//Sliding state
        this.states.slidingState = {
            duck: emptyf, run: emptyf, grounded: emptyf, jump
        }
//JUMPING STATE
        this.states.jumpingState = {
            jump: emptyf,
            duck: function () {
                runner.prev.anim = runner.anim
                runner.anim = 'duck'
                runner.setVelocityY(900 * Display.gamingArea.scaleY)
                runner.play(runner.character + runner.anim + scene.foregroundColor)
                if (GameInfo === 'multi') {
                    Messenger.socket.emit('animchanged', {id: runner.id, anim: runner.anim})
                }
                return true
            },
            grounded: run
        }
        this.states.jumpingAndDucking = {
            jump: emptyf, duck: emptyf, grounded: run
        }
        this.getStates = function () {
            return this.states
        }
    }

}


export default runnerStates