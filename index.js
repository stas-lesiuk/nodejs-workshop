//#!/usr/bin/env node

const http = require('http')
const fs = require('fs')
const serveFile = require('./helpers')
const Products = require('./products')
const products = new Products();

const port = process.env.PORT || 3000

const server = http.createServer((req, res) => {
  const { url, method } = req

  console.log(url, method)

  switch(url) {
  case '/':
  case '/index.html':
    serveFile('index.html', 'text/html', res)
    break
  case '/main.js':
    serveFile('main.js', 'application/javascript', res)
    break
  case '/main.css':
    serveFile('main.css', 'text/css', res)
    break
  case '/api/products':
    if(method === 'POST') {
      let body = [];
      req.on('error', (err) => {
        console.error(err);
      }).on('data', (chunk) => {
        body.push(chunk);
      }).on('end', () => {
        body = Buffer.concat(body).toString();
        products.addProduct(JSON.parse(body));
      });
    } else {
      res.writeHead(200, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify(products.data))
    }
    break
  default:
    res.writeHead(404)
    res.end('404: Not Found')
  }
})

server.listen(port, () => {
  console.log(`Listening on :${port}`)
})
