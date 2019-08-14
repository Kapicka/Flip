function rgb2hex(rbg) {
    return rgb
        .substr(4, scene.foregroundColor.length - 5)
        .split(',')
        .map(c => {
            return parseInt(c)
        })
        .reduce((s, c) => {
            let nc = c.toString(16)
            if (nc === '0') {
                nc = '00'
            }
            return s + nc
        }, '0x')
}

function centerSpriteX(scene, sprite) {
    let sceneWidth = scene.cameras.main.width
    sprite.width = sprite.width * sprite._scaleX
    let spriteWidth = sprite.width
    sprite.setX((sceneWidth / 2) - (spriteWidth / 2))
}

export default centerSpriteX