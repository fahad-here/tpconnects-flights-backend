const mongoose = require('mongoose')
const Schema = mongoose.Schema
const _ = require('lodash')
const { PERMISSION_STATES } = require('../../../config')

const RolePermissionSchema = new Schema(
    {
        role: {
            type: String,
            required: true
        },
        permission: {
            type: Number,
            required: true
        },
        state: {
            type: String,
            enum: _.values(PERMISSION_STATES)
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const RolePermission = mongoose.model('role_permission', RolePermissionSchema)

module.exports = RolePermission
