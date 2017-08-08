const fs = require('fs')
// const Sequelize = require('sequelize')
const boom = require('boom')

class Products {
  constructor () {
    fs.readFile('./static/products.json', 'utf8', (err, content) => {
      if (err) {
        console.log(err)
      } else {
        this._data = JSON.parse(content)
      }
    })
  }

  get data () {
    return this._data
  }

  addProduct (product) {
    if (!product.title) {
      throw boom.badRequest('`title` is missing')
    }
    if (!product.price) {
      throw boom.badRequest('`price` is missing')
    }
    if (Object.keys(product).length > 3) {
      throw boom.badRequest(`Extra fields given: ${Object.keys(req.body)}`)
    }
    const id = this._data.length + 1
    const newProduct = Object.assign({}, product, {
      id,
      img: ''
    })
    this._data.push(newProduct)
    return newProduct
  }

  removeProduct (title) {
    this._data.splice(this._data.indexOf(product => product.title === title), 1)
  }
}

module.exports = Products
