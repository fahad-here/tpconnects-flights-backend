const UserSchema = require('./user')
const RoleSchema = require('./role')
const PermissionSchema = require('./permission')
const RolePermissionSchema = require('./rolePermission')
const TokenSchema = require('./token')
const FlightSchema = require('./flights')

const DBSchemas = {
    UserSchema,
    RoleSchema,
    PermissionSchema,
    RolePermissionSchema,
    TokenSchema,
    FlightSchema
}

module.exports = DBSchemas
