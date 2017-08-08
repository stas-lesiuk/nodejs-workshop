/* eslint-env mocha */

// 2/ Importujemy supertest i bibliotekę do asercji
const request = require('supertest')
const expect = require('chai').expect

// Importujemy definicję naszego serwera
const app = require('./app')

describe('Server', () => {
  // 9/ Piszemy standardowe, asynchroniczne testy mocha.
  it('should respond to GET /version', () => {
    return request(app)
      .get('/version')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.version).to.equal('1.0.0')
      })
  })

  it('should serve HTML at /', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect('Content-Type', /html/)
  })

  it('should serve list of activities at /api/products GET', () => {
    return request(app)
      .get('/api/v1/products')
      .expect(200)
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.body.length).to.equal(3)
      })
  })

  it('should fail to add new product via POST /api/products with no title', () => {
    return request(app)
      .post('/api/v1/products')
      .send({
        desc: 'Test',
        price: 123
      })
      .then(res => {
        expect(res.body.code).to.equal(400)
        expect(res.body.message).to.equal('`title` is missing')
        return request(app)
          .get('/api/v1/products')
          .then(res => {
            expect(res.body.length).to.equal(3)
          })
      })
  })

  it('should success to add new product via POST /api/products', () => {
    return request(app)
      .post('/api/v1/products')
      .send({
        title: 'Test',
        price: 123
      })
      .expect(201)
      .then(res => {
        return request(app)
          .get('/api/v1/products')
          .then(res => {
            expect(res.body.length).to.equal(4)
          })
      })
  })
})
