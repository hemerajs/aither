![aither](https://github.com/hemerajs/aither/blob/master/logo.png?raw=true)
![aither](https://github.com/hemerajs/aither/blob/master/aither-stack.png?raw=true)
# aither

Aither shows an approach how to bootstrap a microservice system with [Hemera 5](https://github.com/hemerajs/hemera) and docker.
You can scale your worker in seconds and because we use NATS as “nervous system" for our distributed system we do not have to carry about service-discovery or load-balancing of hemera-services. We use traefik to load-balancing the api-gateway.

This configuration will setup:

* [Hapi](https://github.com/hapijs/hapi) http server which act as api-gateway to the Hemera services.
* [Microservice](https://github.com/hemerajs/aither/blob/master/worker/index.js) example which is responsible to add two numbers.
* [NATS](https://github.com/nats-io/gnatsd) server the underlying messaging system for Hemera.
* [Jaeger](https://github.com/jaegertracing/jaeger) CNCF Jaeger, a Distributed Tracing System.
* [Natsboard](https://github.com/devfacet/natsboard) dashboard to monitoring your NATS system in realtime.
* [Traefik](https://traefik.io/) modern HTTP reverse proxy and load balancer made to deploy microservices with ease.
* [Redis](https://redis.io) in memory cache for Hemera.

## Architecture

![aither](https://github.com/hemerajs/aither/blob/master/aither-architecture.png?raw=true)

## Running the system
```sh
docker-compose up
```

## Scaling the system
```
docker-compose scale math-service=5 api=2
```

## Run load test

```
npm install -g artillery
artillery run loadtest.yml
```
Print the html artillery report with `artillery report <report.json>`

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

### Jaeger dashboard

[http://localhost:16686/](http://localhost:16686/)

## Example test on Digitalocean

* **Server**: -
* **Scaling**: 25 APIs, 100 workers
* **Load balancing**: Traefik in round-roubin for API services. NATS supports random only.
* **Caching**: No

#### Load-test:
* **Step-1**: Warm-up phase
-

* **Step-2**: Daily business
-

* **Step-3**: High load phase
-

#### Result:
```
```

The full report you can find [here.](https://github.com/hemerajs/aither/tree/master/digitalocean-report)

## Thank you
thanks most of all to the community who create these awesome opensource software and thereby making it possible.
