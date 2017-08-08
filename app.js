const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const responseTime = require('response-time')
const errorhandler = require('errorhandler')
const config = require('config')
const notifier = require('node-notifier')
const bodyParser = require('body-parser')

const Products = require('./products')
const products = new Products()

const app = express()
app.use(morgan('dev'))
app.use(express.static('static'))
app.use(compression())
app.use(responseTime())
notifier.notify({
  'title': 'App starting',
  'message': `Environment is: ${config.get('env')}`
})

app.get('/api/v1/products', (req, res) => {
  const time = process.hrtime(req.startTime)
  const ms = time[ 0 ] * 1e3 + time[ 1 ] * 1e-6
  res.set('Content-Type', 'application/json')
    .set('X-Response-Time', ms)
    .json(products.data)
})

app.post('/api/v1/products', bodyParser.json(), (req, res) => {
  const product = products.addProduct(req.body)
  res
    .status(201)
    .set('Content-Location', `/v1/api/activities/${product.id}`)
    .json(product)
})

app.delete('/api/v1/products', bodyParser.json(), (req, res) => {
  products.removeProduct(req.body.title)
  res.redirect(303, '/')
})

app.get('/version', (req, res) => {
  res.set('Content-Type', 'application/json')
    .json({
    version: require('./package.json').version,
    env: config.get('env')
  })
})

app.post('/crash', () => {
  throw new Error('Crashing!')
})

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
      code: err.output.statusCode,
      message: err.message
    })
})

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
