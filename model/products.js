const fs = require('fs')

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
    return this._data.find(product => product.id === id)
  }

  async addProduct (product) {
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
