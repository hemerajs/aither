const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const HemeraZipkin = require('hemera-zipkin')
const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL,
  childLogger: true,
  tag: 'math-instance'
})

hemera.use(HemeraJoi)
hemera.use(HemeraZipkin, {
  host: process.env.ZIPKIN_URL,
  port: process.env.ZIPKIN_PORT,
  sampling: 1
})

hemera.setOption('payloadValidator', 'hemera-joi')

hemera.ready(() => {
  let Joi = hemera.exposition['hemera-joi'].joi

  hemera.add({
    topic: 'math',
    cmd: 'add',
    a: Joi.number().required(),
    b: Joi.number().required(),
    refresh: Joi.boolean().default(false)
  }, function (req, cb) {
    let key = `math:add_${req.a}_${req.b}`
    let ma = this
    let result

    let operation = (a, b) => {
      return a + b
    }

    // no cache
    if (req.refresh) {
      // big operation
      result = operation(req.a, req.b)

      // update cache
      this.act({
        topic: 'redis-cache',
        cmd: 'set',
        key: key,
        value: result
      }, function () {
        return cb(null, result)
      })
    } else {
      // check cache
      this.act({
        topic: 'redis-cache',
        cmd: 'get',
        key: key
      }, function (err, resp) {
        if (err) {
          return cb(err)
        }

        if (resp) {
          // mark this request as cached for zipkin
          ma.delegate$.cache = 'Redis:HIT'

          return cb(null, resp)
        }

        // big operation
        result = operation(req.a, req.b)

        // update cache
        this.act({
          topic: 'redis-cache',
          cmd: 'set',
          key: key,
          value: result
        }, function () {
          cb(null, result)
        })
      })
    }
  })
})
