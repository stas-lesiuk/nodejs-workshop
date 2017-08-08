const fs = require('fs')
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

  async length () {
    return this._data.length
  }

  async getData (limit, offset, fields) {
    return this._data
      .slice(offset, offset + limit)
      .map(product => {
        if (!fields) {
          return product
        }
        const obj = {}
        fields.map(key => {
          obj[key] = product[key]
        })
        return obj
      })
  }

  async getProduct(id) {
    if(!id) {
      throw boom.badRequest('`id` is empty!')
    }
    return this._data.find(product => product.id === id)
  }

  async addProduct (product) {
    if (!product.title) {
      throw boom.badRequest('`title` is missing')
    }
    if (!product.price) {
      throw boom.badRequest('`price` is missing')
    }
    if (Object.keys(product).length > 3) {
      throw boom.badRequest(`Extra fields given: ${Object.keys(product)}`)
    }
    const id = this._data.length + 1
    const newProduct = Object.assign({}, product, {
      id,
      img: ''
    })
    this._data.push(newProduct)
    return newProduct
  }

  async removeProduct (title) {
    this._data.splice(this._data.indexOf(product => product.title === title), 1)
  }
}

module.exports = Products
