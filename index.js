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
let Class = require('./models/class')
const Assignment = require('./models/assignment')

// import auth middleware 
let { authCheck, teacherCheck } = require('./auth')

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

/* ===== GET ROUTES ===== */

// get your own profile data
router.get('/me', authCheck, async (req, res) => {
  try {
    let user = await User.findById(req.userId)
    res.send(user)
  } catch (e) { res.send(e) }
})

// get a teacher's classes
router.get('/teacher/classes', teacherCheck, async (req, res, next) => {
  try {
    let classes = await Class.find({ teacher_id: req.userId })
    res.send(classes)
  } catch (e) { next(e) }
})

// get a class's assignments
router.get("/teacher/assignments/:classId", teacherCheck, async (req, res, next) => {
    try {
        const assignments = await Assignment.find({ class_id: req.params.classId });
        res.send(assignments);
    } catch(e) {
        res.send([]);//next(e);
    }
})

/* ===== POST ROUTES ===== */

// create a class
router.post('/class', teacherCheck, async (req, res, next) => {
  try {
    let exists = await Class.findOne({ custom_id: req.body.custom_id })
    if (exists) res.send("Class already exists")
    else {
      req.body.teacher_id = req.userId
      try { 
        let newClass = await Class.create(req.body)
        res.send(newClass)
      }
      catch (e) { next(e) }
    }
  } catch (e) { next(e) }
})

// create an assignment
router.post("/assignment", teacherCheck, async (req, res, next) => {
    try {
        const exists = await Assignment.findOne({ name: req.body.name })
        if (exists) {
            res.send("Assignment already exists");
        } else {
            const newAssignment = await Assignment.create(req.body);
            //newAssignment.class_id = req.classId;
            await newAssignment.save();
            res.send(newAssignment)
        }
    } catch (e) {
        next(e);
    }
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

/* ===== DELETE ROUTES ===== */

router.delete('/class/:custom_id', teacherCheck, async (req, res) => {
  try {
    let c = await Class.findOne({ custom_id: req.params.custom_id })
    if (req.userId != c.teacher_id) res.send("This isn't your class")
    else {
      await c.remove()
      res.send("Successfully deleted")
    } 
  } catch (e) { next(e) }
})

// serve all routes with the /api prefix
app.use('/api', router)

module.exports = app
