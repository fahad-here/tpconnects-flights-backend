const passport = require('passport')
const JWT = require('jsonwebtoken')
const { ExtractJwt } = require('passport-jwt')
const PassportJwt = require('passport-jwt')
const moment = require('moment')
const { DBSchemas } = require('../../db')
const {
    UserSchema,
    RoleSchema,
    TokenSchema,
    PermissionSchema,
    RolePermissionSchema
} = DBSchemas
const {
    JWT_SECRET,
    JWT_ALGORITHM,
    JWT_REFRESH_SECRET,
    JWT_REFRESH_ALGORITHM
} = require('../../config')

const { EXPIRATION_PERIOD } = require('../../constants')

const { ResponseMessage } = require('../../utils')

passport.use(UserSchema.createStrategy())

passport.use(
    'jwt',
    new PassportJwt.Strategy(
        // Options
        {
            // Where will the JWT be passed in the HTTP request?
            // e.g. Authorization: xxxxxxxxxx
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            // What is the secret
            secretOrKey: JWT_SECRET,
            // What algorithm(s) were used to sign it?
            algorithms: [JWT_ALGORITHM]
        },
        // When we have a verified token
        (payload, done) => {
            // Find the real user from our database using the `id` in the JWT
            UserSchema.findById(payload.sub)
                .then((user) => {
                    // If user was found with this id
                    if (user) {
                        done(null, user)
                    } else {
                        // If not user was found
                        done(null, false)
                    }
                })
                .catch((error) => {
                    // If there was failure
                    done(error, false)
                })
        }
    )
)

passport.use(
    'refresh-token',
    new PassportJwt.Strategy(
        {
            // Where will the JWT be passed in the HTTP request?
            // e.g. Authorization: xxxxxxxxxx
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            // What is the secret
            secretOrKey: JWT_REFRESH_SECRET,
            // What algorithm(s) were used to sign it?
            algorithms: [JWT_REFRESH_ALGORITHM],
            passReqToCallback: true
        },
        (req, payload, done) => {
            console.log('refresh access')
            const refToken = req.header('authorization')
            TokenSchema.findOne({
                _userId: payload.sub,
                token: refToken,
                type: 'refresh'
            })
                .then(async (refreshToken) => {
                    const user = await UserSchema.findById({ _id: payload.sub })
                    if (moment().isAfter(refreshToken.expireAt) || !user) {
                        done(
                            new Error('Invalid/Expired refresh token'),
                            false,
                            'Invalid/Expired refresh token'
                        )
                    }
                    done(null, { user, refreshToken: refreshToken.token })
                })
                .catch((error) => {
                    // If there was failure
                    done(error, false)
                })
        }
    )
)

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

function signIn(req, res, next) {
    passport.authenticate('local', { session: false }, function (err, user) {
        if (err || !user)
            return res
                .status(401)
                .json(ResponseMessage(true, 'Invalid email/password'))
        else {
            req.user = user
            return next()
        }
    })(req, res, next)
}

function getUser(req, res) {
    const user = req.user
    res.json(ResponseMessage(false, 'Success', { user }))
}

function requireJWT(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (info instanceof Error)
            return res.status(401).json(ResponseMessage(true, info.message))
        if (err) return next(err)
        req.user = user
        //injecting role
        req.role = user.role
        return next()
    })(req, res, next)
}

function requireRefreshToken(req, res, next) {
    passport.authenticate(
        'refresh-token',
        { session: false },
        (err, { user, refreshToken }, info) => {
            if (info instanceof Error)
                return res.status(401).json(ResponseMessage(true, info.message))
            if (err) return next(err)
            req.user = user
            req.refreshToken = refreshToken
            return next()
        }
    )(req, res, next)
}

async function checkPermission(req, res, next) {
    try {
        let permission = req.routePermission
        const savedPermission = await PermissionSchema.findOne({
            name: permission
        })
        if (!savedPermission)
            return res
                .status(403)
                .json(ResponseMessage(true, 'Permission denied'))
        const checkRolePermission = await RolePermissionSchema.findOne({
            role: req.role,
            permission: savedPermission._id,
            state: 'Included'
        })
        if (!checkRolePermission)
            return res
                .status(403)
                .json(
                    ResponseMessage(
                        true,
                        'You do not have sufficient permissions to access the resource.'
                    )
                )
        return next()
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    initialize: passport.initialize(),
    register,
    signJWTForUser,
    signRefreshTokenForUser,
    assignRole,
    checkPermission,
    requireRefreshToken,
    requireJWT,
    signIn,
    getUser
}
