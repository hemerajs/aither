![aither](https://github.com/hemerajs/aither/blob/master/logo.png?raw=true)

# aither

This configuration will setup following:

- [Hapi](https://github.com/hapijs/hapi) server which expose an example `/add` endpoint to calculate two number.
- [NATS](https://github.com/nats-io/gnatsd) server.
- [Zipkin](http://zipkin.io/) dashboard to monitoring your distributed system (with volumes).

## Running the system
```sh
docker-compose up
```

## Scaling the system
```
docker-compose scale worker=5
```

## NATS monitoring endpoint

[http://localhost:8222/](http://localhost:8222/)

## Zipkin dashboard

[http://localhost:9411/](http://localhost:9411/)

## Example REST endpoint

[http://localhost:8789/add?a=4&b=8](http://localhost:8789/add?a=4&b=8)
