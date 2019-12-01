
const Display = {
    init: function (cw, ch) {
        this.gamingArea = { width: cw, height: ch, scaleX: 1, scaleY: 1 }
        this.width = cw
        this.height = ch
        this.scaleX = 1
        this.scaleY = 1
        this.mobile = false

        window.addEventListener('scroll', () => { window.scrollTo(0, 0) })

        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            this.mobile = true
            this.width = window.outerWidth
            this.height = window.outerHeight
            this.gamingArea.width = this.width
            this.gamingArea.height = this.height

            if (this.width < this.height) {
                console.log('ORIENTATION ROTATED')
                this.width = window.outerHeight
                this.height = window.outerWidth
                this.gamingArea.width = this.gamingArea.height
                this.gamingArea.height = this.gamingArea.width
            }

            let displayRatio = this.width / this.height
            let idealRatio = 16 / 9
            if (displayRatio > idealRatio) {
                this.gamingArea.width = this.height / 9 * 16
            } else {
                this.gamingArea.height = this.width / 16 * 9

            }

            this.gamingArea.scaleX = this.gamingArea.width / cw
            this.gamingArea.scaleY = this.gamingArea.height / ch

            this.scaleX = this.width / cw
            this.scaleY = this.height / ch
        }


    }

}

export default Display