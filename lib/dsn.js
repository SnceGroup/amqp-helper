'use strict';

let dsn = '';

module.exports = () => {
  if (dsn !== '') {
    return dsn;
  }

  let auth = '';
  if (process.env.RABBITMQ_USER && process.env.RABBITMQ_PASS) {
    let pass = process.env.RABBITMQ_PASS;

    if (process.env.RABBITMQ_PASS.indexOf('/run/secrets') === 0) {
      pass = fs.readFileSync(process.env.RABBITMQ_PASS, 'utf8').trim();
    }
    auth = `${process.env.RABBITMQ_USER}:${pass}@`;
  }
  dsn = `amqp://${auth}${process.env.MESSAGE_BROKER}:5672`;
  return dsn;
};
