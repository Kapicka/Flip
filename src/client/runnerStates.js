import Display from "./display";
import Messenger from "./messenger"

const runnerStates = {
    states: {},
    init: function (runner, scene) {
        console.log('runner na zacatku', runner)

        function jump() {
            runner.stat = runner.states['jumpingState']
            runner.anim = 'jump'
            runner.setVelocityY(-450 * Display.gamingArea.scaleY)
            let anim = runner.character + runner.anim + scene.foregroundColor
            runner.play(anim)
            Messenger.socket.emit('animchanged', {id: runner.id, anim: runner.anim})
        }

        function grounded() {
            runner.stat = runner.states['runningState']
            runner.setState('runningState')
        }

        function duck() {
            console.log('ALL THE DUCKS ARE SINGING IN THE WATER')
            runner.stat = runner.states['duckState']
        }

        function run() {
            runner.anim = 'run'
            let anim = runner.character + runner.anim + scene.foregroundColor
            runner.play(anim)
            runner.stat = runner.states['runningState']
            Messenger.socket.emit('animchanged',
                {id: runner.id, anim: runner.anim})

        }

        function emptyf() {
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
                runner.anim = 'duck'
                runner.setVelocityY(800 * Display.gamingArea.scaleY)
                runner.play(runner.character + runner.anim + scene.foregroundColor)
                Messenger.socket.emit('animchanged', {id: runner.id, anim: runner.anim})
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