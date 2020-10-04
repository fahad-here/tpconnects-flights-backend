const { DBConnect, DBSchemas } = require('../db')
const {
    UserSchema,
    RolePermissionSchema,
    RoleSchema,
    PermissionSchema
} = DBSchemas
const { USER_ROLES } = require('../constants')
const _ = require('lodash')

const getRank = (ROLE) => {
    switch (ROLE) {
        case USER_ROLES.SUPER_ADMIN:
            return 0
        case USER_ROLES.ADMIN:
            return 1
        case USER_ROLES.MANAGER:
            return 2
        case USER_ROLES.USER:
            return 3
        default:
            return 3
    }
}

const getDescription = (ROLE) => {
    switch (ROLE) {
        case USER_ROLES.SUPER_ADMIN:
            return 'Super admin has permissions to everything'
        case USER_ROLES.ADMIN:
            return 'Admin has permissions to just admin panel'
        case USER_ROLES.MANAGER:
            return 'Manager has permissions to just the front end panel'
        case USER_ROLES.USER:
            return 'User has very limited permissions'
        default:
            return 3
    }
}

const findRoleIndex = (roles, findRole) => {
    return _.findIndex(roles, (role) => {
        return role.name === findRole
    })
}

async function startUpScript() {
    await DBConnect()
    let roles = []
    for (let key of Object.keys(USER_ROLES)) {
        const role = {
            name: USER_ROLES[key],
            rank: getRank(USER_ROLES[key]),
            description: getDescription(USER_ROLES[key])
        }
        let addedRole = await new RoleSchema(role).save()
        roles.push(addedRole)
    }
    const SUIndex = findRoleIndex(roles, USER_ROLES.SUPER_ADMIN)
    let newUser = {
        email: 'test@admin.com',
        name: 'Test User'
    }
    UserSchema.register(newUser, 'test1234', async (error, user) => {
        if (error) throw error
        await UserSchema.findByIdAndUpdate(
            { _id: user._id },
            {
                $set: {
                    role: roles[SUIndex]._id,
                    roleName: roles[SUIndex].name,
                    roleRank: roles[SUIndex].rank
                }
            }
        )
    })
    let permissions = [
        {
            name: 'addNewPermission',
            description: 'Allows user to add new permissions',
            scope: [USER_ROLES.SUPER_ADMIN]
        },
        {
            name: 'addNewFlight',
            description: 'Allows user to add a new flight',
            scope: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER]
        },
        {
            name: 'deleteFlight',
            description: 'Allows user to delete a flight',
            scope: [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
        },
        {
            name: 'viewFlights',
            description: 'Allows user to view all flights',
            scope: [
                USER_ROLES.SUPER_ADMIN,
                USER_ROLES.ADMIN,
                USER_ROLES.MANAGER,
                USER_ROLES.USER
            ]
        }
    ]

    for (let item of permissions) {
        let permission = await new PermissionSchema(item).save()
        for (let sc of item.scope) {
            let index = findRoleIndex(roles, sc)
            await new RolePermissionSchema({
                role: roles[index]._id,
                permission: permission._id
            }).save()
        }
    }
    console.log('Finished setting up backend')
    process.exit()
}

startUpScript()
