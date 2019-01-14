'use strict';

const amqp = require('amqplib/callback_api');
const dsn = require('./dsn');

module.exports = options => {
  amqp.connect(dsn(), (err, conn) => {
    conn.createChannel((err, ch) => {
      ch.assertQueue('', { exclusive: true }, (err, q) => {
        // Publish req to queue
        ch.sendToQueue(
          options.queue,
          Buffer.from(JSON.stringify(options.message))
        );
      });
    });
  });
};
