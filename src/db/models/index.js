const UserSchema = require('./user')
const RoleSchema = require('./role')
const PermissionSchema = require('./permission')
const RolePermissionSchema = require('./role_permission')
const TokenSchema = require('./token')

const DBSchemas = {
    UserSchema,
    RoleSchema,
    PermissionSchema,
    RolePermissionSchema,
    TokenSchema
}

module.exports = DBSchemas
