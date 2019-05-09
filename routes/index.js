var express = require('express'), router = express.Router()

router.use('/assignment', require('./assignmentRoutes.js'))
router.use('/course', require('./courseRoutes.js'))
router.use('/grade', require('./gradeRoutes.js'))
router.use('/user', require('./userRoutes.js'))

module.exports = router