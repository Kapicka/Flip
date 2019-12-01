import Display from './display';
import GameSprite from './gameSprites/gameSprite'
import FlyingEnemy from './gameSprites/flyingEnemy'
import JumpingEnemy from './gameSprites/jumpingEnemy'
import getScenePositions from "./positions";
import { EventEmitter } from 'events';

const runningEnemies = ['deamon', 'duck', 'shaolin', 'pig', 'dog']
const jumpingEnemies = ['frog']
const flyingEnemies = ['bird']
const enemyTypes = { running: runningEnemies, jumping: jumpingEnemies, flying: flyingEnemies }
const enemyScale = 5.3 * Display.scaleX



export default class EnemyGenerator extends EventEmitter {
    constructor(scene) {
        super()
        const scx = Display.gamingArea.scaleX
        const scy = Display.gamingArea.scaleY
        const w = Display.width
        let velocity = -250 * scx
        let enemyScale = 5 * scx
        let id = 0

        this.createEnemy = function (enm) {
            let x = enm.x * scx
            let y = enm.y * scy
            let enemy
            let character

            character = getRandomCharacter(jumpingEnemies)
            if (enm.type === 'running') {
                character = getRandomCharacter(runningEnemies)
                enemy = new GameSprite(scene, x, y, character, 'run', true)
                scene.platformers.add(enemy)
            }
            if (enm.type === 'jumping') {
                character = getRandomCharacter(jumpingEnemies)
                enemy = new JumpingEnemy(scene, x, y, character, scene.platforms)
            }
            if (enm.type === 'flying') {
                character = getRandomCharacter(flyingEnemies)
                enemy = new FlyingEnemy(scene, x, y, character, 500)
            }

            enemy.id = id++
            scene.enemies.add(enemy)
            scene.gameObjects.add(enemy)
            scene.movableObjects.add(enemy)
            enemy.setScale(enemyScale)
                .setVelocityX(velocity)
                .setAnim(enemy.anim)
            this.emit('enemycreated', { x: enm.x, y: enm.y, character: character, id: enemy.id })
        }

        this.generateEnemy = function () {
            if (scene.enemies.getChildren().length < 2) {
                let configIndex = Math.floor(Math.random() * configs.length)
                configs[configIndex].forEach(enm => this.createEnemy(enm))
                velocity -= 5
            }
        }
    }

}

function getRandomCharacter(characters) {
    let characterNumber = Math.floor(Math.random() * characters.length)
    return characters[characterNumber]
}
let configs = [
    //config1
    [
        {
            type: 'flying',
            x: 221,
            y: 217
        },
        {
            type: 'flying',
            x: 200,
            y: 167
        },
        {
            type: 'running',
            x: 410,
            y: 232
        },
        {
            type: 'running',
            x: 555,
            y: 229
        },

    ],
    //config2
    [
        {
            type: 'flying',
            x: 129,
            y: 220
        },
        {
            type: 'flying',
            x: 251,
            y: 210
        },
        {
            type: 'flying',
            x: 370.5,
            y: 220
        },
        {
            type: 'flying',
            x: 517,
            y: 220
        },
        {
            type: 'flying',
            x: 640,
            y: 220
        },
        {
            type: 'flying',
            x: 991,
            y: 220
        },
        {
            type: 'running',
            x: 1050,
            y: 150
        },

    ],
    //config3
    [
        {
            type: 'running',
            x: 223,
            y: 150
        },
        {
            type: 'running',
            x: 410,
            y: 150
        },


    ],
    //config4
    [
        {
            type: 'running',
            x: 95,
            y: 150
        },
        {
            type: 'running',
            x: 508,
            y: 150
        },


    ],
    //9
    [
        {
            type: 'running',
            x: 84,
            y: 150
        },
        {
            type: 'flying',
            x: 267,
            y: 150
        },
        {
            type: 'flying',
            x: 322,
            y: 121
        },
        {
            type: 'flying',
            x: 322,
            y: 121
        },
        {
            type: 'running',
            x: 533,
            y: 230
        },
        {
            type: 'flying',
            x: 654,
            y: 145
        },
        {
            type: 'flying',
            x: 984,
            y: 133
        },
        {
            type: 'running',
            x: 1140,
            y: 237
        },

    ],

]

configs = configs.map(c => c.map(o => {
    o.x = o.x + 640
    return o
}))