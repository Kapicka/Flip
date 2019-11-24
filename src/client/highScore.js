import Textt from './textt'

class HighScore {
    constructor(scene, records, x, y, width, color, fontScale, rows, mode) {
        this.mode = mode
        this.numOfColumns = 4
        this.scene = scene
        this.color = color
        this.width = width
        this.fontScale = fontScale
        this.x = x
        this.y = y
        this.createdGroups = {}
        this.records = records
        this.rows = rows
        this.currentShowCase = undefined


        if (this.mode === 'single') { this.numOfColumns = 3 }
    }

    show(rank) {
        if (rank > 0) {
            while (rank % this.rows !== 0) {
                rank--
            }
        }
        else { rank = 0 }

        if (this.currentShowCase !== undefined) {
            this.createdGroups[this.currentShowCase].forEach(text => {
                text.setVisible(false)
            })
        }

        this.currentShowCase = rank
        if (this.createdGroups[rank] !== undefined) {
            this.createdGroups[rank].forEach(text => {
                text.setVisible(true)
            })
            return
        }

        this.createRecords(rank)
        this.show(rank)
        return
    }
    next() {
        if (this.currentShowCase + this.rows <= this.records.length - 1) {
            this.show(this.currentShowCase + this.rows)
            return true
        }
        return false
    }
    prev() {

        if (this.currentShowCase - this.rows >= 0) {
            this.show(this.currentShowCase - this.rows)
            return true
        }
        return false
    }

    createHeaders() {
        const fontHeight = 7 * this.fontScale
        const fontWidth = 5 * this.fontScale
        const recordMarginX = (this.width / this.rows) * 1.2
        const recordMarginY = fontHeight * 1.5
        this.createdGroups.headers = []

        const x = (this.scene.cameras.main.width / 2) - (recordMarginX * this.numOfColumns / 2)
        let a, b, c, d
        if (this.mode === 'multi') {
            a = new Textt(this.scene, x + 0 * recordMarginX, this.y + recordMarginY, 'RANK', this.color, this.fontScale)
            b = new Textt(this.scene, x + 1 * recordMarginX, this.y + recordMarginY, "PLAYER1", this.color, this.fontScale)
            c = new Textt(this.scene, x + 2 * recordMarginX, this.y + recordMarginY, 'PLAYER2', this.color, this.fontScale)
            d = new Textt(this.scene, x + 3 * recordMarginX, this.y + recordMarginY, 'SCORE', this.color, this.fontScale)
            this.createdGroups['headers'].push(a, b, c, d)
        }
        if (this.mode === 'single') {
            a = new Textt(this.scene, x + 0 * recordMarginX, this.y + recordMarginY, 'RANK', this.color, this.fontScale)
            b = new Textt(this.scene, x + 1 * recordMarginX, this.y + recordMarginY, "PLAYER", this.color, this.fontScale)
            c = new Textt(this.scene, x + 2 * recordMarginX, this.y + recordMarginY, 'SCORE', this.color, this.fontScale)
            this.createdGroups['headers'].push(a, b, c)
        }

    }

    setVisible(option) {
        this.createdGroups[this.currentShowCase]
            .forEach(t => t.setVisible(option))
        this.createdGroups['headers']
            .forEach(t => t.setVisible(option))
        return this

    }

    createRecords(rank) {

        const fontHeight = 7 * this.fontScale
        const fontWidth = 5 * this.fontScale
        const recordMarginX = (this.width / this.rows) * 1.2
        const recordMarginY = fontHeight * 1.5



        this.createdGroups[rank] = []

        let y = this.y + recordMarginY * 1.3

        const columnWidths = [4, 6, 6, 5]
        let rankEnd = 'ST'
        let x = (this.scene.cameras.main.width / 2) - (recordMarginX * this.numOfColumns / 2)
        let ry = 1

        for (let i = rank; i < rank + this.rows; i++) {
            if (this.records[i] === undefined) { return }
            let game = this.records[i]


            if (i === 1) { rankEnd = 'ND' }
            if (i === 2) { rankEnd = 'RD' }
            if (i > 2) { rankEnd = 'TH' }



            if (this.mode === 'multi') {
                if (game.players.length === 1) {
                    game.players.push({ name: 'SOMBODY', color: 'rgb(0,0,0)' })
                }
                console.log('game',game)
                let a = new Textt(this.scene, x + 0 * recordMarginX, y + recordMarginY * ry, rank + ry + rankEnd, this.color, this.fontScale)
                let b = new Textt(this.scene, x + 1 * recordMarginX, y + recordMarginY * ry, game.players[0].name, this.color, this.fontScale)
                let c = new Textt(this.scene, x + 2 * recordMarginX, y + recordMarginY * ry, game.players[1].name, this.color, this.fontScale)
                let d = new Textt(this.scene, x + 3 * recordMarginX, y + recordMarginY * ry, game.score.toString(), this.color, this.fontScale)
                this.createdGroups[rank].push(a, b, c, d)
            }
            if (this.mode === 'single') {
                let a = new Textt(this.scene, x + 0 * recordMarginX, y + recordMarginY * ry, rank + ry + rankEnd, this.color, this.fontScale)
                let b = new Textt(this.scene, x + 1 * recordMarginX, y + recordMarginY * ry, game.players[0].name, this.color, this.fontScale)
                let d = new Textt(this.scene, x + 2 * recordMarginX, y + recordMarginY * ry, game.score.toString(), this.color, this.fontScale)
                this.createdGroups[rank].push(a, b, d)

            }
            ry++


        }

    }

}


export default HighScore