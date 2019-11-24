import GameSprite from "./gameSprite";
import Display from "../display"
export default class Runner extends GameSprite {
    constructor(scene, x, y, state) {
        super(scene, x, y, 'dude', 'run', true)
        this.default = { x: x, y: y }
        this.states = new States(this, scene)
        this.currentState = this.states[state]
        this.lives = 3
        this.id = 'dude'
        this.pivotY = 230 * Display.gamingArea.scaleY
        this.body.setBounce(0.2)

    }
    run() {
        this.currentState.run()
    }
    hit() {
        this.currentState.hit()
    }
    jump() {
        this.currentState.jump()
    }
    slide() {
        this.currentState.slide()
    }
    gap() {
        this.currentState.gap()

    }
}


function States(runner, scene) {

    function jump() {
        runner.emit('jump')
        runner.currentState = runner.states['jumpingState']
        runner.anim = 'jump'
        runner.setVelocityY(-500 * Display.gamingArea.scaleY)
        let anim = runner.character + runner.anim + scene.foregroundColor
        runner.play(anim)
        return true
    }
    function hit() {
        runner.currentState = runner.states['hitState']
        runner.anim = 'hit'
        runner.lives--

        if (runner.lives === 0) {
            runner.emit('killed')
        } else {
            runner.emit('hit')
            runner.play('dudehit' + scene.foregroundColor)
            runner.setSize()
            runner.setY(runner.pivotY)
            scene.time.delayedCall(500, () => {
                runner.anim = 'run'
                runner.play('dude' + runner.anim + scene.foregroundColor)
                runner.setSize()
                runner.setY(runner.pivotY)

                runner.currentState = runner.states['runningState']
            })
        }
        return true
    }
    function run() {

        runner.emit('run')
        runner.currentState = runner.states['runningState']
        runner.anim = 'run'
        let anim = runner.character + runner.anim + scene.foregroundColor
        runner.play(anim)
        runner.setSize()
        runner.setY(runner.pivotY)
        return true
    }
    function jumpDown() {
        runner.emit('jumpdown')
        runner.anim = 'slide'
        runner.setVelocityY(900 * Display.gamingArea.scaleY)
        runner.play(runner.character + runner.anim + scene.foregroundColor)

        return true
    }
    function emptyf() {
        return false
    }
    function gap() {
        scene.fallableObjects.remove(runner)
        runner.currentState = runner.states['gapState']
        runner.anim = 'jump'
        runner.play(runner.character + runner.anim + scene.foregroundColor)
    }

    function slide() {
        runner.emit('slide')
        runner.currentState = runner.states['slidingState']
        runner.anim = 'slide'
        runner.play(runner.character + runner.anim + scene.foregroundColor)
        runner.setSize()
    }

    this.runningState = {
        name: 'runningState', slide: slide, run: emptyf, jump: jump, hit: hit, gap: gap
    }
    /**
     * Jumping State
     */
    this.hitState = {
        name: 'hitState', slide: emptyf, run: emptyf, jump: emptyf, hit: emptyf, gap: emptyf
    }
    /**
     * Sliding State
     */
    this.slidingState = {
        name: 'slidingState', slide: emptyf, run: emptyf, jump: run, hit: hit, gap: gap
    }
    //JUMPING STATE
    this.jumpingState = {
        name: 'jumpingState', jump: emptyf, slide: jumpDown, run: run, hit: hit, gap: gap
    }
    this.gapState = {
        name: 'gapState', jump: emptyf, slide: emptyf, run: emptyf, hit: emptyf, gap: emptyf
    }
    this.jumpingAndslideing = {
        name: 'jumpingAndslideingState', jump: emptyf, slide: emptyf, run: run, gap: gap
    }

}
