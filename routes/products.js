const Router = require('express').Router
const bodyParser = require('body-parser')
const boom = require('boom')
const celebrate = require('celebrate')

const Products = require('../model/products')
const { validateRes } = require('../utils')
const schemas = require('../schemas')

class ProductRoutes {
  constructor(model) {
    this._model = model

    this.router = Router()

    this.router.route('/')
      .get(celebrate({ query: schemas.listingSchema }), validateRes(schemas.productSchema),
        (req, res, next) => this.list(req, res).catch(next))
      .post(bodyParser.json(), celebrate({ body: schemas.productSchema }),
        (req, res, next) => this.add(req, res).catch(next))
      .delete(bodyParser.json(), celebrate({ body: schemas.deleteSchema }),
        (req, res, next) => this.delete(req, res).catch(next))

    this.router.route('/:id').get(validateRes(schemas.productSchema),
      (req, res, next) => this.get(req, res).catch(next))
  }

  async list(req, res) {
    const { limit, offset, fields } = req.query
    const [len, products] = await Promise.all([
      this._model.length(),
      this._model.getData(limit, offset, fields)
    ])
    const hasNext = offset + limit < len
    const hasPrev = offset > 0

    const nextLimit = hasNext ? Math.min(limit, len - offset - limit) : limit
    const nextOffset = offset + limit

    const prevLimit = hasPrev ? Math.min(limit, offset) : 0
    const prevOffset = Math.max(offset - limit, 0)

    const link = (limit, offset) => {
      return `${req.protocol}://${req.header('Host')}${req.baseUrl}?limit=${nextLimit}&offset=${nextOffset}`
    }
    res
      .links({
        next: hasNext ? link(nextLimit, nextOffset) : null,
        prev: hasPrev ? link(prevLimit, prevOffset) : null
      })
      .json(products)
  }

  async add(req, res) {
    const product = await this._model.addProduct({ title, desc, price  })
    res
      .status(201)
      .set('Content-Location', `/v1/api/activities/${product.id}`)
      .json(product)
  }

  async delete(req, res) {
    await this._model.removeProduct(req.body.title)
    res.redirect(303, '/')
  }

  async get(req, res) {
    res.json(await this._model.getProduct(req.params.id))
  }
}

module.exports = new ProductRoutes(new Products()).router