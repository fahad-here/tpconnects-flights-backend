const Joi = require('joi')

module.exports = Joi.object().keys({
    origin: Joi.string().required(),
    destination: Joi.string().required(),
    country: Joi.string().required(),
    currency: Joi.string().required(),
    arrival: Joi.date().required(),
    departure: Joi.date().required(),
    cost: Joi.number().required()
})
