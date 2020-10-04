const { DBSchemas } = require('../../db')
const { FlightSchema } = DBSchemas
const { ResponseMessage } = require('../../utils')

async function addNewFlight(req, res, next) {
    try {
        const {
            origin,
            destination,
            currency,
            arrival,
            departure,
            cost
        } = req.body
        const checkFlight = await FlightSchema.findOne({
            origin,
            destination,
            arrival,
            departure
        })
        if (checkFlight)
            return res
                .status(403)
                .json(
                    ResponseMessage(
                        true,
                        'A flight with similar details has been added'
                    )
                )
        const flight = await new FlightSchema({
            origin,
            destination,
            currency,
            arrival,
            departure,
            cost,
            addedBy: req.user._id
        }).save()
        return res
            .status(200)
            .json(
                ResponseMessage(false, 'Added flight successfully', { flight })
            )
    } catch (e) {
        return next(e)
    }
}

async function editFlight(req, res, next) {
    try {
        const {
            origin,
            destination,
            currency,
            arrival,
            departure,
            cost
        } = req.body
        const _id = req.params.id
        const checkFlight = await FlightSchema.findOne({
            _id
        })
        if (!checkFlight)
            return res
                .status(404)
                .json(
                    ResponseMessage(
                        true,
                        'The flight which you are trying to edit does not exist'
                    )
                )
        const flight = await FlightSchema.findByIdAndUpdate(
            {
                _id
            },
            {
                $set: {
                    origin,
                    destination,
                    currency,
                    arrival,
                    departure,
                    cost,
                    lastEditedBy: req.user._id
                }
            },
            { new: true }
        )
        return res
            .status(200)
            .json(
                ResponseMessage(false, 'Edited flight successfully', { flight })
            )
    } catch (e) {
        return next(e)
    }
}

async function getFlights(req, res, next) {
    try {
        const flights = await FlightSchema.find({})
        return res
            .status(200)
            .json(ResponseMessage(false, 'Successful request', { flights }))
    } catch (e) {
        return next(e)
    }
}

async function deleteFlight(req, res, next) {
    try {
        const _id = req.params.id

        const flight = await FlightSchema.findOneAndRemove({
            _id
        })
        if (flight)
            return res.status(200).json(
                ResponseMessage(false, 'Deleted flight successfully', {
                    flightId: _id
                })
            )
        else
            return res
                .status(404)
                .json(
                    ResponseMessage(
                        true,
                        'The flight which you are trying to delete might not exist'
                    )
                )
    } catch (e) {
        return next(e)
    }
}

module.exports = {
    addNewFlight,
    editFlight,
    deleteFlight,
    getFlights
}
