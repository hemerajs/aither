const Hemera = require('nats-hemera')
const hemeraRedisCache = require('hemera-redis-cache')
const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

hemeraRedisCache.options.redis = {
  host: process.env.REDIS_URL,
  port: process.env.REDIS_PORT
}

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL
})

hemera.ready(() => {

  hemera.use(hemeraRedisCache)

})