const { DBSchemas } = require('../../db')
const { RoleSchema, PermissionSchema, RolePermissionSchema } = DBSchemas
const { ResponseMessage } = require('../../utils')

async function createNewPermission(req, res, next) {
    try {
        const { name, description, scope } = req.body
        const checkPermission = await PermissionSchema.findOne({ name })
        if (checkPermission)
            return res
                .status(403)
                .json(
                    ResponseMessage(
                        new Error(
                            'This permission already exists, try editing'
                        ),
                        'Permission already exists'
                    )
                )
        if (!scope || scope.length === 0)
            return res
                .status(403)
                .json(
                    ResponseMessage(
                        new Error('Scope cannot be empty'),
                        'Scope cannot be empty'
                    )
                )
        const permission = await new PermissionSchema({
            name,
            description,
            scope
        })
        let added = {}
        for (let item of scope) {
            let role = await RoleSchema.findOne({ name: item })
            if (!role) added[item] = false
            else {
                await new RolePermissionSchema({
                    role: role._id,
                    permission: permission._id
                })
                added[item] = true
            }
        }
        return res.status(403).json(
            ResponseMessage(false, 'Check added permissions', {
                permission,
                rolePermissionStatus: added
            })
        )
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    createNewPermission
}
