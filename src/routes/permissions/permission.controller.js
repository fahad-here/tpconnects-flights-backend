const express = require('express')
const usersController = express.Router()
const { AuthMiddleware, PermissionMiddleware } = require('../../middleware')
const { Validation, InjectRouteType } = require('../../utils')
const { ValidateBody, Schemas } = Validation

usersController.post(
    '/',
    AuthMiddleware.requireJWT,
    InjectRouteType('addNewPermission'),
    AuthMiddleware.checkPermission,
    PermissionMiddleware.createNewPermission
)
