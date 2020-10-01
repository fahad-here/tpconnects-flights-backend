const createError = require('http-errors')
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const logger = require('morgan')
const { DBConnect } = require('./src/db')
const { RouteErrorHandler } = require('./src/utils')
const app = express()

const PORT = 3000

// view engine setup
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))

DBConnect()

app.get('/api', (req, res)=>{
    return res.send({
        message: 'success'
    })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(RouteErrorHandler)

app.set('port', PORT)
let server = http.createServer(app)

server.listen(PORT)
server.on('error', onError)
server.on('listening', onListening)

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges')
            process.exit(1)
            break
        case 'EADDRINUSE':
            console.error(bind + ' is already in use')
            process.exit(1)
            break
        default:
            throw error
    }
}

function onListening() {
    let addr = server.address()
    let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port
    console.info('Listening on ' + bind)
}

module.exports = app
