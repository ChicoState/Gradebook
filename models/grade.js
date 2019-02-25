let mongoose = require('mongoose')

let GradeSchema = mongoose.Schema({
  class: String,
  student: String,
  grade: String, 
})

module.exports = mongoose.model('Grade', GradeSchema);