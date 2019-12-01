import Display from './display'
import GameSprite from "./gameSprites/gameSprite";
import EventEmmiter from 'events'
import JumpingEnemy from "./gameSprites/jumpingEnemy";
import FlyingEnemy from "./gameSprites/flyingEnemy";
import Messenger from "./messenger"
import { debuglog } from 'util';
let runningEnemies = ['deamon', 'duck', 'shaolin', 'pig', 'dog']
let jumpingEnemies = ['frog']
let flyingEnemies = ['bird']
let enemyTypes = { running: runningEnemies, jumping: jumpingEnemies, flying: flyingEnemies }
let enemyScale = 5.3 * Display.scaleX
let prevType = 0
let id = 0

export default class EnemyFactory extends EventEmmiter {
    constructor(scene) {
        super()

        this.createRandomEnemy = function (velocity,) {
            let enemyTypeNumber = getRandomType()
            let character = getRandomCharacter(enemyTypes[enemyTypeNumber])
            let x = Display.width * Display.gamingArea.scaleX
            let y = Display.height / 2 * Display.gamingArea.scaleY
            let enemy = undefined


            let enemyScale = 5 * Display.scaleX
            if (enemyTypeNumber === 0) {
                enemy = new GameSprite(scene, x, y, character, 'run', true)
                scene.platformers.add(enemy)
                enemyScale = enemyScale + 1
            }
            if (enemyTypeNumber === 1)
                enemy = new JumpingEnemy(scene, x, y, character, scene.platforms)
            if (enemyTypeNumber === 2)
                enemy = new FlyingEnemy(scene, x, y, character, 500)


            enemy.id = getId()
            scene.enemies.add(enemy)
            scene.gameObjects.add(enemy)
            scene.movableObjects.add(enemy)
            enemy.setScale(enemyScale)
                .setVelocity(velocity)
                .setAnim(enemy.anim)
            this.emit('enemycreated', enemy)
        }


        this.createEnemy = function (id, x, y, character, anim, scale, body) {
            let enemy = new GameSprite(scene, x, y, character, anim, body)
            enemy.id = id
            enemy.setScale(scale)
            return enemy
        }

    }
}
function getRandomCharacter(characters) {
    let characterNumber = Math.floor(Math.random() * characters.length)
    return characters[characterNumber]
}

function getRandomType() {
    let characterTypeNumber = Math.floor(Math.random() * enemyTypes.length)
    while (characterTypeNumber === prevType) {
        characterTypeNumber = Math.floor(Math.random() * enemyTypes.length)
    }
    prevType = characterTypeNumber
    return characterTypeNumber
}

function getId() {
    id++
    return id
}


