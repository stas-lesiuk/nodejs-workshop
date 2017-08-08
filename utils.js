const Joi = require('joi')
const notifier = require('node-notifier')

// 26/ Middleware, który będzie walidował odpowiedź.
function validateRes (schema) {
  return (req, res, next) => {
    // Zapisujemy originalną metodę json
    const origJson = res.json

    // Nadpisujemy metodę `json` na obiekcie res
    res.json = function (data) {
      const ret = origJson.call(this, data)
      // 3/ Pomiń błędy
      if (data.statusCode) {
        return ret
      }
      const result = Joi.validate(data, schema)

      if (result.error) {
        const message = `Invalid response generated for ${req.originalUrl}`
        notifier.notify({
          'title': 'Validation error',
          'message': message
        })
        // Raportowanie błędów
        console.error(message, result.error, result.value)
      }

      return ret
    }

    // A następnie odpalamy kolejny middleware
    next()
  }
}

module.exports = { validateRes }
