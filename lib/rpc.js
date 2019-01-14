'use strict';

const amqp = require('amqplib/callback_api');
const dsn = require('./dsn');

function generateUuid() {
  return Math.random().toString() +
    Math.random().toString() +
    Math.random().toString();
}

module.exports = options => {
  return new Promise((resolve, reject) => {
    amqp.connect(dsn(), (err, conn) => {
      conn.createChannel((err, ch) => {
        ch.assertQueue('', { exclusive: true }, (err, q) => {

          let corr = generateUuid();

          // RPC callback definition - Waiting for the server's response
          ch.consume(q.queue, (msg) => {
            if (msg.properties.correlationId === corr) {
              resolve({
                json: JSON.parse(msg.content.toString()),
                message: msg,
                channel: ch
              });

              setTimeout(() => {
                conn.close();
              }, 500);
            }
          }, { noAck: true });

          // RPC call setting - Publish req to queue
          // - correlationId: mapping to identify the caller to send back the response to the exact request
          // - replyTo: callback to send response to
          ch.sendToQueue(
            options.queue,
            Buffer.from(JSON.stringify(options.message)),
            {
              correlationId: corr,
              replyTo: q.queue
            }
          );
        });
      });
    });
  });
};
