const RouteErrorHandler = require('./errorHandler')
const ResponseMessage = require('./getResponseMessage')
const Logger = require('./logger')
const Validation = require('./validation')
const InjectRouteType = (routePermission) => {
    return (req, res, next) => {
        req.routePermission = routePermission
        next()
    }
}

module.exports = {
    RouteErrorHandler,
    ResponseMessage,
    Logger,
    Validation,
    InjectRouteType
}
