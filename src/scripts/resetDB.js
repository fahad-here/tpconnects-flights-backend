const { DBConnect, DBSchemas } = require('../db')
const {
    UserSchema,
    RolePermissionSchema,
    RoleSchema,
    PermissionSchema
} = DBSchemas
async function resetDbScript() {
    await DBConnect()

    await UserSchema.remove({}, function (err) {
        if (err) console.error(err)
        else console.log('UserSchema collection removed')
    })
    await RolePermissionSchema.remove({}, function (err) {
        if (err) console.error(err)
        else console.log('RolePermissionSchema collection removed')
    })
    await RoleSchema.remove({}, function (err) {
        if (err) console.error(err)
        else console.log('RoleSchema collection removed')
    })
    await PermissionSchema.remove({}, function (err) {
        if (err) console.error(err)
        else console.log('PermissionSchema collection removed')
    })
    process.exit()
}
resetDbScript()
