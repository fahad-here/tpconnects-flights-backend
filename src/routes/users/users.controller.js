const express = require('express')
const usersController = express.Router()

usersController.post('/auth/register')

usersController.post('/auth/login')

usersController.post('/auth/refresh')

usersController.put('/')

usersController.get('/')

module.exports = usersController
