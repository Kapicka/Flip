 const PlatformFactory = {
    init: function (scene) {
        this.createPlatform = () => {
            let platformType = Math.random()
            let direction = GameInfo.direction === 'left' ? -1 : 1
            let velocity = GameInfo.level * 10 * direction
            let sceneWidth = scene.cameras.main.width
            let leftSide = scene.cameras.main.x
            let rightSide = leftSide + sceneWidth
            let cameraY = scene.cameras.main.y
            let x = direction === 1 ? leftSide : rightSide
            let y = 40
            let characterNumber = 0
            let gapSize = 10
            let platformSprite = 'platform'

            if (Math.random() > 0.5) {
                gapSize = 0
                platformSprite = 'platform'//_small'
            }

            let platform = scene.physics.add.sprite(x - gapSize, y, platformSprite)
                .setVelocityX(velocity)
                .setScale(1, 1)
            platform.body.setAllowGravity(false)
            platform.setFrictionY(1)
            platform.x += (platform.width + gapSize) + 1
            if (direction === 1) {
                platform.x -= (platform.width * 2 + gapSize)

            }
            scene.platforms.add(platform)

        }

    }
}

export default PlatformFactory