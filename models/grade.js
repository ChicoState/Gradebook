let mongoose = require('mongoose')

let GradeSchema = mongoose.Schema({
  student_id: String,
  assignment_id: String,
  class_id: String, 
  score: Number, 
  total: Number
})

module.exports = mongoose.model('Grade', GradeSchema);