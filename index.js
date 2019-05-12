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
let Class = require('./models/course')
let Grade = require('./models/grade')
const Assignment = require('./models/assignment')

// import auth middleware 
let { authCheck, teacherCheck } = require('./auth')

// connect to mongoDB database
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }).catch((err) => {
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
app.use(bodyParser.json({ limit: '50mb' }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// use cookieParser 
app.use(cookieParser())

let routes = require('./routes')
app.use('/api', routes)

/* ===== POST ROUTES ===== */

// create an assignment
router.post('/assignment', [authCheck, teacherCheck], async (req, res, next) => {
  let newAssignment = await Assignment.create(req.body)
  newAssignment.teacher_id = req.userId
  await newAssignment.save()
  res.send(newAssignment)

})

// create a grade
router.post('/assignment/:assignment_id/grade', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    let assignment = await Assignment.findById(req.params.assignment_id)
    if (!assignment) throw new Error("No such assignment")
    else if (assignment.teacher_id != req.userId) throw new Error("You don't own this assignment")
    let newGrade = await Grade.create(req.body)
    newGrade.assignment_id = req.params.assignment_id
    await newGrade.save()
    res.send(newGrade)
  } catch (e) { next(e) }
})

// login route
router.post('/login', async function (req, res) {

  let cookie_domain = 'localhost'

  let user = await User.findOne({ email: req.body.email })
  if (!user) res.send("User not found")
  else {
    bcrypt.compare(req.body.password, user.password).then(function (validPassword) {
      if (!validPassword) res.status(400).send({ auth: false, error: 'Incorrect password.', token: null })
      else {
        var token = jwt.sign({
          id: user._id
        }, process.env.TOKEN_SECRET, { expiresIn: 86400 })
        res
          .cookie('csrf_token', token, { maxAge: 86400000, httpOnly: true, domain: cookie_domain })
          .status(200)
          .send({ auth: true, token: token, student: user.student })
      }
    }).catch((err) => {
      console.log("Error comparing passwords:")
      console.log(err)
      res.send({ auth: false, error: 'Something went wrong on the server.', token: null })
    });
  }
});

/* ===== DELETE ROUTES ===== */

router.delete('/class/:custom_id', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    let c = await Class.findOne({ teacher_id: req.userId, custom_id: req.params.custom_id })
    if (!c) { throw new Error("Class not found") }
    else {
      await c.remove()
      res.send("Successfully deleted")
    }
  } catch (e) { console.log(e); next(e) }
})

router.delete('/roster/:class_id/:id', async (req, res, next) => {
  try {
    let newRoster = await Class.findOne({ custom_id: req.params.class_id })
    if (!newRoster) throw new Error("No such Class")
    let user = await User.findOne({ custom_id: req.params.id })
    if (!user) user = await User.findOne({ name: req.params.id })
    if (!user) throw new Error("No such Student")
    if (!newRoster.roster) newRoster.roster = []
    await Class.updateOne({ custom_id: req.params.class_id }, { $pull: { roster: user.custom_id } })
    let out = []
    for (const id of newRoster.roster) {
      if (!id) continue
      const u = await User.findOne({ custom_id: id })
      if (!u) continue
      if (id != user.custom_id) out.push({ name: u.name, custom_id: u.custom_id })
    }
    res.send(out)
  } catch (e) { next(e) }
})

// error handler
router.use(function (err, req, res, next) {
  console.log(err)
  res.status(err.status || 500)
  res.send(err)
})

// // serve all routes with the /api prefix
app.use('/api', router)

exports = module.exports = app
