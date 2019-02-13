var express = require('express')
var app = express()

let port = 3993

app.listen(port )
console.log("Server listening on port " + port)

app.get('/', (req, res) => {
  res.send("Hello world!")
})