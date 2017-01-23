![aither](https://github.com/hemerajs/aither/blob/master/logo.png?raw=true)

# aither

This configuration will setup:

* [Hapi](https://github.com/hapijs/hapi) server which act as api-gataway to the NATS system.
* [Microservice](https://github.com/hemerajs/aither/blob/master/worker/index.js) which is responsible to add two numbers.
* [NATS](https://github.com/nats-io/gnatsd) server.
* [Zipkin](http://zipkin.io/) dashboard to monitoring your distributed system (with volumes).

## Running the system
```sh
docker-compose up
```

## Scaling the system
```
docker-compose scale worker=5
```

### NATS monitoring endpoint

[http://localhost:8222/](http://localhost:8222/)

### Zipkin dashboard

[http://localhost:9411/](http://localhost:9411/)

### Example REST endpoint

[http://localhost:8789/add?a=4&b=8](http://localhost:8789/add?a=4&b=8)
