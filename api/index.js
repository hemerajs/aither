const Hapi = require('hapi')
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

const server = new Hapi.Server()
server.connection({
  port: process.env.API_PORT,
  host: process.env.API_HOST
})

server.register([{
  register: zipkinMiddleware,
  options: {
    tracer,
    serviceName: 'gateway'
  }
}, {
  register: require('hapi-hemera'),
  options: {
    hemera: {
      name: 'test',
      logLevel: process.env.HEMERA_LOG_LEVEL,
      childLogger: true,
      tag: 'hemera-1'
    },
    plugins: [{
      register: require('hemera-zipkin'),
      options: {
        host: process.env.ZIPKIN_URL,
        port: process.env.ZIPKIN_PORT
      }
    }],
    basePattern: function (request) {
      return {
        trace$: {
          traceId: request.plugins.zipkin.traceId.traceId,
          spanId: request.plugins.zipkin.traceId.spanId,
          sampled: request.plugins.zipkin.traceId.sampled,
          flags: request.plugins.zipkin.traceId.flags
        }
      }
    },
    nats: {
      'url': process.env.NATS_URL,
      'user': process.env.NATS_USER,
      'pass': process.env.NATS_PW
    }
  }
}], function (err) {
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

server.route({
  method: 'GET',
  path: '/api/add',
  handler: function (request, reply) {
    request.hemera.act({
      topic: 'math',
      cmd: 'add',
      a: request.query.a,
      b: request.query.b,
      refresh: !!request.query.refresh
    }, function (err, result) {
      if (err) {
        console.error(err)
        return reply(Boom.badRequest(err.message))
      }

      return reply(result)
    })
  }
})
