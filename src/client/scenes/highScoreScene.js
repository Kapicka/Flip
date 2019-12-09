import createAnimations from "../animations";
import GameInfo from "../gameInfo";
import { getHighScoreScenePositions } from '../positions'
import Textt from '../textt'
import Display from '../display'
import Messenger from '../messenger'
import HighScore from "../highScore";
import ColorManager from "../colorManager";




export default class HighScoreScene extends Phaser.Scene {
    constructor() {
        super({ key: 'highScoreScene' })
    }

    create(data) {
        createAnimations(this)
        const p = getHighScoreScenePositions(this)
        console.log(data, 'data')
        this.foregroundColor = data.fg
        // this.backgroundColor = data.bg
        this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)


        this.cameras.main.setBackgroundColor(this.backgroundColor)
        this.currentShowCase = undefined

        this.showcaseSingle = undefined
        this.showcaseMulti = undefined



        new Textt(this, p.nextX, p.nextY, 'NEXT', this.foregroundColor, p.normalTextScale)
            .setInteractive()
            .on('pointerdown', () => {
                if (!this.currentShowCase.next()) this.cameras.main.flash()
            })

        new Textt(this, p.prevX, p.prevY, 'PREV', this.foregroundColor, p.normalTextScale)
            .setInteractive()
            .on('pointerdown', () => {
                if (!this.currentShowCase.prev()) this.cameras.main.flash()
            })




        this.multi = new Textt(this, p.multiX, p.multiY, 'MULTI', this.foregroundColor, p.normalTextScale)
            .setInteractive()

        this.multi.on('pointerdown', () => {
            this.single.setDarken(false)
            this.multi.setDarken(true)
            show('multi')
        })

        this.single = new Textt(this, p.singleX, p.singleY, 'SINGLE', this.foregroundColor, p.normalTextScale)
            .setInteractive()
        this.single.on('pointerdown', () => {
            this.single.setDarken(true)
            this.multi.setDarken(false)
            show('single')
        })

        if (data.mode === 'single') { this.single.setDarken(true) }
        if (data.mode === 'multi') { this.multi.setDarken(true) }

        new Textt(this, p.highScoreTextX, p.highScoreTextY, 'HIGH SCORES', this.foregroundColor, p.highScoreTextScale)
            .centerX()

        this.input.keyboard.on('keydown-DOWN', () => this.currentShowCase.next())
        this.input.keyboard.on('keydown-UP', () => this.currentShowCase.prev())
        this.input.keyboard.on('keydown-J', () => this.currentShowCase.next())
        this.input.keyboard.on('keydown-K', () => this.currentShowCase.prev())
        this.input.keyboard.on('keydown-H', () => this.single.emit('pointerdown'))
        this.input.keyboard.on('keydown-L', () => this.multi.emit('pointerdown'))
        this.input.keyboard.on('keydown-LEFT', () => this.single.emit('pointerdown'))
        this.input.keyboard.on('keydown-RIGHT', () => this.multi.emit('pointerdown'))



        const rows = 5
        function sortGamesDesc(a, b) {
            if (a.score < b.score) { return 1 }
            if (a.score > b.score) { return -1 }
            return 0

        }
        const show = (mode) => {
            console.log(this.currentShowCase, 'is going to disappear ')
            this.currentShowCase.setVisible(false)

            if (mode === 'single') {
                if (this.showcaseSingle === undefined) {
                    createHighScores('single')
                        .then(hs => {
                            this.showcaseSingle = hs
                            this.showcaseSingle.setVisible(true)
                            this.currentShowCase = this.showcaseSingle
                        })
                        .catch(err => {

                            throw err
                        })
                }
                else {
                    this.showcaseSingle.setVisible(true)
                    this.currentShowCase = this.showcaseSingle
                    console.log('currnet show case single please ', this.currentShowCase)
                }
            }

            if (mode === 'multi') {
                if (this.showcaseMulti === undefined) {
                    createHighScores('multi')
                        .then(hs => {
                            this.showcaseMulti = hs
                            this.showcaseMulti.setVisible(true)
                            this.currentShowCase = this.showcaseMulti
                        }).catch(err => { throw err })
                }
                else {
                    this.showcaseMulti.setVisible(true)
                    this.currentShowCase = this.showcaseMulti
                }
            }
        }
        const createHighScores = (mode) => {
            return new Promise((res, rej) => {
                Messenger[mode].getGames()
                    .then(games => {
                        const sortedGames = games.sort(sortGamesDesc)
                        let rank = data.rank
                        if (data.rank > 3) {
                            rank = sortedGames.findIndex(g => g._id === data.id)
                        }
                        const highScore = new HighScore(this,
                            sortedGames,
                            p.highScoreX,
                            p.highScoreY,
                            Display.width,
                            this.foregroundColor,
                            3 * Display.gamingArea.scaleY,
                            rows,
                            mode)
                        highScore.createHeaders()
                        highScore.show(rank)

                        res(highScore)
                    }
                    ).catch(err => {
                        this.scene.start('disconnectScene', { subject: 'server' })
                        rej(err)
                    })
            })

        }

        createHighScores(data.mode)
            .then(hs => {
                this.currentShowCase = hs
                show(data.mode)
            })
            .catch(err => { throw err })


        this.add.sprite(p.homeButtonX, p.homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(p.homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                this.scene.stop('tutorialScene')
            })




    }


    update(t) {

    }

}






