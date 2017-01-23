const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const HemeraZipkin = require('hemera-zipkin')
const nats = require('nats').connect({
  'url': process.env.NATS_URL,
  'user': process.env.NATS_USER,
  'pass': process.env.NATS_PW
})

const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL || 'info'
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

    cb(null, req.a + req.b)
  })
})