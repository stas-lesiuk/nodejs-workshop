const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const responseTime = require('response-time')
const errorhandler = require('errorhandler')
const config = require('config')
const celebrate = require('celebrate')

const routes = require('./routes')

const app = express()
app.use(morgan('dev'))
app.use(express.static('static'))
app.use(compression())
app.use(responseTime())

app.use(routes)

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next()
  }

  if (!err.isBoom) {
    return next(err)
  }

  res
    .status(err.output.statusCode)
    .json({
      statusCode: err.output.statusCode,
      message: err.message
    })
})

app.use(celebrate.errors())

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
