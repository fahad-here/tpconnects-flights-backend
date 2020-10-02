const express = require('express')
const flightController = express.Router()
const { AuthMiddleware, FlightMiddleware } = require('../../middleware')
const { Validation, InjectRouteType } = require('../../utils')
const { ValidateBody, Schemas } = Validation

flightController.post(
    '/',
    AuthMiddleware.requireJWT,
    InjectRouteType('addNewFlight'),
    AuthMiddleware.checkPermission,
    ValidateBody(Schemas.Flight),
    FlightMiddleware.addNewFlight
)

flightController.put(
    '/:id',
    AuthMiddleware.requireJWT,
    InjectRouteType('editFlight'),
    AuthMiddleware.checkPermission,
    ValidateBody(Schemas.Flight),
    FlightMiddleware.editFlight
)

flightController.delete(
    '/:id',
    AuthMiddleware.requireJWT,
    InjectRouteType('deleteFlight'),
    AuthMiddleware.checkPermission,
    FlightMiddleware.deleteFlight
)

module.exports = flightController
