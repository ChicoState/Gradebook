// router/gradeRoutes.js

var express = require('express')
var router = express.Router()

var Grade = require('../models/grade')
var Assignment = require('../models/assignment')
var Course = require('../models/course')

let { authCheck, teacherCheck } = require('../auth')

// get your grade for a course
router.get('/course/:id', authCheck, async (req, res, next) => {
  let course = await Course.findOne({ custom_id: req.params.id, roster: req.userId })
  if (!course) res.send("Wrong course ID!")

  let myGrades = await Grade.find({ student_id: req.userId, class_id: req.params.id })
  var total = 0, score = 0
  for (const grade of myGrades) {
    total += grade.total
    score += grade.score
  }
  let grade = total > 0 ? score / total : 0
  res.send({ grade: grade })
})

// get all grades for an assignment
router.get('/assignment/:id', [authCheck, teacherCheck, async (req, res, next) => {
  let assignment = await Assignment.findById(req.params.id)

  if (assignment.teacher_id != req.userId) res.status(403).send("Unauthorized")

  let grades = await Grade.find({ assignment_id: req.params.id })
  res.send(grades)
}])

// create a grade
router.post('/:course_id', [authCheck, teacherCheck], async (req, res, next) => {
  let course = await Course.findOne({ custom_id: req.params.course_id })

  if (!course) res.send("Course doesn't exist!")
  if (course.teacher_id != req.userId) res.status(403).send("Unauthorized")

  try {
    req.body.class_id = req.params.course_id
    let grade = await Grade.findOneAndUpdate({ assignment_id: req.body.assignment_id, student_id: req.body.student_id }, req.body, { new: true, upsert: true })
    res.send(grade)
  } catch (e) {
    res.status(500).send(e)
  }

})

module.exports = router