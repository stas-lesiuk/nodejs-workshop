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
})
