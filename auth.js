var jwt = require('jsonwebtoken')

// import User model
let User = require('./models/user')

let secret = process.env.TOKEN_SECRET

function authCheck(req, res, next) {
  
  var header_token = req.headers['x-access-token']
  var cookie_token = req.cookies['csrf_token']

  if (!header_token || !cookie_token)
    return res.status(403).send({ auth: false, message: 'No token provided.' })
  else if (header_token != cookie_token)
    return res.status(403).send({ auth: false, message: 'Tokens do not match.' })
  jwt.verify(cookie_token, secret, function(err, decoded) {
    if (err) {
      console.log(err)
      return res.status(403).send({ auth: false, message: 'Failed to authenticate token.' })
    }
    req.userId = decoded.id
    next()
  })

}

async function teacherCheck(req, res, next) {
  try {
    authCheck(req, res, next)
    let user = await User.findById(req.userId)
    if (user.student) return res.status(403).send({ auth: false, message: 'You are not a teacher.' })
    next()
  } catch(e) { next(e) }
}

module.exports = { authCheck, teacherCheck }