import { loadEnv } from 'vite'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

/**
 * Serves /api/* during `vite` using the same Web-handler modules as Vercel.
 * Loads root .env into process.env so server routes can read non-VITE_ secrets.
 */
export function viteApiPlugin() {
  return {
    name: 'cinevault-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, '')
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) {
          process.env[key] = value
        }
      }

      server.middlewares.use(async (req, res, next) => {
        try {
          const url = req.url || ''
          if (!url.startsWith('/api/')) {
            next()
            return
          }

          const pathname = url.split('?')[0]
          const routeMap = {
            '/api/chat': path.resolve(server.config.root, 'api/chat.js'),
            '/api/search-movies': path.resolve(server.config.root, 'api/search-movies.js'),
          }

          const modulePath = routeMap[pathname]
          if (!modulePath) {
            res.statusCode = 404
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'API route not found' }))
            return
          }

          const chunks = []
          for await (const chunk of req) {
            chunks.push(chunk)
          }
          const rawBody = Buffer.concat(chunks)

          const host = req.headers.host || 'localhost'
          const requestUrl = `http://${host}${url}`
          const headers = new Headers()
          for (const [key, value] of Object.entries(req.headers)) {
            if (value == null) continue
            if (Array.isArray(value)) {
              for (const item of value) headers.append(key, item)
            } else {
              headers.set(key, value)
            }
          }

          const init = {
            method: req.method || 'GET',
            headers,
          }

          if (req.method !== 'GET' && req.method !== 'HEAD') {
            init.body = rawBody
          }

          const request = new Request(requestUrl, init)
          const mod = await import(`${pathToFileURL(modulePath).href}?t=${Date.now()}`)
          const handler = mod.default || mod.POST
          if (typeof handler !== 'function') {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'API handler missing' }))
            return
          }

          const response = await handler(request)
          res.statusCode = response.status
          response.headers.forEach((value, key) => {
            if (key.toLowerCase() === 'transfer-encoding') return
            res.setHeader(key, value)
          })

          if (!response.body) {
            res.end()
            return
          }

          const reader = response.body.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            res.write(Buffer.from(value))
          }
          res.end()
        } catch (error) {
          console.error('[vite-api]', error)
          if (!res.headersSent) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ message: 'Local API middleware failed' }))
          } else {
            res.end()
          }
        }
      })
    },
  }
}
