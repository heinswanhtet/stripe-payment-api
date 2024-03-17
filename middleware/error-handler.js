const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleWare = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Oops! Something went wrong. Please try again later.'
    }

    if (err.name === 'ValidationError') {
        customError.msg = Object.values(err.errors).map(item => item.message).join(', ')
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.code && err.code == 11000) {
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }

    if (err.name === 'CastError') {
        customError.msg = `No item found with id: ${err.value._id}`
        customError.statusCode = StatusCodes.NOT_FOUND
    }

    // return res.status(customError.statusCode).json({ err })
    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleWare