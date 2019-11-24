import Textt from "./textt"
import { GameObjects } from "phaser"
import { cpus } from "os"
import { copyFile } from "fs"

export default class TextMenu {
    constructor(scene, config) {





        const x = config.x
        const y = config.y
        const color = config.color
        const scale = config.scale
        let activeColor = config.activeColor
        const items = config.items
        let orientation = config.orientation
        const mobile = config.mobile

        let arrowLeft = " <-"
        let arrowRight = "-> "

        if (activeColor === undefined) { activeColor = color }
        if (orientation === undefined) { orientation = 'vertical' }
        if (mobile === true) { arrowLeft = ''; arrowRight = '' }

        this.head = undefined
        this.tail = undefined
        this.activeText = undefined
        this.margin = 7 * scale * 1.5
        this.marginX = 5 * scale
     



        const setActiveText = (text) => {
            this.activeText
                .setText(this.activeText.value)
                .flipColor(color)
                .centerX()

            text.setText(arrowRight + text.value + arrowLeft)
                .flipColor(activeColor)
                .centerX()
            this.activeText = text
        }



        this.addText = function (text) {
            if (this.head === undefined) {
                this.head = createText(scene, x, y, text, activeColor, scale)
                this.head.prev = this.head
                this.head.next = this.head
                this.activeText = this.head
                this.tail = this.head
                setActiveText(this.head)
            }
            else {
                let image = undefined

                if (orientation === 'vertical') {
                    let newy = this.head.y + this.margin
                    image = createText(scene, x, newy, text, color, scale)
                }
                if (orientation === 'horizontal') {
                    image = createText(scene, x, y, text, color, scale)
                    console.log(this.head.x + image.getWidth() + this.marginX)
                    image.setX(this.head.x + image.getWidth() + this.marginX)
                }


                image.next = this.tail
                image.prev = this.head
                this.head.next = image
                this.head = image

            }
        }
        function createText(scene, x, y, text, activeColor, scale) {
            let txt = new Textt(scene, x, y, text.text, activeColor, scale)
            txt.action = text.action
            txt.centerX
            txt.centerX()
            txt.setInteractive()
            txt.on('pointerover', () => { setActiveText(txt) })
            txt.on('pointerdown', text.action)
            txt.action = text.action
            txt.value = text.text
            return txt
        }

        this.down = function () {
            setActiveText(this.activeText.next)
        }

        this.up = function () {
            setActiveText(this.activeText.prev)
        }
        this.submit = function () {
            this.activeText.action()
        }


        if (items !== undefined) {

            items.forEach(text => this.addText(text))
        }

    }
}

