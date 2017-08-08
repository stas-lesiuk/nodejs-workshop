const Router = require('express').Router
const config = require('config')
const boom = require('boom')

const products = require('./products')

const router = Router()

router.get('/api/v1/', (req, res, next) => {
  const time = process.hrtime(req.startTime)
  const ms = time[ 0 ] * 1e3 + time[ 1 ] * 1e-6
  res.set('Content-Type', 'application/json')
    .set('X-Response-Time', ms)
  next()
})

router.use('/api/v1/products', products)

router.get('/version', (req, res) => {
  res.json({
    version: require('../package.json').version,
    env: config.get('env')
  })
})

router.post('/crash', () => {
  throw new Error('Crashing!')
})

module.exports = router