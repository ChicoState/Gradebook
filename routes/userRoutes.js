// routes/userRoutes.js

var express = require('express')
var router = express.Router()

var User = require('../models/user')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

let { authCheck, teacherCheck } = require('../auth')

// get your own profile data
router.get('/me', authCheck, async (req, res) => {
  try {
    let user = await User.findById(req.userId)
    res.send(user)
  } catch (e) { res.send(e) }
})

// create a user
router.post('/', async function(req, res) {
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
          student: req.body.student,
          custom_id: req.body.custom_id
      })

      // create auth token
      var token = jwt.sign({ id: newUser._id }, process.env.TOKEN_SECRET, { expiresIn: 86400 });

      res
        .cookie('csrf_token', token, { maxAge: 86400000, httpOnly: true })
        .status(200)
        .send({ auth: true, token: token });
    }
}); 

module.exports = router