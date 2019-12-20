export default (scene, sprite) => {
    let sceneWidth = scene.cameras.main.width
    sprite.width = sprite.width * sprite._scaleX
    let spriteWidth = sprite.width
    sprite.setX((sceneWidth / 2) - (spriteWidth / 2))
}



