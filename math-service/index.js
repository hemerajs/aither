const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const HemeraZipkin = require('hemera-zipkin')
const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL
})

hemera.use(HemeraJoi)

HemeraZipkin.options = {
  host: process.env.ZIPKIN_URL,
  port: process.env.ZIPKIN_PORT
}

hemera.use(HemeraZipkin)

hemera.ready(() => {

  hemera.setOption('payloadValidator', 'hemera-joi')
  let Joi = hemera.exposition['hemera-joi'].joi

  hemera.add({
    topic: 'math',
    cmd: 'add',
    a: Joi.number().required(),
    b: Joi.number().required()
  }, function (req, cb) {

    let key = `math:add_${req.a}_${req.b}`
    let ma = this

    // check cache
    this.act({
      topic: 'redis-cache',
      cmd: 'get',
      key: key
    }, function (err, result) {

      if (err) {

        return cb(err)
      }

      if (result) {

        // mark this request as cached for zipkin
        ma.delegate$.cache = 'Redis:HIT'

        return cb(null, result)
      }

      // big operation
      let operation = req.a + req.b

      // update cache
      this.act({
        topic: 'redis-cache',
        cmd: 'set',
        key: key,
        value: operation
      }, function () {

        if (err) {

          return cb(err)
        }

        cb(null, operation)
      })

    })

  })
})