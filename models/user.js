let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String, 
  custom_id: String, //for storing school issued student IDs 
  student: { type: Boolean, default: true }
})

module.exports = mongoose.model('User', UserSchema);