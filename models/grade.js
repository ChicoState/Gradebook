let mongoose = require('mongoose')

let GradeSchema = mongoose.Schema({
  student_id: String,
  assignment_id: String,
  score: Number
})

module.exports = mongoose.model('Grade', GradeSchema);