import EventEmmiter from 'events'

export default class SwipeController extends EventEmmiter {
    constructor(scene, threshold) {
        super()
        let downPos = 0
        scene.input.on('pointerup', (pointer) => {
                let xDiff = downPos.x - pointer.x
                let yDiff = downPos.y - pointer.y

                if (Math.abs(yDiff) > Math.abs(xDiff)) {
                    if (downPos.y + threshold < pointer.y) {
                        console.log('down')
                        this.emit('down')
                    }
                    if (downPos.y - threshold > pointer.y) {
                        console.log('up')
                        this.emit('up')
                    }
                } else {
                    if (downPos.x + threshold < pointer.x) {
                        console.log('right')
                        this.emit('right')
                    }
                    if (downPos.x - threshold > pointer.x) {
                        console.log('left')
                        this.emit('left')
                    }
                }
            }
        )


        scene.input.on('pointerdown', (pointer) => {
                downPos = {x: pointer.x, y: pointer.y}
            }
        )

    }
}


