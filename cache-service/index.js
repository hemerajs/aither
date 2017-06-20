const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const HemeraRedisCache = require('hemera-redis-cache')
const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL,
  childLogger: true,
  tag: 'cache-instance'
})

hemera.use(HemeraJoi)
hemera.use(HemeraRedisCache, {
  redis: {
    host: process.env.REDIS_URL,
    port: process.env.REDIS_PORT
  }
})

hemera.ready()
