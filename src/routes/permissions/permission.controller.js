const express = require('express')
const permissionController = express.Router()
const { AuthMiddleware, PermissionMiddleware } = require('../../middleware')
const { InjectRouteType } = require('../../utils')

permissionController.post(
    '/',
    AuthMiddleware.requireJWT,
    InjectRouteType('addNewPermission'),
    AuthMiddleware.checkPermission,
    PermissionMiddleware.createNewPermission
)

module.exports = permissionController
