const express = require('express')
const router = express.Router()
const users = require('./users/users.controller')
const flights = require('./flights/flights.controller')

router.use('/users', users)
router.use('/flights', flights)

module.exports = router
