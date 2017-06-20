const Hapi = require('hapi')
const HemeraZipkin = require('hemera-zipkin')
const Hemera = require('nats-hemera')
const Boom = require('boom')
const zipkinMiddleware = require('zipkin-instrumentation-hapi').hapiMiddleware
const { Tracer, ExplicitContext, BatchRecorder } = require('zipkin')
const { HttpLogger } = require('zipkin-transport-http')

const recorder = new BatchRecorder({
  logger: new HttpLogger({
    endpoint: 'http://' + process.env.ZIPKIN_URL + ':' + process.env.ZIPKIN_PORT + '/api/v1/spans'
  })
})

const ctxImpl = new ExplicitContext()
const tracer = new Tracer({ ctxImpl, recorder })

const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

const server = new Hapi.Server()
server.connection({
  port: process.env.API_PORT,
  host: process.env.API_HOST
})

server.register({
  register: zipkinMiddleware,
  options: {
    tracer,
    serviceName: 'gateway'
  }
}, function (err) {
  if (err) {
    console.error(err)
    throw err
  }

  server.start((err) => {
    if (err) {
      console.error(err)
      throw err
    }
    console.log(`Server running at: ${server.info.uri}`)
  })
})

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL,
  childLogger: true,
  tag: 'gateway-instance'
})

hemera.use(HemeraZipkin, {
  host: process.env.ZIPKIN_URL,
  port: process.env.ZIPKIN_PORT,
  sampling: 1
})

hemera.ready(() => {
  server.route({
    method: 'GET',
    path: '/api/add',
    handler: function (request, reply) {
      hemera.act({
        topic: 'math',
        cmd: 'add',
        a: request.query.a,
        b: request.query.b,
        refresh: !!request.query.refresh,
        trace$: {
          traceId: request.plugins.zipkin.traceId.traceId,
          spanId: request.plugins.zipkin.traceId.spanId
        }
      },
        (err, result) => {
          if (err) {
            console.error(err)
            return reply(Boom.badRequest(err.message))
          }

          return reply(result)
        })
    }
  })
})
