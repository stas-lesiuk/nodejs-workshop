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

  get data () {
    return this._data
  }

  addProduct (product) {
    this._data.push(product)
  }

  removeProduct (title) {
    this._data.splice(1, this._data.indexOf(product => product.title === title))
  }
}

module.exports = Products
