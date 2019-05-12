// router/assignmentRoutes.js

var express = require('express')
var router = express.Router()

var Assignment = require('../models/assignment')

let { authCheck, teacherCheck } = require('../auth')

// get an assignment's grades 
router.get('/:id/grades', [authCheck, teacherCheck], async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id })
    if (!assignment) throw new Error("Assignment not found")
    else if (assignment.teacher_id != req.userId) throw new Error("This isn't your assignment")
    let grades = await Grade.find({ assignment_id: assignment._id })
    res.send(grades)
  } catch (e) { next(e) }
})

// get an assignment
router.get('/:id', [/*authCheck, teacherCheck*/], async (req, res, next) => {
  try {
    const assignment = await Assignment.findOne({ _id: req.params.id })
    if (!assignment) throw new Error("Assignment not found")
    else if (assignment.teacher_id != req.userId) throw new Error("This isn't your assignment")
    res.send(assignment)
  } catch (e) { next(e) }
})

module.exports = router