const fs = require('fs')

// Tworzymy pomocniczą funkcję, ktora zwróci Promise na zawartość pliku
function readFile (file) {
  return new Promise((resolve, reject) => {
    fs.readFile(`./static/${file}`, 'utf8', (err, content) => {
      if (err) {
        reject(err)
      } else {
        resolve(content)
      }
    })
  })
}

// Do deklaracji funkcji dodajemy `async`
// -- Ta funkcja od teraz automatycznie zwraca Promise.
async function serveFile (file, mime, res) {
  // 11/ A następnie zamiast wołać `then` używamy `await`.
  try {
    const content = await readFile(file)
    res.writeHead(200, {
      'Content-Type': mime
    })
    res.end(content)
  } catch (err) {
    console.error(err)
    res.writeHead(500)
    res.end(`Internal Error`)
  }
}

module.exports = serveFile
