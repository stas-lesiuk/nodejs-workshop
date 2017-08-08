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
    console.log('removing product, prev len', this._data.length)
    this._data.splice(this._data.indexOf(product => product.title === title), 1)
    console.log('after removing product, prev len', this._data.length)
  }
}

module.exports = Products
