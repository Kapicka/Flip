const Messenger = require('./messenger')

const root = 'http://localhost:3000/'
// const url = root + "highscores/multi/"
const url = root + "test/"
const params = {
    headers: { "content-type": "application/json" },
    method: "get"
}
fetch(url, params)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.error(err))
