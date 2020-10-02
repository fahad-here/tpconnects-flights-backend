const AuthMiddleware = require('./auth')
const PermissionMiddleware = require('./permission')
const FlightMiddleware = require('./flights')

module.exports = {
    AuthMiddleware,
    PermissionMiddleware,
    FlightMiddleware
}
