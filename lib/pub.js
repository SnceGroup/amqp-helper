'use strict';

const amqp = require('amqplib/callback_api');
const dsn = require('./dsn');

module.exports = options => {
  amqp.connect(dsn(), (err, conn) => {
    conn.createChannel((err, ch) => {
      let ex = options.exchange;

      ch.assertExchange(ex, 'fanout', { durable: true });
      ch.publish(ex, '', Buffer.from(JSON.stringify(options.message)));
    });
  });
};
