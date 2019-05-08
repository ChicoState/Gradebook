// router/courseRoutes.js

var express = require('express')
var router = express.Router()

var Course = require('../models/course')
var User = require('../models/user')
var Assignment = require('../models/assignment')

const ShortUniqueId = require('short-unique-id')
var uid = new ShortUniqueId()

let { authCheck, teacherCheck } = require('../auth')

/* ===== GET ROUTES ===== */

// get a user's courses
router.get('/list', authCheck, async (req, res, next) => {
  let user = await User.findById(req.userId)
  var courses = []

  // if user is a student, get all courses where they're on the roster
  if (!!user.student) 
    courses = await Course.find({ roster: req.userId })
  else // if they're a teacher, get all courses they own
    courses = await Course.find({ teacher_id: req.userId })

  res.send(courses)
})

// get a course
router.get('/:custom_id', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    let c = await Course.findOne({ teacher_id: req.userId, custom_id: req.params.custom_id })
    if (!c) throw new Error("Class not found")
    else res.send(c)
  } catch (e) { next(e) }
})

// get a course's assignments
router.get('/:id/assignments', authCheck, async (req, res, next) => {
  const assignments = await Assignment.find({ class_id: req.params.id })
  res.send(assignments)
})

// get a course roster
router.get('/:id/roster', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    const course = await Course.findOne({ custom_id: req.params.id })
    if (!course) throw new Error("Course not found")
    var out = []
    for (const id of course.roster) {
      const user = await User.findById(id)
      out.push({ name: user.name, custom_id: user.custom_id, _id: user._id })
    }
    res.send(out)
  } catch (e) { next(e) }
})

/* ===== POST ROUTES ===== */

// create a course
router.post('/', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    let exists = await Course.findOne({ custom_id: req.body.custom_id, teacher_id: req.userId })
    if (exists) { res.send("Course already exists") }
    else {
      req.body.teacher_id = req.userId
      req.body.join_code = uid.randomUUID(8) 
      try { 
        let newCourse = await Course.create(req.body)
        return res.send(newCourse)
      } catch (e) { next(e) }
    }
  } catch (e) {  next(e) }
})

// create an assignment
router.post('/:id/assignment', [authCheck, teacherCheck], async (req, res, next) => {
    let newAssignment = await Assignment.create(req.body)
    newAssignment.teacher_id = req.userId
    newAssignment.course_id = req.params.id
    await newAssignment.save()
    res.send(newAssignment)
})

// join a course 
router.post('/join/:join_code', authCheck, async (req, res) => {
  let toJoin = await Course.findOne({ join_code: req.params.join_code })
  if (!toJoin) res.send("No such course");
  if (!toJoin.roster.includes(req.userId))
    toJoin.roster.push(req.userId)
  await toJoin.save()
  res.send("Successfully joined course")
})

module.exports = router
