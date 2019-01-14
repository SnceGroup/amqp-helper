'use strict';

const amqp = require('amqplib/callback_api');

module.exports = options => {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
    conn.createChannel((err, ch) => {
      let ex = options.exchange;
  
      ch.assertExchange(ex, 'fanout', { durable: true });
      ch.publish(ex, '', Buffer.from(JSON.stringify(options.message)));
    });
  });
};