const Hemera = require('nats-hemera')
const HemeraJoi = require('hemera-joi')
const HemeraJaeger = require('hemera-jaeger')
const nats = require('nats').connect({
  url: process.env.NATS_URL,
  user: process.env.NATS_USER,
  pass: process.env.NATS_PW
})
const hemera = new Hemera(nats, {
  logLevel: process.env.HEMERA_LOG_LEVEL,
  childLogger: true,
  tag: 'hemera-math'
})

let sampleOperation = (a, b) => {
  return a + b
}

async function start() {
  hemera.use(HemeraJoi)
  hemera.use(HemeraJaeger, {
    serviceName: 'math',
    jaeger: {
      sampler: {
        type: 'Const',
        options: true
      },
      options: {
        tags: {
          'nodejs.version': process.versions.node
        }
      },
      reporter: {
        host: process.env.JAEGER_URL
      }
    }
  })

  await hemera.ready()

  let Joi = hemera.joi

  hemera.add(
    {
      topic: 'math',
      cmd: 'add',
      a: Joi.number().required(),
      b: Joi.number().required(),
      refresh: Joi.boolean().default(false)
    },
    async function(req) {
      let key = `math:add_${req.a}_${req.b}`
      let ma = this
      let result

      // no cache
      if (req.refresh) {
        // big operation
        result = sampleOperation(req.a, req.b)

        // update cache
        await this.act({
          topic: 'redis-cache',
          cmd: 'set',
          key: key,
          value: result
        })

        return result
      } else {
        // check cache
        const resp = await this.act({
          topic: 'redis-cache',
          cmd: 'get',
          key: key
        })

        if (resp.data) {
          // mark this request as cached for zipkin
          ma.delegate$.cache = 'Redis:HIT'

          return resp.data
        }

        // big operation
        result = sampleOperation(req.a, req.b)

        // update cache
        await this.act({
          topic: 'redis-cache',
          cmd: 'set',
          key: key,
          value: result
        })

        return result
      }
    }
  )
}

start()
