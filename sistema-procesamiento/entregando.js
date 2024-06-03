const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'entregando-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'entregando-group' });
const producer = kafka.producer();

const entregando = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'preparando' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(`Prepared message: ${message.value.toString()}`);
      
      const data = JSON.parse(message.value.toString());
      
      data.estado = 'entregando';

      const updatedMessage = JSON.stringify(data);

      const delay = 10000;

      setTimeout(async () => {
        await produceMessage(updatedMessage);
      }, delay);
    },
  });
};

const produceMessage = async (message) => {
  await producer.connect();
  await producer.send({
    topic: 'entregando',
    messages: [{ value: message }],
  });
  console.log('Message with updated state sent to "entregando" topic\n');
};

module.exports = entregando;
