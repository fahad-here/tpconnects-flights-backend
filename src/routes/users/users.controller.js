const express = require('express')
const usersController = express.Router()
const { AuthMiddleware } = require('../../middleware')
const { Validation } = require('../../utils')
const { ValidateBody, Schemas } = Validation

usersController.post(
    '/auth/register',
    ValidateBody(Schemas.RegisterUser),
    AuthMiddleware.register,
    AuthMiddleware.assignRole,
    AuthMiddleware.signRefreshTokenForUser,
    AuthMiddleware.signJWTForUser
)

usersController.post('/auth/login')

usersController.post('/auth/refresh')

usersController.put('/')

usersController.get('/')

module.exports = usersController
