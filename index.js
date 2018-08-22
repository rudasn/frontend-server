require('dotenv').config()

const config = require('./config')
const createExpressApp = require('./express')

createExpressApp(config)
