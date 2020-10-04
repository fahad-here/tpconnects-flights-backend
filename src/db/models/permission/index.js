const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PermissionSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        scope: {
            type: [String],
            required: true
        },
        description: {
            type: String
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const Permission = mongoose.model('permission', PermissionSchema)

module.exports = Permission
