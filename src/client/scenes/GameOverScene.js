import Display from '../Display'
import Textt from "../Textt"
import Messenger from '../Messenger'

import { getGameOverScenePositions } from '../Positions'
import TextMenu from '../TextMenu';
import GameInfo from '../GameInfo';
import ColorManager from '../ColorManager';

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'gameOverScene' })

    }

    init() {
    }

    preload() {
    }

    create() {
        const p = getGameOverScenePositions(this)

        let score = GameInfo.score
        this.rank = undefined

        let mainTextValue = "Game Over"
        mainTextValue = mainTextValue.toUpperCase()


        const setRankText = (rank) => {
            if (rank === 0) { mainTextValue = 'First place!' }
            if (rank === 1) { mainTextValue = 'Second place!' }
            if (rank === 2) { mainTextValue = 'Third place!' }
            this.mainText.setText(mainTextValue.toUpperCase())
            this.mainText.centerX()
        }

        const getRankSingle = () => {
            Messenger.single.getRank(GameInfo.score)
                .then(rank => {
                    this.rank = rank
                    setRankText(rank)
                })
                .catch(err => console.error(err))
        }
        function getRankMulti() {
            Messenger.multi.getRank(score)
                .then(rank => {
                    setRankText(rank)
                })
                .catch(err => console.error(err))
        }

        const scoreValue = GameInfo.score.toString()
        console.log(GameInfo.score)
        const scoreText = 'YOUR SCORE'

        console.log('gameOverScene!')

        this.foregroundColor = GameInfo.players.localPlayer.color
        this.backgroundColor = GameInfo.players.remotePlayer.color

        if (this.backgroundColor === undefined) {
            this.backgroundColor = ColorManager.getRandomExcept(this.foregroundColor)
        }

        console.log(p.scoreTextX, p.scoreTextY, scoreText, scale)

        this.cameras.main.setBackgroundColor(this.backgroundColor)

        this.mainText = new Textt(this, p.mainTextX, p.mainTextY, mainTextValue, this.foregroundColor, 6 * Display.scaleX)
            .centerX()
        this.scoreText = new Textt(this, p.scoreTextX, p.scoreTextY, scoreText, this.foregroundColor, 3 * Display.scaleX)
            .centerX()
        this.score = new Textt(this, p.scoreX, p.scoreY, scoreValue, this.foregroundColor, 3 * Display.scaleX)
            .centerX()


        if (GameInfo.mode === 'single') { getRankSingle() }
        if (GameInfo.mode === 'multi') { getRankMulti() }

        let text = 'GOOD JOB!'
        if (score < 4) {
            text = 'WHAT A BEAUTIFUL DAY!'
        }
        const playAgain = () => {
            if (GameInfo.mode === 'single')
                this.scene.start('singleGameScene')
            if (GameInfo.mode === 'multi') {
                GameInfo.players.remotePlayer = undefined
                this.scene.start('waitingScene')
            }
            GameInfo.score = 0
            GameInfo.onTurn = false
            GameInfo.master = false
            this.scene.stop('gameOverScene')
            this.scene.stop('gameScene')
            this.scene.stop('dummyGameScene')
            this.scene.stop('disconnectScene')
        }

        const startHighScores = () => {
            let fg = GameInfo.players.localPlayer.color
            let bg = ColorManager.getRandomExcept(fg)

            if (GameInfo.mode === 'multi') {
                bg = GameInfo.players.remotePlayer.color
                if (bg === fg) { bg = ColorManager.getRandomExcept(fg) }
            }

            this.scene.start('highScoreScene', {
                fg: fg,
                bg: bg,
                mode: GameInfo.mode,
                rank: this.rank
            })
            this.scene.stop(this)
        }

        const startNameEntry = () => {
            this.scene.start('enterNameScene', { rank: this.rank })
            this.scene.stop(this)
        }

        let menuItems = [
            { text: "ENTER NAME", action: startNameEntry },
            { text: "PLAY AGAIN", action: playAgain },
            { text: "HIGH SCORES", action: startHighScores }
        ]

        const scale = 3 * Display.scaleX

        const menuConfig = {
            x: p.menuTextX,
            y: p.menuTextY,
            color: this.foregroundColor,
            scale: scale,
            items: menuItems
        }

        let textMenu = new TextMenu(this, menuConfig)
        this.input.keyboard.on('keydown-J', () => textMenu.down())
        this.input.keyboard.on('keydown-K', () => textMenu.up())
        this.input.keyboard.on('keydown-DOWN', () => textMenu.down())
        this.input.keyboard.on('keydown-UP', () => textMenu.up())
        this.input.keyboard.on('keydown-SPACE', () => textMenu.submit())
        this.input.keyboard.on('keydown-ENTER', () => textMenu.submit())

        let homeButtonX = 30 * Display.scaleX
        let homeButtonY = 30 * Display.scaleX
        let homeButtonScale = 4 * Display.scaleX


        this.homeButton = this.add.sprite(homeButtonX,
            homeButtonY, 'buttons', 'homeButton' + this.foregroundColor)
            .setScale(homeButtonScale)
            .setInteractive()
            .on('pointerup', () => {
                this.scene.start('firstScene')
                GameInfo.prevScene = this.scene.key
            })



    }
}

