let products = []
const productsRoot = $('#productsRoot')
const filter = $('#filter')

filter.on('input', function (event) {
  const search = event.target.value
  displayProducts(products.filter(product => product.title.includes(search)))
})

displayProducts(products)

function displayProducts (products) {
  productsRoot.empty()
  products.forEach(product => {
    const node = $('<div />')
    const title = $('<div />')
    const desc = $('<div />')
    const more = $('<div />')
    const img = $('<img />')
    const price = $('<div />')

    node.addClass('product product--small')
    title.text(product.title)
    desc.addClass('product__desc')
    desc.text(product.desc)
    more.text('Read more')
    more.click(function () {
      console.log('click more ')
      node.toggleClass('product--small')
    })
    img.attr('src', product.img)
    price.text(product.price + ' EUR')
    price.addClass('product__price')

    node.append(img)
    node.append(title)
    node.append(desc)
    node.append(more)
    node.append(price)

    productsRoot.append(node)
  })
}

window.fetch('api/products')
  .then(res => res.json())
  .then(prods => {
    products = prods
    displayProducts(products)
  })
