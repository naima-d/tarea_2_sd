const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'preparando-client',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'preparando-group' });
const producer = kafka.producer();

const preparando = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'recibido' });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {

      console.log(`Prepared message: ${message.value.toString()}`);
      
      const data = JSON.parse(message.value.toString());

      data.estado = 'preparando';

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
    topic: 'preparando',
    messages: [{ value: message }],
  });
  console.log('Message with updated state sent to "preparando" topic\n');
};

module.exports = preparando;
