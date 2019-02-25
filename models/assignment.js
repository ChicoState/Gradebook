let mongoose = require('mongoose')

let AssignmentSchema = mongoose.Schema({
  class_id: String,
  name: String, 
  pointsPossible: Number, 
  type: String
})

module.exports = mongoose.model('Assignment', AssignmentSchema);