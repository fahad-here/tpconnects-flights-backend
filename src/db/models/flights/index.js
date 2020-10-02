const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FlightSchema = new Schema(
    {
        origin: {
            type: String,
            required: true
        },
        destination: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            required: true
        },
        arrival: {
            type: Date,
            required: true
        },
        departure: {
            type: Date,
            required: true
        },
        addedBy: {
            type: Schema.Types.ObjectId
        }
    },
    {
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        }
    }
)

const Flight = mongoose.model('flight', FlightSchema)

module.exports = Flight
