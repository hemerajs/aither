![aither](https://github.com/hemerajs/aither/blob/master/logo.png?raw=true)
![aither](https://github.com/hemerajs/aither/blob/master/aither-stack.png?raw=true)
# aither

Aither shows an approach how to bootstrap a microservice system with [Hemera](https://github.com/hemerajs/hemera) and docker.
You can scale your worker in seconds and because we use NATS as “nervous system" for our distributed system we do not have to carry about service-discovery or load-balancing of hemera-services. We use traefik to load-balancing the api-gateway.

This configuration will setup:

* [Hapi](https://github.com/hapijs/hapi) http server which act as api-gateway to the Hemera services.
* [Microservice](https://github.com/hemerajs/aither/blob/master/worker/index.js) example which is responsible to add two numbers.
* [NATS](https://github.com/nats-io/gnatsd) server the underlying messaging system for Hemera.
* [Zipkin](http://zipkin.io/) dashboard to monitoring your distributed system.
* [Natsboard](https://github.com/devfacet/natsboard) dashboard to monitoring your NATS system in realtime.
* [Traefik](https://traefik.io/) modern HTTP reverse proxy and load balancer made to deploy microservices with ease.

## Architecture

![aither](https://github.com/hemerajs/aither/blob/master/aither-architecture.png?raw=true)

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

### Zipkin dashboard

[http://localhost:9411/](http://localhost:9411/)

## Example test on Digitalocean

* **Server**: 12 CPUs, 32GB RAM, 320GB SSD
* **Scaling**: 25 APIs, 100 workers
* **Load balancing**: Traefik in round-roubin for API services. NATS supports random only.
* **Caching**: No

#### Load-test:
* **Step-1**: Warm-up phase
Duration: 300 seconds
5 virtual users/second that last for 300 seconds

* **Step-2**: Daily business
Duration: 60 seconds
100 virtual users/second that last for 60 seconds

* **Step-3**: High load phase
Duration: 600 seconds
200 virtual users/second that last for 600 seconds

#### Result:
```
Complete report
  Scenarios launched:  126100
  Scenarios completed: 126100
  Requests completed:  126100
  RPS sent: 129.53
  Request latency:
    min: 3.8
    max: 736.9
    median: 6.9
    p95: 20.3
    p99: 63.2
  Scenario duration:
    min: 4.5
    max: 738.4
    median: 7.7
    p95: 21.3
    p99: 64.3
  Scenario counts:
    0: 126100 (100%)
  Codes:
    200: 126100
```

The full report you can find [here.](https://github.com/hemerajs/aither/tree/master/digitalocean-report)

## Thank you
thanks most of all to the community who create these awesome opensource software and thereby making it possible.
