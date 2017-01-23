# aither

This configuration will setup following:

- Hapi server which expose an example `/add` endpoint to calculate two number
- NATS server
- Zipkin dashboard to monitoring your distributed system (with volumes)

## Installing
```sh
docker-compose up
```

## Scaling
```
docker-compose scale worker=5
```

## NATS monitoring endpoint

[http://localhost:8222/](http://localhost:8222/)

## Zipkin dashboard

[http://localhost:9411/](http://localhost:9411/)

## Example REST endpoint

[http://localhost:8789/add?a=4&b=8](http://localhost:8789/add?a=4&b=8)