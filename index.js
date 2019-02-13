var express = require('express')
var app = express()
var router = express.Router()

let port = 3993

// start server on port 3993
app.listen(port)
console.log("Server listening on port " + port)

// serve static files from the client directory 
app.use(express.static('client/build'))

//
router.get('/', (req, res) => {
  res.send("Hello world!")
})

// serve all routes with the /api prefix
app.use('/api', router)