require('dotenv').config()

const {
    MONGO_DEV_CONNECTION_STRING,
    MONGO_TEST_CONNECTION_STRING,
    MONGO_PRODUCTION_CONNECTION_STRING,
    NODE_ENV,
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_ALGORITHM
} = process.env

const whitelist = ['http://localhost:3000', 'http://127.0.0.1:3000']

const CORS_CONFIG = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
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
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_ALGORITHM,
    CORS_CONFIG
}
