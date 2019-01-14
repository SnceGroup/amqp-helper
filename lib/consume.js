'use strict';

const amqp = require('amqplib/callback_api');

module.exports = options => {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
    conn.createChannel((err, ch) => {

      ch.assertQueue(options.queue, { durable: true });
      ch.prefetch(1);

      ch.consume(options.queue, msg => {
        options.callback({
          json: JSON.parse(msg.content.toString()),
          message: msg,
          channel: ch
        });
        ch.ack(msg);
      });
    });
  });
};
