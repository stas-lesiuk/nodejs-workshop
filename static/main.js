let products = []
const productsURL = 'api/v1/products'
const productsRoot = $('#productsRoot')
const filter = $('#filter')
const addProduct = $('#add-product')
const productTitle = $('#product-title')
const productDesc = $('#product-desc')
const productPrice = $('#product-price')

init()

filter.on('input', function (event) {
  const search = event.target.value
  displayProducts(products.filter(product => product.title.includes(search)))
})

addProduct.click(function () {
  const body = {
    title: productTitle.val(),
    desc: productDesc.val(),
    price: productPrice.val()
  }
  console.log('sendind data: ', body)
  window.fetch(productsURL, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'post',
    body: JSON.stringify(body)
  }).then(data => {
    console.log('received data', data)
    init()
  })
})

function init () {
  window.fetch(productsURL)
    .then(res => res.json())
    .then(prods => {
      products = prods
      displayProducts(products)
    })
}

function displayProducts (products) {
  productsRoot.empty()
  products.forEach(product => {
    const node = $('<div class="product product--small"/>')
    const title = $('<h2 class="product__title"/>')
    const desc = $('<div class="product__desc"/>')
    const more = $('<button type="button" class="product__read-more"/>')
    const img = $('<img />')
    const price = $('<div class="product__price"/>')

    title.text(product.title)
    desc.text(product.desc)
    more.text('Read more')
    more.click(function () {
      console.log('click more ')
      node.toggleClass('product--small')
    })
    img.attr('src', product.img)
    price.text(product.price + ' EUR')

    node.append(img)
    node.append(title)
    node.append(desc)
    node.append(more)
    node.append(price)

    productsRoot.append(node)
  })
}
