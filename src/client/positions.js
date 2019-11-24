import Display from "./display";

function getGameScenePositions(scene) {
    let w = Display.gamingArea.width
    let h = Display.gamingArea.height
    let cx = w / 2
    let cy = h / 2
    let x = scene.cameras.main.x + ((Display.width - w) / 2)
    let y = scene.cameras.main.y + ((Display.height - h) / 2)
    let scx = Display.gamingArea.scaleX
    let scy = Display.scaleY

    //DUDE POSITION
    return {
        homeButtonX: 30 * scx,
        homeButtonY: 30 * scy,
        homeButtonScale: 3 * scx,
        ///
        dudeX: x + 40 * scx,
        dudeY: 80 * scy,
        dudeScale: 4 * scx,
        //PLATFORM  POSITION,
        platformX: Display.x,
        platformWidth: Display.width * 5,
        platformHeight: 10 * scy,
        platformY: (h * (1 - (1 / 4))) - 10 * scy,
        //DISPLAYED LIVES POSSITONS,
        liveMarginLeft: -10 * scx,
        liveX: 30 * scx,
        liveY: 15 * scy,
        liveScale: 3 * scx,
        //SCORE POSITON,
        displayedScoreX: x + w - (3 * scx * 15),
        displayedScoreY: 30 * scy,
        displayedScoreSize: 3 * scx
    }
}

function getFirstScenePositions(scene) {
    let w = Display.gamingArea.width
    let h = Display.gamingArea.height
    let cx = w / 2
    let cy = h / 2
    let x = scene.cameras.main.x + ((Display.width - w) / 2)
    let y = scene.cameras.main.y + ((Display.height - h) / 2)
    let scx = Display.gamingArea.scaleX
    let scy = Display.scaleY

    return {

        mainTextScale: 10 * scx,
        menu: 4 * scx,

        //DUDE POSITION
        dudeY: 77 * scy,
        dudeX: x + cx + 10 * scx,

        flX: x + 210 * scx,
        flY: 75 * scy,

        iX: x + 338 * scx,
        iY: 125 * scy,

        pX: x + 390 * scx,
        pY: 80 * scy,

        menuX: 1 * scx,
        menuY: 190 * scy


    }
}

function getHighScoreScenePositions(scene) {
    let w = scene.cameras.main.width
    let h = scene.cameras.main.height
    let x = scene.cameras.main.x + ((Display.width - w) / 2)
    let y = scene.cameras.main.y + ((Display.height - h) / 2)
    let scx = Display.scaleX
    let scy = Display.scaleY
    let normalText = 3 * scx

    return {
        highScoreX: 70 * scx,
        highScoreY: 80 * scy,
        highScoreScale: 3 * scx,
        highScoreWidth: w * 0.9,
        normalTextScale: 3 * scx,

        buttonsY: 320 * scx,

        nextX: 530 * scx,
        nextY: 320 * scy,

        prevX: 420 * scx,
        prevY: 320 * scy,

        multiX: 165 * scx,
        multiY: 320 * scy,

        singleX: 40 * scx,
        singleY: 320 * scy,

        homeButtonX: 30 * scx,
        homeButtonY: 30 * scy,

        homeButtonScale: 3 * scx,


        highScoreTextX: x + 200 * scx,
        highScoreTextY: 40 * scy,
        highScoreTextScale: 5 * scx,


        mainTextY: 483,
        mainTextX: 206

    }

}

function getTutorialScenePositions(scene) {
    let w = Display.gamingArea.width
    let h = Display.gamingArea.height
    let cx = w / 2
    let cy = h / 2
    let x = scene.cameras.main.x + ((Display.width - w) / 2)
    let y = scene.cameras.main.y + ((Display.height - h) / 2)
    let scx = Display.gamingArea.scaleX
    let scy = Display.scaleY
    return {
        homeButtonX: 30 * scx,
        homeButtonY: 30 * scy,
        ///
        dudeX: x + 40 * scx,
        dudeY: 40 * scy,
        dudeScale: 4 * scx,
        //PLATFORM  POSITION,
        platformX: Display.x,
        platformWidth: Display.width * 5,
        platformHeight: 10 * scy,
        platformY: (h * (1 - (1 / 4))) - 10 * scy,

        awsomeTextX: 30,
        awsomeTextY: 60 * scy,
        awsomeTextScale: 5 * scx,

        mainTextY: 60 * scy,
        mainTextX: x + cx,
        mainTextScale: 3 * scx,

        turnTextX: x + cx + 20 * scx,
        turnTextY: cy + 30 * scy



    }

}
function getDisconnectScenePosition(scene) {
    let w = Display.gamingArea.width
    let h = Display.gamingArea.height
    let cx = w / 2
    let cy = h / 2
    let x = scene.cameras.main.x + ((Display.width - w) / 2)
    let y = scene.cameras.main.y + ((Display.height - h) / 2)
    let scx = Display.gamingArea.scaleX
    let scy = Display.scaleY
    return {
        homeButtonX: 30 * scx,
        homeButtonY: 30 * scy,
        ///
        mainTextX: x + 163,
        mainTextY: 60 * scy,

        mainTextScale: 6 * scx,

        secondaryTextX: x + 262,
        secondaryTextY: 180 * scy,
        secondaryTextScale: 4 * scx,


    }

}




function getGameOverScenePositions(scene) {
    let w = scene.cameras.main.width
    let h = scene.cameras.main.height
    let cx = w / 2
    let cy = h / 2
    let x = scene.cameras.main.x
    let y = scene.cameras.main.y
    let scx = Display.scaleX
    let scy = Display.scaleY

    //DUDE POSITION
    return {
        mainTextX: 205 * scx,
        mainTextY: 70 * scy,

        scoreTextX: 215 * scx,
        scoreTextY: 150 * scy,

        menuTextX: 215 * scx,
        menuTextY: 220 * scy,


        scoreX: 215 * scx,
        scoreY: 185 * scy,

        bestScoreTextX: 215 * scx,
        bestScoreTextY: 240 * scy,

        bestScoreX: 215 * scx,
        bestScoreY: 280 * scy,

        againButtonX: 285 * scx,
        againButtonY: 350 * scy,

        homeButtonX: 360 * scx,
        homeButtonY: 350 * scy,
        //PLATFORM  POSITION,
        platformX: Display.x,
        platformWidth: Display.width,
        platformHeight: 10 * scy,
        platformY: (h * (1 - (1 / 4))) - 10 * scy,
        //DISPLAYED LIVES POSSITONS,
        liveMarginLeft: -10 * scx,
        liveX: 30 * scx,
        liveY: 15 * scy,
        liveScale: 3 * scx,
        //SCORE POSITON,
        displayedScoreX: x + w - (3 * scx * 15),
        displayedScoreY: 30 * scy,
        displayedScoreSize: 3 * scx
    }
}


export {
    getDisconnectScenePosition,
    getTutorialScenePositions,
    getFirstScenePositions,
    getGameScenePositions,
    getGameOverScenePositions,
    getHighScoreScenePositions
}
