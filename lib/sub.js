'use strict';

const amqp = require('amqplib/callback_api');

module.exports = options => {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
    conn.createChannel((err, ch) => {
      let ex = options.exchange;
  
      ch.assertExchange(ex, 'fanout', { durable: true });
  
      ch.assertQueue('', { exclusive: true }, (err, q) => {
        ch.bindQueue(q.queue, ex, '');
  
        ch.consume(q.queue, msg => {
          options.callback({
            json: JSON.parse(msg.content.toString()),
            message: msg,
            channel: ch
          });
          ch.ack(msg);
        });
      });
    });
  });  
};
