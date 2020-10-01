const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RoleSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        rank: {
            type: Number,
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

const Role = mongoose.model('role', RoleSchema)

module.exports = Role
