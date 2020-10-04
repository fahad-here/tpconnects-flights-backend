const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')
const { PERMISSION_STATES } = require('../../../constants')

const RolePermissionSchema = new Schema(
    {
        role: {
            type: Schema.Types.ObjectId,
            required: true
        },
        permission: {
            type: Schema.Types.ObjectId,
            required: true
        },
        state: {
            type: String,
            enum: _.values(PERMISSION_STATES),
            default: PERMISSION_STATES.INCLUDED
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const RolePermission = mongoose.model('rolePermission', RolePermissionSchema)

module.exports = RolePermission
