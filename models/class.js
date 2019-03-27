let mongoose = require('mongoose')

let ClassSchema = mongoose.Schema({
  teacher_id: String, 
  name: String, 
  custom_id: String, // for storing University class code
  roster: [String]
})

module.exports = mongoose.model('Class', ClassSchema);