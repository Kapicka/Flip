import GameInfo from './gameInfo'
import EnemyFactory from './enemyFactory'
import Display from './display';
import getScenePositions from "./positions";
import { EventEmitter } from 'events';


export default class EnemyGenerator extends EventEmitter {
    constructor(scene) {
        super()
        let scx = Display.scaleX
        let velocity = -250 * scx

        this.generateEnemy = function () {
            if (scene.enemies.getChildren().length < 2) {
                let comboIndex = Math.floor(Math.random() * combos.length)
                let combo = combos[comboIndex]
                scene.enemyFactory.createFromListPhysics(combo, velocity)
                velocity -= 5
                this.emit('enemies', comboIndex)
            }

        }
    }

}
let combos = [
    //combo1
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
    //combo2
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
    //combo3
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
    //combo4
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
    //combo9
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