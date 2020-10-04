const Joi = require('joi')
const { USER_ROLES } = require('../../../../constants')
const _ = require('lodash')
module.exports = Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string()
        .valid(..._.values(USER_ROLES))
        .required()
})
