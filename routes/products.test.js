/* eslint-env mocha */
const express = require('express')
const request = require('supertest')
const expect = require('chai').expect

// 3/ Możemy przetestować pod-aplikację zupełnie niezależnie.
const products = require('./products')
const app = express()
app.use(products)

describe('Products', () => {

  it('should serve list of products at /api/products GET', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).to.equal(3)
      })
  })

  it('should fail to add new product via POST /api/products with no title', () => {
    return request(app)
      .post('/')
      .send({
        desc: 'Test',
        price: 123
      })
      .then(res => {
        expect(res.body.code).to.equal(400)
        expect(res.body.message).to.equal('`title` is missing')
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.length).to.equal(3)
          })
      })
  })

  it('should success to add new product via POST /api/products', () => {
    return request(app)
      .post('/')
      .send({
        title: 'Test',
        price: 123
      })
      .expect(201)
      .then(res => {
        return request(app)
          .get('/')
          .then(res => {
            expect(res.body.length).to.equal(4)
          })
      })
  })
})
