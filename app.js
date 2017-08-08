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

app.get('/api/products', (req, res) => {
  const time = process.hrtime(req.startTime)
  const ms = time[ 0 ] * 1e3 + time[ 1 ] * 1e-6
  res.set('Content-Type', 'application/json')
    .set('X-Response-Time', ms)
    .json(products.data)
})

app.post('/api/products', bodyParser.urlencoded({extended: false}), (req, res) => {
  products.addProduct(req.body)
  res.redirect(303, '/')
})

app.delete('/api/products', bodyParser.urlencoded({extended: false}), (req, res) => {
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

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
