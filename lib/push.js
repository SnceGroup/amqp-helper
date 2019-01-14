'use strict';

const amqp = require('amqplib/callback_api');

module.exports = options => {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
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
