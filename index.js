// import .env file
require('dotenv').config()

// initialize app and router
var express = require('express')
var app = express()
var router = express.Router()

// import dependencies
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const cors = require('cors')

// import mongoose models
let User = require('./models/user')

// import auth middleware 
let authCheck = require('./auth')

// connect to mongoDB database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true })
.catch((err) => { 
  console.log("Error connecting to database:")
  console.log(err) 
});

let port = 3993

// enable cors
app.use(cors({ credentials: true, origin: true }))

// start server on port 3993
app.listen(port)
console.log("Server listening on port " + port)

// serve static files from the client directory 
app.use(express.static('client/build'))

// get data from body parameters
// parse application/json
app.use(bodyParser.json({limit: '50mb'}));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// use cookieParser 
app.use(cookieParser())

//
router.get('/', (req, res) => {
  res.send("Hello world!")
})

// get your own profile data
router.get('/me', authCheck, async (req, res) => {
  try {
    let user = await User.findById(req.userId)
    res.send(user)
  } catch (e) { res.send(e) }
})

// login route
router.post('/login', async function(req, res) {

  let cookie_domain = 'localhost'

  let user = await User.findOne({ email: req.body.email })
  if (!user) res.send("User not found")
  else {
    bcrypt.compare(req.body.password, user.password).then(function(validPassword) {
      if (!validPassword) res.status(400).send({ auth: false, error: 'Incorrect password.', token: null })
      else {
        var token = jwt.sign({ 
          id: user._id
        }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
        res
          .cookie('csrf_token', token, { maxAge: 86400000, httpOnly: true, domain: cookie_domain })
          .status(200)
          .send({ auth: true, token: token })
      }
    }).catch((err) => {
      console.log("Error comparing passwords:")
      console.log(err)
      res.send({ auth: false, error: 'Something went wrong on the server.', token: null })
    });
  }

});

router.post('/user', async function(req, res) {
  // make sure a user with that email doesn't already exist
  let user = await User.findOne({ 'email' : req.body.email })
  if (user) res.send("User already exists")

  else {
    // hash password
    var hashedPassword = bcrypt.hashSync(req.body.password, 8)

    let newUser = await User.create({
      password: hashedPassword,
      email: req.body.email,
      name: req.body.name, 
      student: req.body.student
    })

    // create auth token
    var token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: 86400 });

    res
      .cookie('csrf_token', token, { maxAge: 86400000, httpOnly: true })
      .status(200)
      .send({ auth: true, token: token });
  }
}); 

router.get('/teach', function (req, res) {
  res.send('GET request to the homepage')
})

// serve all routes with the /api prefix
app.use('/api', router)

module.exports = app