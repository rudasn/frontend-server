const compression = require('compression')
const cors = require('cors')
const express = require('express')
const path = require('path')
const request = require('request')

module.exports = ({ PKG, PORT, BUILD_PATH }) => {
  const app = express()

  // gzip
  app.use(compression())

  // cors
  app.use(cors())

  // Custom Headers
  app.use(function(req, res, next) {
    res.setHeader('X-Version', PKG.version)
    next()
  })

  // static assets
  app.use(
    express.static(BUILD_PATH, {
      setHeaders: function(res, path) {
        // Cache static files for a very long time.
        // This assumes that the static files are cache-busted by their filename.
        // eg. main.<hash>.css
        res.setHeader('Cache-Control', `max-age=${ 3e8 }`)
      },
    })
  )

  // Proxy requests
  app.get('/proxy', function(req, res) {
    const url = req.query.url
    req.pipe(request(url)).pipe(res)
  })

  // Handle routes (pages) with our React client.
  app.use(function(req, res) {
    res.set({
      // These pages will all have the same Etag since they all respond
      // the same index.html file.
      // The browser will revalidate these whenever the Etag changes.
      'Cache-Control': `public, must-revalidate, max-age=${ 60 * 5 }`,
    })
    res.sendFile(path.join(BUILD_PATH, 'index.html'))
  })

  app.listen(PORT)

  console.log(`[${ PKG.name }] Listening on port ${ PORT }...`)
  console.log(`\n\n[${ PKG.name }] Point your browser to http://localhost:${ PORT }/ to see the application.`)

  return app
}
