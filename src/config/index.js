require('dotenv').config()

const {
    MONGO_DEV_CONNECTION_STRING,
    MONGO_TEST_CONNECTION_STRING,
    MONGO_PRODUCTION_CONNECTION_STRING,
    NODE_ENV
} = process.env

const whitelist = ['http://localhost:3000']

const CORS_CONFIG = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

module.exports = {
    MONGO_DEV_CONNECTION_STRING,
    MONGO_TEST_CONNECTION_STRING,
    MONGO_PRODUCTION_CONNECTION_STRING,
    NODE_ENV,
    CORS_CONFIG
}
