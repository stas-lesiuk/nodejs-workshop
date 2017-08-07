const connect = require('connect')
const morgan = require('morgan')
const serveStatic = require('serve-static')
const compression = require('compression')
const responseTime = require('response-time')
const errorhandler = require('errorhandler')
const config = require('config')
const notifier = require('node-notifier')

const Products = require('./products')
const products = new Products()

const app = connect()
app.use(morgan('dev'))
app.use(serveStatic('static'))
app.use(compression())
app.use(responseTime())
notifier.notify({
  'title': 'App starting',
  'message': `Environment is: ${config.get('env')}`
})

app.use('/api/', (req, res, next) => {
  req.startTime = process.hrtime()
  next()
})

app.use('/api/products', (req, res) => {
  const time = process.hrtime(req.startTime)
  const ms = time[0] * 1e3 + time[1] * 1e-6
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'X-Response-Time': ms
  })
  const { method } = req
  if (method === 'POST') {
    let body = []
    req.on('error', (err) => {
      notifier.notify({
        'title': 'Error',
        'message': err
      })
    }).on('data', (chunk) => {
      body.push(chunk)
    }).on('end', () => {
      body = Buffer.concat(body).toString()
      products.addProduct(JSON.parse(body))
    })
  } else {
    res.end(JSON.stringify(products.data))
  }
})

app.use('/version', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  })
  // 6/ Zwracamy JSONa z dwoma polami
  res.end(JSON.stringify({
    // Wersję wyciągamy z package.json
    version: require('./package.json').version,
    // Dodajemy też środowisko korzystając ze standardowej zmiennej NODE_ENV
    env: config.get('env')
  }))
})

app.use('/crash', () => {
  throw new Error('Crashing!')
})

if (config.get('env') !== 'production') {
  app.use(errorhandler())
}

module.exports = app
