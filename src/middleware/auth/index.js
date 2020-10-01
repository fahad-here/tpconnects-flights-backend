const passport = require('passport')
const JWT = require('jsonwebtoken')
const { DBSchemas } = require('../../db')
const { UserSchema, RoleSchema, TokenSchema } = DBSchemas
const {
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_ALGORITHM
} = require('../../config')

const { EXPIRATION_PERIOD } = require('../../constants')

const { ResponseMessage } = require('../../utils')

passport.use(UserSchema.createStrategy())

async function assignRole(req, res, next) {
    let user = req.user
    let { role } = req.body

    const findRole = await RoleSchema.findOne({ name: role })
    if (!findRole) {
        user.delete()
        return ResponseMessage(new Error('No role provided'), 'Role not found')
    }
    user = await UserSchema.findByIdAndUpdate(
        { _id: user._id },
        {
            $set: {
                role: findRole._id,
                roleName: findRole.name,
                roleRank: findRole.rank
            }
        },
        { new: true }
    )
    req.user = user
    return next()
}

function register(req, res, next) {
    const user = new UserSchema({
        email: req.body.email,
        name: req.body.name
    })
    // Create the user with the specified password
    UserSchema.register(user, req.body.password, async (error, user) => {
        if (error) {
            // Our register middleware failed
            return next(error)
        }
        // Store user so we can access it in our handler
        req.user = user
        // Success!
        return next()
    })
}

async function signRefreshTokenForUser(req, res, next) {
    try {
        const user = req.user

        const refreshToken = JWT.sign(
            // payload
            {
                email: user.email,
                sub: user._id.toString()
            },
            // secret
            JWT_REFRESH_SECRET,
            {
                algorithm: JWT_REFRESH_ALGORITHM,
                expiresIn: EXPIRATION_PERIOD.LONG
            }
        )
        await new TokenSchema({
            _userId: user._id,
            token: refreshToken,
            expireAt: Date.now() + parseInt(EXPIRATION_PERIOD.LONG),
            type: 'refresh'
        }).save()
        req.refreshToken = refreshToken
        return next()
    } catch (e) {
        return next(e)
    }
}

async function signJWTForUser(req, res) {
    // Get the user (either just signed in or signed up)
    const user = req.user
    const refreshToken = req.refreshToken
    // Create a signed token
    const token = JWT.sign(
        // payload
        {
            email: user.email,
            role: user.role,
            sub: user._id.toString()
        },
        // secret
        JWT_SECRET,
        {
            algorithm: JWT_ALGORITHM,
            expiresIn: EXPIRATION_PERIOD.SHORT
        }
    )
    // Send the token
    res.json(
        ResponseMessage(false, 'Registered successfully', {
            token,
            refreshToken
        })
    )
}

module.exports = {
    initialize: passport.initialize(),
    register,
    signJWTForUser,
    signRefreshTokenForUser,
    assignRole
}
