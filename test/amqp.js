const amqp = require('amqplib/callback_api');
const assert = require('assert');

const mq = require('../');

function consume(name, callback) {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
    conn.createChannel((err, ch) => {
  
      ch.assertQueue(name, { durable: true });
      ch.prefetch(1);
  
      ch.consume(name, msg => {
        callback({
          json: JSON.parse(msg.content.toString()),
          message: msg,
          channel: ch
        });
        ch.ack(msg);
      });
    });
  });
}

function push(name, message) {
  amqp.connect(`amqp://${process.env.MESSAGE_BROKER}`, (err, conn) => {
    conn.createChannel((err, ch) => {
      ch.assertQueue('', { exclusive: true }, (err, q) => {
        ch.sendToQueue(
          name, 
          Buffer.from(JSON.stringify(message))
        );
      });
    });
  });
}

describe('AMQP helper', () => {
  describe('Work Queue // Push', () => {
    let name = 'push-test-queue';

    mq.push({
      queue: name,
      message: {
        answer: 42
      }
    });

    it('should capture the message pushed by amqp-helper\'s push', (done) => {
      consume(name, res => {
        assert.equal(res.json.answer, 42);
        assert.notEqual(typeof(res.channel.ch), 'undefined');
        done();
      });
    });

  });

  describe('Work Queue // Consume', () => {
    let name = 'consume-test-queue';

    it('should receive a message pushed to a queue triggered by an external client', (done) => {
      mq.consume({
        queue: name,
        callback: res => {
          assert.equal(res.json.author, 'Douglas Noël Adams');
          done();
        }
      });
    });

    push(name, {
      author: 'Douglas Noël Adams'
    });

  });
});

