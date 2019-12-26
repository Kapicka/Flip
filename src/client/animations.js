import ColorManager from './ColorManager';
const barvy = ColorManager.getColors()
const enemies = ['dude', 'shaolin', 'deamon', 'bird', 'dog', 'duck', 'pig']


function createAnimations(scene) {
    barvy.forEach(b => {
        scene.anims.create({
            key: 'dude' + 'wait' + b,
            repeat: 2,
            frameRate: 9,
            delay: 2000,
            frames: [{
                key: 'sprites',
                frame: 'dude_stand_1' + b
            },
                {
                    key: 'sprites',
                    frame: 'dude_stand_0' + b
                },
            ]
        })
        scene.anims.create({
            key: 'dude' + 'slide' + b,
            repeat: -1,
            frameRate: 12,
            frames: [{
                key: 'sprites',
                frame: 'dude_slide_0' + b
            },
                {
                    key: 'sprites',
                    frame: 'dude_slide_1' + b
                },
            ]
        })
        scene.anims.create({
            key: 'dude' + 'hit' + b,
            repeat: -1,
            frameRate: 12,
            frames: [{
                key: 'sprites',
                frame: 'dude_hit_0' + b
            },
                {
                    key: 'sprites',
                    frame: 'dude_hit_1' + b
                },
            ]
        })
        scene.anims.create({
            key: 'frog' + 'run' + b,
            repeat: 1,
            frameRate: 1,
            frames: [{
                key: 'sprites',
                frame: 'frog_run_0' + b
            }]
        })
        scene.anims.create({
            key: 'frog' + 'jump' + b,
            repeat: 1,
            frameRate: 1,
            frames: [{
                key: 'sprites',
                frame: 'frog_run_1' + b
            }]
        })
        scene.anims.create({
            key: 'dude' + 'jump' + b,
            repeat: -1,
            frameRate: 12,
            frames: [{
                key: 'sprites',
                frame: 'dude_run_1' + b
            },
                {
                    key: 'sprites',
                    frame: 'dude_run_4' + b
                },
            ]
        })
    })


    enemies.forEach(e => {
        barvy.forEach(c => {
            let key = e + 'run' + c
            let prefix = e + '_run_'
            let suffix = c
            scene.anims.create({
                key: key,
                repeat: -1,
                frameRate: 12,
                frames: scene.anims.generateFrameNames('sprites', {
                    prefix: prefix,
                    suffix: suffix,
                    start: 0,
                    end: 1,
                    zeropad: 1
                })
            })
        })
    })
}

export default createAnimations