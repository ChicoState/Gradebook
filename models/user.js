let mongoose = require('mongoose')

let UserSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String, 
  student: { type: Boolean, default: true }
})

module.exports = mongoose.model('User', UserSchema);