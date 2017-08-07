// #!/usr/bin/env node
const http = require('http')
const config = require('config')

// Przenosimy tworzenie aplikacji do osobnego modułu
const app = require('./app')

// 5/ W index.js zostaje nam tylko uruchomienie serwera.
const port = process.env.PORT || config.get('port')

http.createServer(app).listen(port, () => {
  console.log(`Listening on :${port}`)
})
