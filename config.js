const path = require('path')

const PKG = require('./package.json')

const PORT = process.env.PORT
if (!PORT) {
  throw `[${ pkg.name }] No "PORT" specified.`
}

const BUILD_DIR = process.env.BUILD_DIR
if (!BUILD_DIR) {
  throw `[${ pkg.name }] No "BUILD_DIR" specified.`
}

const BUILD_PATH = path.join(__dirname, BUILD_DIR)

module.exports = {
  PKG,
  PORT,
  BUILD_PATH,
}
