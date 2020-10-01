const UserSchema = require('./user')
const RoleSchema = require('./role')
const PermissionSchema = require('./permission')
const RolePermissionSchema = require('./role_permission')

const DBSchemas = {
    UserSchema,
    RoleSchema,
    PermissionSchema,
    RolePermissionSchema
}

module.exports = DBSchemas
