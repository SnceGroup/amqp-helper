# amqp-helper

A Node.js helper for AMQP messaging.

## Installation

Still to be published on NPM.

## Requirements

The library works by pushing and retrieving messages from the message broker identified by the environment variable `MESSAGE_BROKER`.
`MESSAGE_BROKER` can be whatever you use to identify the message broker host (IP address or hostname).

If you're using docker, it's enough to define the env variable into the docker-compose.yml:
```
  environment:
    - MESSAGE_BROKER=rabbitmq # in this case rabbitmq is the name of another container
```

## Usage

The aim of the library is to ease AMQP messaging configuration and execution by:

  - removing the overhead of the AMQP connection configuration;
  - offering easy to use (and remember) functions.

### Work Queue

#### Push to a queue

```
const mq = require('amqp-helper');

mq.push({
  queue: 'basket.save',
  message: {
    products: [4, 8, 15, 16, 23, 42],
    total: 42
  }
});
```

#### Retrieve messages from a queue

```
const mq = require('amqp-helper');

mq.consume({
  queue: 'basket.save',
  callback: res => {
    console.log(res.json);
  }
});
```

### Publish/Subscribe

In this case the communication is handled by defining an exchange instead of a queue.

#### Publish a message

```
const mq = require('amqp-helper');

mq.pub({
  exchange: 'order.billing-changed',
  message: {
    data: userData
  }
});
```

#### Consume a message

Multiple consumers can subscribe to an exchange and get the same message

```
const mq = require('amqp-helper');

mq.sub({
  exchange: 'order.billing-changed',
  callback: res => {
    console.log(res);
  }
});
```

### RPC

Remote Procedure Call pattern can be easily set up by:

#### Invoking an RPC

```
const mq = require('amqp-helper');

mq.rpc({
  queue: 'user.get',
  message: {
    user_id: 3
  }
}).then(result => {
  console.log(result);
});
```

#### Listening for the RPC message

```
const mq = require('amqp-helper');

mq.consume({
  queue: 'user.get',
  callback: data => {

    // Invoking RPC callback
    data.channel.sendToQueue(
      data.message.properties.replyTo,
      Buffer.from(JSON.stringify({
        userData: {
          name: 'Douglas'
        }
      })),
      {
        correlationId: data.message.properties.correlationId
      }
    );

  }
});
```

## Todo

  - Enhance documentation
  - Code coverage

## Contribution

```
cp .env.dist .env
docker-compose up -d
./npm install
./npm test
```
