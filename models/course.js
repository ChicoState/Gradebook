let mongoose = require('mongoose')

let CourseSchema = mongoose.Schema({
  teacher_id: String, 
  name: String, 
  custom_id: String, // for storing University course code
  roster: [String], 
  join_code: String, 
  startDate: Date, 
  endDate: Date
})

module.exports = mongoose.model('Course', CourseSchema);