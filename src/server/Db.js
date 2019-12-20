const mongo = require('mongodb').MongoClient
const objectId = require('mongodb').ObjectID
const dbName = "scores"
// const uri = 'mongodb+srv://hano00:2jou22orU@cluster0-kyvi2.mongodb.net/test?retryWrites=true&w=majority'
//mongodb+srv://hano00:2jou22orU@cluster0-kyvi2.mongodb.net/test?retryWrites=true&w=majority
const uri = 'mongodb://localhost:27017/scores/' 
const mongoConfig = { useUnifiedTopology: true, useNewUrlParser: true }
const collectionNameMulti = 'multi'
const collectionNameSingle = 'single'
const highScoreFilter = {}

function getId() {
    return objectId()
}

const multi = {
    getGames: getGamesMulti,
    getBestThreeGames: getBestThreeGamesMulti,
    insertGame: insertGameMulti,
    addPlayer: addPlayerMulti,
    gameExist: gameExist

}
const single = {

    getBestThreeGames: getBestThreeGamesSingle,
    insertGame: insertGameSingle,
    getGames: getGamesSingle,
    getId: getId
}

function gameExist(id) {
    const collection = 'multi'
    const query = { "_id": objectId(id) }
    return new Promise((res, rej) =>
        mongo.connect(uri, mongoConfig)
            .then(conn =>
                conn.db(dbName)
                    .collection(collection)
                    .find(query).limit(1)
                    .toArray()
            )
            .then(arr => res(arr.length))
            .then(() => conn.close())
            .catch(err => rej(err))
    )
}

//UPDATING GAMES
function addPlayerMulti(id, player) {
    const update = { $push: { players: player } }
    return updateGame(objectId(id), collectionNameMulti, update)
}

function updateGame(id, collection, update) {
    return new Promise((res, rej) => {
        const query = { "_id": objectId(id) }
        mongo.connect(uri, mongoConfig)
            .then(conn => conn
                .db(dbName)
                .collection(collection)
                .updateOne(query, update)
                .then(info => res(info))
                .then(() => conn.close())
            ).catch(err => rej(err))
    })
}


//GETTING GAMES
function getBestThreeGamesSingle() {
    return getBestThreeGames(collectionNameSingle)

}
function getBestThreeGamesMulti() {
    return getBestThreeGames(collectionNameMulti)
}


function getBestThreeGames(collection) {
    return new Promise((res, rej) =>
        mongo.connect(uri, mongoConfig)
            .then(conn =>
                conn.db(dbName)
                    .collection(collection)
                    .find({})
                    .sort({ score: -1 })
                    .limit(3).toArray()
            )
            .then(games => res(games))
            .then(() => conn.close())
            .catch(err => rej(err))
    )
}

function getGamesMulti() {
    return getGames(collectionNameMulti, highScoreFilter)
}
function getGamesSingle() {
    return getGames(collectionNameSingle, highScoreFilter)
}

function getGames(collection, filter) {
    return new Promise((res, rej) => {
        mongo.connect(uri, mongoConfig).then(conn => conn
            .db(dbName).collection(collection)
            .find(filter).toArray()
            .then(games => res(games))
            .then(() => conn.close())
        ).catch(err => rej(err))
    })
}


//INSERTING GAMES
function insertGameMulti(game) {
    game["_id"] = objectId(game["_id"])
    return insertGame(game, collectionNameMulti)
}
function insertGameSingle(game) {
    return insertGame(game, collectionNameSingle)
}


function insertGame(game, collection) {
    return new Promise((res, rej) => {
        mongo.connect(uri, mongoConfig)
            .then(conn =>
                conn.db(dbName)
                    .collection(collection)
                    .insertOne(game)
                    .then(info => res(info.insertedId))
                    .then(() => conn.close())
            ).catch(err => rej(err))
    })
}

//getGamesMulti().then(games => console.log(games)).catch(err => console.error(err))
module.exports = { single, multi, getId }

