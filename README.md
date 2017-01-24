![aither](https://github.com/hemerajs/aither/blob/master/logo.png?raw=true)
![aither](https://github.com/hemerajs/aither/blob/master/aither-stack.png?raw=true)
# aither

Aither shows an approach how to bootstrap a microservice system with [Hemera](https://github.com/hemerajs/hemera) and docker.
You can scale your worker in seconds and because we use NATS as “nervous system" for our distributed system we do not have to carry about service-discovery or load-balancing of hemera-services. We use traefik to load-balancing the api-gateway.

This configuration will setup:

* [Hapi](https://github.com/hapijs/hapi) http server which act as api-gataway to the Hemera services.
* [Microservice](https://github.com/hemerajs/aither/blob/master/worker/index.js) example which is responsible to add two numbers.
* [NATS](https://github.com/nats-io/gnatsd) server the underlying messaging system for Hemera.
* [Zipkin](http://zipkin.io/) dashboard to monitoring your distributed system.
* [Natsboard](https://github.com/devfacet/natsboard) dashboard to monitoring your NATS system in realtime.
* [Traefik](https://traefik.io/) modern HTTP reverse proxy and load balancer made to deploy microservices with ease.

## Running the system
```sh
docker-compose up
```

## Scaling the system
```
docker-compose scale worker=5 api=2
```

## Run load test

```
npm install -g artillery
artillery run loadtest.yml
```

## Start a request against load balancer

```
http://localhost:8182/api/add?a=1&b=10
```

### Traefik dashboard

[http://localhost:8181/](http://localhost:8181/)

### NATS dashboard

[http://localhost:3000/](http://localhost:3000/)

### NATS monitoring endpoint

[http://localhost:8222/](http://localhost:8222/)

### Zipkin dashboard

[http://localhost:9411/](http://localhost:9411/)

### Thank you
thanks most of all to the community who create these awesome opensource software and thereby making it possible.
